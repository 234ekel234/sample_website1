"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
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
        scrolled ? "bg-white/95 shadow-sm backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className={`text-xl font-bold tracking-tight transition-colors ${
            scrolled ? "text-slate-900" : "text-white"
          }`}
        >
          Tusi<span className="text-blue-500">Solutions</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  scrolled ? "text-slate-600" : "text-white/90"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/order"
          className={cn(
            buttonVariants(),
            "hidden bg-blue-700 text-white hover:bg-blue-800 md:inline-flex"
          )}
        >
          Order Now
        </Link>

        <button
          aria-label="Toggle menu"
          className={`md:hidden ${scrolled ? "text-slate-900" : "text-white"}`}
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
                  className="text-sm font-medium text-slate-700 hover:text-blue-600"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/order"
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants(),
              "mt-4 w-full bg-blue-700 text-white hover:bg-blue-800"
            )}
          >
            Order Now
          </Link>
        </div>
      )}
    </header>
  );
}
