// Decide what "undo last photo change" should do, from what's in blob storage.
//
//  - A saved previous version (_rollback copy) exists  -> restore it.
//  - No previous version, but a photo is currently uploaded -> delete it so the
//    item falls back to its built-in/default image. This is the common case:
//    the admin replaced an item's DEFAULT image, so there was never a prior
//    upload to back up — "undo" therefore means "remove my upload".
//  - Nothing uploaded at all -> nothing to undo.
//
// Pure so the rule is unit-tested; the route does the blob I/O around it.
export type RevertAction = "restore" | "delete-to-default" | "nothing";

export function revertAction(
  hasRollback: boolean,
  hasCurrent: boolean
): RevertAction {
  if (hasRollback) return "restore";
  if (hasCurrent) return "delete-to-default";
  return "nothing";
}
