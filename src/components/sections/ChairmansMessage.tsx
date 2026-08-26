import { getContent } from "@/lib/content";
import { boardMembers } from "@/lib/board-data";
import ChairmansMessageContent from "@/components/sections/ChairmansMessageContent";

// Server component: reads the message from the staff-editable content sheet,
// then hands it to the client component that does the animation. Same split as
// News.tsx -> NewsCards.tsx.
//
// If the sheet is unconfigured or unreachable, getContent() returns the current
// wording, so this section always renders.
//
// THE KEYS ARE STILL NAMED chairman.* AND THAT IS NOW A MISNOMER. They are the
// sheet's contract — column A is matched by exact string — so renaming them
// here would silently detach the section from the cells staff edit. The section
// carries whoever the sheet names, whatever their office.

/** Fold a name so the sheet's casing and punctuation cannot miss a match. */
const fold = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export default async function ChairmansMessage() {
  const { chairman } = await getContent();

  // THE PORTRAIT FOLLOWS THE NAME. It was a hardcoded path, so changing who is
  // quoted meant editing the sheet and a deploy — and until both landed the
  // page showed one officer's photograph above another's words. Resolving it
  // from board-data means the sheet alone decides who is quoted, and the face
  // can never belong to somebody other than the byline.
  //
  // No match yields no photo rather than a default one: a name that has been
  // mistyped, or an officer not yet in board-data, must not be illustrated with
  // whoever happens to be first in the list.
  const speaker = boardMembers.find(
    (m) => fold(m.name) === fold(chairman.name)
  );

  return (
    <ChairmansMessageContent
      name={chairman.name}
      title={chairman.title}
      body={chairman.body}
      portrait={speaker?.image ?? null}
    />
  );
}
