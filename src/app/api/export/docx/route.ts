import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, incrementUsage } from "@/lib/rate-limit";
import { generateResumeDocx, generateCoverLetterDocx } from "@/lib/export-docx";
import { z } from "zod";

const exportSchema = z.object({
  generationId: z.string().uuid(),
  type: z.enum(["resume", "cover-letter"]),
});

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

    const { allowed } = await checkRateLimit(dbUser.id, plan, "export");
    if (!allowed) {
      return NextResponse.json(
        { error: "Daily export limit reached. Upgrade to Pro for unlimited exports." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = exportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const generation = await prisma.generation.findFirst({
      where: { id: parsed.data.generationId, userId: dbUser.id },
    });

    if (!generation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let buffer: Buffer;
    let filename: string;

    if (parsed.data.type === "resume") {
      buffer = await generateResumeDocx(generation.resumeOptimized);
      filename = `resume_${generation.jobTitle || "optimized"}.docx`;
    } else {
      buffer = await generateCoverLetterDocx(generation.coverLetter);
      filename = `cover_letter_${generation.jobTitle || "optimized"}.docx`;
    }

    await incrementUsage(dbUser.id, "export");

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=\"" + filename + "\"",
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
