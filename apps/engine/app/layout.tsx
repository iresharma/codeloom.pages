import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Mono, IBM_Plex_Sans, Newsreader, Syne } from "next/font/google";
import { AUTHOR, PRODUCTS } from "@codeloom/config";

import { PRODUCT_ID } from "../product";
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

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

const product = PRODUCTS[PRODUCT_ID];

export const metadata: Metadata = {
  metadataBase: new URL(`https://${product.host}`),
  title: {
    default: `${product.name} — ${product.tagline}`,
    template: "%s · CodeLoom",
  },
  description: product.description,
  authors: [{ name: AUTHOR.name, url: "https://iresharma.com" }],
  keywords: product.keywords,
  openGraph: {
    title: product.name,
    description: product.description,
    url: `https://${product.host}`,
    siteName: "CodeLoom",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: product.name,
    description: product.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${plexSans.variable} ${plexMono.variable} ${newsreader.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
