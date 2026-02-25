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

    const dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id },
    });

    if (!dbUser?.stripeCustomerId) {
      return NextResponse.json({ error: "No billing account found" }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Portal error:", err);
    return NextResponse.json({ error: "Failed to create portal" }, { status: 500 });
  }
}
