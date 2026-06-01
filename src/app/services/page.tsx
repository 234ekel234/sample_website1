import type { Metadata } from "next";
import ServicesHero from "@/components/sections/services/ServicesHero";
import ServicesList from "@/components/sections/services/ServicesList";
import HowItWorks from "@/components/sections/services/HowItWorks";
import OrderCTA from "@/components/sections/OrderCTA";

export const metadata: Metadata = {
  title: "Services — Tusi Solutions",
  description:
    "Explore Tusi Solutions' core services: consulting & strategy, digital solutions, and product supply.",
};

export default function ServicesPage() {
  return (
    <main>
      <ServicesHero />
      <ServicesList />
      <HowItWorks />
      <OrderCTA />
    </main>
  );
}
