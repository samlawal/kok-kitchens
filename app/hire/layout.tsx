import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableware & Chafing Dish Hire — North London & Hertfordshire",
  description:
    "Hire chafing dishes, charger plates, tableware and coolers for your event across North London & Hertfordshire. Check live availability and enquire for pricing.",
};

export default function HireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
