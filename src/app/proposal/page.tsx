import type { Metadata } from "next";
import ProposalHero from "@/components/sections/proposal/ProposalHero";
import ProposalTOC from "@/components/sections/proposal/ProposalTOC";
import BackToTop from "@/components/sections/proposal/BackToTop";
import WhatsBuilt from "@/components/sections/proposal/WhatsBuilt";
import OperatingCosts from "@/components/sections/proposal/OperatingCosts";
import DomainOptions from "@/components/sections/proposal/DomainOptions";
import MarketValue from "@/components/sections/proposal/MarketValue";
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

// scroll-mt offsets each anchor target so it isn't hidden behind the fixed navbar.
const anchor = "scroll-mt-24";

export default function ProposalPage() {
  return (
    <main>
      <ProposalHero />
      <ProposalTOC />
      <div id="whats-built" className={anchor}>
        <WhatsBuilt />
      </div>
      <div id="operating-costs" className={anchor}>
        <OperatingCosts />
      </div>
      <div id="domain-options" className={anchor}>
        <DomainOptions />
      </div>
      <div id="market-value" className={anchor}>
        <MarketValue />
      </div>
      <div id="alternatives" className={anchor}>
        <Alternatives />
      </div>
      <div id="add-ons" className={anchor}>
        <AddOns />
      </div>
      <div id="risks" className={anchor}>
        <Risks />
      </div>
      <div id="maintenance" className={anchor}>
        <Maintenance />
      </div>
      <div id="next-steps" className={anchor}>
        <NextSteps />
      </div>
      <BackToTop />
    </main>
  );
}
