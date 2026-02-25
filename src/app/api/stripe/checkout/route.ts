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
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          supabaseUserId: user.id,
          email: user.email ?? "",
          name: user.user_metadata?.full_name ?? user.email ?? "",
        },
      });
    }

    let customerId = dbUser.stripeCustomerId;

    if (customerId) {
      try {
        await stripe.customers.retrieve(customerId);
      } catch {
        customerId = null;
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { stripeCustomerId: null },
        });
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        metadata: { userId: dbUser.id },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
