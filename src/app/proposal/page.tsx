import type { Metadata } from "next";
import ProposalHero from "@/components/sections/proposal/ProposalHero";
import WhatsBuilt from "@/components/sections/proposal/WhatsBuilt";
import OperatingCosts from "@/components/sections/proposal/OperatingCosts";
import DomainOptions from "@/components/sections/proposal/DomainOptions";
import MarketValue from "@/components/sections/proposal/MarketValue";
import Investment from "@/components/sections/proposal/Investment";
import Alternatives from "@/components/sections/proposal/Alternatives";
import AddOns from "@/components/sections/proposal/AddOns";
import Risks from "@/components/sections/proposal/Risks";
import Maintenance from "@/components/sections/proposal/Maintenance";
import NextSteps from "@/components/sections/proposal/NextSteps";

export const metadata: Metadata = {
  title: "Website Proposal",
  description:
    "What's been built, what it costs to operate, and what we could add next.",
  robots: { index: false, follow: false },
};

export default function ProposalPage() {
  return (
    <main>
      <ProposalHero />
      <WhatsBuilt />
      <OperatingCosts />
      <DomainOptions />
      <MarketValue />
      <Investment />
      <Alternatives />
      <AddOns />
      <Risks />
      <Maintenance />
      <NextSteps />
    </main>
  );
}
