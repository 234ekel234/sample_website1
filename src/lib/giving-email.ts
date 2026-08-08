// Sends a donor their own giving summary.
//
// This is the delivery half of the design the proposal describes: the figures
// are never rendered on screen for an unverified visitor, they are sent to the
// address itself, so only the person who can open that inbox sees them.
//
// SERVER ONLY.
//
// Required environment variables:
//   RESEND_API_KEY   – transactional email key. Without it, sending fails and
//                      the caller reports a service error. It never silently
//                      pretends to have sent.
//   GIVING_FROM_EMAIL (optional) – the From address; defaults below.

import type { GivingHistory } from "@/lib/donations";
import { SITE_URL } from "@/lib/site";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "PMAFI <noreply@pmafi.org>";

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

function formatDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value || "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-PH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Plain-text body — some recipients will only ever see this. */
export function renderText(history: GivingHistory): string {
  const lines = [
    history.donorName ? `Dear ${history.donorName},` : "Dear friend of PMAFI,",
    "",
    "Thank you for supporting the Philippine Military Academy Foundation.",
    "Here is a summary of the gifts we have recorded against this address.",
    "",
  ];
  for (const d of history.donations) {
    lines.push(
      `  ${formatDate(d.date)} — ${peso.format(d.amount)}` +
        (d.fund ? ` — ${d.fund}` : "") +
        `\n    Status: ${d.status}   Reference: ${d.reference}`
    );
  }
  lines.push(
    "",
    `  Total recorded: ${peso.format(history.total)}`,
    "",
    "Only gifts our team has verified and recorded appear here, so a very",
    "recent donation may not yet be listed.",
    "",
    `See what each fund has achieved: ${SITE_URL}/donate/impact`,
    "",
    "If anything looks wrong, reply to this message and we will look into it.",
    "",
    "Philippine Military Academy Foundation, Inc.",
  );
  return lines.join("\n");
}

/** HTML body, deliberately simple — inline styles only, no external assets. */
export function renderHtml(history: GivingHistory): string {
  const rows = history.donations
    .map(
      (d) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;">${escapeHtml(formatDate(d.date))}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#1B2A4A;">${escapeHtml(peso.format(d.amount))}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;">${escapeHtml(d.fund || "—")}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;">${escapeHtml(d.status)}</td>
      </tr>`
    )
    .join("");

  return `<div style="font-family:Georgia,serif;max-width:640px;margin:0 auto;padding:24px;color:#0f172a;">
  <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8A6A22;margin:0 0 4px;">Philippine Military Academy Foundation</p>
  <h1 style="font-size:22px;color:#1B2A4A;margin:0 0 16px;">Your giving summary</h1>
  <p style="color:#334155;line-height:1.6;">${history.donorName ? `Dear ${escapeHtml(history.donorName)},` : "Dear friend of PMAFI,"}</p>
  <p style="color:#334155;line-height:1.6;">Thank you for supporting the Academy. Here is a summary of the gifts we have recorded against this address.</p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;font-family:system-ui,sans-serif;font-size:14px;">
    <thead>
      <tr style="text-align:left;">
        <th style="padding:8px 12px;border-bottom:2px solid #1B2A4A;color:#1B2A4A;">Date</th>
        <th style="padding:8px 12px;border-bottom:2px solid #1B2A4A;color:#1B2A4A;">Amount</th>
        <th style="padding:8px 12px;border-bottom:2px solid #1B2A4A;color:#1B2A4A;">Fund</th>
        <th style="padding:8px 12px;border-bottom:2px solid #1B2A4A;color:#1B2A4A;">Status</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <p style="font-size:16px;color:#1B2A4A;"><strong>Total recorded: ${escapeHtml(peso.format(history.total))}</strong></p>
  <p style="color:#64748b;font-size:13px;line-height:1.6;">Only gifts our team has verified and recorded appear here, so a very recent donation may not yet be listed.</p>
  <p style="margin:20px 0;"><a href="${SITE_URL}/donate/impact" style="color:#8A6A22;">See what each fund has achieved &rarr;</a></p>
  <p style="color:#64748b;font-size:13px;">If anything looks wrong, reply to this message and we will look into it.</p>
</div>`;
}

/**
 * Send the summary. Throws on any failure so the caller can report a service
 * error rather than telling a donor their summary is on the way when it is not.
 */
export async function sendGivingSummary(
  to: string,
  history: GivingHistory
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured — cannot send summaries");
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.GIVING_FROM_EMAIL || DEFAULT_FROM,
      to: [to],
      subject: "Your PMAFI giving summary",
      text: renderText(history),
      html: renderHtml(history),
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Email send failed (${res.status}): ${await res.text()}`);
  }
}
