import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS class names safely.
 * - clsx handles conditional classes and arrays
 * - twMerge removes duplicate Tailwind classes (e.g., "p-2 p-4" → "p-4")
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", "text-white")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a JavaScript Date object into a human-readable string.
 * e.g., "Sunday, 20 July 2025"
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Truncates a string to a maximum length, adding "..." if it was cut.
 * Useful for sermon/event description previews.
 *
 * @example
 * truncate("A very long description...", 50)
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
