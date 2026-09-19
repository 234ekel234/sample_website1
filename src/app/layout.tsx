import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import { getContent } from "@/lib/content";
import { getFaqs } from "@/lib/faq";
import StructuredData from "@/components/StructuredData";
import Analytics from "@/components/Analytics";
import { ConsentProvider } from "@/components/ConsentProvider";
import CookieNotice from "@/components/CookieNotice";
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
  // Self-referencing canonical, resolved per route against metadataBase.
  // The app is reachable on two hosts — www.pmafi.org and the pmafi.vercel.app
  // deployment URL, which serves the same pages with a 200 rather than
  // redirecting. Without this, the two compete as duplicate content and the
  // free subdomain can outrank the domain PMAFI pays for.
  alternates: { canonical: "./" },
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The assistant's contact channels and approved answers both come from the
  // staff-editable sheet; blank values are hidden rather than guessed.
  const [{ contact, social }, faqs] = await Promise.all([
    getContent(),
    getFaqs(),
  ]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* The consent answer is read once here and shared, so the analytics
            script, the notice and the footer's "Cookie settings" cannot
            disagree about it. It wraps everything because the footer control
            needs it as much as the script does. */}
        <ConsentProvider>
          <StructuredData contact={contact} social={social} />
          {/* First in the body, so a keyboard visitor reaches the notice
              before the whole page rather than after it. It is `fixed`, so
              its position on screen is unaffected. */}
          <CookieNotice />
          <Navbar />
          {children}
          <Footer />
          <FloatingChat
            email={contact.email}
            phone={contact.phone}
            faqs={faqs}
          />
          <Analytics />
        </ConsentProvider>
      </body>
    </html>
  );
}
