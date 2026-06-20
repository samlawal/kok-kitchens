import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableware & Chafing Dish Hire — Hertfordshire",
  description:
    "Hire chafing dishes, charger plates, tableware and coolers for your event across Hertfordshire. Check live availability and enquire for pricing.",
};

export default function HireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
