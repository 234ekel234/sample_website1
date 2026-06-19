import type { Metadata } from "next";
import DonateHero from "@/components/sections/donate/DonateHero";
import WaysToGive from "@/components/sections/donate/WaysToGive";
import GivingPromise from "@/components/sections/donate/GivingPromise";
import HowToDonate from "@/components/sections/donate/HowToDonate";
import OrderCTA from "@/components/sections/OrderCTA";

export const metadata: Metadata = {
  title: "Donate | PMAFI",
  description:
    "Support the Philippine Military Academy Foundation, Inc. Give a general donation, establish a professorial chair or endowment fund, or become a member — and help sustain academic excellence at the PMA.",
};

export default function DonatePage() {
  return (
    <main>
      <DonateHero />
      <WaysToGive />
      <GivingPromise />
      <HowToDonate />
      <OrderCTA />
    </main>
  );
}
