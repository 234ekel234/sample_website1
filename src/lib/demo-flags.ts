/**
 * Temporary demo relaxations. Off unless explicitly switched on.
 *
 * Everything here weakens a rule the site otherwise holds, so each flag states
 * what it gives up. They exist to be switched on for a preview deployment and
 * off again afterwards — not to become configuration.
 */

/**
 * Whether /membership/id will mint a card from a NAME alone.
 *
 * WHAT THIS GIVES UP. The ID gate is normally email-only, and deliberately so:
 * names are public — alumni lists, reunion programmes, this site's own
 * /about#board page — so a name that mints a sealed card makes the credential
 * forgeable by anyone who can read one. The card also prints a class year, a
 * joining year and a standing, which is precisely the identity fingerprint the
 * /membership name lookup refuses to return for the same reason. Turning this
 * on means accepting all of that.
 *
 * WHERE IT BELONGS: a preview deployment, for a demo, for as long as the demo
 * lasts. Production is `www.pmafi.org` with a roster of real members, sixteen
 * of whom are named on this site's own board page.
 *
 * FAIL-CLOSED THREE WAYS. Only the exact string "true" enables it, so an unset,
 * misspelled or half-configured variable leaves the gate shut. The action
 * re-reads this rather than trusting a prop: the page passes the flag down to
 * decide what UI to render, and a prop is something a caller can lie about, so
 * the check that matters is the one inside the action. And the variable is NOT
 * `NEXT_PUBLIC_`, which means it is not inlined into the browser bundle — if
 * this module is ever imported from a client component by mistake,
 * `process.env.DEMO_ID_BY_NAME` is `undefined` there and the answer is false
 * rather than accidentally true. (`server-only` would make that a build error
 * instead of a silent false, but it is not a dependency of this project and is
 * not worth adding for one flag.)
 *
 * The same reasoning rules out NEXT_PUBLIC for a second reason: an inlined
 * value is a build artifact, so turning the demo off would need a redeploy
 * rather than an environment change.
 */
export function idByNameEnabled(): boolean {
  return process.env.DEMO_ID_BY_NAME === "true";
}
