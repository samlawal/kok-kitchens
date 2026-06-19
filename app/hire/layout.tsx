import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equipment Hire",
  description:
    "Hire chafing dishes, charger plates, tableware and coolers for your event across Hertfordshire — enquire for availability and pricing.",
};

export default function HireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
