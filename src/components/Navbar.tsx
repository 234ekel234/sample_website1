"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import LogoMark from "@/components/LogoMark";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Board of Trustees", href: "/board" },
  { label: "Membership", href: "/membership" },
  { label: "Contact", href: "/contact" },
  // TEMPORARY: internal proposal link — remove before public launch.
  { label: "Proposal", href: "/proposal" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark className="h-10 w-10 shrink-0 drop-shadow-sm" />
          <span className="flex flex-col leading-tight">
            <span
              className={`text-lg font-bold tracking-tight transition-colors ${
                scrolled ? "text-[#1B2A4A]" : "text-white"
              }`}
            >
              PMAFI
            </span>
            <span
              className={`text-[9px] font-medium uppercase tracking-widest transition-colors ${
                scrolled ? "text-[#C8A951]" : "text-[#C8A951]/80"
              }`}
            >
              Philippine Military Academy Foundation
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={`group relative text-sm font-medium transition-colors hover:text-[#C8A951] ${
                  scrolled ? "text-slate-600" : "text-white/90"
                }`}
              >
                {label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-[#C8A951] transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className={cn(
            buttonVariants(),
            "hidden bg-[#C8A951] font-semibold text-[#1B2A4A] shadow-[0_4px_16px_-4px_rgba(200,169,81,0.6)] transition-all hover:bg-[#A07830] hover:text-white md:inline-flex"
          )}
        >
          Support Us
        </Link>

        <button
          aria-label="Toggle menu"
          className={`md:hidden ${scrolled ? "text-[#1B2A4A]" : "text-white"}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm font-medium text-slate-700 hover:text-[#C8A951]"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants(),
              "mt-4 w-full bg-[#C8A951] text-[#1B2A4A] font-semibold hover:bg-[#A07830] hover:text-white"
            )}
          >
            Support Us
          </Link>
        </div>
      )}
    </header>
  );
}
