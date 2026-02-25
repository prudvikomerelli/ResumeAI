import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ synced: false, reason: "Not authenticated" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id },
      include: { subscription: true },
    });

    if (!dbUser) {
      return NextResponse.json({ synced: false, reason: "User not found in database" });
    }

    if (!dbUser.stripeCustomerId) {
      return NextResponse.json({ synced: false, reason: "No Stripe customer ID linked to this user" });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: dbUser.stripeCustomerId,
      limit: 5,
    });

    const activeSub = subscriptions.data.find(
      (s) => s.status === "active" || s.status === "trialing"
    );

    if (!activeSub) {
      const statuses = subscriptions.data.map((s) => s.status).join(", ") || "none";
      const incompleteSub = subscriptions.data.find((s) => s.status === "incomplete");
      if (incompleteSub) {
        return NextResponse.json({
          synced: false,
          reason: "Subscription is still processing. Please wait a moment and refresh.",
        });
      }
      return NextResponse.json({
        synced: false,
        reason: `No active subscription found. Statuses: ${statuses}`,
      });
    }

    const subAny = activeSub as unknown as Record<string, unknown>;
    const rawEnd = subAny.current_period_end ?? subAny.currentPeriodEnd;
    const periodEnd = typeof rawEnd === "number"
      ? new Date(rawEnd * 1000)
      : rawEnd instanceof Date
        ? rawEnd
        : new Date();

    await prisma.subscription.upsert({
      where: { userId: dbUser.id },
      update: {
        stripeSubscriptionId: activeSub.id,
        plan: "PRO",
        status: "ACTIVE",
        currentPeriodEnd: periodEnd,
      },
      create: {
        userId: dbUser.id,
        stripeSubscriptionId: activeSub.id,
        plan: "PRO",
        status: "ACTIVE",
        currentPeriodEnd: periodEnd,
      },
    });

    return NextResponse.json({ synced: true, plan: "PRO" });
  } catch (err) {
    console.error("Stripe sync error:", err);
    return NextResponse.json(
      { error: "Sync failed", details: String(err) },
      { status: 500 }
    );
  }
}
