import type { Metadata } from "next";
import ContactHero from "@/components/sections/contact/ContactHero";
import ContactDetails from "@/components/sections/contact/ContactDetails";
import FAQ from "@/components/sections/contact/FAQ";
import OrderCTA from "@/components/sections/OrderCTA";

export const metadata: Metadata = {
  title: "Contact — Tusi Solutions",
  description:
    "Get in touch with Tusi Solutions. Reach us by email or phone — we respond within 24 hours.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactDetails />
      <FAQ />
      <OrderCTA />
    </main>
  );
}
