import type { Metadata } from "next";
import AboutHero from "@/components/sections/about/AboutHero";
import OurStory from "@/components/sections/about/OurStory";
import AnniversaryVideo from "@/components/sections/about/AnniversaryVideo";
import AcademyBand from "@/components/sections/about/AcademyBand";
import MissionValues from "@/components/sections/about/MissionValues";
import BoardOfTrustees from "@/components/sections/about/BoardOfTrustees";

export const metadata: Metadata = {
  title: "About | PMAFI",
  description:
    "Learn about the Philippine Military Academy Foundation, Inc. — our story, mission, vision, values, and the 2025–2026 Board of Trustees who lead it.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <OurStory />
      {/* Renders nothing until `video.url` is set in the content sheet. */}
      <AnniversaryVideo />
      <AcademyBand />
      <MissionValues />
      <BoardOfTrustees />
    </main>
  );
}
