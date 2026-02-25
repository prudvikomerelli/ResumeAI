import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
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
      include: { subscription: true },
    });

    if (!dbUser) {
      return NextResponse.json({
        plan: "FREE",
        status: "ACTIVE",
        currentPeriodEnd: null,
        usage: { generationsCount: 0, exportsCount: 0 },
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usage = await prisma.usage.findUnique({
      where: { userId_date: { userId: dbUser.id, date: today } },
    });

    return NextResponse.json({
      plan: dbUser.subscription?.plan ?? "FREE",
      status: dbUser.subscription?.status ?? "ACTIVE",
      currentPeriodEnd: dbUser.subscription?.currentPeriodEnd ?? null,
      usage: {
        generationsCount: usage?.generationsCount ?? 0,
        exportsCount: usage?.exportsCount ?? 0,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch billing" }, { status: 500 });
  }
}
