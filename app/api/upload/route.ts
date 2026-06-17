import { NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kok-admin-2026";

// Always store under the canonical .webp path so /api/images (which serves the
// menu's uploaded photos) and the static fallback resolve consistently. The
// file extension is cosmetic — browsers and Next/Image render by Content-Type,
// which we set to match the actual uploaded bytes.
function blobPath(menuItemId: string) {
  return `meals/${menuItemId}.webp`;
}
function rollbackPath(menuItemId: string) {
  return `meals/_rollback/${menuItemId}.webp`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get("password") as string;
  const file = formData.get("file") as File;
  const menuItemId = formData.get("menuItemId") as string;

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 401 }
    );
  }

  if (!file || !menuItemId) {
    return NextResponse.json(
      { success: false, message: "File and menu item ID required" },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { success: false, message: "Only image files are allowed" },
      { status: 400 }
    );
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { success: false, message: "File too large (max 10MB)" },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || "image/webp";

    // Save the current image as a rollback copy before overwriting.
    const existing = await list({ prefix: blobPath(menuItemId) });
    const currentBlob = existing.blobs[0];
    if (currentBlob) {
      try {
        const resp = await fetch(currentBlob.url);
        const curType = resp.headers.get("content-type") || "image/webp";
        const curData = await resp.arrayBuffer();
        await put(rollbackPath(menuItemId), Buffer.from(curData), {
          access: "public",
          contentType: curType,
          addRandomSuffix: false,
          allowOverwrite: true,
        });
      } catch (e) {
        console.warn("Rollback save skipped:", e);
      }
    }

    const blob = await put(blobPath(menuItemId), buffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    const sizeKb = Math.round(buffer.length / 1024);

    return NextResponse.json({
      success: true,
      url: blob.url,
      size: `${sizeKb}KB`,
      message: `Photo updated for ${menuItemId} (${sizeKb}KB).`,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: `Upload failed: ${detail}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { password, menuItemId } = await request.json();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 401 }
    );
  }

  try {
    const rollbacks = await list({ prefix: rollbackPath(menuItemId) });

    if (rollbacks.blobs.length === 0) {
      return NextResponse.json(
        { success: false, message: "No previous version to rollback to" },
        { status: 404 }
      );
    }

    const rollbackBlob = rollbacks.blobs[0];
    const resp = await fetch(rollbackBlob.url);
    const rbType = resp.headers.get("content-type") || "image/webp";
    const rollbackData = await resp.arrayBuffer();

    const blob = await put(blobPath(menuItemId), Buffer.from(rollbackData), {
      access: "public",
      contentType: rbType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    // Remove the rollback copy now that it's been restored.
    await del(rollbackBlob.url);

    return NextResponse.json({
      success: true,
      url: blob.url,
      message: `Rolled back photo for ${menuItemId}`,
    });
  } catch (error) {
    console.error("Rollback failed:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: `Rollback failed: ${detail}` },
      { status: 500 }
    );
  }
}
