import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: dbUser.name || "",
      email: dbUser.email,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const updated = await prisma.user.update({
      where: { id: dbUser.id },
      data: { name: body.name },
    });

    return NextResponse.json({ name: updated.name, email: updated.email });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: dbUser.id } });
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
