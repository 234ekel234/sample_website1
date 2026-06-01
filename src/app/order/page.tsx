import type { Metadata } from "next";
import OrderHero from "@/components/sections/order/OrderHero";
import OrderSteps from "@/components/sections/order/OrderSteps";
import OrderFormLink from "@/components/sections/order/OrderFormLink";

export const metadata: Metadata = {
  title: "Order — Tusi Solutions",
  description:
    "Place a product order with Tusi Solutions. Fill out our order form and we'll confirm your total within 24 hours.",
};

export default function OrderPage() {
  return (
    <main>
      <OrderHero />
      <OrderSteps />
      <OrderFormLink />
    </main>
  );
}
