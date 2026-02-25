import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeOutput(text: string): string {
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .trim();
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
