"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, X, Phone, Mail, Send } from "lucide-react";
import type { FaqEntry } from "@/lib/faq";
import { findAnswer, relatedQuestions } from "@/lib/faq-match";

// FAQ assistant (Phase 2, Module B).
//
// Answers come ONLY from the approved list passed in as `faqs`. There is no AI
// and no generation: if nothing matches, the assistant says so and hands off to
// the contact channel rather than guessing.
//
// Contact details arrive from the staff-editable content sheet; a blank phone
// number is simply not offered.
export interface FloatingChatProps {
  email: string;
  phone: string;
  faqs: FaqEntry[];
  messengerUrl?: string;
}

type Message =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "bot"; text: string; entry?: FaqEntry; unmatched?: boolean };

const GREETING =
  "Hello! I can answer common questions about the Foundation, membership and giving. Tap a question below, or type your own.";

export default function FloatingChat({
  email,
  phone,
  faqs,
  messengerUrl = "",
}: FloatingChatProps) {
  const emailUrl = `mailto:${email}`;
  const phoneUrl = phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : "";

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<FaqEntry[]>([]);

  const nextId = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Delay the entrance so the widget does not fight the page's own animations.
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  // Seed the conversation the first time the panel is opened.
  useEffect(() => {
    if (!open || messages.length > 0) return;
    const starters = faqs.filter((f) => f.suggested).slice(0, 4);
    setMessages([{ id: nextId.current++, role: "bot", text: GREETING }]);
    setSuggestions(starters.length > 0 ? starters : faqs.slice(0, 4));
  }, [open, messages.length, faqs]);

  // Keep the newest message in view.
  useEffect(() => {
    if (open) logEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, open]);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Escape closes the panel and returns focus to the toggle.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const ask = useCallback(
    (question: string, known?: FaqEntry) => {
      const trimmed = question.trim();
      if (!trimmed) return;

      const entry = known ?? findAnswer(trimmed, faqs);
      const userMsg: Message = {
        id: nextId.current++,
        role: "user",
        text: trimmed,
      };

      const botMsg: Message = entry
        ? { id: nextId.current++, role: "bot", text: entry.answer, entry }
        : {
            id: nextId.current++,
            role: "bot",
            text: "I am not able to answer that one. The Foundation will be glad to help directly — you can reach the team using the options below.",
            unmatched: true,
          };

      setMessages((prev) => [...prev, userMsg, botMsg]);
      setSuggestions(entry ? relatedQuestions(entry, faqs) : []);
      setInput("");
    },
    [faqs]
  );

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 transition-all duration-500 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className="flex h-[min(32rem,calc(100vh-8rem))] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-20px_rgba(27,42,74,0.45)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-[#1B2A4A] px-4 py-3">
            <div>
              <p id={titleId} className="text-sm font-semibold text-white">
                PMAFI Assistant
              </p>
              <p className="text-xs text-slate-300">
                Answers to common questions
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close the assistant"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Conversation */}
          <div
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.map((m) =>
              m.role === "user" ? (
                <p
                  key={m.id}
                  className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[#1B2A4A] px-3.5 py-2.5 text-sm text-white"
                >
                  <span className="sr-only">You asked: </span>
                  {m.text}
                </p>
              ) : (
                <div key={m.id} className="max-w-[90%]">
                  <div className="rounded-2xl rounded-bl-sm bg-slate-100 px-3.5 py-2.5 text-sm leading-relaxed text-slate-700">
                    <span className="sr-only">Assistant: </span>
                    {m.text}
                  </div>
                  {m.entry?.linkHref && m.entry.linkLabel && (
                    <Link
                      href={m.entry.linkHref}
                      onClick={close}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#C8A951]/50 bg-[#C8A951]/10 px-3 py-1.5 text-xs font-semibold text-gold-ink transition-colors hover:bg-[#C8A951]/20"
                    >
                      {m.entry.linkLabel}
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}
                  {m.unmatched && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <a
                        href={emailUrl}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B2A4A] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#16294d]"
                      >
                        <Mail size={13} aria-hidden="true" />
                        Email the Foundation
                      </a>
                      {phoneUrl && (
                        <a
                          href={phoneUrl}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          <Phone size={13} aria-hidden="true" />
                          Call
                        </a>
                      )}
                      <Link
                        href="/contact"
                        onClick={close}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        Contact page
                      </Link>
                    </div>
                  )}
                </div>
              )
            )}
            <div ref={logEndRef} />
          </div>

          {/* Suggested questions */}
          {suggestions.length > 0 && (
            <div className="border-t border-slate-200 px-4 py-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {messages.length > 1 ? "Related questions" : "Try asking"}
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <li key={s.question}>
                    <button
                      type="button"
                      onClick={() => ask(s.question, s)}
                      className="rounded-full border border-slate-300 px-3 py-1.5 text-left text-xs text-slate-700 transition-colors hover:border-[#C8A951] hover:bg-[#C8A951]/10"
                    >
                      {s.question}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-slate-200 px-3 py-3"
          >
            <label htmlFor="faq-input" className="sr-only">
              Ask a question
            </label>
            <input
              id="faq-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-full border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20"
            />
            <button
              type="submit"
              aria-label="Send question"
              disabled={!input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C8A951] text-[#1B2A4A] transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle button */}
      <button
        ref={toggleRef}
        type="button"
        aria-label={open ? "Close the assistant" : "Open the assistant"}
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-[0_8px_30px_-8px_rgba(200,169,81,0.6)] transition-all duration-300 hover:scale-105 ${
          open ? "bg-[#1B2A4A] text-[#C8A951]" : "bg-[#C8A951] text-[#1B2A4A]"
        }`}
      >
        {open ? <X size={22} aria-hidden="true" /> : <MessageCircle size={22} aria-hidden="true" />}
      </button>

      {/* Messenger stays available as a direct channel when configured. */}
      {!open && messengerUrl && (
        <a href={messengerUrl} target="_blank" rel="noopener noreferrer" className="sr-only">
          Message the Foundation on Messenger
        </a>
      )}
    </div>
  );
}
