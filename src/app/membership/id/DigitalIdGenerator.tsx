"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Upload, Download, IdCard } from "lucide-react";
import { SITE_HOST } from "@/lib/site";

/**
 * Digital member ID generator.
 *
 * Rendered only by IdGate, after the membership check has matched a roster
 * record — every detail on the card comes from that record, so the card cannot
 * assert a membership the Foundation's own records do not grant. The photo is
 * the one thing the visitor supplies.
 *
 * Composited onto a <canvas> and downloaded as a pixel-exact PNG. Nothing is
 * uploaded: the photo is cached in localStorage (this browser only) so a
 * returning member need not re-upload it, and "Forget my photo" clears it.
 *
 * Still unbuilt: scan-to-verify, which would need photos persisted server-side
 * plus an id-lookup endpoint (Phase 3, Module A).
 */

// ── PRINT GEOMETRY ───────────────────────────────────────────────────────────
//
// Drawn to ISO/IEC 7810 ID-1 — the CR80 card blank every ID printer takes —
// on the assumption that these will eventually be printed rather than only
// shown on a phone. That assumption changes four things a screen-only card
// gets away with:
//
//   BLEED. Card printers print oversize and cut. Artwork that stops at the
//   trim line leaves a white sliver on any sheet that shifts by half a
//   millimetre, so the background runs 2mm past it on every side.
//
//   SAFE AREA. The cut is not exact either, so nothing that must survive sits
//   within 4mm of the trim. Text pushed to the edge is text that gets sliced.
//
//   NO ROUNDED CORNERS IN THE ARTWORK. A CR80 blank is already die-cut round.
//   Drawing rounded corners into the file means printing the card's corner
//   radius onto a card that has its own — and it was also the source of the
//   gold tabs at the top corners, where a square accent bar overhung a rounded
//   body. The preview rounds them in CSS, which is where that belongs.
//
//   RESOLUTION. 635 dpi at card size, comfortably past the 300 a printer asks
//   for, so the same file serves screen and press.
//
// 12.5 design units per millimetre keeps every dimension below a whole number.
const MM = 12.5;
const TRIM_W = 85.6 * MM;   // 1070
const TRIM_H = 54 * MM;     // 675
const BLEED = 2 * MM;       // 25
const SAFE = 4 * MM;        // 50 in from the trim
const CARD_W = TRIM_W + BLEED * 2; // 1120 — the whole artwork, bleed included
const CARD_H = TRIM_H + BLEED * 2; // 725
const SCALE = 2;            // 2240 × 1450 exported

/** Left/top of the safe area, and the box everything must stay inside. */
const X0 = BLEED + SAFE;              // 75
const Y0 = BLEED + SAFE;              // 75
const X1 = BLEED + TRIM_W - SAFE;     // 1045
const Y1 = BLEED + TRIM_H - SAFE;     // 650

const NAVY = "#0a1628";
const NAVY_2 = "#1B2A4A";
const GOLD = "#C8A951";

/**
 * The site's own typefaces, read off the document rather than guessed.
 *
 * The card used to draw in `system-ui`, which means San Francisco on a Mac,
 * Segoe on Windows and Roboto on Android — the same member's card came out
 * differently on every device, and none of them matched the site. That is
 * survivable on screen and not survivable in print, where a batch of cards
 * must be identical whichever machine generated them.
 *
 * next/font puts the real families on <html> as --font-sans and --font-mono.
 */
function siteFonts(): { sans: string; mono: string } {
  if (typeof window === "undefined") {
    return { sans: "system-ui, sans-serif", mono: "ui-monospace, monospace" };
  }
  const s = getComputedStyle(document.documentElement);
  return {
    sans: s.getPropertyValue("--font-sans").trim() || "system-ui, sans-serif",
    mono: s.getPropertyValue("--font-mono").trim() || "ui-monospace, monospace",
  };
}

