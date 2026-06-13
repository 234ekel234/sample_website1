import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import ChairmansMessage from "@/components/sections/ChairmansMessage";
import News from "@/components/sections/News";
import OrderCTA from "@/components/sections/OrderCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Services />
      <ChairmansMessage />
      <News />
      <OrderCTA />
    </main>
  );
}
