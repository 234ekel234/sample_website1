import { getContent } from "@/lib/content";
import ChairmansMessageContent from "@/components/sections/ChairmansMessageContent";

// Server component: reads the Chairman's message from the staff-editable content
// sheet, then hands it to the client component that does the animation. Same
// split as News.tsx -> NewsCards.tsx.
//
// If the sheet is unconfigured or unreachable, getContent() returns the current
// wording, so this section always renders.
export default async function ChairmansMessage() {
  const { chairman } = await getContent();

  return (
    <ChairmansMessageContent
      name={chairman.name}
      title={chairman.title}
      body={chairman.body}
    />
  );
}
