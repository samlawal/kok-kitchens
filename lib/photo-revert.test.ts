import { describe, it, expect } from "vitest";
import { revertAction } from "./photo-revert";

describe("revertAction", () => {
  it("restores the saved previous version when one exists", () => {
    expect(revertAction(true, true)).toBe("restore");
    expect(revertAction(true, false)).toBe("restore");
  });

  it("deletes the upload (back to default) when there's no saved previous version", () => {
    // The reported bug: admin replaced an item's DEFAULT image, so nothing was
    // backed up — undo should remove the upload, not error.
    expect(revertAction(false, true)).toBe("delete-to-default");
  });

  it("does nothing when there is no uploaded photo at all", () => {
    expect(revertAction(false, false)).toBe("nothing");
  });
});
