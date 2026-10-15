import type { Metadata } from "next";
import "./globals.css";
import { assetPath, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Artem Shuvalov | Network Security Engineer",
  description: "Network Security Engineer specializing in enterprise firewalls, VPN infrastructure, security operations, and Python & JavaScript automation. Explore Artem Shuvalov’s work and get in touch.",
  openGraph: {
    title: "Artem Shuvalov — Securing Networks. Automating Operations.",
    description: "Enterprise network security, secure connectivity, and practical automation. Explore my experience and projects.",
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    images: [{ url: new URL(assetPath("/assets/artem-portrait.webp"), new URL(SITE_URL).origin).href, width: 791, height: 996, alt: "Artem Shuvalov" }],
  },
  twitter: { card: "summary", title: "Artem Shuvalov | Network Security Engineer" },
  robots: { index: true, follow: true },
  icons: {
    icon: assetPath("/favicon.svg"),
    shortcut: assetPath("/favicon.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
