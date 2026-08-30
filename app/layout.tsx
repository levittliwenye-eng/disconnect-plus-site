import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://disconnect.plus"
  ),
  title: "DISCONNECT+",
  description:
    "DISCONNECT+ archive for experimental electronic music, free open-source DISCONNECT audio plugins, Noise Box in Kunming, and Field Electric Noise.",
  openGraph: {
    title: "DISCONNECT+",
    description:
      "Experimental electronics, free open-source audio plugins, Noise Box at 871 Cultural and Creative Factory in Kunming, field noise, visuals, artifacts, and contact.",
    images: ["/images/skeleton_beach.jpg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <html lang="zh-CN">
      <body>
        {children}
        {turnstileSiteKey && (
          <script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            async
            defer
          />
        )}
      </body>
    </html>
  );
}
