import { getContent } from "@/lib/content";
import { boardMembers } from "@/lib/board-data";
import LeadershipMessageContent from "@/components/sections/LeadershipMessageContent";

// Server component: reads both messages from the staff-editable content sheet,
// then hands each to the client component that does the animation. Same split
// as News.tsx -> NewsCards.tsx.
//
// If the sheet is unconfigured or unreachable, getContent() returns the current
// wording, so both sections always render.
//
// THE SHEET KEYS ARE chairman.* AND president.*, AND THOSE NAMES ARE THE
// CONTRACT — column A is matched by exact string, so renaming them here would
// silently detach a section from the cells staff edit. Each section carries
// whoever its rows name, whatever their office; `chairman.*` already carried
// the President's message for a week in August without a code change. Read the
// prefixes as "first message" and "second message", not as job titles.

/** Fold a name so the sheet's casing and punctuation cannot miss a match. */
const fold = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// THE PORTRAIT FOLLOWS THE NAME. It was a hardcoded path, so changing who is
// quoted meant editing the sheet and a deploy — and until both landed the page
// showed one officer's photograph above another's words. Resolving it from
// board-data means the sheet alone decides who is quoted, and the face can
// never belong to somebody other than the byline.
//
// No match yields no photo rather than a default one: a name that has been
// mistyped, or an officer not yet in board-data, must not be illustrated with
// whoever happens to be first in the list. With two messages on the page that
// matters more than it did with one — the wrong default here would be the
// other speaker, who is directly above or below.
const portraitFor = (name: string) =>
  boardMembers.find((m) => fold(m.name) === fold(name))?.image ?? null;

export default async function LeadershipMessages() {
  const { chairman, president } = await getContent();

  return (
    <>
      <LeadershipMessageContent
        name={chairman.name}
        title={chairman.title}
        body={chairman.body}
        portrait={portraitFor(chairman.name)}
        eyebrow="From Our Leadership"
        tone="light"
      />
      {/*
        The second message drops the eyebrow and mirrors the layout. One
        "From Our Leadership" introduces the pair; repeating it a section later
        reads as a copy-paste fault, and the derived heading ("Message from the
        President") already says who is speaking. The mirror is what stops two
        structurally identical bands from looking like the page has stuttered.

        `muted` keeps the alternation described in page.tsx: white here, then
        slate-50, then MissionVision's dark band.
      */}
      <LeadershipMessageContent
        name={president.name}
        title={president.title}
        body={president.body}
        portrait={portraitFor(president.name)}
        eyebrow={null}
        tone="muted"
        flip
      />
    </>
  );
}
