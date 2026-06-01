import type { Metadata } from "next";
import AboutHero from "@/components/sections/about/AboutHero";
import OurStory from "@/components/sections/about/OurStory";
import MissionValues from "@/components/sections/about/MissionValues";

export const metadata: Metadata = {
  title: "About | PMAFI",
  description:
    "Learn about the Philippine Military Academy Foundation, Inc. — our story, mission, vision, and the values that guide our work in support of PMA.",
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
