// Cached Blob listings — the account's scarce resource is Vercel Blob
// ADVANCED operations (every list() call is one; Hobby shared 2k/month, Pro
// metered). Before this cache, every /api/image request listed the store and
// every menu render paginated "meals/" — ~1.2k ops/month from this project
// alone. Now listings serve from a 5-minute server cache that is busted the
// moment an admin uploads/reverts, so photo changes still appear instantly.
//
// Blob pathnames here are stable ("meals/{id}.webp", allowOverwrite), so a
// cached listing can never hand out a dead URL — re-uploads keep the same
// URL and buildImageMap's ?v= cache-buster handles freshness per upload.

import { unstable_cache, revalidateTag } from "next/cache";
import { list } from "@vercel/blob";
import type { BlobLike } from "@/lib/blob-images";

const FOLDERS = ["meals", "hire"] as const;
export type BlobFolder = (typeof FOLDERS)[number];

async function listAll(prefix: string): Promise<BlobLike[]> {
  const out: BlobLike[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    for (const b of page.blobs) {
      out.push({
        pathname: b.pathname,
        url: b.url,
        uploadedAt:
          b.uploadedAt instanceof Date ? b.uploadedAt.toISOString() : String(b.uploadedAt),
      });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

const cachedListers: Record<BlobFolder, () => Promise<BlobLike[]>> = {
  meals: unstable_cache(() => listAll("meals/"), ["kok-blobs-meals"], {
    revalidate: 300,
    tags: ["blobs-meals"],
  }),
  hire: unstable_cache(() => listAll("hire/"), ["kok-blobs-hire"], {
    revalidate: 300,
    tags: ["blobs-hire"],
  }),
};

/** Cached listing of a blob folder (≤5 min stale; busted on every upload). */
export function getFolderBlobs(folder: BlobFolder): Promise<BlobLike[]> {
  return cachedListers[folder]();
}

/** Call after any put/del in a folder so cached listings refresh instantly.
 *  try/catch: revalidateTag needs the Next runtime — unit tests run without it. */
export function bustBlobCache(folder: BlobFolder): void {
  try {
    // Next 16 signature: (tag, profile) — 'max' expires the tag immediately.
    revalidateTag(`blobs-${folder}`, "max");
  } catch {
    /* outside Next runtime (tests) — nothing to bust */
  }
}
