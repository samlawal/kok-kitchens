import { NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kok-admin-2026";
const MAX_WIDTH = 800;
const WEBP_QUALITY = 82;

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get("password") as string;
  const file = formData.get("file") as File;
  const menuItemId = formData.get("menuItemId") as string;

  // Auth check
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

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { success: false, message: "Only image files are allowed" },
      { status: 400 }
    );
  }

  // 10MB max
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { success: false, message: "File too large (max 10MB)" },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Dynamic import — avoids build-time native binary issues
    const sharp = (await import("sharp")).default;

    // Auto-optimize: resize + convert to WebP
    const optimized = await sharp(buffer)
      .resize(MAX_WIDTH, MAX_WIDTH, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const filename = `meals/${menuItemId}.webp`;

    // Check if a current image exists — save as rollback
    const existing = await list({ prefix: `meals/${menuItemId}.webp` });
    if (existing.blobs.length > 0) {
      // Copy current to rollback path before overwriting
      const currentBlob = existing.blobs[0];
      const currentData = await fetch(currentBlob.url).then((r) =>
        r.arrayBuffer()
      );
      await put(`meals/_rollback/${menuItemId}.webp`, Buffer.from(currentData), {
        access: "public",
        contentType: "image/webp",
        addRandomSuffix: false,
      });
    }

    // Upload the new optimized image
    const blob = await put(filename, optimized, {
      access: "public",
      contentType: "image/webp",
      addRandomSuffix: false,
    });

    const sizeKb = Math.round(optimized.length / 1024);

    return NextResponse.json({
      success: true,
      url: blob.url,
      size: `${sizeKb}KB`,
      message: `Photo updated for ${menuItemId}. Optimized to ${sizeKb}KB WebP.`,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}

// Rollback endpoint
export async function PUT(request: Request) {
  const { password, menuItemId } = await request.json();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 401 }
    );
  }

  try {
    // Find rollback version
    const rollbacks = await list({
      prefix: `meals/_rollback/${menuItemId}.webp`,
    });

    if (rollbacks.blobs.length === 0) {
      return NextResponse.json(
        { success: false, message: "No previous version to rollback to" },
        { status: 404 }
      );
    }

    // Fetch rollback data and overwrite current
    const rollbackBlob = rollbacks.blobs[0];
    const rollbackData = await fetch(rollbackBlob.url).then((r) =>
      r.arrayBuffer()
    );

    const blob = await put(
      `meals/${menuItemId}.webp`,
      Buffer.from(rollbackData),
      {
        access: "public",
        contentType: "image/webp",
        addRandomSuffix: false,
      }
    );

    // Remove rollback copy
    await del(rollbackBlob.url);

    return NextResponse.json({
      success: true,
      url: blob.url,
      message: `Rolled back photo for ${menuItemId}`,
    });
  } catch (error) {
    console.error("Rollback failed:", error);
    return NextResponse.json(
      { success: false, message: "Rollback failed" },
      { status: 500 }
    );
  }
}
