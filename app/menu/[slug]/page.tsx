import { notFound } from "next/navigation";
import { getMenuItemBySlug, menuItems, formatPrice } from "@/lib/menu-data";
import AddToCartButton from "./AddToCartButton";
import MealDetailClient from "./MealDetailClient";
import { Flame, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function generateStaticParams() {
  return menuItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getMenuItemBySlug(slug);
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
  const item = getMenuItemBySlug(slug);
  if (!item) notFound();

  // Get related items from same category (exclude current)
  const related = menuItems
    .filter((m) => m.category === item.category && m.id !== item.id)
    .slice(0, 3);

  return <MealDetailClient item={item} related={related} />;
}
