import type { NextConfig } from "next";
import { readFileSync } from "fs";

function loadEnvKey(key: string): string | undefined {
  try {
    const content = readFileSync(".env", "utf8");
    const match = content.match(new RegExp(`^${key}=["']?([^"'\\n]+)["']?`, "m"));
    return match?.[1] || undefined;
  } catch {
    return undefined;
  }
}

if (!process.env.OPENAI_API_KEY) {
  const val = loadEnvKey("OPENAI_API_KEY");
  if (val) process.env.OPENAI_API_KEY = val;
}

const nextConfig: NextConfig = {};

export default nextConfig;
