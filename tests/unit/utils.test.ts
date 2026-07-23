import { describe, it, expect } from "vitest";
import { cn, formatDate, truncate } from "@/lib/utils";

/**
 * Unit tests for the utility functions in lib/utils.ts
 *
 * Run with: npm run test
 * Watch mode: npm run test:watch
 */

describe("cn (class name merger)", () => {
  it("combines multiple class strings", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("removes duplicate Tailwind classes, keeping the last one", () => {
    // twMerge resolves conflicting Tailwind classes
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("handles conditional classes", () => {
    const isActive = true;
    expect(cn("base", isActive && "active")).toBe("base active");
  });

  it("ignores falsy values", () => {
    expect(cn("base", false, null, undefined, "end")).toBe("base end");
  });

  it("returns an empty string for no arguments", () => {
    expect(cn()).toBe("");
  });
});

describe("formatDate", () => {
  it("formats a Date object into a human-readable string", () => {
    // Use a fixed date so the test doesn't depend on the current time
    const date = new Date("2025-12-25T10:00:00.000Z");
    const formatted = formatDate(date);
    // The exact format may vary by timezone, so we just check key parts
    expect(formatted).toContain("2025");
    expect(formatted).toContain("December");
  });

  it("accepts a date string", () => {
    const formatted = formatDate("2025-01-01");
    expect(formatted).toContain("2025");
    expect(typeof formatted).toBe("string");
  });
});

describe("truncate", () => {
  it("returns the original string if it is short enough", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates and appends an ellipsis when the string exceeds maxLength", () => {
    const result = truncate("This is a long description", 10);
    // The result should be shorter than the original string
    expect(result.length).toBeLessThan("This is a long description".length);
    // The result must end with the ellipsis character
    expect(result.endsWith("…")).toBe(true);
    // The text portion (before ellipsis) must not exceed maxLength
    expect(result.slice(0, -1).length).toBeLessThanOrEqual(10);
  });

  it("does not truncate a string that is exactly maxLength characters", () => {
    const text = "Exact fit!"; // 10 characters
    expect(truncate(text, 10)).toBe(text);
  });
});
