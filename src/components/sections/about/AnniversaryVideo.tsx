import { getContent } from "@/lib/content";
import { youtubeId } from "@/lib/video";
import VideoEmbed from "@/components/ui/VideoEmbed";

/**
 * The Foundation's own film, between its story and the Academy it supports.
 *
 * A SERVER COMPONENT THAT RETURNS NULL rather than a section with nothing in
 * it. The url lives in the content sheet, so this shipped before the film was
 * uploaded and appeared the moment staff pasted the link — no deploy, same as
 * form.correction and form.contact. It disappears the same way if the cell is
 * cleared, and a link that is not YouTube renders nothing rather than an empty
 * black frame. The id is parsed here as well as inside VideoEmbed so that the
 * heading and the slate band do not render around a video that will not.
 *
 * ON /about RATHER THAN THE HOME PAGE. An anniversary film is dated by
 * construction — "the 38th" is history the moment the 39th comes round. On a
 * page that tells the Foundation's story that reads as a record; on the home
 * page it would be something somebody has to remember to swap.
 *
 * Slate-50, between OurStory (white) and AcademyBand (white).
 *
 * NO NAMES IN THE CAPTION, following /donate and the At Work band. The poster
 * frame is a room full of identifiable members greeting each other.
 */
export default async function AnniversaryVideo() {
  const content = await getContent();
  if (!youtubeId(content.video.url)) return null;

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            In our own words
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-4 text-3xl font-bold text-[#1B2A4A] sm:text-4xl">
            Thirty-eight years of the Foundation
          </h2>
        </div>

        <VideoEmbed
          url={content.video.url}
          poster="/anniversary-video-poster.jpg"
          title="PMA Foundation, Inc. — 38th Founding Anniversary"
          caption="The Foundation's 38th founding anniversary. Plays on YouTube; nothing loads from Google until you press play."
        />
      </div>
    </section>
  );
}
