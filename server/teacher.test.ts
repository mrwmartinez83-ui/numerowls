import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function makeCtx(overrides: Partial<TrpcContext["user"]> = {}): TrpcContext {
  return {
    user: {
      id: 99,
      openId: "teacher-test",
      email: "teacher@test.com",
      name: "Test Teacher",
      displayName: "Ms Test",
      yearGroup: null,
      avatarEmoji: null,
      totalPoints: 0,
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      ...overrides,
    } as TrpcContext["user"],
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("setWork router", () => {
  it("forPupil returns an array", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.setWork.forPupil();
    expect(Array.isArray(result)).toBe(true);
  });

  it("forClass returns an array", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.setWork.forClass({ classId: 999 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("delete returns success for non-existent work (no-op)", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.setWork.delete({ workId: 999999 });
    expect(result).toEqual({ success: true });
  });

  it("update returns success for non-existent work (no-op)", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.setWork.update({ workId: 999999, title: "Updated" });
    expect(result).toEqual({ success: true });
  });
});

describe("classes router", () => {
  it("create generates a join code", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.classes.create({ name: "2B Maths Test", yearGroup: 2 });
    expect(result.success).toBe(true);
    expect(typeof result.joinCode).toBe("string");
    expect(result.joinCode.length).toBe(6);
  });

  it("classDetails requires a classId", async () => {
    const caller = appRouter.createCaller(makeCtx());
    // Should return empty array when DB is unavailable
    const result = await caller.classes.classDetails({ classId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("pupilProgress returns empty array without DB", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.classes.pupilProgress({ classId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("classResults returns empty array without DB", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.classes.classResults({ classId: 1, limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("classMembers router", () => {
  it("join rejects invalid code without DB", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.classMembers.join({ joinCode: "INVALID" })
    ).rejects.toThrow();
  });
});
