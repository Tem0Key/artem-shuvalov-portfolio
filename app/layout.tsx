import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://artem-shuvalov-network-engineer.clevereagle513.chatgpt.site"),
  title: "Artem Shuvalov | Network Security Engineer",
  description: "Network Security Engineer specializing in enterprise firewalls, VPN infrastructure, security operations, and Python & JavaScript automation. Explore Artem Shuvalov’s work and get in touch.",
  openGraph: {
    title: "Artem Shuvalov — Securing Networks. Automating Operations.",
    description: "Enterprise network security, secure connectivity, and practical automation. Explore my experience and projects.",
    type: "website",
    locale: "en_US",
    images: [{ url: "/assets/artem-portrait.webp", width: 791, height: 996, alt: "Artem Shuvalov" }],
  },
  twitter: { card: "summary", title: "Artem Shuvalov | Network Security Engineer" },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
