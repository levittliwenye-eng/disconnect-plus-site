import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://disconnect-plus-site.pages.dev").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date("2026-08-30"),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/privacy/`,
      lastModified: new Date("2026-08-30"),
      changeFrequency: "yearly",
      priority: 0.3
    }
  ];
}
