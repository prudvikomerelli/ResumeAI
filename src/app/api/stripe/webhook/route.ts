import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

interface SubscriptionData {
  id: string;
  customer: string;
  status: string;
  current_period_end: number;
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const existing = await prisma.webhookEvent.findUnique({
    where: { stripeEventId: event.id },
  });

  if (existing) {
    return NextResponse.json({ received: true });
  }

  await prisma.webhookEvent.create({
    data: { stripeEventId: event.id, type: event.type },
  });

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as unknown as SubscriptionData;
        const customerId = subscription.customer;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          const status = subscription.status === "active"
            ? "ACTIVE"
            : subscription.status === "past_due"
              ? "PAST_DUE"
              : "CANCELED";

          await prisma.subscription.upsert({
            where: { userId: user.id },
            update: {
              stripeSubscriptionId: subscription.id,
              plan: "PRO",
              status,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
            create: {
              userId: user.id,
              stripeSubscriptionId: subscription.id,
              plan: "PRO",
              status,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as unknown as SubscriptionData;
        const customerId = subscription.customer;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.subscription.upsert({
            where: { userId: user.id },
            update: {
              plan: "FREE",
              status: "CANCELED",
              stripeSubscriptionId: null,
              currentPeriodEnd: null,
            },
            create: {
              userId: user.id,
              plan: "FREE",
              status: "CANCELED",
            },
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
