import { it } from "vitest";
import { writeFileSync } from "node:fs";
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
      date: "2026-01-08", amount: 10000, fund: "Facilities & Modernization", status: "Receipt issued" },
    { reference: "PMAFI-2025-Z2WT7C", email: "juan@example.com", donorName: "Juan Dela Cruz",
      date: "2025-11-22", amount: 5000, fund: "", status: "Acknowledged" },
  ],
};

it("writes an email preview to the scratchpad", () => {
  const dir = process.env.PREVIEW_DIR || "/tmp";
  writeFileSync(`${dir}/giving-email.html`, renderHtml(SAMPLE));
  writeFileSync(`${dir}/giving-email.txt`, renderText(SAMPLE));
});
