import { getContent } from "@/lib/content";
import { FUNDS, findFund } from "@/lib/funds";
import { Mail, Phone, Handshake, FileText, Package, Landmark } from "lucide-react";

/**
 * Arrange a gift directly, rather than sending it yourself.
 *
 * The bank and GCash instructions above suit a gift somebody can simply send.
 * They do not suit the two the brochure actually leads with: a professorial
 * chair at ₱250,000 and an endowment at ₱100,000 are established in the donor's
 * name, and nobody transfers that amount to an account number they read on a
 * website without speaking to someone first. This is the route for those, and
 * for everything else that needs a person — gifts in kind, cheques, transfers
 * from abroad, a class or company giving together, and the paperwork.
 *
 * Always rendered. Unlike the dues and account numbers, this section can be
 * honest with nothing configured at all: it needs a way to reach the
 * Foundation, and there is always one. A dedicated finance address is an
 * improvement on that, not a precondition for it.
 *
 * NOTHING HERE PROMISES A TAX DEDUCTION. PMAFI's BIR donee institution status
 * is still unconfirmed (see references/pmafi-information-request.md), so the
 * copy offers an official receipt — which the Foundation does issue, and which
 * the giving status flow already tracks — and stops there.
 */
export default async function DirectGiving() {
  const { contact, finance } = await getContent();

  // A major-gift enquiry landing in the Foundation's ordinary inbox is a far
  // better outcome than this option being hidden until someone fills a cell.
  const email = finance.email || contact.email;
  const chair = findFund("Professorial Chair Fund")!;
  const endowment = findFund("Endowment Fund")!;

  const arrangements = [
    {
      icon: Landmark,
      title: "Establish a chair or an endowment",
      description: `A professorial chair from ${chair.minimum}, or an endowment fund from ${endowment.minimum}, set up in your name or your class's honour. The principal is never spent — only the earnings fund the grant.`,
    },
    {
      icon: Package,
      title: "Give in kind",
      description:
        "Books, reference materials, laboratory and training equipment, or support for a specific facility.",
    },
    {
      icon: Handshake,
      title: "Give as a class or a company",
      description:
        "Reunion classes, alumni groups and corporate partners giving together, toward a named project.",
    },
    {
      icon: FileText,
      title: "Anything needing paperwork",
      description:
        "A cheque, a transfer from abroad, a deed of donation, or an official receipt made out a particular way.",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            Give Directly
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
            Rather Arrange It With Someone
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Some gifts deserve a conversation rather than a transfer form. The
            Foundation&apos;s finance team will walk you through it and handle
            the documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {arrangements.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A]">
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-[#1B2A4A]">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-5 rounded-2xl border border-[#C8A951]/30 bg-[#0a1628] p-7 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-bold text-white">Talk to the finance team</p>
            <p className="mt-1 text-sm text-slate-300">
              Tell us roughly what you have in mind and we will take it from
              there — there is no form to fill in first.
              {finance.name && ` ${finance.name}.`}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#C8A951] px-5 py-2.5 text-sm font-semibold text-[#0a1628] transition-colors hover:bg-[#A07830] hover:text-white"
            >
              <Mail className="h-4 w-4" />
              {email}
            </a>
            {/* Only when PMAFI has confirmed a number — the site never invents
                one, and a wrong number on a major-gift page is worse than none. */}
            {finance.phone && (
              <a
                href={`tel:${finance.phone.replace(/[^+\d]/g, "")}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-[#C8A951]"
              >
                <Phone className="h-4 w-4" />
                {finance.phone}
              </a>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Gifts arranged this way are recorded the same as any other, under{" "}
          {FUNDS.map((f) => f.name).join(", ")} — so you can look them up at any
          time.
        </p>
      </div>
    </section>
  );
}
