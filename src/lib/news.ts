// Server-side news fetcher.
//
// Reads published news items from the PMAFI News Google Sheet via the shared
// client in src/lib/sheets.ts. The sheet must be shared with
// GOOGLE_SERVICE_ACCOUNT_EMAIL (Viewer access is enough).
//
// Required environment variables:
//   NEWS_SHEET_ID                        – spreadsheet ID from its URL
//   GOOGLE_SERVICE_ACCOUNT_EMAIL         – service account email
//   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY   – PEM private key (\n-escaped is OK)
//
// If NEWS_SHEET_ID is not set the function returns the fallback posts so the
// page always renders even before the sheet is configured.
//
// Sheet columns (row 1 = headers, data starts at row 2):
//   A: Title  B: Excerpt  C: Category  D: Date  E: Link  F: Published (Yes/No)

import { readRange } from "@/lib/sheets";

export interface NewsItem {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  link: string;
  image: string;
}

const NEWS_RANGE = "News!A2:G";

// Convert any Google Drive share URL to a direct image URL that next/image can load.
// Accepts:  https://drive.google.com/file/d/{ID}/view?...
//           https://drive.google.com/open?id={ID}
//           https://drive.google.com/uc?id={ID}&export=view
// Returns:  https://lh3.googleusercontent.com/d/{ID}  (or the original if not Drive)
function toDriveImageUrl(raw: string): string {
  if (!raw) return "";
  const fileId =
    raw.match(/\/file\/d\/([^/?#]+)/)?.[1] ??
    raw.match(/[?&]id=([^&]+)/)?.[1];
  return fileId ? `https://lh3.googleusercontent.com/d/${fileId}` : raw;
}

const FALLBACK: NewsItem[] = [
  {
    title: "Annual General Membership Meeting",
    excerpt: "Members gather for the yearly assembly — Foundation updates, the Board report, and fellowship among PMA alumni and supporters.",
    category: "Events",
    date: "Upcoming",
    link: "",
    image: "",
  },
  {
    title: "Professorial Chair & Endowment Awarding",
    excerpt: "Recognizing donors and grantees of professorial chairs and endowment funds that sustain teaching excellence at the Academy.",
    category: "Programs",
    date: "Upcoming",
    link: "",
    image: "",
  },
  {
    title: "Class Reunion & Homecoming Support",
    excerpt: "PMAFI partners with alumni classes on reunion activities that give back to the Corps and the cadets following in their footsteps.",
    category: "Community",
    date: "Upcoming",
    link: "",
    image: "",
  },
];

export async function getNews(): Promise<NewsItem[]> {
  const sheetId = process.env.NEWS_SHEET_ID;
  if (!sheetId) return FALLBACK;

  try {
    const rows = await readRange(sheetId, NEWS_RANGE, { revalidate: 60 });

    const items: NewsItem[] = [];
    for (const row of rows) {
      const title = String(row[0] ?? "").trim();
      const excerpt = String(row[1] ?? "").trim();
      const category = String(row[2] ?? "").trim();
      const date = String(row[3] ?? "").trim();
      const link = String(row[4] ?? "").trim();
      const published = String(row[5] ?? "").trim().toLowerCase();

      if (!title || !excerpt) continue;
      if (published !== "yes" && published !== "true") continue;

      const image = toDriveImageUrl(String(row[6] ?? "").trim());
      items.push({ title, excerpt, category, date, link, image });
    }

    return items.length > 0 ? items : FALLBACK;
  } catch {
    return FALLBACK;
  }
}
