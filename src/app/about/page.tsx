import type { Metadata } from "next";
import AboutHero from "@/components/sections/about/AboutHero";
import OurStory from "@/components/sections/about/OurStory";
import MissionValues from "@/components/sections/about/MissionValues";

export const metadata: Metadata = {
  title: "About — Tusi Solutions",
  description:
    "Learn about Tusi Solutions — our story, mission, and the values that guide every engagement.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <OurStory />
      <MissionValues />
    </main>
  );
}
