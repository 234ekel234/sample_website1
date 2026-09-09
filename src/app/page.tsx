import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import SupportImpact from "@/components/sections/SupportImpact";
import LeadershipMessages from "@/components/sections/LeadershipMessages";
import MissionVision from "@/components/sections/MissionVision";
import News from "@/components/sections/News";
import AtWork from "@/components/sections/AtWork";
import OrderCTA from "@/components/sections/OrderCTA";

/**
 * THE SECTIONS WITH PHOTOGRAPHS COME FIRST.
 *
 * Below the hero the two leadership messages (the Chairman's and the
 * President's board portraits) and the news cards (whatever staff attach in the
 * sheet) carry photographs; AtWork carries three more further down. The rest is
 * icon tiles. Leading with faces rather than icons means a visitor meets the
 * Foundation as people before they meet it as a list of programme areas, and
 * the Chairman's welcome is the natural thing to read straight after the hero.
 *
 * LEADERSHIPMESSAGES RENDERS TWO SECTIONS, NOT ONE — white then slate-50, the
 * second mirrored. It is a fragment rather than a wrapper precisely so those
 * two bands sit in this sequence like any other, and it counts as two when
 * checking the alternation below.
 *
 * THE BACKGROUNDS ALTERNATE, AND THAT CONSTRAINS THE REST.
 * The Chairman's message is white and the President's slate-50, News slate-50,
 * Stats white, AtWork slate-50, Services slate-50, and MissionVision,
 * SupportImpact and OrderCTA are all #0a1628. Two bands of one colour touching
 * read as a single enormous section with a gap in the middle, so SupportImpact
 * sits BEFORE Services rather than after it, keeping a light section between
 * those two dark ones — and AtWork sits between Stats and SupportImpact, the
 * only seam where another slate band does not land against News's or Services'.
 * Reordering these again means checking that same thing. The sequence below runs
 * dark · white · slate · dark · slate · white · slate · dark · slate · dark.
 *
 * MissionVision goes AFTER the messages rather than before them. It is formal
 * prose, and putting it between the hero and the messages would undo the
 * ordering above — a visitor would meet the Foundation as a statement before
 * meeting it as a person. After the messages it also reads in the right order:
 * the officers speak, then the Foundation states what it is formally for. It is
 * also what separates the President's slate band from News's.
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <LeadershipMessages />
      <MissionVision />
      <News />
      <Stats />
      <AtWork />
      <SupportImpact />
      <Services />
      <OrderCTA />
    </main>
  );
}
