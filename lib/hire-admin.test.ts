import { describe, it, expect } from "vitest";
import {
  validateHireAdminOp,
  HIRE_BOOKING_STATUSES,
} from "./hire-admin";

const IDS = new Set(["chafing-single", "charger-gold"]);
const run = (body: Record<string, unknown>) => validateHireAdminOp(body, IDS);

describe("validateHireAdminOp — setStock", () => {
  it("accepts a known item with a non-negative quantity", () => {
    expect(run({ op: "setStock", itemId: "charger-gold", totalQty: 50 })).toEqual({
      ok: true,
      op: "setStock",
      itemId: "charger-gold",
      totalQty: 50,
    });
  });

  it("allows zero (managed but out of stock)", () => {
    const r = run({ op: "setStock", itemId: "charger-gold", totalQty: 0 });
    expect(r).toMatchObject({ ok: true, totalQty: 0 });
  });

  it("floors a decimal quantity to whole units", () => {
    const r = run({ op: "setStock", itemId: "chafing-single", totalQty: 5.9 });
    expect(r).toMatchObject({ ok: true, totalQty: 5 });
  });

  it("coerces a numeric string", () => {
    const r = run({ op: "setStock", itemId: "chafing-single", totalQty: "8" });
    expect(r).toMatchObject({ ok: true, totalQty: 8 });
  });

  it("rejects an unknown item id", () => {
    expect(run({ op: "setStock", itemId: "not-an-item", totalQty: 5 })).toMatchObject({
      ok: false,
      status: 400,
      message: "Invalid item or quantity",
    });
  });

  it("rejects a negative quantity", () => {
    expect(run({ op: "setStock", itemId: "charger-gold", totalQty: -1 })).toMatchObject({
      ok: false,
      status: 400,
    });
  });

  it("rejects a non-numeric quantity", () => {
    expect(run({ op: "setStock", itemId: "charger-gold", totalQty: "lots" })).toMatchObject({
      ok: false,
      status: 400,
    });
  });

  it("rejects a missing item id", () => {
    expect(run({ op: "setStock", totalQty: 5 })).toMatchObject({ ok: false, status: 400 });
  });
});

describe("validateHireAdminOp — deleteStock", () => {
  it("accepts a known item", () => {
    expect(run({ op: "deleteStock", itemId: "charger-gold" })).toEqual({
      ok: true,
      op: "deleteStock",
      itemId: "charger-gold",
    });
  });

  it("rejects an unknown item", () => {
    expect(run({ op: "deleteStock", itemId: "nope" })).toMatchObject({
      ok: false,
      status: 400,
      message: "Invalid item",
    });
  });
});

describe("validateHireAdminOp — setStatus", () => {
  it("accepts every valid status", () => {
    for (const status of HIRE_BOOKING_STATUSES) {
      expect(run({ op: "setStatus", id: 1, status })).toMatchObject({ ok: true, op: "setStatus", id: 1, status });
    }
  });

  it("coerces a numeric id string", () => {
    expect(run({ op: "setStatus", id: "12", status: "confirmed" })).toMatchObject({
      ok: true,
      id: 12,
      status: "confirmed",
    });
  });

  it("rejects an unknown status", () => {
    expect(run({ op: "setStatus", id: 1, status: "shipped" })).toMatchObject({
      ok: false,
      status: 400,
      message: "Invalid booking or status",
    });
  });

  it("rejects a non-integer id", () => {
    expect(run({ op: "setStatus", id: 1.5, status: "confirmed" })).toMatchObject({ ok: false, status: 400 });
    expect(run({ op: "setStatus", id: "abc", status: "confirmed" })).toMatchObject({ ok: false, status: 400 });
  });

  it("rejects a missing id", () => {
    expect(run({ op: "setStatus", status: "confirmed" })).toMatchObject({ ok: false, status: 400 });
  });
});

describe("validateHireAdminOp — op dispatch", () => {
  it("rejects an unknown op", () => {
    expect(run({ op: "frobnicate", itemId: "charger-gold" })).toMatchObject({
      ok: false,
      status: 400,
      message: "Unknown operation",
    });
  });

  it("rejects a missing op", () => {
    expect(run({ itemId: "charger-gold", totalQty: 5 })).toMatchObject({
      ok: false,
      status: 400,
      message: "Unknown operation",
    });
  });
});
