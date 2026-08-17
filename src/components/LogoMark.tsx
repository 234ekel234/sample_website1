import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official PMAFI seal (transparent PNG), so it sits cleanly on both the dark
 * hero/footer and the white scrolled navbar. The caller sets the display size
 * via `className` (e.g. `h-10 w-10`).
 *
 * The source is square and circular — the seal PMAFI supplied arrived as a JPEG
 * on a cream background, and the alpha was cut with a circular mask fitted to
 * the outer rim. `object-contain` is kept so a future non-square source cannot
 * distort it.
 *
 * 256px is deliberate, not arbitrary. The largest use anywhere is the digital ID
 * card, which draws the seal at 84px on a 2x canvas — 168px. This seal is
 * photographic rather than flat, so it does not compress like a logo: at 512px
 * the file was 512 KB, and this component marks it `priority`, which would make
 * half a megabyte a blocking preload on every page. At 256px it is 145 KB and
 * still oversampled for every place it appears.
 */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/pmafi-logo.png"
      alt="Philippine Military Academy Foundation, Inc. seal"
      width={175}
      height={170}
      priority
      className={cn("object-contain", className)}
    />
  );
}
