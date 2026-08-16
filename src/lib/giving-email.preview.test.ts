import { it } from "vitest";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { renderHtml, renderText } from "@/lib/giving-email";
import type { GivingHistory } from "@/lib/donations";

// Not an assertion — a preview. Renders the real templates to disk so the email
// can be eyeballed before a single message is sent to anyone.
const SAMPLE: GivingHistory = {
  donorName: "Juan Dela Cruz",
  total: 265000,
  donations: [
    { reference: "PMAFI-2026-K7QX3M", email: "juan@example.com", donorName: "Juan Dela Cruz",
      date: "2026-03-15", amount: 250000, fund: "Professorial Chair Fund", status: "Allocated" },
    { reference: "PMAFI-2026-B4LM9P", email: "juan@example.com", donorName: "Juan Dela Cruz",
      date: "2026-01-08", amount: 10000, fund: "Endowment Fund", status: "Receipt issued" },
    { reference: "PMAFI-2025-Z2WT7C", email: "juan@example.com", donorName: "Juan Dela Cruz",
      date: "2025-11-22", amount: 5000, fund: "", status: "Acknowledged" },
  ],
};

it("writes an email preview", () => {
  // Repo-local by default. This used to point at a scratchpad belonging to one
  // machine on one day, which meant the script silently wrote nowhere.
  const dir = process.env.PREVIEW_DIR || path.resolve(".preview");
  mkdirSync(dir, { recursive: true });

  const html = path.join(dir, "giving-email.html");
  const text = path.join(dir, "giving-email.txt");
  writeFileSync(html, renderHtml(SAMPLE));
  writeFileSync(text, renderText(SAMPLE));

  // Printed, because a preview nobody can find is not a preview.
  console.log(`\n  Donor email preview written:\n    ${html}\n    ${text}\n`);
});
