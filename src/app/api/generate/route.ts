import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { generateSchema } from "@/lib/validations";
import { generateOptimizedContent } from "@/lib/llm";
import { checkRateLimit, incrementUsage } from "@/lib/rate-limit";
import { sanitizeOutput } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id },
      include: { subscription: true },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const plan = dbUser.subscription?.plan ?? "FREE";

    const { allowed, remaining } = await checkRateLimit(
      dbUser.id,
      plan,
      "generation"
    );
    if (!allowed) {
      return NextResponse.json(
        { error: `Daily generation limit reached. ${remaining} remaining. Upgrade to Pro for unlimited.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const result = await generateOptimizedContent(parsed.data);

    const generation = await prisma.generation.create({
      data: {
        userId: dbUser.id,
        jobTitle: parsed.data.jobTitle || null,
        jobDescription: parsed.data.jobDescription,
        resumeOriginal: parsed.data.resume,
        resumeOptimized: sanitizeOutput(result.resumeOptimized),
        coverLetter: sanitizeOutput(result.coverLetter),
        atsScore: result.atsScore,
        matchedKeywords: result.matchedKeywords,
        missingKeywords: result.missingKeywords,
        tone: parsed.data.tone,
      },
    });

    await incrementUsage(dbUser.id, "generation");

    return NextResponse.json({ id: generation.id });
  } catch (err) {
    console.error("Generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate. Please try again." },
      { status: 500 }
    );
  }
}
