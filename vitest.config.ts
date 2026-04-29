import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      // Allow server-only modules to be imported in the test environment
      "server-only": path.resolve(
        __dirname,
        "./__tests__/mocks/server-only.ts",
      ),
      "@": path.resolve(__dirname, "."),
    },
  },
});