/** localStorage key for the member's own photo. Browser-local, never uploaded. */
const PHOTO_CACHE_KEY = "pmafi:id-photo";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Deterministic short ID so the same name always yields the same number.
/**
 * Stable member number.
 *
 * Derived from the EMAIL, not the name. The email is the roster's key: it is
 * unique by definition, and correcting a typo or adding a middle initial to a
 * member's name no longer silently reissues them a different number.
 *
 * Uses the full 32-bit digest. Truncating to six hex characters gave a 24-bit
 * space, where a roster of ~3,300 members carries a 27.7% chance that two of
 * them share a number. At 32 bits that falls to 0.13%.
 *
 * NOT PMAFI's own scheme — the Foundation has never supplied one, and it is on
 * the information request. This only guarantees the number is consistent for a
 * given member.
 */
function idFromEmail(email: string): string {
  const s = email.trim().toLowerCase();
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `PMAFI-${(h >>> 0).toString(16).toUpperCase().padStart(8, "0")}`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

// Cover-fit (center-crop) an image inside a box.
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

// Pick the largest font (<= max) that keeps `text` within `maxW`.
function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  max: number,
  min: number,
  family: string,
  weight = 700
) {
  let size = max;
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxW) break;
    size -= 1;
  } while (size > min);
  return size;
}

/** The verified member this card is for. Supplied by the roster, never typed. */
export interface VerifiedMember {
  /** Roster key — the member number is derived from this, so it stays stable. */
  email: string;
  name: string;
  /** PMA class or batch. Blank rows simply omit the line. */
  pmaClass: string;
  /** Year joined. Preferred over the issue date, which moves every download. */
  memberSince: string;
  category: string;
  standing: "Active" | "Lapsed" | "Pending";
}

