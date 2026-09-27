"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { youtubeId, youtubeEmbedUrl } from "@/lib/video";

/**
 * A YouTube video that loads nothing from Google until the visitor asks for it.
 *
 * THE IFRAME DOES NOT EXIST UNTIL THE PLAY BUTTON IS CLICKED, and that is the
 * whole design rather than a performance trick. This site's position is that no
 * third-party script runs before the visitor has agreed to it — Analytics.tsx
 * returns null rather than loading a tracker behind a flag, and AGENTS.md
 * explicitly rejects Google's own consent mode because it still fetches a
 * script and pings Google from a page nobody agreed to be measured on. An
 * ordinary <iframe src="youtube.com/..."> contradicts that on page load: it
 * fetches roughly 1.5MB from Google and sets cookies before anyone has pressed
 * anything. A poster and a button do not.
 *
 * THE POSTER IS SELF-HOSTED, and that is the half of this people miss. Pulling
 * the thumbnail from img.youtube.com is a request to Google on page load, which
 * gives away most of what the facade was for. It lives in public/ instead.
 *
 * Clicking play is an unambiguous request for the video, so creating the iframe
 * at that point needs no separate consent — the visitor has just asked. The
 * embed uses youtube-nocookie.com regardless, which does not set cookies until
 * playback actually begins.
 *
 * A BLANK OR UNPARSEABLE URL RENDERS NOTHING. The url comes from the content
 * sheet, so the section appears when staff paste a link and disappears when
 * they clear the cell — the same rule as form.correction and form.contact,
 * where a blank key hides the control rather than rendering a dead one.
 */
export default function VideoEmbed({
  url,
  poster,
  title,
  caption,
}: {
  /** Any YouTube link shape, from the content sheet. */
  url: string;
  /** Self-hosted poster in public/. */
  poster: string;
  /** Used as the iframe title and the poster's alt text — screen readers get
   *  this as the only description of what the video is. */
  title: string;
  caption?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(url);
  if (!id) return null;

  return (
    <figure className="overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#0a1628]">
        {playing ? (
          <iframe
            src={youtubeEmbedUrl(id)}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            <Image
              src={poster}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            {/* Darkened so the play control keeps its contrast whatever the
                poster frame happens to be — this one is a bright room. */}
            <span className="absolute inset-0 bg-[#0a1628]/30 transition-colors duration-300 group-hover:bg-[#0a1628]/20" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#C8A951] shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Play
                  className="ml-1 h-8 w-8 text-[#0a1628]"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </span>
            </span>
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-slate-500">{caption}</figcaption>
      )}
    </figure>
  );
}
