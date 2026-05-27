import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import Products from "@/components/sections/Products";
import OrderCTA from "@/components/sections/OrderCTA";
import PaymentMethods from "@/components/sections/PaymentMethods";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Services />
      <Products />
      <OrderCTA />
      <PaymentMethods />
    </main>
  );
}
