import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official PMAFI seal (transparent PNG), so it sits cleanly on both the dark
 * hero/footer and the white scrolled navbar. The caller sets the display size
 * via `className` (e.g. `h-10 w-10`); `object-contain` keeps the circular
 * emblem from distorting since the source is very slightly non-square.
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
