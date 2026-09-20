"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  checkMembershipAction,
  idByNameAction,
  type MembershipCheckState,
  type IdCardState,
} from "@/app/membership/actions";
import DigitalIdGenerator, { type VerifiedMember } from "./DigitalIdGenerator";
import { idFromEmail } from "@/lib/member-id";
import { applyPrefill } from "@/lib/form-prefill";
import { presentName } from "@/lib/card-name";
import { track } from "@/lib/analytics";
import {
  Search,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  User,
  PencilLine,
  Phone,
} from "lucide-react";

const initialState: MembershipCheckState = { status: "idle" };
const initialIdState: IdCardState = { status: "idle" };

/**
 * Gate in front of the ID generator.
 *
 * The card used to be built from whatever a visitor typed: any name, any
 * category, and a hardcoded "ACTIVE" pill. That made it a forgeable credential
 * — a downloadable PNG bearing the Foundation's seal asserting membership the
 * roster had never granted.
 *
 * Now the name, category and standing all come from the roster, so the card can
 * only ever state what PMAFI's own records say. A lapsed member still gets a
 * card; it says LAPSED, which is the honest outcome and more useful than a
 * refusal.
 *
 * This inherits the membership check's known limitation — it confirms an email
 * exists in the roster, not that the visitor owns it. Closing that needs real
 * sign-in, which is Phase 3, Module A.
 *
 * MEMBERS ADDED BY HAND ARE TREATED THE SAME as those who applied through the
 * form. PMAFI records the member's own address when it adds them, so the row
 * carries an address the member gave rather than one invented for them — see
 * the note above checkMembershipAction in actions.ts.
 *
 * A MEMBER MAY IDENTIFY THEMSELVES BY NAME OR BY EMAIL, and the name tab is the
 * one that opens. That was a demo relaxation behind `DEMO_ID_BY_NAME` until
 * PMAFI settled it on 2026-09-19: most of this roster cannot say which address
 * the Foundation holds for them, and about half of it was typed in by staff, so
 * leading with the email locked out exactly the members least able to guess it.
 * What the decision accepts — a card mintable, and so forgeable, from a public
 * name — is set out above `idByNameAction` in actions.ts.
 *
 * The email tab stays because it is the only lookup that cannot be ambiguous: a
 * member who knows their address never has to answer the class-year follow-up,
 * and a member whose class the roster does not hold can only be found this way.
 */
