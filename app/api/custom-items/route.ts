import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdminSecret } from "@/lib/admin-auth";
import { put } from "@vercel/blob";
import { menuItems } from "@/lib/menu-data";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET — public, returns all custom items for the menu
export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, slug, name, description, price, category, image, spicy, servings
      FROM custom_menu_items
      ORDER BY created_at DESC
    `;
    return NextResponse.json(
      { success: true, items: rows },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("custom-items GET failed:", error);
    return NextResponse.json(
      { success: true, items: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}

// POST — admin-gated, create a new custom menu item (accepts FormData with optional image)
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  let password: string;
  let name: string;
  let description: string;
  let price: number;
  let category: string;
  let spicy = false;
  let servings = "";
  let imageFile: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    password = (form.get("password") as string) || "";
    name = ((form.get("name") as string) || "").trim();
    description = ((form.get("description") as string) || "").trim();
    price = parseFloat((form.get("price") as string) || "0");
    category = (form.get("category") as string) || "";
    spicy = form.get("spicy") === "true";
    servings = ((form.get("servings") as string) || "").trim();
    imageFile = form.get("image") as File | null;
  } else {
    const body = await request.json();
    password = body.password || "";
    name = (body.name || "").trim();
    description = (body.description || "").trim();
    price = parseFloat(body.price || "0");
    category = body.category || "";
    spicy = body.spicy === true;
    servings = (body.servings || "").trim();
  }

  if (!verifyAdminSecret(password)) {
    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 401 }
    );
  }

  if (!name || !category || isNaN(price) || price < 0) {
    return NextResponse.json(
      { success: false, message: "Name, category, and a valid price are required" },
      { status: 400 }
    );
  }

  const baseSlug = slugify(name);
  if (!baseSlug) {
    return NextResponse.json(
      { success: false, message: "Name must contain at least one letter or number" },
      { status: 400 }
    );
  }

  // Ensure slug is unique across static + custom items
  const sql = getDb();
  const staticSlugs = new Set(menuItems.map((i) => i.slug));
  const existingCustom = await sql`SELECT slug FROM custom_menu_items`;
  const customSlugs = new Set(existingCustom.map((r) => r.slug as string));

  let slug = baseSlug;
  let n = 2;
  while (staticSlugs.has(slug) || customSlugs.has(slug)) {
    slug = `${baseSlug}-${n}`;
    n++;
  }

  const id = `custom-${slug}`;

  // Upload image if provided
  let imageUrl = "";
  if (imageFile && imageFile.size > 0 && imageFile.type.startsWith("image/")) {
    try {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const blob = await put(`meals/${id}.webp`, buffer, {
        access: "public",
        contentType: imageFile.type,
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      imageUrl = blob.url;
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  }

  try {
    await sql`
      INSERT INTO custom_menu_items (id, slug, name, description, price, category, image, spicy, servings)
      VALUES (${id}, ${slug}, ${name}, ${description}, ${price}, ${category}, ${imageUrl}, ${spicy}, ${servings || null})
    `;

    return NextResponse.json({
      success: true,
      message: `Added "${name}" to the menu`,
      item: { id, slug, name, description, price, category, image: imageUrl, spicy, servings },
    });
  } catch (error) {
    console.error("custom-items POST failed:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: `Failed to add item: ${detail}` },
      { status: 500 }
    );
  }
}

// DELETE — admin-gated, remove a custom menu item
export async function DELETE(request: Request) {
  const { password, itemId } = await request.json();

  if (!verifyAdminSecret(password)) {
    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 401 }
    );
  }

  if (!itemId) {
    return NextResponse.json(
      { success: false, message: "itemId is required" },
      { status: 400 }
    );
  }

  try {
    const sql = getDb();
    const deleted = await sql`
      DELETE FROM custom_menu_items WHERE id = ${itemId} RETURNING name
    `;
    if (deleted.length === 0) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: `Removed "${deleted[0].name}" from the menu`,
    });
  } catch (error) {
    console.error("custom-items DELETE failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove item" },
      { status: 500 }
    );
  }
}
