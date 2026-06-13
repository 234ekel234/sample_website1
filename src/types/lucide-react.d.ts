// Type shim for lucide-react.
//
// The installed lucide-react (1.16.0) points `typings` at `dist/lucide-react.d.ts`
// in its package.json, but that file isn't shipped in this environment. Without a
// declaration, `next build`'s type-check fails with TS7016 ("Could not find a
// declaration file for module 'lucide-react'") on every component that imports an
// icon. (`next dev` skips full type-checking, so it only shows up in a prod build.)
//
// Declaring the module here resolves the icons (as `any` at the type level) so the
// build type-checks. Runtime behavior is unchanged — the icon components still come
// from the real package. Remove this shim if lucide-react is ever updated to a
// build that ships its own declarations.
declare module "lucide-react";