export default function IdGate({
  correctionFormUrl = "",
  contactFormUrl = "",
}: {
  correctionFormUrl?: string;
  contactFormUrl?: string;
}) {
  const [state, action, pending] = useActionState(
    checkMembershipAction,
    initialState
  );
  const [nameState, nameAction, namePending] = useActionState(
    idByNameAction,
    initialIdState
  );
  // Name first: it is the entry most of this roster can actually complete.
  const [mode, setMode] = useState<"name" | "email">("name");

  // Both routes end at the same card. The email path hashes the address the
  // visitor typed; the name path was handed a number the server already
  // derived from the roster's copy of it. Same member, same number, either way.
  let verified: VerifiedMember | null = null;
  // Only the email path has one. The name path deliberately never returns an
  // address — that is the property that stops a public name being exchanged for
  // a private email — so the contact form simply opens unprefilled there.
  let knownEmail = "";
  if (state.status === "found") {
    knownEmail = state.email;
    verified = {
      memberId: idFromEmail(state.email),
      name: state.name,
      category: state.category,
      standing: state.standing,
      pmaClass: state.pmaClass,
      memberSince: state.memberSince,
    };
  } else if (nameState.status === "found") {
    verified = {
      memberId: nameState.memberId,
      name: nameState.name,
      category: nameState.category,
      standing: nameState.standing,
      pmaClass: nameState.pmaClass,
      memberSince: nameState.memberSince,
    };
  }

  if (verified) {
    return (
      // THE CHECK COMES BEFORE THE CARD, and holds it back until the member
      // confirms. See ConfirmBeforeDownload for why.
      //
      // KEYED ON THE MEMBER so that looking somebody else up starts the check
      // again. Without the key, React keeps the component mounted across a new
      // lookup and carries the previous member's confirmation over to a record
      // nobody has looked at.
      <ConfirmBeforeDownload
        key={verified.memberId}
        member={verified}
        correctionFormUrl={correctionFormUrl}
        contactFormUrl={contactFormUrl}
        email={knownEmail}
      />
    );
  }

  const notFound =
    state.status === "notfound" || nameState.status === "notfound";
  const errorMessage =
    state.status === "error"
      ? state.message
      : nameState.status === "error"
        ? nameState.message
        : null;

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <p className="flex items-center gap-2 font-bold text-[#1B2A4A]">
          <ShieldCheck className="h-5 w-5 text-[#C8A951]" />
          Confirm your membership first
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Your card is built from the Foundation&apos;s own records, so we need
          to find you in them first. Enter your full name, or the email address
          your membership is filed under.
        </p>

        <div
          role="tablist"
          aria-label="How to find your membership"
          className="mt-5 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1"
        >
          {(["name", "email"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              type="button"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                mode === m
                  ? "bg-white text-[#1B2A4A] shadow-sm"
                  : "text-slate-500 hover:text-[#1B2A4A]"
              }`}
            >
              {m === "name" ? "By name" : "By email"}
            </button>
          ))}
        </div>

        {mode === "email" && (
          <form action={action} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                aria-label="Your email address"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-[#C8A951] focus:ring-2 focus:ring-[#C8A951]/30"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B2A4A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0a1628] disabled:opacity-60"
            >
              {pending ? "Checking…" : "Continue"}
            </button>
          </form>
        )}

        {mode === "name" && (
          <form action={nameAction} className="mt-5 flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  minLength={3}
                  aria-label="Your full name"
                  defaultValue={
                    nameState.status === "ambiguous" ? nameState.name : ""
                  }
                  placeholder="Juan Dela Cruz"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-[#C8A951] focus:ring-2 focus:ring-[#C8A951]/30"
                />
              </div>
              <button
                type="submit"
                disabled={namePending}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B2A4A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0a1628] disabled:opacity-60"
              >
                {namePending ? "Checking…" : "Continue"}
              </button>
            </div>

            {/*
              THE AMBIGUOUS FOLLOW-UP ASKS; IT NEVER LISTS. Same rule as the
              status check: showing the near matches to pick from would answer
              a guessed name with real members' names. The visitor supplies the
              year and we never show one.
            */}
            {nameState.status === "ambiguous" && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label
                  htmlFor="classYear"
                  className="text-sm font-semibold text-[#1B2A4A]"
                >
                  More than one member goes by that name
                </label>
                <p className="mt-1 text-sm text-slate-600">
                  Add your PMA class year and we&apos;ll find the right record.
                </p>
                <input
                  id="classYear"
                  type="text"
                  name="classYear"
                  inputMode="numeric"
                  placeholder="e.g. 1988"
                  className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-[#C8A951] focus:ring-2 focus:ring-[#C8A951]/30 sm:max-w-[200px]"
                />
              </div>
            )}
          </form>
        )}

        {notFound && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="flex items-center gap-2 font-semibold text-[#1B2A4A]">
              <UserPlus className="h-5 w-5 text-[#C8A951]" />
              We couldn&apos;t find a membership under that{" "}
              {mode === "name" ? "name" : "email"}.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Your records may use a different{" "}
              {mode === "name" ? "spelling" : "address"}, or you may
              not be registered yet. Member IDs are issued only to members on
              the Foundation&apos;s roster.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/membership"
                className="group inline-flex items-center gap-2 rounded-lg bg-[#C8A951] px-5 py-2.5 text-sm font-semibold text-[#0a1628] transition-all hover:bg-[#8A6A22] hover:text-white"
              >
                Apply for membership
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              {correctionFormUrl && (
                <a
                  // THROUGH applyPrefill EVEN THOUGH THERE IS NOTHING TO FILL
                  // IN. The lookup just failed, so no address is known here —
                  // but if the content key holds a prefill template, passing it
                  // through raw would put the literal text PMAFI_EMAIL_HERE in
                  // the form's email box and ask the member to delete it.
                  // Substituting nothing strips the token and leaves the field
                  // blank, which is what this branch means.
                  href={applyPrefill(correctionFormUrl, "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gold-ink underline-offset-4 hover:underline"
                >
                  <PencilLine className="h-4 w-4" />
                  My name is recorded incorrectly
                </a>
              )}
            </div>
          </div>
        )}

        {errorMessage && (
          <p className="mt-3 text-sm font-medium text-red-600">{errorMessage}</p>
        )}

        <p className="mt-4 text-xs text-slate-500">
          We check your details privately against the member roster. Nothing
          about other members is ever shown, and your photo is never uploaded.
        </p>
      </div>
    </div>
  );
}

/**
 * Offered once a card exists, because that is when a member SEES the spelling
 * the roster holds. The name on the card is not editable — it is the roster's,
 * and a card that says whatever the holder typed is the forgeable credential
 * this gate was built to stop — so the way to change it is to ask staff to fix
 * the record, and regenerate afterwards.
 *
 * Renders nothing when no form URL is configured, exactly as /donate does with
 * `form.donation`: an unset key leaves the page as it was rather than showing a
 * dead control.
 */
/**
 * Asks for a current email address and mobile number, once a card exists.
 *
 * WHY HERE. This is the one moment the Foundation knows it is looking at a
 * real member doing something they wanted to do, rather than at a visitor it
 * is interrupting. About half the roster was typed in by hand on the Manual
 * Members tab, where there may be no number at all, and a form member's number
 * is as old as their application.
 *
 * IT ASKS; IT DOES NOT GATE. The card downloads whether or not this is
 * answered, and nothing here is required. The ID is a membership benefit the
 * roster already entitles them to, not a trade for personal data — and since
 * the site cannot verify a number anyway, a member who would rather not give
 * one would simply type digits, which collects worse data rather than more.
 *
 * IT IS A LINK, NOT A FIELD, for the same reason the correction prompt is: the
 * service account is `spreadsheets.readonly` and must stay so. The details go
 * to PMAFI's own form, on the same footing as the membership application —
 * which also keeps the collection PMAFI's rather than the website's, and the
 * site is still without a privacy policy of its own.
 *
 * The email we already hold is prefilled where the content key carries a
 * template (lib/form-prefill.ts). A plain link works too and simply opens the
 * form blank; what must never happen is the prompt failing to render a link.
 */
function ContactDetailsPrompt({ url, email }: { url: string; email: string }) {
  const href = applyPrefill(url, email);
  if (!href) return null;

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-[#1B2A4A]">
        <Phone className="h-4 w-4 text-[#C8A951]" />
        Are your contact details up to date?
      </p>
      <p className="mt-1 text-sm text-slate-600">
        The Foundation uses your email address and mobile number to reach you
        about membership and Academy news. If either has changed — or we have
        never had your number — you can give us the current ones here. It takes
        a moment and is entirely optional; your card is already yours.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("contact_details_form_opened")}
        className="group mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-[#1B2A4A] transition-all hover:border-[#C8A951] hover:bg-slate-50"
      >
        Update my contact details
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

/**
 * CHECK BEFORE DOWNLOAD. The member is shown exactly what the card will print
 * and must say it is right before the card appears at all.
 *
 * PMAFI asked for this on 2026-09-20, and it closes a real gap: the page used
 * to offer a correction link beside a card that could be downloaded regardless,
 * so "if the details are wrong, request a correction" was a suggestion rather
 * than a step. Nothing stopped a member printing a card that misspelled their
 * own name, under the Foundation's seal.
 *
 * IT IS A CONFIRMATION, NOT A PROOF. Anyone can click "these are correct" on a
 * record that is not. That is fine and is the honest limit of what a page can
 * do — the value is that every member now looks at their details deliberately
 * before printing something official, and that a member who spots a mistake
 * meets the form at the moment they notice rather than after the fact.
 *
 * IT SHOWS EVERY FIELD THE CARD PRINTS, not just the name. Asking "is this
 * correct?" beside a name alone invites a yes from somebody whose PMA class is
 * wrong, and the class is the field the roll most often has missing or wrong.
 */
function ConfirmBeforeDownload({
  member,
  correctionFormUrl,
  contactFormUrl,
  email,
}: {
  member: VerifiedMember;
  correctionFormUrl: string;
  contactFormUrl: string;
  email: string;
}) {
  // Prefilled on the same reasoning as the contact prompt: the form's first
  // question asks for the address the record is filed under, staff find the row
  // by it, and where the member came in by email that address is the one thing
  // here that is certainly RIGHT. A plain link carries no token and opens blank.
  const href = applyPrefill(correctionFormUrl, email);

  // A BLANK FORM KEY MEANS THERE IS NOWHERE TO SEND ANYONE, so the gate would
  // be a dead end: a member whose name is wrong would be asked to confirm it or
  // click a control that does not exist. Start already confirmed, which is
  // exactly the behaviour before this gate existed. Same rule as every other
  // control driven by a content key — a blank key hides it rather than
  // rendering something broken.
  const [confirmed, setConfirmed] = useState(!href);
  const [requested, setRequested] = useState(false);

  if (confirmed) {
    return (
      <div className="space-y-6">
        <DigitalIdGenerator member={member} />
        {contactFormUrl && (
          <ContactDetailsPrompt url={contactFormUrl} email={email} />
        )}
      </div>
    );
  }

  const rows: [string, string][] = [
    ["Name", presentName(member.name)],
    ["Category", `${member.category} Member`],
    ...(member.pmaClass ? ([["PMA Class", member.pmaClass]] as [string, string][]) : []),
    ["Standing", member.standing],
  ];

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6">
      <p className="flex items-center gap-2 font-semibold text-[#1B2A4A]">
        <PencilLine className="h-4 w-4 shrink-0 text-[#C8A951]" />
        Check your details before you download
      </p>
      <p className="mt-1 text-sm text-slate-600">
        Your card prints these exactly as the Foundation&apos;s records hold
        them, so they can&apos;t be edited here.
      </p>

      <dl className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-slate-50">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 px-4 py-2.5">
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              {label}
            </dt>
            <dd className="text-right text-sm font-semibold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>

      {requested ? (
        /* WHAT HAPPENS NEXT, said plainly. A member who has just asked for a
           correction needs to know that a person reviews it and that the card
           is worth coming back for — otherwise the form feels like a void. */
        <div className="mt-5 rounded-lg border border-sky-200 bg-sky-50 p-4">
          <p className="text-sm font-semibold text-sky-900">
            Thank you — we have your request.
          </p>
          <p className="mt-1 text-sm text-sky-800">
            A member of the Foundation will check it against our records and put
            it right. Come back once we have confirmed the change and your card
            will carry the corrected details. Your member number stays the same.
          </p>
          <button
            type="button"
            onClick={() => setConfirmed(true)}
            className="mt-3 text-sm font-semibold text-sky-900 underline underline-offset-4 hover:text-sky-700"
          >
            Download the card as it stands anyway
          </button>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          {/* The two answers are deliberately the same size and weight. A
              faint "something is wrong" beside a bright "correct" collects a
              yes by making the correction harder to find, which is the whole
              failure this gate exists to fix. */}
          <button
            type="button"
            onClick={() => setConfirmed(true)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#C8A951] px-5 py-3 text-sm font-semibold text-[#0a1628] transition-all hover:bg-[#8A6A22] hover:text-white"
          >
            <ShieldCheck className="h-4 w-4" />
            Yes, these are correct
          </button>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setRequested(true)}
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-[#1B2A4A] transition-all hover:border-[#C8A951] hover:bg-slate-50"
          >
            Something is wrong
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      )}
    </div>
  );
}
