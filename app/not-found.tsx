import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-stone-50 flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <ChefHat className="h-8 w-8 text-orange-700" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">
          This page has wandered off
        </h1>
        <p className="mt-3 text-stone-500 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Let&apos;s get you back to the good stuff.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700 transition-colors"
          >
            Browse the menu
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 hover:border-orange-400 hover:text-orange-700 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
