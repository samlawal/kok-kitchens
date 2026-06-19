import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import ClearCart from "./ClearCart";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const paidByCard = !!ref;

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <ClearCart />
      <div className="text-center px-4 max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-700" />
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-3">
          Order Confirmed!
        </h1>
        {ref && (
          <p className="text-sm text-stone-500 mb-2">
            Reference <span className="font-semibold text-stone-600">{ref}</span>
          </p>
        )}
        <p className="text-stone-500 leading-relaxed mb-2">
          Thank you for your order. We&apos;re preparing your delicious
          Nigerian meal right now.
        </p>
        <p className="text-sm text-stone-500 mb-8">
          You&apos;ll receive a confirmation email with your order details
          shortly.{" "}
          {paidByCard
            ? "Your card payment has been received."
            : "Payment will be collected on delivery."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
          >
            Order Again
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-stone-200 px-6 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
