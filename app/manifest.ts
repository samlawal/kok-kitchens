import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KOK Kitchens — Authentic Nigerian Food & Catering",
    short_name: "KOK Kitchens",
    description:
      "Order authentic Nigerian meals for delivery across North London & Hertfordshire, or let us cater your next event.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0a09",
    theme_color: "#ea580c",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon.png", type: "image/png", sizes: "512x512" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
