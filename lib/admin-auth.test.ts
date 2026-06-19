import { describe, it, expect } from "vitest";
import { verifyAdminPassword } from "./admin-auth";

const PW = "kok-admin-2026";

describe("verifyAdminPassword — positive", () => {
  it("accepts the exact password", () => {
    expect(verifyAdminPassword(PW, PW)).toBe(true);
  });

  it("tolerates a trailing space (the reported iPad bug)", () => {
    expect(verifyAdminPassword(`${PW} `, PW)).toBe(true);
  });

  it("tolerates a leading space and a trailing newline", () => {
    expect(verifyAdminPassword(` ${PW}`, PW)).toBe(true);
    expect(verifyAdminPassword(`${PW}\n`, PW)).toBe(true);
  });

  it("tolerates whitespace on the expected/env side too", () => {
    expect(verifyAdminPassword(PW, `${PW}\n`)).toBe(true);
  });
});

describe("verifyAdminPassword — negative", () => {
  it("rejects a wrong password", () => {
    expect(verifyAdminPassword("not-the-password", PW)).toBe(false);
  });

  it("is case-sensitive", () => {
    expect(verifyAdminPassword("KOK-ADMIN-2026", PW)).toBe(false);
  });

  it("rejects an inner-whitespace mismatch (only edges are trimmed)", () => {
    expect(verifyAdminPassword("kok-admin -2026", PW)).toBe(false);
  });

  it("rejects empty / whitespace-only input", () => {
    expect(verifyAdminPassword("", PW)).toBe(false);
    expect(verifyAdminPassword("   ", PW)).toBe(false);
  });

  it("rejects non-string input", () => {
    expect(verifyAdminPassword(undefined, PW)).toBe(false);
    expect(verifyAdminPassword(null, PW)).toBe(false);
    expect(verifyAdminPassword(12345, PW)).toBe(false);
  });

  it("rejects everything when no password is configured", () => {
    expect(verifyAdminPassword("anything", "")).toBe(false);
  });
});
