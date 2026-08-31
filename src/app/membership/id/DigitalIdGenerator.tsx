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

// ISO ID-1 ("credit card") proportions, rendered at 2x for crisp exports.
const CARD_W = 1000;
const CARD_H = 630;
const SCALE = 2;

const NAVY = "#0a1628";
const NAVY_2 = "#1B2A4A";
const GOLD = "#C8A951";

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
  weight = 700
) {
  let size = max;
  do {
    ctx.font = `${weight} ${size}px system-ui, -apple-system, 'Segoe UI', sans-serif`;
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


  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !seal) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    ctx.clearRect(0, 0, CARD_W, CARD_H);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    // Background
    const bg = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
    bg.addColorStop(0, NAVY);
    bg.addColorStop(1, NAVY_2);
    roundRect(ctx, 0, 0, CARD_W, CARD_H, 28);
    ctx.fillStyle = bg;
    ctx.fill();

    // Gold top accent
    ctx.fillStyle = GOLD;
    roundRect(ctx, 0, 0, CARD_W, 10, 0);
    ctx.fill();

    // Header: seal + titles
    ctx.drawImage(seal, 48, 44, 84, 84);
    ctx.fillStyle = "#ffffff";
    ctx.font =
      "700 30px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("PMAFI", 150, 78);
    ctx.fillStyle = GOLD;
    ctx.font =
      "600 14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("PHILIPPINE MILITARY ACADEMY FOUNDATION, INC.", 150, 102);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.fillText("DIGITAL MEMBER ID", 150, 124);

    // Divider
    ctx.strokeStyle = "rgba(200,169,81,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(48, 156);
    ctx.lineTo(CARD_W - 48, 156);
    ctx.stroke();

    // Photo
    const px = 48,
      py = 192,
      pw = 240,
      ph = 300;
    ctx.save();
    roundRect(ctx, px, py, pw, ph, 16);
    ctx.clip();
    if (photo) {
      drawCover(ctx, photo, px, py, pw, ph);
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(px, py, pw, ph);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = "500 15px system-ui, sans-serif";
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
    const tx = 328;
    const nameMaxW = CARD_W - tx - 48;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.fillText("MEMBER", tx, py + 14);
    ctx.fillStyle = "#ffffff";
    const nameSize = fitFont(ctx, displayName, nameMaxW, 38, 22);
    ctx.font = `700 ${nameSize}px system-ui, -apple-system, 'Segoe UI', sans-serif`;
    ctx.fillText(displayName, tx, py + 56);

    ctx.fillStyle = GOLD;
    ctx.font = "600 18px system-ui, sans-serif";
    ctx.fillText(`${category} Member`, tx, py + 90);
    // PMA class — the identity marker that carries most weight in this
    // community, and already collected on the application form. Omitted
    // entirely when the roster has no class for this member.
    if (pmaClass) {
      const catW = ctx.measureText(`${category} Member`).width;
      const prevFill = ctx.fillStyle;
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillText("·", tx + catW + 10, py + 90);
      ctx.fillStyle = "#C8A951";
      ctx.fillText(`PMA ${pmaClass}`, tx + catW + 22, py + 90);
      ctx.fillStyle = prevFill;
    }

    // Status pill — colour follows the roster, so a lapsed card reads as lapsed
    // at a glance rather than only in small print.
    ctx.font = "700 14px system-ui, sans-serif";
    const pillText = standing.toUpperCase();
    const pillW = ctx.measureText(pillText).width + 32;
    const pillY = py + 112;
    const pillColor =
      standing === "Active"
        ? { bg: "rgba(16,185,129,0.18)", fg: "#34d399" }   // emerald
        : standing === "Pending"
          ? { bg: "rgba(56,189,248,0.18)", fg: "#38bdf8" } // sky
          : { bg: "rgba(251,191,36,0.18)", fg: "#fbbf24" }; // amber — lapsed
    ctx.fillStyle = pillColor.bg;
    roundRect(ctx, tx, pillY, pillW, 30, 15);
    ctx.fill();
    ctx.fillStyle = pillColor.fg;
    ctx.fillText(pillText, tx + 16, pillY + 20);

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
    ctx.font = "500 12px system-ui, sans-serif";
    ctx.fillText(`as of ${issued}`, tx + pillW + 12, pillY + 20);

    // ID, joining year, and the date this copy was generated.
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "600 12px system-ui, sans-serif";
    ctx.fillText("MEMBER NO.", tx, py + 192);
    // BOTH DATES NOW, not one or the other. The joining year and the day this
    // copy was generated answer different questions — how long they have been a
    // member, and how stale the standing above is — and the card previously
    // dropped the second whenever it knew the first, which is precisely the
    // case for almost every member.
    ctx.fillText(memberSince ? "MEMBER SINCE" : "ISSUED", tx, py + 240);
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 22px ui-monospace, 'SF Mono', Menlo, Consolas, monospace";
    ctx.fillText(memberId, tx, py + 220);
    ctx.font = "500 18px system-ui, sans-serif";
    ctx.fillText(memberSince || issued, tx, py + 268);

    // Footer note. No "scan to verify" claim: there is nothing to scan, and
    // nothing on the site could verify it yet. Scan-to-verify needs a lookup
    // endpoint and persisted cards — Phase 3, Module A.
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "500 12px system-ui, sans-serif";
    ctx.fillText(
      `Issued by the Philippine Military Academy Foundation · ${SITE_HOST}`,
      48,
      CARD_H - 40
    );
  }, [seal, photo, displayName, category, memberId, issued, standing, pmaClass, memberSince]);

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
