import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nigerian Catering — North London & Hertfordshire",
  description:
    "Nigerian event catering for 20 to 200+ guests across North London & Hertfordshire — weddings, birthdays, corporate events and private dinners. Get a tailored quote within 24 hours.",
};

export default function CateringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
