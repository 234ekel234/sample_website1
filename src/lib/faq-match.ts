// Keyword matching for the FAQ assistant.
//
// Deliberately simple and inspectable: a visitor's question is scored against
// each approved answer, and the best scorer wins provided it clears a minimum
// bar. If nothing clears it, the caller hands off to the contact page rather
// than answering badly.
//
// No AI, no network, no generation — this runs in the browser against the list
// already on the page.

import type { FaqEntry } from "@/lib/faq";

/** Words that carry no matching signal on their own. */
const STOPWORDS = new Set([
  "a", "am", "an", "and", "any", "are", "as", "at", "be", "can", "could", "do",
  "does", "for", "from", "get", "give", "has", "have", "how", "i", "if", "in",
  "is", "it", "its", "me", "my", "of", "on", "or", "please", "should", "so",
  "some", "tell", "that", "the", "their", "them", "there", "they", "this", "to",
  "want", "was", "we", "what", "when", "where", "which", "who", "why", "will",
  "with", "would", "you", "your",
]);

/** Minimum score for an answer to be considered a genuine match. */
const MATCH_THRESHOLD = 3;

const KEYWORD_WEIGHT = 3;
const QUESTION_WORD_WEIGHT = 1;

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function contentWords(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/** Score one entry against an already-normalized query and its word set. */
function scoreEntry(
  entry: FaqEntry,
  normalizedQuery: string,
  queryWords: Set<string>
): number {
  let score = 0;

  for (const keyword of entry.keywords) {
    const kw = normalize(keyword);
    if (!kw) continue;
    // Multi-word keywords ("how much", "sign up") match as a phrase.
    const hit = kw.includes(" ")
      ? normalizedQuery.includes(kw)
      : queryWords.has(kw);
    if (hit) score += KEYWORD_WEIGHT;
  }

  for (const word of contentWords(entry.question)) {
    if (queryWords.has(word)) score += QUESTION_WORD_WEIGHT;
  }

  return score;
}

/**
 * Best matching answer, or null when nothing clears the threshold.
 *
 * Returning null is a feature: the assistant says it does not know and points
 * the visitor to the contact channel, rather than answering something adjacent.
 */
export function findAnswer(query: string, entries: FaqEntry[]): FaqEntry | null {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return null;

  const queryWords = new Set(contentWords(query));

  let best: FaqEntry | null = null;
  let bestScore = 0;

  for (const entry of entries) {
    // An exact question match always wins outright (e.g. a tapped suggestion).
    if (normalize(entry.question) === normalizedQuery) return entry;

    const score = scoreEntry(entry, normalizedQuery, queryWords);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore >= MATCH_THRESHOLD ? best : null;
}

/**
 * A few related questions to offer after an answer, so the visitor can keep
 * exploring without typing. Excludes whatever was just answered.
 */
export function relatedQuestions(
  answered: FaqEntry,
  entries: FaqEntry[],
  limit = 3
): FaqEntry[] {
  const answeredWords = new Set([
    ...contentWords(answered.question),
    ...answered.keywords.map(normalize),
  ]);

  return entries
    .filter((e) => e.question !== answered.question)
    .map((entry) => {
      let overlap = 0;
      for (const word of contentWords(entry.question)) {
        if (answeredWords.has(word)) overlap += 1;
      }
      for (const keyword of entry.keywords) {
        if (answeredWords.has(normalize(keyword))) overlap += 1;
      }
      return { entry, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((r) => r.entry);
}
