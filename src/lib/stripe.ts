import Stripe from "stripe";

function getStripeKey(): string {
  if (process.env.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY;
  try {
    const fs = require("fs");
    const content = fs.readFileSync(".env", "utf8");
    const match = content.match(/^STRIPE_SECRET_KEY="?([^"\n]+)"?/m);
    if (match?.[1]) return match[1];
  } catch {}
  throw new Error("STRIPE_SECRET_KEY is not configured");
}

export const stripe = new Stripe(getStripeKey());
