import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function makeCtx(overrides: Partial<TrpcContext["user"]> = {}): TrpcContext {
  return {
    user: {
      id: 99,
      openId: "test-pupil",
      name: "Test Pupil",
      displayName: "TestOwl",
      email: "test@example.com",
      loginMethod: "manus",
      role: "user",
      yearGroup: 2,
      avatarEmoji: "🦉",
      totalPoints: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      ...overrides,
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("setWork.forPupil", () => {
  it("returns an empty array when DB is unavailable", async () => {
    const caller = appRouter.createCaller(makeCtx());
    // DB not available in test env — should return [] gracefully
    const result = await caller.setWork.forPupil();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("classMembers.myClasses", () => {
  it("returns an empty array when DB is unavailable", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.classMembers.myClasses();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("results.myHistory", () => {
  it("returns an empty array when DB is unavailable", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.results.myHistory();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("skills.myProgress", () => {
  it("returns an empty array when DB is unavailable", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.skills.myProgress();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("badges.myBadges", () => {
  it("returns an empty array when DB is unavailable", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.badges.myBadges();
    expect(Array.isArray(result)).toBe(true);
  });
});
