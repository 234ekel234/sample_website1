"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

// Floating "back to top" control for the long proposal page. Appears after the
// reader scrolls past the first viewport. Sits above the global FloatingChat.
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 600);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-24 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#C8A951]/30 bg-[#1B2A4A] text-[#C8A951] shadow-[0_8px_30px_-8px_rgba(27,42,74,0.6)] transition-all duration-300 hover:bg-[#16294d] ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp size={20} />
    </button>
  );
}
