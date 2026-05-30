import { list } from "@vercel/blob";

// Cache of Blob URLs — refreshed every 5 minutes in production
let blobCache: Map<string, string> = new Map();
let lastFetch = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function refreshBlobCache() {
  const now = Date.now();
  if (now - lastFetch < CACHE_TTL && blobCache.size > 0) return;

  try {
    const result = await list({ prefix: "meals/" });
    const newCache = new Map<string, string>();
    for (const blob of result.blobs) {
      // Extract menu item ID from path: "meals/jollof-rice-small-tray.webp"
      const filename = blob.pathname.replace("meals/", "").replace(".webp", "");
      if (!filename.startsWith("_rollback/")) {
        newCache.set(filename, blob.url);
      }
    }
    blobCache = newCache;
    lastFetch = now;
  } catch {
    // Blob not configured yet — fall back to static files
  }
}

/**
 * Get the image URL for a menu item.
 * Checks Vercel Blob first (uploaded via /admin), falls back to static file.
 */
export async function getImageUrl(menuItemId: string): Promise<string> {
  await refreshBlobCache();

  const blobUrl = blobCache.get(menuItemId);
  if (blobUrl) return blobUrl;

  // Fall back to static file in /public/meals/
  return `/meals/${menuItemId}.webp`;
}

/**
 * Synchronous version for client components — uses the static path.
 * Blob-uploaded images are served via the API route below instead.
 */
export function getStaticImageUrl(menuItemId: string): string {
  return `/meals/${menuItemId}.webp`;
}
