"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for debugging; in prod this also reaches Vercel logs.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-stone-50 flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <AlertTriangle className="h-8 w-8 text-orange-700" />
        </div>
        <h1 className="text-3xl font-bold text-stone-900">
          Something went wrong
        </h1>
        <p className="mt-3 text-stone-500 leading-relaxed">
          Sorry — that didn&apos;t work as expected. Please try again, or reach
          us on WhatsApp and we&apos;ll sort it out for you.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 hover:border-orange-400 hover:text-orange-700 transition-colors"
          >
            Browse the menu
          </Link>
          <a
            href="https://wa.me/447447982712"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-green-700/40 px-6 py-3 text-sm font-semibold text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors"
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </div>
  );
}
