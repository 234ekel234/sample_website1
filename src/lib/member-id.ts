/**
 * The member number printed on a digital ID card.
 *
 * LIVES HERE, RATHER THAN IN THE GENERATOR, so the server can compute it too.
 * That is what lets the demo name path issue a card with the member's REAL
 * number without the browser ever seeing their email: the action looks the
 * member up, derives the number server-side, and returns the number alone. A
 * name goes in and a number comes out, with the address that produced it never
 * crossing the wire.
 */

/**
 * Stable member number.
 *
 * Derived from the EMAIL, not the name. The email is the roster's key: it is
 * unique by definition, and correcting a typo or adding a middle initial to a
 * member's name no longer silently reissues them a different number. That
 * property is the whole reason the demo path derives the number from the
 * matched member's stored address rather than from what the visitor typed —
 * find yourself by name and you get the same card you would get by email.
 *
 * Uses the full 32-bit digest. Truncating to six hex characters gave a 24-bit
 * space, where a roster of ~3,300 members carries a 27.7% chance that two of
 * them share a number. At 32 bits that falls to 0.13%.
 *
 * NOT PMAFI's own scheme — the Foundation has never supplied one, and it is on
 * the information request. This only guarantees the number is consistent for a
 * given member.
 */
export function idFromEmail(email: string): string {
  const s = email.trim().toLowerCase();
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `PMAFI-${(h >>> 0).toString(16).toUpperCase().padStart(8, "0")}`;
}
