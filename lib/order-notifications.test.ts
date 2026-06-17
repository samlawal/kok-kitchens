import { describe, it, expect } from "vitest";
import { dispatchNotifications } from "./order-notifications";

// A channel that only flips `done` after a couple of microtasks, so a caller
// that doesn't await it would observe done === false.
function trackedChannel() {
  let done = false;
  const run = async () => {
    await Promise.resolve();
    await Promise.resolve();
    done = true;
  };
  return { run, isDone: () => done };
}

describe("dispatchNotifications", () => {
  // Regression: COD order emails were dropped because the route fired the sends
  // without awaiting them, and the serverless function froze on response.
  it("waits for every channel to finish before resolving", async () => {
    const owner = trackedChannel();
    const customer = trackedChannel();
    const push = trackedChannel();

    await dispatchNotifications([owner.run, customer.run, push.run]);

    expect(owner.isDone()).toBe(true);
    expect(customer.isDone()).toBe(true);
    expect(push.isDone()).toBe(true);
  });

  it("isolates a failing channel — the others still complete and it never throws", async () => {
    const ok = trackedChannel();
    const failing = () => Promise.reject(new Error("push service down"));

    await expect(
      dispatchNotifications([ok.run, failing])
    ).resolves.toBeUndefined();
    expect(ok.isDone()).toBe(true);
  });

  it("starts all channels concurrently", async () => {
    let started = 0;
    const ch = () => {
      started += 1;
      return Promise.resolve();
    };

    const pending = dispatchNotifications([ch, ch, ch]);
    // allSettled maps over the channels synchronously, so all are invoked
    // before we await — i.e. concurrently, not one-after-another.
    expect(started).toBe(3);
    await pending;
  });

  it("resolves for an empty channel list", async () => {
    await expect(dispatchNotifications([])).resolves.toBeUndefined();
  });
});
