import { notFound } from "next/navigation";
import { getMenuItemBySlug, menuItems, formatPrice } from "@/lib/menu-data";
import AddToCartButton from "./AddToCartButton";
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

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-orange-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center text-[120px]">
            🍛
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-stone-900">
                {item.name}
              </h1>
              {item.spicy && <Flame className="h-5 w-5 text-red-500" />}
            </div>

            <p className="mt-4 text-stone-600 leading-relaxed text-lg">
              {item.description}
            </p>

            {item.servings && (
              <p className="mt-2 text-sm font-medium text-orange-600">
                {item.servings}
              </p>
            )}

            {item.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8">
              <p className="text-3xl font-bold text-stone-900">
                {formatPrice(item.price)}
              </p>
            </div>

            <div className="mt-6">
              <AddToCartButton item={item} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
