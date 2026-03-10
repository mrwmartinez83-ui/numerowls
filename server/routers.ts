import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { testResults, skillProgress, userBadges, potwAnswers, potwCompetitions, potwEntries, classes, classMembers, setWork, users } from "../drizzle/schema";
import { eq, desc, and, sql, inArray } from "drizzle-orm";
import { z } from "zod/v4";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  profile: router({
    update: protectedProcedure
      .input(z.object({
        displayName: z.string().max(64).optional(),
        yearGroup: z.number().min(1).max(6).optional(),
        avatarEmoji: z.string().max(8).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        await db.update(users).set(input).where(eq(users.id, ctx.user.id));
        return { success: true };
      }),
  }),

  results: router({
    save: protectedProcedure
      .input(z.object({
        testType: z.string(),
        skillId: z.string().optional(),
        yearGroup: z.number(),
        score: z.number(),
        total: z.number(),
        durationSeconds: z.number().optional(),
        pointsEarned: z.number(),
        certificateEarned: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        try {
          await db.insert(testResults).values({ ...input, userId: ctx.user.id });

          // XP earned = same as points (score * 3 for practice, score * 5 for timed)
          const xpEarned = input.pointsEarned;

          // Streak logic: check if today is a new practice day
          const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
          const [currentUser] = await db.select({
            currentStreak: users.currentStreak,
            longestStreak: users.longestStreak,
            lastPracticeDate: users.lastPracticeDate,
          }).from(users).where(eq(users.id, ctx.user.id)).limit(1);

          let newStreak = currentUser?.currentStreak ?? 0;
          let newLongest = currentUser?.longestStreak ?? 0;
          const lastDate = currentUser?.lastPracticeDate;

          if (lastDate !== todayStr) {
            // Check if yesterday was the last practice day (streak continues)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().slice(0, 10);
            if (lastDate === yesterdayStr) {
              newStreak += 1;
            } else {
              newStreak = 1; // streak broken, restart
            }
            if (newStreak > newLongest) newLongest = newStreak;
          }

          await db.update(users)
            .set({
              totalPoints: sql`totalPoints + ${input.pointsEarned}`,
              xp: sql`xp + ${xpEarned}`,
              currentStreak: newStreak,
              longestStreak: newLongest,
              lastPracticeDate: todayStr,
            })
            .where(eq(users.id, ctx.user.id));

          // Award streak badge at 5 days
          if (newStreak >= 5) {
            const existing = await db.select().from(userBadges)
              .where(and(eq(userBadges.userId, ctx.user.id), eq(userBadges.badgeId, "streak_5")))
              .limit(1);
            if (existing.length === 0) {
              await db.insert(userBadges).values({ userId: ctx.user.id, badgeId: "streak_5" });
            }
          }

          return { success: true, xpEarned, newStreak };
        } catch { return { success: false }; }
      }),
    myHistory: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(testResults)
        .where(eq(testResults.userId, ctx.user.id))
        .orderBy(desc(testResults.completedAt))
        .limit(50);
    }),
  }),

  skills: router({
    updateProgress: protectedProcedure
      .input(z.object({ skillId: z.string(), attempted: z.number(), correct: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        try {
          const existing = await db.select().from(skillProgress)
            .where(and(eq(skillProgress.userId, ctx.user.id), eq(skillProgress.skillId, input.skillId)))
            .limit(1);
          if (existing.length > 0) {
            await db.update(skillProgress)
              .set({
                attempted: sql`attempted + ${input.attempted}`,
                correct: sql`correct + ${input.correct}`,
                lastAttemptAt: new Date(),
              })
              .where(and(eq(skillProgress.userId, ctx.user.id), eq(skillProgress.skillId, input.skillId)));
          } else {
            await db.insert(skillProgress).values({ ...input, userId: ctx.user.id });
          }
          return { success: true };
        } catch { return { success: false }; }
      }),
    myProgress: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(skillProgress).where(eq(skillProgress.userId, ctx.user.id));
    }),
  }),

  badges: router({
    award: protectedProcedure
      .input(z.object({ badgeId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        try {
          const existing = await db.select().from(userBadges)
            .where(and(eq(userBadges.userId, ctx.user.id), eq(userBadges.badgeId, input.badgeId)))
            .limit(1);
          if (existing.length === 0) {
            await db.insert(userBadges).values({ userId: ctx.user.id, badgeId: input.badgeId });
          }
          return { success: true };
        } catch { return { success: false }; }
      }),
    myBadges: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(userBadges).where(eq(userBadges.userId, ctx.user.id));
    }),
  }),

  potw: router({
    // ── Get the current active competition ─────────────────────────────────────
    current: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db.select().from(potwCompetitions)
        .where(eq(potwCompetitions.status, "active"))
        .orderBy(desc(potwCompetitions.startedAt))
        .limit(1);
      return rows[0] ?? null;
    }),

    // ── Get the most recently ended competition (for results reveal) ───────────
    lastEnded: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db.select().from(potwCompetitions)
        .where(eq(potwCompetitions.status, "ended"))
        .orderBy(desc(potwCompetitions.endedAt))
        .limit(1);
      return rows[0] ?? null;
    }),

    // ── Pupil: submit an answer ─────────────────────────────────────────────────
    submit: protectedProcedure
      .input(z.object({
        competitionId: z.number(),
        chosenOption: z.string(),
        correct: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        const comp = await db.select().from(potwCompetitions)
          .where(and(eq(potwCompetitions.id, input.competitionId), eq(potwCompetitions.status, "active")))
          .limit(1);
        if (comp.length === 0) return { success: false, reason: "competition_ended" };
        const existing = await db.select().from(potwEntries)
          .where(and(eq(potwEntries.userId, ctx.user.id), eq(potwEntries.competitionId, input.competitionId)))
          .limit(1);
        if (existing.length > 0) return { success: false, reason: "already_entered" };
        await db.insert(potwEntries).values({
          competitionId: input.competitionId,
          userId: ctx.user.id,
          chosenOption: input.chosenOption,
          correct: input.correct,
        });
        return { success: true };
      }),

    // ── Pupil: check if they have entered the current competition ──────────────
    myEntry: protectedProcedure
      .input(z.object({ competitionId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return null;
        const rows = await db.select().from(potwEntries)
          .where(and(eq(potwEntries.userId, ctx.user.id), eq(potwEntries.competitionId, input.competitionId)))
          .limit(1);
        return rows[0] ?? null;
      }),

    // ── Public: winners of an ended competition (chronological order) ──────────
    winners: publicProcedure
      .input(z.object({ competitionId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        const comp = await db.select().from(potwCompetitions)
          .where(and(eq(potwCompetitions.id, input.competitionId), eq(potwCompetitions.status, "ended")))
          .limit(1);
        if (comp.length === 0) return [];
        return db.select({
          entryId: potwEntries.id,
          userId: potwEntries.userId,
          chosenOption: potwEntries.chosenOption,
          correct: potwEntries.correct,
          submittedAt: potwEntries.submittedAt,
          displayName: users.displayName,
          avatarEmoji: users.avatarEmoji,
          yearGroup: users.yearGroup,
        })
          .from(potwEntries)
          .innerJoin(users, eq(potwEntries.userId, users.id))
          .where(and(eq(potwEntries.competitionId, input.competitionId), eq(potwEntries.correct, true)))
          .orderBy(potwEntries.submittedAt);
      }),

    // ── All-time POTW leaderboard ───────────────────────────────────────────────
    potwLeaderboard: publicProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select({
          userId: potwEntries.userId,
          displayName: users.displayName,
          avatarEmoji: users.avatarEmoji,
          yearGroup: users.yearGroup,
          wins: sql<number>`SUM(CASE WHEN ${potwEntries.correct} = 1 THEN 1 ELSE 0 END)`,
          entries: sql<number>`COUNT(*)`,
        })
          .from(potwEntries)
          .innerJoin(users, eq(potwEntries.userId, users.id))
          .innerJoin(potwCompetitions, eq(potwEntries.competitionId, potwCompetitions.id))
          .where(eq(potwCompetitions.status, "ended"))
          .groupBy(potwEntries.userId, users.displayName, users.avatarEmoji, users.yearGroup)
          .orderBy(desc(sql`wins`), desc(sql`entries`))
          .limit(input.limit);
      }),

    // ── Admin/Teacher: all entries for a competition ───────────────────────────
    allEntries: protectedProcedure
      .input(z.object({ competitionId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "teacher") return [];
        const db = await getDb();
        if (!db) return [];
        return db.select({
          entryId: potwEntries.id,
          userId: potwEntries.userId,
          chosenOption: potwEntries.chosenOption,
          correct: potwEntries.correct,
          submittedAt: potwEntries.submittedAt,
          displayName: users.displayName,
          avatarEmoji: users.avatarEmoji,
          yearGroup: users.yearGroup,
        })
          .from(potwEntries)
          .innerJoin(users, eq(potwEntries.userId, users.id))
          .where(eq(potwEntries.competitionId, input.competitionId))
          .orderBy(potwEntries.submittedAt);
      }),

    // ── Admin/Teacher: end competition and automatically start next ────────────
    endAndStartNext: protectedProcedure
      .input(z.object({
        competitionId: z.number(),
        nextQuestionId: z.string(),
        nextTitle: z.string(),
        nextYearLabel: z.string().optional(),
        nextPoints: z.number().default(15),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "teacher") throw new Error("Not authorised");
        const db = await getDb();
        if (!db) return { success: false };
        await db.update(potwCompetitions)
          .set({ status: "ended", endedAt: new Date(), endedBy: ctx.user.id })
          .where(eq(potwCompetitions.id, input.competitionId));
        // Award points to correct entrants
        const correctEntries = await db.select({ userId: potwEntries.userId })
          .from(potwEntries)
          .where(and(eq(potwEntries.competitionId, input.competitionId), eq(potwEntries.correct, true)));
        for (const entry of correctEntries) {
          await db.update(users)
            .set({ totalPoints: sql`totalPoints + ${input.nextPoints}` })
            .where(eq(users.id, entry.userId));
        }
        const [next] = await db.insert(potwCompetitions).values({
          questionId: input.nextQuestionId,
          title: input.nextTitle,
          yearLabel: input.nextYearLabel,
          points: input.nextPoints,
          status: "active",
        }).$returningId();
        return { success: true, newCompetitionId: next?.id };
      }),

    // ── Admin/Teacher: create the very first competition ───────────────────────
    createFirst: protectedProcedure
      .input(z.object({
        questionId: z.string(),
        title: z.string(),
        yearLabel: z.string().optional(),
        points: z.number().default(15),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "teacher") throw new Error("Not authorised");
        const db = await getDb();
        if (!db) return { success: false };
        const active = await db.select().from(potwCompetitions)
          .where(eq(potwCompetitions.status, "active")).limit(1);
        if (active.length > 0) return { success: false, reason: "already_active" };
        const [created] = await db.insert(potwCompetitions).values({
          questionId: input.questionId,
          title: input.title,
          yearLabel: input.yearLabel,
          points: input.points,
          status: "active",
        }).$returningId();
        return { success: true, competitionId: created?.id };
      }),

    // ── Public: entry count for a competition ─────────────────────────────────
    entryCount: publicProcedure
      .input(z.object({ competitionId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { total: 0, correct: 0 };
        const rows = await db.select({
          total: sql<number>`COUNT(*)`,
          correct: sql<number>`SUM(CASE WHEN ${potwEntries.correct} = 1 THEN 1 ELSE 0 END)`,
        })
          .from(potwEntries)
          .where(eq(potwEntries.competitionId, input.competitionId));
        return rows[0] ?? { total: 0, correct: 0 };
      }),

    // ── Legacy ─────────────────────────────────────────────────────────────────
    myAnswers: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(potwAnswers).where(eq(potwAnswers.userId, ctx.user.id));
    }),
  }),

  leaderboard: router({
    top: publicProcedure
      .input(z.object({ yearGroup: z.number().optional(), limit: z.number().default(20) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select({
          id: users.id,
          displayName: users.displayName,
          name: users.name,
          yearGroup: users.yearGroup,
          totalPoints: users.totalPoints,
          avatarEmoji: users.avatarEmoji,
        }).from(users).orderBy(desc(users.totalPoints)).limit(input.limit);
      }),
  }),

  classes: router({
    create: protectedProcedure
      .input(z.object({ name: z.string(), yearGroup: z.number().optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        await db.insert(classes).values({ ...input, teacherId: ctx.user.id, joinCode });
        return { success: true, joinCode };
      }),
    myClasses: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(classes).where(eq(classes.teacherId, ctx.user.id));
    }),
    classDetails: protectedProcedure
      .input(z.object({ classId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select({
          userId: classMembers.userId,
          name: users.name,
          displayName: users.displayName,
          yearGroup: users.yearGroup,
          totalPoints: users.totalPoints,
          avatarEmoji: users.avatarEmoji,
        })
          .from(classMembers)
          .innerJoin(users, eq(classMembers.userId, users.id))
          .where(eq(classMembers.classId, input.classId));
      }),
    // Returns per-skill progress for every pupil in a class (for the teacher's progress table)
    pupilProgress: protectedProcedure
      .input(z.object({ classId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        // Verify teacher owns this class
        const cls = await db.select().from(classes)
          .where(and(eq(classes.id, input.classId), eq(classes.teacherId, ctx.user.id))).limit(1);
        if (cls.length === 0) return [];
        // Get all pupil IDs in class
        const members = await db.select({ userId: classMembers.userId })
          .from(classMembers).where(eq(classMembers.classId, input.classId));
        if (members.length === 0) return [];
        const userIds = members.map(m => m.userId);
        // Get skill progress for all pupils
        return db.select({
          userId: skillProgress.userId,
          skillId: skillProgress.skillId,
          attempted: skillProgress.attempted,
          correct: skillProgress.correct,
          lastAttemptAt: skillProgress.lastAttemptAt,
          displayName: users.displayName,
          name: users.name,
          avatarEmoji: users.avatarEmoji,
          totalPoints: users.totalPoints,
        })
          .from(skillProgress)
          .innerJoin(users, eq(skillProgress.userId, users.id))
          .where(inArray(skillProgress.userId, userIds));
      }),
    // Returns recent test results for all pupils in a class
    classResults: protectedProcedure
      .input(z.object({ classId: z.number(), limit: z.number().default(50) }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        const cls = await db.select().from(classes)
          .where(and(eq(classes.id, input.classId), eq(classes.teacherId, ctx.user.id))).limit(1);
        if (cls.length === 0) return [];
        const members = await db.select({ userId: classMembers.userId })
          .from(classMembers).where(eq(classMembers.classId, input.classId));
        if (members.length === 0) return [];
        const userIds = members.map(m => m.userId);
        return db.select({
          id: testResults.id,
          userId: testResults.userId,
          testType: testResults.testType,
          skillId: testResults.skillId,
          yearGroup: testResults.yearGroup,
          score: testResults.score,
          total: testResults.total,
          durationSeconds: testResults.durationSeconds,
          pointsEarned: testResults.pointsEarned,
          certificateEarned: testResults.certificateEarned,
          completedAt: testResults.completedAt,
          displayName: users.displayName,
          name: users.name,
          avatarEmoji: users.avatarEmoji,
        })
          .from(testResults)
          .innerJoin(users, eq(testResults.userId, users.id))
          .where(inArray(testResults.userId, userIds))
          .orderBy(desc(testResults.completedAt))
          .limit(input.limit);
      }),
  }),

  classMembers: router({
    join: protectedProcedure
      .input(z.object({ joinCode: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        const cls = await db.select().from(classes)
          .where(eq(classes.joinCode, input.joinCode.toUpperCase())).limit(1);
        if (cls.length === 0) throw new Error("Invalid join code");
        const existing = await db.select().from(classMembers)
          .where(and(eq(classMembers.classId, cls[0].id), eq(classMembers.userId, ctx.user.id))).limit(1);
        if (existing.length > 0) return { success: true, className: cls[0].name };
        await db.insert(classMembers).values({ classId: cls[0].id, userId: ctx.user.id });
        return { success: true, className: cls[0].name };
      }),
    myClasses: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select({
        classId: classMembers.classId,
        className: classes.name,
        yearGroup: classes.yearGroup,
      })
        .from(classMembers)
        .innerJoin(classes, eq(classMembers.classId, classes.id))
        .where(eq(classMembers.userId, ctx.user.id));
    }),
  }),

  setWork: router({
    create: protectedProcedure
      .input(z.object({
        classId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        skillId: z.string().optional(),
        testType: z.string().optional(),
        dueDate: z.coerce.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        await db.insert(setWork).values({ ...input, teacherId: ctx.user.id });
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        workId: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        skillId: z.string().optional(),
        testType: z.string().optional(),
        dueDate: z.coerce.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        const { workId, ...rest } = input;
        await db.update(setWork).set(rest)
          .where(and(eq(setWork.id, workId), eq(setWork.teacherId, ctx.user.id)));
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ workId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        await db.delete(setWork)
          .where(and(eq(setWork.id, input.workId), eq(setWork.teacherId, ctx.user.id)));
        return { success: true };
      }),
    forClass: protectedProcedure
      .input(z.object({ classId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(setWork)
          .where(and(eq(setWork.classId, input.classId), eq(setWork.teacherId, ctx.user.id)))
          .orderBy(desc(setWork.createdAt));
      }),
    forPupil: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      const memberships = await db.select({ classId: classMembers.classId })
        .from(classMembers).where(eq(classMembers.userId, ctx.user.id));
      if (memberships.length === 0) return [];
      const classIds = memberships.map(m => m.classId);
      return db.select({
        id: setWork.id,
        title: setWork.title,
        description: setWork.description,
        skillId: setWork.skillId,
        testType: setWork.testType,
        dueDate: setWork.dueDate,
        createdAt: setWork.createdAt,
        teacherName: users.displayName,
      }).from(setWork)
        .innerJoin(users, eq(setWork.teacherId, users.id))
        .where(inArray(setWork.classId, classIds))
        .orderBy(desc(setWork.createdAt));
    }),
  }),
});

export type AppRouter = typeof appRouter;
