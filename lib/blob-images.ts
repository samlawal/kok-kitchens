// Pure helpers for resolving admin-uploaded meal photos from Vercel Blob.
// Kept free of @vercel/blob / Next imports so it can be unit-tested directly.

export interface BlobLike {
  pathname: string;
  url: string;
  uploadedAt: string | Date;
}

const KNOWN_EXT = /\.(webp|jpe?g|png)$/i;

/**
 * Build a { menuItemId: imageUrl } map from a list of blobs under "meals/".
 *
 * - strips the "meals/" prefix and the file extension to recover the item id
 * - skips rollback copies under "meals/_rollback/"
 * - skips files without a recognised image extension (no polluted keys)
 * - prefers the canonical ".webp" file when duplicate extensions exist
 * - appends "?v=<uploadedAt ms>" so Next/Image busts its cache on re-upload
 */
export function buildImageMap(
  blobs: BlobLike[],
  prefix = "meals/"
): Record<string, string> {
  const images: Record<string, string> = {};
  const chosenIsWebp: Record<string, boolean> = {};

  for (const blob of blobs) {
    const path = blob.pathname.startsWith(prefix)
      ? blob.pathname.slice(prefix.length)
      : blob.pathname;
    if (path.startsWith("_rollback/")) continue;
    if (!KNOWN_EXT.test(path)) continue;

    const id = path.replace(KNOWN_EXT, "");
    if (!id) continue;

    const isWebp = /\.webp$/i.test(path);
    // Once a .webp has been chosen for an id, don't let a non-webp override it.
    if (images[id] && chosenIsWebp[id] && !isWebp) continue;

    const version = new Date(blob.uploadedAt).getTime();
    images[id] = `${blob.url}?v=${version}`;
    chosenIsWebp[id] = isWebp;
  }

  return images;
}
