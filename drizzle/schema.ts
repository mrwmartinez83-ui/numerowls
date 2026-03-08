import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "teacher"]).default("user").notNull(),
  yearGroup: int("yearGroup"),
  displayName: varchar("displayName", { length: 64 }),
  avatarEmoji: varchar("avatarEmoji", { length: 8 }).default("🦉"),
  totalPoints: int("totalPoints").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Classes ───────────────────────────────────────────────────────────────────
export const classes = mysqlTable("classes", {
  id: int("id").autoincrement().primaryKey(),
  teacherId: int("teacherId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  yearGroup: int("yearGroup"),
  joinCode: varchar("joinCode", { length: 8 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Class = typeof classes.$inferSelect;

// ── Class Members ─────────────────────────────────────────────────────────────
export const classMembers = mysqlTable("classMembers", {
  id: int("id").autoincrement().primaryKey(),
  classId: int("classId").notNull(),
  userId: int("userId").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

// ── Test Results ──────────────────────────────────────────────────────────────
export const testResults = mysqlTable("testResults", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  testType: varchar("testType", { length: 32 }).notNull(),
  skillId: varchar("skillId", { length: 32 }),
  yearGroup: int("yearGroup").notNull(),
  score: int("score").notNull(),
  total: int("total").notNull(),
  durationSeconds: int("durationSeconds"),
  pointsEarned: int("pointsEarned").default(0).notNull(),
  certificateEarned: boolean("certificateEarned").default(false).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});
export type TestResult = typeof testResults.$inferSelect;

// ── Skill Progress ────────────────────────────────────────────────────────────
export const skillProgress = mysqlTable("skillProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  skillId: varchar("skillId", { length: 32 }).notNull(),
  attempted: int("attempted").default(0).notNull(),
  correct: int("correct").default(0).notNull(),
  bestScore: int("bestScore").default(0).notNull(),
  lastAttemptAt: timestamp("lastAttemptAt").defaultNow().notNull(),
});
export type SkillProgress = typeof skillProgress.$inferSelect;

// ── Badges ────────────────────────────────────────────────────────────────────
export const userBadges = mysqlTable("userBadges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeId: varchar("badgeId", { length: 32 }).notNull(),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});

// ── Problem of the Week ───────────────────────────────────────────────────────
export const potwAnswers = mysqlTable("potwAnswers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  weekKey: varchar("weekKey", { length: 16 }).notNull(),
  correct: boolean("correct").notNull(),
  answeredAt: timestamp("answeredAt").defaultNow().notNull(),
});

// ── Set Work ──────────────────────────────────────────────────────────────────
export const setWork = mysqlTable("setWork", {
  id: int("id").autoincrement().primaryKey(),
  teacherId: int("teacherId").notNull(),
  classId: int("classId").notNull(),
  title: varchar("title", { length: 128 }).notNull(),
  description: text("description"),
  skillId: varchar("skillId", { length: 32 }),
  testType: varchar("testType", { length: 32 }).default("practice"),
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SetWork = typeof setWork.$inferSelect;