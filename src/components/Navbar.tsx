"use client";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown } from "lucide-react";
import LogoMark from "@/components/LogoMark";

// Every route in src/app is reachable from here. Membership and Donate each own
// a sub-page, so they group rather than sitting flat — eight top-level items
// overflowed the bar below about 900px and read as clutter above it.
//
// The board is the one route-like thing absent by design: it is a section of
// /about (/about#board), not a route.
interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const links: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  {
    label: "Membership",
    href: "/membership",
    children: [
      { label: "Join PMAFI", href: "/membership" },
      { label: "Digital Member ID", href: "/membership/id" },
    ],
  },
  {
    label: "Donate",
    href: "/donate",
    children: [
      { label: "Ways to Give", href: "/donate" },
      { label: "Fund Updates", href: "/donate/impact" },
      { label: "My Donations", href: "/donate/status" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

// Whether the page has scrolled far enough for the bar to go solid, read as an
// external store rather than mirrored into state by an effect.
//
// That is not just style. The previous version started at `false` and only ever
// updated on a scroll EVENT, so any load that begins already scrolled — a
// reload restoring position, or a deep link to /about#board — left the bar
// transparent until the visitor happened to scroll. Transparent means white
// nav text, which over a white section is invisible. Reading the real value on
// hydration fixes it.
const SOLID_AFTER_PX = 20;

const subscribeToScroll = (onStoreChange: () => void) => {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
};
const getScrolled = () => window.scrollY > SOLID_AFTER_PX;
/** The server has no scroll position; the bar starts transparent over the hero. */
const getServerScrolled = () => false;

export default function Navbar() {
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrolled,
    getServerScrolled
  );
  const [open, setOpen] = useState(false);
  /** Label of the desktop dropdown currently open, or null. */
  const [menu, setMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Navigating anywhere closes whatever is open. Most links already close their
  // own panel; this catches the ones that cannot — the logo, and browser
  // back/forward, which changes the route without any click of ours.
  //
  // Adjusted during render against the previous pathname rather than in an
  // effect: an effect would paint the new page with the old menu still open,
  // then close it in a second pass. React re-runs this component immediately
  // and renders nothing in between.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (pathname !== renderedPath) {
    setRenderedPath(pathname);
    setMenu(null);
    setOpen(false);
  }

  // Escape closes the dropdown; a click outside dismisses it. Both matter for
  // keyboard users, who can otherwise be left with an open panel they cannot
  // dismiss without tabbing through it.
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenu(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [menu]);

  const linkColor = scrolled ? "text-slate-600" : "text-white/90";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        ref={navRef}
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
      >
        <Link href="/" className="flex items-center gap-3">
          <LogoMark className="h-10 w-10 shrink-0 drop-shadow-sm" />
          <span className="flex flex-col leading-tight">
            <span
              className={`text-xl font-bold tracking-tight transition-colors ${
                scrolled ? "text-[#1B2A4A]" : "text-white"
              }`}
            >
              PMAFI
            </span>
            <span
              className={`text-[10px] font-medium uppercase tracking-[0.14em] transition-colors ${
                scrolled ? "text-[#C8A951]" : "text-[#C8A951]/80"
              }`}
            >
              Philippine Military Academy Foundation
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map(({ label, href, children }) =>
            children ? (
              <li
                key={href}
                className="relative"
                onMouseEnter={() => setMenu(label)}
                onMouseLeave={() => setMenu(null)}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={menu === label}
                  onClick={() => setMenu(menu === label ? null : label)}
                  className={`group relative inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#C8A951] ${linkColor}`}
                >
                  {label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      menu === label ? "rotate-180" : ""
                    }`}
                  />
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-[#C8A951] transition-transform duration-300 group-hover:scale-x-100" />
                </button>

                {/* Always in the DOM, shown with CSS. Mounting this only while
                    open would keep the sub-page links out of the served HTML,
                    where crawlers never see them and a visitor without JS could
                    not reach them. `invisible` also drops them from the tab
                    order while closed. */}
                <div
                  className={`absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 transition-opacity duration-200 ${
                    menu === label
                      ? "visible opacity-100"
                      : "invisible opacity-0"
                  }`}
                >
                  <ul className="overflow-hidden rounded-xl border border-slate-200/80 bg-white py-2 shadow-[0_18px_40px_-18px_rgba(27,42,74,0.45)]">
                    {children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setMenu(null)}
                          className="block px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#1B2A4A]"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ) : (
              <li key={href}>
                <Link
                  href={href}
                  className={`group relative text-sm font-medium transition-colors hover:text-[#C8A951] ${linkColor}`}
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-[#C8A951] transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            )
          )}
        </ul>

        <Link
          href="/donate"
          className={cn(
            buttonVariants(),
            "hidden bg-[#C8A951] font-semibold text-[#0a1628] shadow-[0_4px_16px_-4px_rgba(200,169,81,0.6)] transition-all hover:bg-[#A07830] hover:text-white lg:inline-flex"
          )}
        >
          Support Us
        </Link>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className={`lg:hidden ${scrolled ? "text-[#1B2A4A]" : "text-white"}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 lg:hidden">
          <ul className="flex flex-col gap-4">
            {links.map(({ label, href, children }) => (
              <li key={href}>
                {children ? (
                  <>
                    {/* slate-500, not 400: this sits on white, where 400 is
                        2.56:1 and fails AA. It escaped the Lighthouse run only
                        because the audit never opens the mobile menu. */}
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      {label}
                    </p>
                    <ul className="mt-2 flex flex-col gap-3 border-l border-slate-200 pl-4">
                      {children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="text-sm font-medium text-slate-700 hover:text-[#C8A951]"
                            onClick={() => setOpen(false)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={href}
                    className="text-sm font-medium text-slate-700 hover:text-[#C8A951]"
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/donate"
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants(),
              "mt-4 w-full bg-[#C8A951] text-[#0a1628] font-semibold hover:bg-[#A07830] hover:text-white"
            )}
          >
            Support Us
          </Link>
        </div>
      )}
    </header>
  );
}
