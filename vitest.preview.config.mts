import { defineConfig } from "vitest/config";
import path from "node:path";

// Previews are excluded from the pass/fail suite on purpose — they assert
// nothing, they render. But `vitest --exclude` APPENDS to the config's exclude
// rather than replacing it, so the main config can never be talked out of
// skipping them. Hence a config of their own.
//
//   npm run preview:email
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  test: {
    environment: "node",
    include: ["src/**/*.preview.test.ts"],
    exclude: ["**/node_modules/**"],
  },
});
