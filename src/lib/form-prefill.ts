// Filling in what the site already knows before it hands a visitor to a form.
//
// WHY THIS EXISTS: the contact-details form asks for an email address, and
// staff use that address to find the member's row — it is the roster's key. A
// member who mistypes it produces a contact update that cannot be matched to
// anybody, which is worse than no update at all, because it looks like data.
// On the ID page we already hold the address they typed to get through the
// gate, so there is no reason to ask them to type it a second time.
//
// HOW PMAFI CONFIGURES IT: Google Forms prefills through query parameters whose
// names are opaque ids (`entry.1234567890`), and those ids are minted when the
// form is created — they cannot be guessed here. So the Apps Script generator
// prints a PREFILL TEMPLATE: the form's own prefilled URL with a known token
// standing in for the value. Staff paste that whole template into the content
// sheet and the site substitutes.
//
// A PLAIN FORM URL IS ALSO VALID and is what staff will paste if they skip that
// step or recreate the form by hand. It carries no token, `applyPrefill` finds
// nothing to replace, and the form opens blank — which is exactly the behaviour
// before any of this existed. THIS IS THE IMPORTANT PROPERTY: a link that
// cannot be prefilled must still be a working link, never a broken one.

/**
 * The stand-in staff paste, or that the generator writes into the template.
 *
 * Upper case and prefixed so it cannot collide with a real value, and so a
 * staff member looking at the URL can see what it is for.
 */
export const EMAIL_TOKEN = "PMAFI_EMAIL_HERE";

/**
 * Substitute a member's email into a prefill template.
 *
 * Returns the URL unchanged when there is no token to replace or no email to
 * put in it. Never throws: this feeds an `href`, and a prompt that fails to
 * render a link is a worse outcome than a form the member fills in by hand.
 */
export function applyPrefill(template: string, email: string): string {
  const url = template.trim();
  if (!url) return "";
  if (!url.includes(EMAIL_TOKEN)) return url;

  const value = email.trim();
  // No address to offer — strip the token rather than sending the literal
  // "PMAFI_EMAIL_HERE" into the form's email box, which is what a member on
  // the demo name path would otherwise be asked to correct. An empty prefill
  // parameter simply leaves the field blank.
  if (!value) return url.replaceAll(EMAIL_TOKEN, "");

  return url.replaceAll(EMAIL_TOKEN, encodeURIComponent(value));
}
