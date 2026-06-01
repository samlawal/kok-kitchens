import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://kok-kitchens-samlawals-projects.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
