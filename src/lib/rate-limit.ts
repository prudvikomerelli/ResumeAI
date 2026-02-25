import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/plans";
import type { Plan } from "@prisma/client";

export async function checkRateLimit(
  userId: string,
  plan: Plan,
  type: "generation" | "export"
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const planLimits = PLANS[plan];
  const limit =
    type === "generation"
      ? planLimits.generationsPerDay
      : planLimits.exportsPerDay;

  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity, limit: Infinity };
  }

  const usage = await prisma.usage.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  const current =
    type === "generation"
      ? usage?.generationsCount ?? 0
      : usage?.exportsCount ?? 0;

  return {
    allowed: current < limit,
    remaining: Math.max(0, limit - current),
    limit,
  };
}

export async function incrementUsage(
  userId: string,
  type: "generation" | "export"
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const field =
    type === "generation" ? "generationsCount" : "exportsCount";

  await prisma.usage.upsert({
    where: { userId_date: { userId, date: today } },
    update: { [field]: { increment: 1 } },
    create: {
      userId,
      date: today,
      [field]: 1,
    },
  });
}
