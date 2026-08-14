import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AUTHOR, PRODUCTS } from "@codeloom/config";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const product = PRODUCTS.agent;

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
