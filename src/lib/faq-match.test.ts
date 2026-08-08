import { describe, it, expect } from "vitest";
import { findAnswer, relatedQuestions, normalize } from "@/lib/faq-match";
import type { FaqEntry } from "@/lib/faq";

const entry = (
  question: string,
  keywords: string[] = [],
  answer = "answer"
): FaqEntry => ({ question, answer, keywords });

const SET: FaqEntry[] = [
  entry("How do I become a member?", ["join", "apply", "sign up"]),
  entry("How much are the membership dues?", ["dues", "fee", "how much"]),
  entry("Where does my donation go?", ["donation", "gift", "funds"]),
  entry("Who is on the Board of Trustees?", ["board", "trustees"]),
];

describe("normalize", () => {
  it("lowercases, strips punctuation and collapses whitespace", () => {
    expect(normalize("  How MUCH,  are the dues?? ")).toBe(
      "how much are the dues"
    );
  });

  it("keeps letters and digits from any script", () => {
    expect(normalize("PMAFI-2026 ¡hola!")).toBe("pmafi 2026 hola");
  });
});

describe("findAnswer", () => {
  it("returns null for an empty or punctuation-only query", () => {
    expect(findAnswer("", SET)).toBeNull();
    expect(findAnswer("???", SET)).toBeNull();
  });

  it("matches on a single keyword", () => {
    expect(findAnswer("how do I join", SET)?.question).toBe(
      "How do I become a member?"
    );
  });

  it("matches a multi-word keyword only as a phrase", () => {
    // "how much" is a phrase keyword; the words apart should not trigger it.
    expect(findAnswer("how much are dues", SET)?.question).toBe(
      "How much are the membership dues?"
    );
  });

  it("returns the entry outright when the question matches exactly", () => {
    // This is the tapped-suggestion path — it must never lose to a keyword pile-up.
    expect(findAnswer("Who is on the Board of Trustees?", SET)?.question).toBe(
      "Who is on the Board of Trustees?"
    );
  });

  it("ignores case and surrounding punctuation", () => {
    expect(findAnswer("  JOIN!!  ", SET)?.question).toBe(
      "How do I become a member?"
    );
  });

  it("returns null rather than answering something adjacent", () => {
    // The whole point of the threshold: an unrelated question must hand off to
    // the contact page instead of returning the least-bad entry.
    expect(findAnswer("what is the weather in Baguio", SET)).toBeNull();
  });

  it("does not match on stopwords alone", () => {
    expect(findAnswer("what is the how do I", SET)).toBeNull();
  });

  it("is unaffected by an empty answer set", () => {
    expect(findAnswer("join", [])).toBeNull();
  });
});

describe("relatedQuestions", () => {
  const answered = SET[0];

  it("never includes the question just answered", () => {
    const related = relatedQuestions(answered, SET);
    expect(related.map((r) => r.question)).not.toContain(answered.question);
  });

  it("respects the limit", () => {
    expect(relatedQuestions(answered, SET, 2)).toHaveLength(2);
  });

  it("returns nothing when there is nothing else to offer", () => {
    expect(relatedQuestions(answered, [answered])).toEqual([]);
  });

  it("prefers entries sharing vocabulary with the answered one", () => {
    const set: FaqEntry[] = [
      entry("How do I make a donation?", ["donation"]),
      entry("Where does my donation go?", ["donation"]),
      entry("Who is on the Board of Trustees?", ["board"]),
    ];
    const [first] = relatedQuestions(set[0], set, 1);
    expect(first.question).toBe("Where does my donation go?");
  });
});
