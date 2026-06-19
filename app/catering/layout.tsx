import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catering",
  description:
    "Event catering for 20 to 200+ guests across Hertfordshire — authentic Nigerian cuisine for celebrations, corporate events and private dinners.",
};

export default function CateringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
