import { notFound } from "next/navigation";
import { getMenuItemBySlug, menuItems } from "@/lib/menu-data";
import MealDetailClient from "./MealDetailClient";
import { getDb } from "@/lib/db";
import type { MenuItem } from "@/lib/types";

export function generateStaticParams() {
  return menuItems.map((item) => ({ slug: item.slug }));
}

async function getCustomItemBySlug(slug: string): Promise<MenuItem | null> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, slug, name, description, price, category, image, spicy, servings
      FROM custom_menu_items WHERE slug = ${slug} LIMIT 1
    `;
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id as string,
      slug: r.slug as string,
      name: r.name as string,
      description: r.description as string,
      price: Number(r.price),
      category: r.category as MenuItem["category"],
      image: (r.image as string) || "",
      spicy: r.spicy as boolean,
      servings: (r.servings as string) || undefined,
      tags: [],
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getMenuItemBySlug(slug) || (await getCustomItemBySlug(slug));
  if (!item) return {};
  return {
    title: item.name,
    description: item.description,
  };
}

export default async function MealDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getMenuItemBySlug(slug) || (await getCustomItemBySlug(slug));
  if (!item) notFound();

  const related = menuItems
    .filter((m) => m.category === item.category && m.id !== item.id)
    .slice(0, 3);

  return <MealDetailClient item={item} related={related} />;
}
