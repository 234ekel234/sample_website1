import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import LogoMark from "@/components/LogoMark";

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.54V9.84c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.8 8.43-4.94 8.43-9.93z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const socials = [
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
];

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Board of Trustees", href: "/board" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0D1628] text-slate-400">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <LogoMark className="h-12 w-12 shrink-0" />
            <div>
              <p className="text-xl font-bold text-white">PMAFI</p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-[#C8A951]">
                Philippine Military Academy Foundation, Inc.
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            Supporting the Philippine Military Academy in developing officers
            of integrity, competence, and character for the nation.
          </p>

          <div className="mt-6 flex gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition-colors hover:bg-[#C8A951] hover:text-[#0D1628]"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">
            Quick Links
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            {quickLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">
            Contact
          </p>
          <address className="space-y-2 text-sm not-italic">
            <p>
              <a
                href="mailto:pmafi@pma.edu.ph"
                className="transition-colors hover:text-white"
              >
                pmafi@pma.edu.ph
              </a>
            </p>
            <p className="text-slate-500">
              Fort del Pilar, Baguio City, Philippines
            </p>
          </address>
        </div>
      </div>

      <Separator className="bg-white/5" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-xs text-slate-600">
        <span>© {new Date().getFullYear()} Philippine Military Academy Foundation, Inc. All rights reserved.</span>
        <span>Built with Next.js</span>
      </div>
    </footer>
  );
}
