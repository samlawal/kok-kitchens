// Covers the REAL failing path of bug DRBfP9SOiPY: custom_menu_items didn't
// exist in production (initDb was never re-run after the feature shipped), so
// the un-guarded SELECT in /api/custom-items threw Postgres 42P01 and every
// admin "add new item" save 500'd. ensureSchema turns that into: init the
// schema (idempotent) and retry once.
import { describe, it, expect, vi } from "vitest";
import { ensureSchema } from "./db";

class FakeNeonError extends Error {
  code: string;
  constructor(code: string) {
    super(`db error ${code}`);
    this.code = code;
  }
}

describe("ensureSchema", () => {
  it("heals 42P01 (undefined_table): runs init, retries, returns the result", async () => {
    const init = vi.fn().mockResolvedValue(true);
    const op = vi
      .fn()
      .mockRejectedValueOnce(new FakeNeonError("42P01")) // table missing — Taiwo's exact failure
      .mockResolvedValueOnce([{ slug: "jollof-rice" }]);

    await expect(ensureSchema(op, init)).resolves.toEqual([{ slug: "jollof-rice" }]);
    expect(init).toHaveBeenCalledTimes(1);
    expect(op).toHaveBeenCalledTimes(2);
  });

  it("does not swallow other database errors (no init, no retry)", async () => {
    const init = vi.fn();
    const op = vi.fn().mockRejectedValue(new FakeNeonError("23505")); // unique violation

    await expect(ensureSchema(op, init)).rejects.toThrow("db error 23505");
    expect(init).not.toHaveBeenCalled();
    expect(op).toHaveBeenCalledTimes(1);
  });

  it("passes through on the happy path without touching init", async () => {
    const init = vi.fn();
    const op = vi.fn().mockResolvedValue(42);

    await expect(ensureSchema(op, init)).resolves.toBe(42);
    expect(init).not.toHaveBeenCalled();
  });

  it("surfaces the second failure if the table is still missing after init", async () => {
    const init = vi.fn().mockResolvedValue(true);
    const op = vi.fn().mockRejectedValue(new FakeNeonError("42P01"));

    await expect(ensureSchema(op, init)).rejects.toThrow("db error 42P01");
    expect(init).toHaveBeenCalledTimes(1);
    expect(op).toHaveBeenCalledTimes(2); // exactly one retry — no loops
  });
});
