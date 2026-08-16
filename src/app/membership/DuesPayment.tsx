import { Landmark, Smartphone, Receipt } from "lucide-react";
import type { SiteContent } from "@/lib/content";

/**
 * Dues and where to send them — the half of the pay-first flow that cannot be
 * invented.
 *
 * Rendered ONLY when canPayFirst() is true. The page never calls this with
 * blank values, but every field is still guarded individually: a sheet with a
 * bank name and no account number must show the bank block with one line
 * missing, not a row reading "Account number:" followed by nothing.
 *
 * Nothing here is hardcoded. Every figure and every account detail comes from
 * the staff-editable content sheet, so PMAFI can correct a digit without a
 * deploy — which matters more here than anywhere else on the site, because a
 * wrong account number sends a member's money to a stranger.
 */
export default function DuesPayment({
  payment,
  dues,
}: {
  payment: SiteContent["payment"];
  dues: SiteContent["dues"];
}) {
  const tiers = [
    { label: "Regular Member", amount: dues.regular },
    { label: "Associate Member", amount: dues.associate },
    { label: "Affiliate Member", amount: dues.affiliate },
  ].filter((t) => t.amount);

  const hasBank = payment.bankName && payment.bankAccountNumber;
  const hasGcash = payment.gcashName && payment.gcashNumber;

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-[#C8A951]/30 bg-[#0a1628]">
      <div className="border-b border-white/10 px-7 py-5">
        <p className="flex items-center gap-2 font-bold text-white">
          <Receipt className="h-5 w-5 text-[#C8A951]" />
          Dues and payment details
        </p>
        <p className="mt-1 text-sm text-slate-300">
          Settle your dues first, then attach the receipt to your application.
        </p>
      </div>

      {tiers.length > 0 && (
        <div className="grid gap-px bg-white/10 sm:grid-cols-3">
          {tiers.map(({ label, amount }) => (
            <div key={label} className="bg-[#0a1628] px-7 py-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {label}
              </p>
              <p className="mt-1 text-xl font-bold text-[#C8A951]">{amount}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-2">
        {hasBank && (
          <div className="bg-[#0a1628] px-7 py-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-white">
              <Landmark className="h-4 w-4 text-[#C8A951]" />
              Bank transfer
            </p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <Row label="Bank" value={payment.bankName} />
              <Row label="Account name" value={payment.bankAccountName} />
              <Row label="Account number" value={payment.bankAccountNumber} mono />
            </dl>
          </div>
        )}
        {hasGcash && (
          <div className="bg-[#0a1628] px-7 py-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-white">
              <Smartphone className="h-4 w-4 text-[#C8A951]" />
              GCash
            </p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <Row label="Account name" value={payment.gcashName} />
              <Row label="Number" value={payment.gcashNumber} mono />
            </dl>
          </div>
        )}
      </div>

      <p className="border-t border-white/10 px-7 py-4 text-xs text-slate-400">
        Keep your proof of payment — a screenshot or photo of the receipt is
        enough. You will be asked to attach it on the application form.
      </p>
    </div>
  );
}

/** One detail line. Omitted entirely when the sheet has no value for it. */
function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
      <dt className="text-slate-400">{label}</dt>
      <dd
        className={`font-semibold text-white ${mono ? "font-mono tracking-wide" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
