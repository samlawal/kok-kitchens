import type { Metadata } from "next";

// The /checkout/success page sets its own title via its own metadata export.
export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your KOK Kitchens order — delivery or pickup across North London & Hertfordshire.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
