import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://disconnectplus.com"
  ),
  title: "DISCONNECT+",
  description:
    "DISCONNECT+ archive for an experimental electronic band, independent DISCONNECT audio plugins, the Kunming Noise Box club, and Wilderness Noise.",
  openGraph: {
    title: "DISCONNECT+",
    description:
      "Experimental electronics, independent audio plugins, the Noise Box club at 871 Cultural and Creative Factory in Kunming, Wilderness Noise, visuals, artifacts, and contact.",
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
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            defer
          />
        )}
      </body>
    </html>
  );
}
