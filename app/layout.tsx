import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://kok-kitchens-samlawals-projects.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "KOK Kitchen — Authentic Nigerian Food Ordering & Catering",
    template: "%s | KOK Kitchen",
  },
  description:
    "Order authentic Nigerian meals for delivery across Hertfordshire or let us cater your next event. From smoky party jollof to rich egusi soup — taste the soul of Nigeria.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "KOK Kitchen",
    title: "KOK Kitchen — Authentic Nigerian Food Ordering & Catering",
    description:
      "50+ authentic Nigerian dishes delivered across Hertfordshire. Jollof rice, egusi soup, suya, peppered chicken & more. Order online or WhatsApp us.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KOK Kitchen — Authentic Nigerian Cuisine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KOK Kitchen — Authentic Nigerian Food",
    description:
      "Order authentic Nigerian meals for delivery across Hertfordshire. 50+ dishes, event catering, fast delivery.",
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
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
