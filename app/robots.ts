import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://disconnect-plus-site.pages.dev").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/admin/"]
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
