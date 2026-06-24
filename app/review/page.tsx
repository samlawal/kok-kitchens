import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Star, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Leave us a review",
  description:
    "Leave KOK Kitchens a Google review — we'd love to hear how it went.",
  robots: { index: false, follow: false },
};

// Stable URL that printed stickers, bag inserts and the launch QR all point at.
// We redirect to KOK's Google Business Profile review form when the env var
// is set; otherwise a friendly fallback so day-one printed materials still
// land somewhere useful. Updating the destination later requires no reprint —
// just set the env var in Vercel and redeploy.
export default function ReviewRedirectPage() {
  const url = process.env.GOOGLE_REVIEW_URL?.trim();
  if (url) redirect(url);

  return (
    <div className="min-h-[70vh] bg-stone-50 flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <Star className="h-8 w-8 text-orange-700" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold text-stone-900">
          Loved your meal?
        </h1>
        <p className="mt-3 text-stone-600 leading-relaxed">
          We&apos;re setting up our Google reviews right now — for the moment,
          we&apos;d love to hear from you directly. A WhatsApp message or an
          email genuinely makes our week, and we&apos;ll add your kind words to
          our wall of love. 🧡
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://wa.me/447447982712?text=Hi%20KOK%20Kitchens%21%20I%27d%20like%20to%20leave%20a%20review..."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Send a WhatsApp
          </a>
          <a
            href="mailto:orders@kokkitchens.com?subject=A%20review%20for%20KOK%20Kitchens"
            className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 hover:border-orange-400 hover:text-orange-700 hover:bg-orange-50 active:bg-orange-100 transition-colors"
          >
            Email us instead
          </a>
        </div>
        <p className="mt-8 text-sm text-stone-500">
          <Link href="/" className="underline hover:text-orange-700">
            Back to the menu
          </Link>
        </p>
      </div>
    </div>
  );
}
