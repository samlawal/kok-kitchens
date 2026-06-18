import { describe, it, expect } from "vitest";
import { isValidEmail, isValidUkPhone } from "./validation";

describe("isValidEmail", () => {
  it("accepts well-formed emails", () => {
    expect(isValidEmail("sam@kokkitchens.com")).toBe(true);
    expect(isValidEmail("  a.b-c@sub.domain.co.uk ")).toBe(true);
  });
  it("rejects malformed emails", () => {
    for (const bad of ["", "sam", "sam@", "@x.com", "a@b", "a b@c.com"]) {
      expect(isValidEmail(bad)).toBe(false);
    }
  });
});

describe("isValidUkPhone", () => {
  it("accepts UK mobile and landline formats (with punctuation)", () => {
    expect(isValidUkPhone("07400123456")).toBe(true);
    expect(isValidUkPhone("+447400123456")).toBe(true);
    expect(isValidUkPhone("+44 7400 123 456")).toBe(true);
    expect(isValidUkPhone("020 7946 0958")).toBe(true);
  });
  it("rejects obviously wrong numbers", () => {
    for (const bad of ["", "123", "abc", "12345", "+1 415 555 0172", "0740012"]) {
      expect(isValidUkPhone(bad)).toBe(false);
    }
  });
});
