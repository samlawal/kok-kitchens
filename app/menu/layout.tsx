import type { Metadata } from "next";

// The menu page is a client component and cannot export metadata itself, so the
// per-route <title> lives here. /menu/[slug] overrides this via generateMetadata.
export const metadata: Metadata = {
  title: "Nigerian Food Menu — Hertfordshire Delivery",
  description:
    "Browse 50+ authentic Nigerian dishes — jollof rice, egusi soup, suya, peppered chicken and more. Order online for delivery across Hertfordshire, or on WhatsApp.",
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
