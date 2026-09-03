import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import SupportImpact from "@/components/sections/SupportImpact";
import ChairmansMessage from "@/components/sections/ChairmansMessage";
import News from "@/components/sections/News";
import AtWork from "@/components/sections/AtWork";
import OrderCTA from "@/components/sections/OrderCTA";

/**
 * THE SECTIONS WITH PHOTOGRAPHS COME FIRST.
 *
 * Below the hero the Chairman's message (his board portrait) and the news cards
 * (whatever staff attach in the sheet) carry photographs; AtWork carries three
 * more further down. The rest is icon tiles. Leading with faces rather than
 * icons means a visitor meets the Foundation as people before they meet it as a
 * list of programme areas, and the Chairman's welcome is the natural thing to
 * read straight after the hero.
 *
 * THE BACKGROUNDS ALTERNATE, AND THAT CONSTRAINS THE REST.
 * Chairman is white, News slate-50, Stats white, AtWork slate-50, Services
 * slate-50, and both SupportImpact and OrderCTA are #0a1628. Two bands of one
 * colour touching read as a single enormous section with a gap in the middle,
 * so SupportImpact sits BEFORE Services rather than after it, keeping a light
 * section between the two dark ones — and AtWork sits between Stats and
 * SupportImpact, the only seam where another slate band does not land against
 * News's or Services'. Reordering these again means checking that same thing.
 * The sequence below runs dark · white · slate · white · slate · dark · slate ·
 * dark.
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <ChairmansMessage />
      <News />
      <Stats />
      <AtWork />
      <SupportImpact />
      <Services />
      <OrderCTA />
    </main>
  );
}
