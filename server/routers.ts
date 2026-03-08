import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { testResults, skillProgress, userBadges, potwAnswers, classes, classMembers, setWork, users } from "../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";
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
        if (!db) throw new Error("DB unavailable");
        await db.insert(testResults).values({ ...input, userId: ctx.user.id });
        await db.update(users)
          .set({ totalPoints: sql`totalPoints + ${input.pointsEarned}` })
          .where(eq(users.id, ctx.user.id));
        return { success: true };
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
        if (!db) throw new Error("DB unavailable");
        const existing = await db.select().from(skillProgress)
          .where(and(eq(skillProgress.userId, ctx.user.id), eq(skillProgress.skillId, input.skillId)))
          .limit(1);
        if (existing.length > 0) {
          await db.update(skillProgress)
            .set({ attempted: sql`attempted + ${input.attempted}`, correct: sql`correct + ${input.correct}`, lastAttemptAt: new Date() })
            .where(and(eq(skillProgress.userId, ctx.user.id), eq(skillProgress.skillId, input.skillId)));
        } else {
          await db.insert(skillProgress).values({ ...input, userId: ctx.user.id });
        }
        return { success: true };
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
        if (!db) throw new Error("DB unavailable");
        const existing = await db.select().from(userBadges)
          .where(and(eq(userBadges.userId, ctx.user.id), eq(userBadges.badgeId, input.badgeId)))
          .limit(1);
        if (existing.length === 0) {
          await db.insert(userBadges).values({ userId: ctx.user.id, badgeId: input.badgeId });
        }
        return { success: true };
      }),
    myBadges: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(userBadges).where(eq(userBadges.userId, ctx.user.id));
    }),
  }),
  potw: router({
    submit: protectedProcedure
      .input(z.object({ weekKey: z.string(), correct: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        const existing = await db.select().from(potwAnswers)
          .where(and(eq(potwAnswers.userId, ctx.user.id), eq(potwAnswers.weekKey, input.weekKey)))
          .limit(1);
        if (existing.length === 0) {
          await db.insert(potwAnswers).values({ ...input, userId: ctx.user.id });
          if (input.correct) {
            await db.update(users).set({ totalPoints: sql`totalPoints + 10` }).where(eq(users.id, ctx.user.id));
          }
        }
        return { success: true };
      }),
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
  }),
  setWork: router({
    create: protectedProcedure
      .input(z.object({
        classId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        skillId: z.string().optional(),
        testType: z.string().optional(),
        dueDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        await db.insert(setWork).values({ ...input, teacherId: ctx.user.id });
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
  }),
});

export type AppRouter = typeof appRouter;
