"use client";
import { useEffect, useState } from "react";
import { MessageCircle, X, Phone } from "lucide-react";

const MESSENGER_URL = "https://m.me/";
const PHONE_URL = "tel:+63740000000";

function MessengerIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.34.27.55l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.16-.07.34-.08.51-.04 1.04.29 2.13.45 3.27.45 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm6 7.46-2.94 4.66c-.46.73-1.46.92-2.16.4l-2.34-1.75a.6.6 0 0 0-.72 0L6.7 14.66c-.42.32-.97-.18-.68-.62l2.94-4.66c.46-.73 1.46-.92 2.16-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.14-1.89c.42-.32.97.18.68.62z" />
    </svg>
  );
}

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 transition-all duration-500 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {/* Expanded actions */}
      <div
        className={`flex flex-col items-end gap-2 transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <a
          href={MESSENGER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-lg ring-1 ring-slate-200 transition-all hover:-translate-x-1 hover:shadow-xl"
        >
          <span className="text-sm font-medium text-slate-700">Message us</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B2A4A] text-white">
            <MessengerIcon size={16} />
          </span>
        </a>
        <a
          href={PHONE_URL}
          className="flex items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-lg ring-1 ring-slate-200 transition-all hover:-translate-x-1 hover:shadow-xl"
        >
          <span className="text-sm font-medium text-slate-700">Call us</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C8A951] text-[#1B2A4A]">
            <Phone size={15} />
          </span>
        </a>
      </div>

      {/* Toggle button */}
      <button
        type="button"
        aria-label={open ? "Close chat menu" : "Open chat menu"}
        onClick={() => setOpen(!open)}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-[0_8px_30px_-8px_rgba(200,169,81,0.6)] transition-all duration-300 hover:scale-105 ${
          open
            ? "bg-[#1B2A4A] text-[#C8A951]"
            : "bg-[#C8A951] text-[#1B2A4A]"
        }`}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
