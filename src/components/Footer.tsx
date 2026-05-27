import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const quickLinks = ["About", "Services", "Products", "Order", "Contact"];
const paymentMethods = ["GCash", "PayMaya", "Bank Transfer", "Cash on Delivery"];

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

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.86a8.16 8.16 0 0 0 4.77 1.52V6.97a4.85 4.85 0 0 1-1.84-.28z" />
    </svg>
  );
}

const socials = [
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
  { icon: TikTokIcon, label: "TikTok", href: "https://tiktok.com" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <p className="mb-3 text-xl font-bold text-white">
            Tusi<span className="text-blue-400">Solutions</span>
          </p>
          <p className="text-sm leading-relaxed">
            Honest service, quality products, and people you can actually talk
            to. We&apos;d love to hear from you.
          </p>

          <div className="mt-6 flex gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition-colors hover:bg-blue-600 hover:text-white"
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
            {quickLinks.map((label) => (
              <li key={label}>
                <Link
                  href={`/${label.toLowerCase()}`}
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
                href="mailto:tusi.ekel@gmail.com"
                className="transition-colors hover:text-white"
              >
                tusi.ekel@gmail.com
              </a>
            </p>
            <p>
              <a
                href="tel:+639357330435"
                className="transition-colors hover:text-white"
              >
                0935 733 0435
              </a>
            </p>
          </address>

          <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-widest text-white">
            We Accept
          </p>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Separator className="bg-slate-800" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-xs text-slate-600">
        <span>© {new Date().getFullYear()} Tusi Solutions. All rights reserved.</span>
        <span>Built with Next.js &amp; Vercel</span>
      </div>
    </footer>
  );
}
