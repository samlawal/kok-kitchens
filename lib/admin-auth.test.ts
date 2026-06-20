import { describe, it, expect, vi, afterEach } from "vitest";
import {
  verifyAdminPassword,
  resolveAdminPassword,
  verifyAdminSecret,
} from "./admin-auth";

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

// Regression: the go-live fix that removed the public `kok-admin-2026` default
// from production. If ADMIN_PASSWORD is unset in prod, admin must FAIL CLOSED.
describe("resolveAdminPassword — fail-closed in production", () => {
  it("returns the configured password in any environment", () => {
    expect(resolveAdminPassword("s3cret", "production")).toBe("s3cret");
    expect(resolveAdminPassword("s3cret", "development")).toBe("s3cret");
    expect(resolveAdminPassword("s3cret", "test")).toBe("s3cret");
  });

  it("FAILS CLOSED in production when unset/blank (no public default)", () => {
    expect(resolveAdminPassword(undefined, "production")).toBeNull();
    expect(resolveAdminPassword("", "production")).toBeNull();
    expect(resolveAdminPassword("   ", "production")).toBeNull();
  });

  it("falls back to the dev default outside production when unset", () => {
    expect(resolveAdminPassword(undefined, "development")).toBe("kok-admin-2026");
    expect(resolveAdminPassword(undefined, "test")).toBe("kok-admin-2026");
    expect(resolveAdminPassword(undefined, undefined)).toBe("kok-admin-2026");
    expect(resolveAdminPassword("", "development")).toBe("kok-admin-2026");
  });
});

describe("verifyAdminSecret — production safety", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("rejects every input in production when ADMIN_PASSWORD is unset", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(verifyAdminSecret("anything")).toBe(false);
    expect(verifyAdminSecret("kok-admin-2026")).toBe(false);
    expect(verifyAdminSecret("")).toBe(false);
  });

  it("accepts the configured password (trimmed) and rejects wrong ones in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ADMIN_PASSWORD", "strong-prod-pw");
    expect(verifyAdminSecret("strong-prod-pw")).toBe(true);
    expect(verifyAdminSecret(" strong-prod-pw ")).toBe(true);
    expect(verifyAdminSecret("wrong")).toBe(false);
  });

  it("uses the dev default outside production when unset", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(verifyAdminSecret("kok-admin-2026")).toBe(true);
    expect(verifyAdminSecret("nope")).toBe(false);
  });
});
