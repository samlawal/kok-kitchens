import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Resolve the "@/..." path alias (from tsconfig) so tests can import route
// handlers and modules that use it. Regex keeps it off scoped packages like
// "@vercel/blob".
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: fileURLToPath(new URL("./", import.meta.url)) },
    ],
  },
});
