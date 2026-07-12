import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MotionConfig } from "framer-motion";
import { SITE_URL as siteUrl } from "@/lib/site-url";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { StagingBanner } from "@/components/StagingBanner";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import UpsellToast from "@/components/UpsellToast";
import RestaurantSchema from "@/components/RestaurantSchema";
import PWA from "@/components/PWA";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KOK Kitchens — Nigerian Food & Catering, North London & Hertfordshire",
    template: "%s | KOK Kitchens",
  },
  description:
    "Order authentic Nigerian meals for delivery across North London & Hertfordshire or let us cater your next event. From smoky party jollof to rich egusi soup — taste the soul of Nigeria.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "KOK Kitchens",
    title: "KOK Kitchens — Authentic Nigerian Food Ordering & Catering",
    description:
      "50+ authentic Nigerian dishes delivered across North London & Hertfordshire. Jollof rice, egusi soup, suya, peppered chicken & more. Order online or WhatsApp us.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KOK Kitchens — Authentic Nigerian Cuisine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KOK Kitchens — Authentic Nigerian Food",
    description:
      "Order authentic Nigerian meals for delivery across North London & Hertfordshire. 50+ dishes, event catering, fast delivery.",
    images: ["/og-image.png"],
  },
  other: {
    "theme-color": "#0c0a09",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <StagingBanner />
        <RestaurantSchema />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-stone-900 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Skip to content
        </a>
        <MotionConfig reducedMotion="user">
          <CartProvider>
            <Header />
            <main id="main-content" tabIndex={-1} className="flex-1">
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <UpsellToast />
            <WhatsAppButton />
            <PWA />
          </CartProvider>
          <Analytics />
        </MotionConfig>
      </body>
    </html>
  );
}
