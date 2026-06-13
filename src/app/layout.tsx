import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

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
  // Update to the custom domain (e.g. https://pmafi.org) once it goes live.
  metadataBase: new URL("https://pmafi.vercel.app"),
  title: "PMAFI — Philippine Military Academy Foundation, Inc.",
  description:
    "Supporting the Philippine Military Academy in developing officers of integrity, competence, and character — building the next generation of leaders for our nation.",
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
        <Navbar />
        {children}
        <Footer />
        <FloatingChat />
      </body>
    </html>
  );
}