export default function DigitalIdGenerator({
  member,
}: {
  member: VerifiedMember;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { email, name, category, standing, pmaClass, memberSince } = member;
  const [seal, setSeal] = useState<HTMLImageElement | null>(null);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  /** Set when a chosen file could not be decoded. Cleared on the next attempt. */
  const [photoError, setPhotoError] = useState<string | null>(null);

  // The photo is the one input the roster cannot supply, so it is remembered
  // HERE — in this browser, never on a server. That keeps "your photo never
  // leaves your device" literally true while sparing a returning member the
  // re-upload. Persisting photos server-side would mean holding personal data
  // the Foundation has no privacy notice for; that is Phase 3 territory.
  useEffect(() => {
    try {
      const cached = window.localStorage.getItem(PHOTO_CACHE_KEY);
      if (cached) loadImage(cached).then(setPhoto).catch(() => {});
    } catch {
      // Private browsing or a full quota — the uploader still works.
    }
  }, []);

  const displayName = name.trim();
  const memberId = useMemo(() => idFromEmail(email), [email]);
  const issued = new Date().toLocaleDateString("en-PH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Load the seal once.
  useEffect(() => {
    let cancelled = false;
    loadImage("/pmafi-logo.png")
      .then((img) => !cancelled && setSeal(img))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // REDRAW ONCE THE WEBFONTS HAVE ACTUALLY LOADED.
  //
  // Canvas does not wait: ask it for Geist before the font file has arrived and
  // it silently substitutes the fallback, then never repaints. The first card
  // drawn on a cold load would come out in a different typeface from every card
  // drawn after it — the exact inconsistency that switching off system-ui was
  // meant to end.
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready
      .then(() => !cancelled && setFontsReady(true))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);


  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !seal) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { sans, mono } = siteFonts();

    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    ctx.clearRect(0, 0, CARD_W, CARD_H);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    // Background — square, full bleed. See PRINT GEOMETRY above: the corner
    // radius belongs to the card blank and to the CSS preview, not to the file.
    const bg = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
    bg.addColorStop(0, NAVY);
    bg.addColorStop(1, NAVY_2);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    // Gold band across the head of the card, run out through the bleed so a
    // cut that lands 1mm low still finds gold rather than white paper.
    ctx.fillStyle = GOLD;
    ctx.fillRect(0, 0, CARD_W, BLEED + 2.4 * MM);

    // The seal again, very faint and very large, behind the details. A flat
    // panel of navy reads as a slide; a watermark reads as a document, and it
    // is the cheapest way to say "issued" without claiming verification.
    ctx.save();
    ctx.globalAlpha = 0.06;
    const wm = 520;
    ctx.drawImage(seal, X1 - wm + 60, Y0 + 120, wm, wm);
    ctx.restore();

    // Header: seal + titles
    const sealSize = 108;
    ctx.drawImage(seal, X0, Y0 + 8, sealSize, sealSize);
    const hx = X0 + sealSize + 26;
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 36px ${sans}`;
    ctx.fillText("PMAFI", hx, Y0 + 48);
    ctx.fillStyle = GOLD;
    ctx.font = `600 15px ${sans}`;
    ctx.fillText("PHILIPPINE MILITARY ACADEMY FOUNDATION, INC.", hx, Y0 + 74);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = `600 13px ${sans}`;
    ctx.fillText("MEMBER IDENTIFICATION CARD", hx, Y0 + 98);

    // Divider
    ctx.strokeStyle = "rgba(200,169,81,0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(X0, Y0 + 132);
    ctx.lineTo(X1, Y0 + 132);
    ctx.stroke();

    // Photo — 20 × 25mm, the proportion an ID photo is cropped to.
    const px = X0,
      py = Y0 + 172,
      pw = 20 * MM,
      ph = 25 * MM;
    ctx.save();
    roundRect(ctx, px, py, pw, ph, 16);
    ctx.clip();
    if (photo) {
      drawCover(ctx, photo, px, py, pw, ph);
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(px, py, pw, ph);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = `500 16px ${sans}`;
      ctx.textAlign = "center";
      ctx.fillText("Photo", px + pw / 2, py + ph / 2);
      ctx.textAlign = "left";
    }
    ctx.restore();
    ctx.strokeStyle = "rgba(200,169,81,0.5)";
    ctx.lineWidth = 2;
    roundRect(ctx, px, py, pw, ph, 16);
    ctx.stroke();

    // Member details (right of photo)
    const tx = px + pw + 40;
    const nameMaxW = X1 - tx;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = `600 13px ${sans}`;
    ctx.fillText("MEMBER", tx, py + 14);
    ctx.fillStyle = "#ffffff";
    const nameSize = fitFont(ctx, displayName, nameMaxW, 42, 24, sans);
    ctx.font = `700 ${nameSize}px ${sans}`;
    ctx.fillText(displayName, tx, py + 58);

    ctx.fillStyle = GOLD;
    ctx.font = `600 19px ${sans}`;
    ctx.fillText(`${category} Member`, tx, py + 92);
    // PMA class — the identity marker that carries most weight in this
    // community, and already collected on the application form. Omitted
    // entirely when the roster has no class for this member.
    if (pmaClass) {
      const catW = ctx.measureText(`${category} Member`).width;
      const prevFill = ctx.fillStyle;
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillText("·", tx + catW + 10, py + 92);
      ctx.fillStyle = "#C8A951";
      ctx.fillText(`PMA ${pmaClass}`, tx + catW + 22, py + 92);
      ctx.fillStyle = prevFill;
    }

    // Status pill — colour follows the roster, so a lapsed card reads as lapsed
    // at a glance rather than only in small print.
    //
    // The three CATEGORIES are deliberately not colour-coded to match. PMAFI
    // has never defined a colour for Regular, Associate or Affiliate, and
    // inventing one here would put a scheme on a printed credential that the
    // Foundation would then have to live with — and explain. The category is
    // stated in words directly above.
    ctx.font = `700 15px ${sans}`;
    const pillText = standing.toUpperCase();
    const pillW = ctx.measureText(pillText).width + 34;
    const pillY = py + 116;
    const pillColor =
      standing === "Active"
        ? { bg: "rgba(16,185,129,0.18)", fg: "#34d399" }   // emerald
        : standing === "Pending"
          ? { bg: "rgba(56,189,248,0.18)", fg: "#38bdf8" } // sky
          : { bg: "rgba(251,191,36,0.18)", fg: "#fbbf24" }; // amber — lapsed
    ctx.fillStyle = pillColor.bg;
    roundRect(ctx, tx, pillY, pillW, 34, 17);
    ctx.fill();
    ctx.fillStyle = pillColor.fg;
    ctx.fillText(pillText, tx + 17, pillY + 23);

    // A STANDING WITHOUT A DATE IS A CLAIM WITHOUT AN EXPIRY.
    //
    // This is a PNG. Once downloaded it never changes, while the membership it
    // describes does — a member who prints ACTIVE today and lapses next year is
    // still holding a card that says ACTIVE, over the Foundation's seal, with
    // nothing on it to suggest otherwise. Nobody reading it can tell whether it
    // was generated this morning or three years ago.
    //
    // The card cannot expire on its own and this does not make it verifiable —
    // that needs Phase 3. What it does is stop the card asserting a present
    // tense it has no way to keep: "ACTIVE as of 31 August 2026" is true
    // forever, where a bare "ACTIVE" stops being true the day the roster
    // changes. Anyone shown a card dated two years ago knows to check.
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = `500 13px ${sans}`;
    ctx.fillText(`as of ${issued}`, tx + pillW + 14, pillY + 23);

    // ID, joining year, and the date this copy was generated.
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = `600 12px ${sans}`;
    ctx.fillText("MEMBER NO.", tx, py + 196);
    // BOTH DATES NOW, not one or the other. The joining year and the day this
    // copy was generated answer different questions — how long they have been a
    // member, and how stale the standing above is — and the card previously
    // dropped the second whenever it knew the first, which is precisely the
    // case for almost every member.
    ctx.fillText(memberSince ? "MEMBER SINCE" : "ISSUED", tx, py + 248);
    ctx.fillStyle = "#ffffff";
    ctx.font = `600 24px ${mono}`;
    ctx.fillText(memberId, tx, py + 226);
    ctx.font = `500 19px ${sans}`;
    ctx.fillText(memberSince || issued, tx, py + 278);

    // Footer note. No "scan to verify" claim: there is nothing to scan, and
    // nothing on the site could verify it yet. Scan-to-verify needs a lookup
    // endpoint and persisted cards — Phase 3, Module A.
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = `500 13px ${sans}`;
    ctx.fillText(
      `Issued by the Philippine Military Academy Foundation · ${SITE_HOST}`,
      X0,
      Y1 - 4
    );
    // fontsReady is not read above, but it must stay in this list: it is what
    // re-runs the draw once the webfonts arrive, and canvas reads the font at
    // fillText time rather than reacting to it later.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seal, photo, displayName, category, memberId, issued, standing, pmaClass, memberSince, fontsReady]);

  useEffect(() => {
    draw();
  }, [draw]);

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Clearing the input lets the SAME file be chosen again. A change event
    // only fires when the value differs, so without this a member who picked a
    // photo, hit an error, and reached for the identical file had nothing
    // happen at all.
    e.target.value = "";
    if (!file) return;

    setPhotoError(null);
    const url = URL.createObjectURL(file);
    loadImage(url)
      .then((img) => {
        setPhoto(img);
        cachePhoto(img);
      })
      // WITHOUT THIS THE FAILURE IS SILENT. `accept="image/*"` is what the file
      // picker offers, not what the browser can decode: an iPhone HEIC outside
      // Safari, a RAW file, a truncated download all reach here and reject.
      // `.finally` does not handle a rejection, so this was an unhandled
      // promise error in the console and, on screen, nothing whatsoever — the
      // download button stayed disabled under "Add a photo to download your
      // ID", which is the one message guaranteed to look wrong to somebody who
      // just added one.
      .catch(() => {
        setPhotoError(
          "That image couldn't be opened. JPEG and PNG always work — photos straight from an iPhone are sometimes in a format browsers can't read."
        );
      })
      .finally(() => URL.revokeObjectURL(url));
  };

  /** Remember the photo in this browser only, downscaled to keep it small. */
  const cachePhoto = (img: HTMLImageElement) => {
    try {
      const max = 600;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
      window.localStorage.setItem(PHOTO_CACHE_KEY, c.toDataURL("image/jpeg", 0.8));
    } catch {
      // Quota exceeded or storage unavailable — caching is a convenience only.
    }
  };

  const forgetPhoto = () => {
    try {
      window.localStorage.removeItem(PHOTO_CACHE_KEY);
    } catch {}
    setPhoto(null);
  };

  // The photo is the only thing that can be missing: every other field comes
  // from the roster, and loadMembers drops rows without a name. Checking the
  // name here too would guard an unreachable case while making the message
  // below ("add a photo") wrong in the one case it fired.
  const canDownload = photo !== null;
  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PMAFI-Member-ID-${memberId}.png`;
      a.click();
      // Revoking in the same task can cancel the download before the browser
      // has finished reading the blob — Firefox in particular. Hold the URL
      // briefly instead; it is one image, and the page drops it either way.
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    }, "image/png");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      {/* Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="flex items-center gap-2 text-lg font-semibold text-[#1B2A4A]">
          <IdCard className="h-5 w-5 text-[#C8A951]" />
          Your details
        </p>

        {/* Name and category are not editable — they come from the roster, so a
            card cannot assert something the Foundation's records do not. */}
        <dl className="mt-5 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Name
            </dt>
            <dd className="text-sm font-semibold text-slate-900">{name}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Category
            </dt>
            <dd className="text-sm font-semibold text-slate-900">
              {category} Member
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Standing
            </dt>
            <dd className="text-sm font-semibold text-slate-900">
              {standing}
              {/* Said here as well as on the card, so a member understands why
                  the date is printed beside their standing before they wonder
                  about it. */}
              <span className="ml-1.5 font-normal text-slate-500">
                as of {issued}
              </span>
            </dd>
          </div>
          {pmaClass && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                PMA Class
              </dt>
              <dd className="text-sm font-semibold text-slate-900">{pmaClass}</dd>
            </div>
          )}
          {memberSince && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Member since
              </dt>
              <dd className="text-sm font-semibold text-slate-900">{memberSince}</dd>
            </div>
          )}
        </dl>

        <div className="mt-4">
          <span className="block text-sm font-medium text-slate-700">
            Photo
          </span>
          <label className="mt-1.5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-[#C8A951] hover:bg-[#C8A951]/5">
            <Upload className="h-4 w-4" />
            {photo ? "Change photo" : "Upload photo"}
            <input
              type="file"
              accept="image/*"
              onChange={onPhoto}
              className="hidden"
            />
          </label>
          {/* aria-live so a screen reader announces the failure: this is the
              only feedback a rejected file produces, and it appears without
              any change of focus. */}
          {photoError && (
            <p
              role="alert"
              aria-live="polite"
              className="mt-2 text-sm font-medium text-red-600"
            >
              {photoError}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={download}
          disabled={!canDownload}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#C8A951] px-5 py-3 text-sm font-semibold text-[#0a1628] transition-all hover:bg-[#8A6A22] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Download ID (PNG)
        </button>
        {!canDownload && (
          <p className="mt-2 text-center text-xs text-slate-500">
            Add a photo to download your ID.
          </p>
        )}
        <p className="mt-4 text-xs text-slate-500">
          Your photo never leaves your device — the card is built right here in
          your browser, and the photo is remembered only in this browser so you
          need not upload it again.
          {photo && (
            <>
              {" "}
              <button
                type="button"
                onClick={forgetPhoto}
                className="font-medium text-[#1B2A4A] underline decoration-[#C8A951]/50 underline-offset-2 transition-colors hover:text-[#C8A951]"
              >
                Forget my photo
              </button>
              .
            </>
          )}
        </p>
      </div>

      {/* Live preview */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Live preview
        </p>
        <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
          <canvas
            ref={canvasRef}
            width={CARD_W * SCALE}
            height={CARD_H * SCALE}
            className="block h-auto w-full"
            aria-label="PMAFI digital member ID preview"
          />
        </div>
      </div>
    </div>
  );
}
