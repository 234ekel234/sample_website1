import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import OrderCTA from "@/components/sections/OrderCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Services />
      <OrderCTA />
    </main>
  );
}
