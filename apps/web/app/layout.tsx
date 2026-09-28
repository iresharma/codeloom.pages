import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans, JetBrains_Mono, Newsreader, Syne } from "next/font/google";
import { AUTHOR, siteUrl } from "@codeloom/config";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "CodeLoom — engine, cloud controller, clients",
    template: "%s · CodeLoom",
  },
  description:
    "A coding-agent stack split at its natural seam: an engine that owns the workspace, a cloud controller for running it unattended, and thin clients — a web client and a TUI — that just render what it says.",
  authors: [{ name: AUTHOR.name, url: "https://iresharma.com" }],
  keywords: ["coding agent", "engine", "cloud controller", "web coding agent", "tui", "codeloom"],
  openGraph: {
    title: "CodeLoom",
    description: "One engine. One protocol. As many clients as you want.",
    url: siteUrl(),
    siteName: "CodeLoom",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeLoom",
    description: "One engine. One protocol. As many clients as you want.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${plexSans.variable} ${jetbrainsMono.variable} ${newsreader.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
