import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/**
 * EVERY ENVIRONMENT VARIABLE THE CODE READS MUST BE NAMED IN STATUS.md.
 *
 * STATUS.md is the stated source of truth for configuration — it carries the
 * table that says which variables are set locally, which are set on Vercel, and
 * what each one is for. A variable the code reads but that table never mentions
 * is invisible at handover: nobody knows to set it on a new deployment, and
 * nobody knows it exists when something behaves oddly because it is unset.
 *
 * That is not hypothetical. An audit on 2026-09-20 found three — a donations
 * range override, the address giving summaries are sent from, and a rate-limit
 * switch added the day before. All three had been documented carefully in the
 * code that read them, and in no place anyone would look.
 *
 * This is a documentation test, so it fails on a WORDING change as well as a
 * missing one: renaming a variable without editing STATUS.md breaks it. That is
 * the point — the rename is exactly when the table goes stale.
 */

const ROOT = path.resolve(__dirname, "../..");
const SRC = path.join(ROOT, "src");

/**
 * Variables deliberately left out of STATUS.md.
 *
 * Keep this short and justify each one. "It felt obvious" is not a reason — the
 * table is read by people who have never seen the code.
 */
const EXEMPT = new Set<string>([
  // Set by the runtime, not by us, and not something anyone configures.
  "NODE_ENV",
]);

/** Source files, excluding tests — a var only a test reads is not deployment config. */
function sourceFiles(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      sourceFiles(full, found);
    } else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) {
      found.push(full);
    }
  }
  return found;
}

/**
 * Every variable name the file reads, in any of the three shapes this codebase
 * uses. `requireEnv` matters as much as `process.env.X`: the sheet IDs — the
 * most important variables in the project — are read only through it, so a
 * scanner that misses that form gives false confidence.
 */
function envNamesIn(source: string): string[] {
  const names: string[] = [];
  for (const m of source.matchAll(/process\.env\.([A-Z][A-Z0-9_]*)/g)) names.push(m[1]);
  for (const m of source.matchAll(/process\.env\[\s*["'`]([A-Z][A-Z0-9_]*)["'`]\s*\]/g)) names.push(m[1]);
  // requireEnv("NAME") and requireEnv("NAME", "FALLBACK") — both are read.
  for (const m of source.matchAll(/requireEnv\(\s*["'`]([A-Z][A-Z0-9_]*)["'`]\s*(?:,\s*["'`]([A-Z][A-Z0-9_]*)["'`]\s*)?\)/g)) {
    names.push(m[1]);
    if (m[2]) names.push(m[2]);
  }
  return names;
}

describe("environment variables are documented", () => {
  const status = readFileSync(path.join(ROOT, "STATUS.md"), "utf8");

  const used = new Map<string, string[]>(); // name -> files that read it
  for (const file of sourceFiles(SRC)) {
    for (const name of envNamesIn(readFileSync(file, "utf8"))) {
      if (EXEMPT.has(name)) continue;
      const rel = path.relative(ROOT, file);
      const seen = used.get(name) ?? [];
      if (!seen.includes(rel)) seen.push(rel);
      used.set(name, seen);
    }
  }

  it("finds the variables it is supposed to be checking", () => {
    // A scanner that silently matches nothing would pass forever. Anchor it on
    // the one variable the site cannot run without.
    expect(used.has("MEMBERS_SHEET_ID")).toBe(true);
    expect(used.size).toBeGreaterThan(4);
  });

  it("names every one of them in STATUS.md", () => {
    const missing = [...used.entries()]
      .filter(([name]) => !status.includes(name))
      .map(([name, files]) => `  ${name} — read in ${files.join(", ")}`);

    expect(
      missing,
      missing.length === 0
        ? ""
        : "These environment variables are read by the code but are not named " +
            "anywhere in STATUS.md. Add each to the Configuration table (what it " +
            "does, whether it is set locally and on Vercel), or add it to EXEMPT " +
            "in this file with a reason:\n" +
            missing.join("\n")
    ).toEqual([]);
  });
});
