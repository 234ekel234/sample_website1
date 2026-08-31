import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import SupportImpact from "@/components/sections/SupportImpact";
import ChairmansMessage from "@/components/sections/ChairmansMessage";
import News from "@/components/sections/News";
import OrderCTA from "@/components/sections/OrderCTA";

/**
 * THE TWO SECTIONS WITH PHOTOGRAPHS COME FIRST.
 *
 * Of everything below the hero, only the Chairman's message (his board
 * portrait) and the news cards (whatever staff attach in the sheet) carry a
 * photograph — the rest is icon tiles. Leading with faces rather than icons
 * means a visitor meets the Foundation as people before they meet it as a list
 * of programme areas, and the President's welcome is the natural thing to read
 * straight after the hero.
 *
 * THE BACKGROUNDS ALTERNATE, AND THAT CONSTRAINS THE REST.
 * Chairman is white, News slate-50, Stats white, Services slate-50, and both
 * SupportImpact and OrderCTA are #0a1628. Two dark bands touching read as one
 * enormous block with a gap in the middle, so SupportImpact sits BEFORE
 * Services rather than after it, keeping a light section between the two dark
 * ones. Reordering these again means checking that same thing. The sequence
 * below runs dark · white · slate · white · dark · slate · dark.
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <ChairmansMessage />
      <News />
      <Stats />
      <SupportImpact />
      <Services />
      <OrderCTA />
    </main>
  );
}
