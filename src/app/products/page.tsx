import type { Metadata } from "next";
import ProductsHero from "@/components/sections/products/ProductsHero";
import ProductsGrid from "@/components/sections/products/ProductsGrid";
import ProductsGuarantee from "@/components/sections/products/ProductsGuarantee";
import OrderCTA from "@/components/sections/OrderCTA";

export const metadata: Metadata = {
  title: "Products — Tusi Solutions",
  description:
    "Browse Tusi Solutions' packages — from entry-level starter packs to fully custom enterprise engagements.",
};

export default function ProductsPage() {
  return (
    <main>
      <ProductsHero />
      <ProductsGrid />
      <ProductsGuarantee />
      <OrderCTA />
    </main>
  );
}
