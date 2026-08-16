import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    // Mirror the "@/*" alias from tsconfig so tests import modules the same way
    // the app does.
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // The email preview writes files rather than asserting; run it on demand
    // with `npm run preview:email`, not as part of the pass/fail suite.
    exclude: ["**/node_modules/**", "**/*.preview.test.ts"],
  },
});
