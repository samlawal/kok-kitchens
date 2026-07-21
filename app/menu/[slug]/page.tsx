import { notFound } from "next/navigation";
import { getMenuItemBySlug, menuItems } from "@/lib/menu-data";
import MealDetailClient from "./MealDetailClient";
import { getCustomItemBySlug as fetchCustomItem, customItemToMenuItem } from "@/lib/custom-items";
import type { MenuItem } from "@/lib/types";

export function generateStaticParams() {
  return menuItems.map((item) => ({ slug: item.slug }));
}

// Custom items now come through the shared data layer (lib/custom-items), which
// coerces Neon's string price in one place; here we just adapt to MenuItem.
async function getCustomMenuItemBySlug(slug: string): Promise<MenuItem | null> {
  const item = await fetchCustomItem(slug);
  return item ? customItemToMenuItem(item) : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getMenuItemBySlug(slug) || (await getCustomMenuItemBySlug(slug));
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
  const item = getMenuItemBySlug(slug) || (await getCustomMenuItemBySlug(slug));
  if (!item) notFound();

  const related = menuItems
    .filter((m) => m.category === item.category && m.id !== item.id)
    .slice(0, 3);

  return <MealDetailClient item={item} related={related} />;
}
