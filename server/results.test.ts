import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function makeCtx(overrides: Partial<NonNullable<TrpcContext["user"]>> = {}): TrpcContext {
  return {
    user: {
      id: 42,
      openId: "test-pupil-results",
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

describe("results.save", () => {
  it("gracefully handles DB unavailability for timed test result", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.results.save({
      testType: "timed",
      yearGroup: 2,
      score: 16,
      total: 20,
      durationSeconds: 480,
      pointsEarned: 80,
      certificateEarned: true,
    });
    // Should return success:true or success:false — never throw
    expect(typeof result.success).toBe("boolean");
  });

  it("gracefully handles DB unavailability for practice result", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.results.save({
      testType: "practice",
      yearGroup: 2,
      score: 5,
      total: 6,
      durationSeconds: 120,
      pointsEarned: 15,
      certificateEarned: false,
    });
    expect(typeof result.success).toBe("boolean");
  });
});

describe("skills.updateProgress", () => {
  it("gracefully handles DB unavailability", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.skills.updateProgress({
      skillId: "addition",
      attempted: 3,
      correct: 2,
    });
    expect(typeof result.success).toBe("boolean");
  });
});

describe("badges.award", () => {
  it("gracefully handles DB unavailability for perfect_test badge", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.badges.award({ badgeId: "perfect_test" });
    expect(typeof result.success).toBe("boolean");
  });

  it("gracefully handles DB unavailability for first_question badge", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.badges.award({ badgeId: "first_question" });
    expect(typeof result.success).toBe("boolean");
  });
});

describe("results.myHistory", () => {
  it("returns an array (empty when DB unavailable)", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.results.myHistory();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("skills.myProgress", () => {
  it("returns an array (empty when DB unavailable)", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.skills.myProgress();
    expect(Array.isArray(result)).toBe(true);
  });
});
