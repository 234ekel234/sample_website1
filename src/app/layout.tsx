import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import StructuredData from "@/components/StructuredData";
import Analytics from "@/components/Analytics";
import { SITE_URL } from "@/lib/site";

const SITE_NAME = "PMAFI — Philippine Military Academy Foundation, Inc.";
const SITE_DESCRIPTION =
  "Supporting the Philippine Military Academy in developing officers of integrity, competence, and character — building the next generation of leaders for our nation.";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Absolute base for resolving OG / Twitter image URLs in shared links.
  metadataBase: new URL(SITE_URL),
  // Pages set their own full "<Page> | PMAFI" titles; this is the home/default.
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationName: "PMAFI",
  keywords: [
    "PMAFI",
    "Philippine Military Academy Foundation",
    "Philippine Military Academy",
    "PMA",
    "Fort del Pilar",
    "military foundation",
    "scholarship",
    "donate",
    "membership",
  ],
  openGraph: {
    type: "website",
    siteName: "PMAFI",
    locale: "en_PH",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    // og:image is supplied automatically by app/opengraph-image.tsx.
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <StructuredData />
        <Navbar />
        {children}
        <Footer />
        <FloatingChat />
        <Analytics />
      </body>
    </html>
  );
}
