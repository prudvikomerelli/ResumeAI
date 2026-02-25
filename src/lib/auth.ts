import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function getOrCreateDbUser() {
  const user = await requireUser();

  let dbUser = await prisma.user.findUnique({
    where: { supabaseUserId: user.id },
    include: { subscription: true },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: user.email!,
        name: user.user_metadata?.full_name || null,
        supabaseUserId: user.id,
        subscription: {
          create: {
            plan: "FREE",
            status: "ACTIVE",
          },
        },
      },
      include: { subscription: true },
    });
  }

  return dbUser;
}
