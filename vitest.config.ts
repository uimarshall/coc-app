import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vitest configuration for unit tests.
 * @see https://vitest.dev/config/
 */
export default defineConfig({
  plugins: [
    // Enables React JSX transform so you can write JSX in test files
    react(),
  ],
  test: {
    // Use jsdom to simulate a browser environment in Node.js
    environment: "jsdom",

    // Automatically import expect, describe, it, etc. in every test file
    globals: true,

    // Run this setup file before each test to configure Testing Library
    setupFiles: ["./tests/setup.ts"],

    // Only look for test files inside the tests/unit directory
    include: ["tests/unit/**/*.test.{ts,tsx}"],

    coverage: {
      // Use V8 for fast native code coverage
      provider: "v8",
      reporter: ["text", "html"],
      // Track coverage for all source files, not just those imported in tests
      include: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
      exclude: ["app/api/**", "**/*.d.ts"],
    },
  },
  resolve: {
    alias: {
      // Makes "@/components/..." work the same as in Next.js
      "@": path.resolve(__dirname, "."),
    },
  },
});
