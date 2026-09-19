/**
 * How a member's name is SET on the digital ID card.
 *
 * Presentation only. The roster keeps whatever PMAFI typed, every lookup goes
 * on folding the name through normalizeName(), and nothing here can change who
 * a search matches — it changes how the matched member's name is drawn.
 *
 * Two problems it fixes, both from the roll PMAFI supplied:
 *
 *   · THE WHOLE ROLL IS UPPER CASE. 7,747 rows of `RICARDO DE LEON`, because
 *     that is how the spreadsheet was typed. The card printed it verbatim, so
 *     every card shouted. A credential bearing the Foundation's seal should be
 *     set the way a name is written.
 *
 *   · MIDDLE INITIALS CARRY NO POINT. `LEO ANGELO D LEUTERIO`. On a formal card
 *     the conventional form is `D.`, and normalizeName() strips punctuation, so
 *     adding one cannot affect a single lookup.
 *
 * Fixing this in the sheet instead would mean regenerating 7,747 rows, and the
 * roster would then hold a prettified copy of what the Foundation sent rather
 * than what it sent. Presentation belongs at the point of presentation.
 */

/** Suffixes that are set in capitals and never take a point. */
const ROMAN = new Set(["II", "III", "IV", "V", "VI", "VII", "VIII"]);

/** Suffixes conventionally abbreviated with a point. */
const ABBREVIATED = new Set(["JR", "SR"]);

/**
 * Whether the name already carries case information we should not overwrite.
 *
 * A NAME WITH ANY LOWER CASE IN IT IS LEFT ALONE, and that guard is the point.
 * Members who apply through the form type their own names — "Simoun Ezequiel A.
 * Tusi" — and some of those names are cased in ways this function would get
 * wrong: McArthur, de la Cruz, van Bergen, O'Brien-Reyes. Re-casing them would
 * be a downgrade imposed on the one person who had already got it right. Only a
 * name with no lower case at all — which is every row of the supplied roll, and
 * nothing a person typed — is re-set here.
 */
function isAllCaps(name: string): boolean {
  return name === name.toUpperCase() && name !== name.toLowerCase();
}

/**
 * Capitalise one word, including after a hyphen or an apostrophe.
 *
 * `BLANZA-GUALBERTO` and `GALVERO-DE LEON` are both on the roll, so the letter
 * after a hyphen has to rise too — "Blanza-gualberto" would be a new kind of
 * wrong. Both straight and curly apostrophes are handled, since the roll uses
 * whichever the typist's keyboard produced.
 */
function capitalise(word: string): string {
  const bare = word.replace(/\./g, "").toUpperCase();
  if (ROMAN.has(bare)) return bare;
  if (ABBREVIATED.has(bare)) return bare.charAt(0) + bare.slice(1).toLowerCase() + ".";
  return word
    .toLowerCase()
    .replace(/(^|[-'’])(\p{L})/gu, (_m, sep: string, ch: string) => sep + ch.toUpperCase());
}

/**
 * Point a bare middle initial: `D` becomes `D.`
 *
 * Applied whatever the casing, because a single letter standing alone in a name
 * is an initial in every spelling of it — and a name that already reads `D.` is
 * left untouched rather than becoming `D..`.
 */
function pointInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => (/^\p{L}$/u.test(w) ? `${w}.` : w))
    .join(" ");
}

/** The member's name as the card should set it. */
export function presentName(raw: string): string {
  const name = raw.trim().replace(/\s+/g, " ");
  if (!name) return "";
  const cased = isAllCaps(name)
    ? name.split(" ").map(capitalise).join(" ")
    : name;
  return pointInitials(cased);
}
