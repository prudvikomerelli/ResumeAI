import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const scoreSchema = z.object({
  jobDescription: z.string().min(1),
  resume: z.string().min(1),
});

function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-\/\+\#\.]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const stopWords = new Set([
    "the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
    "her", "was", "one", "our", "out", "has", "have", "with", "this", "that",
    "from", "they", "been", "will", "their", "would", "about", "which",
    "when", "make", "like", "than", "each", "also", "into", "year", "some",
    "them", "know", "want", "give", "most", "only", "over", "such", "take",
    "able", "work", "experience", "responsibilities", "requirements", "must",
    "should", "including", "preferred", "required", "strong",
  ]);

  const keywords = words.filter((w) => !stopWords.has(w));
  return [...new Set(keywords)];
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = scoreSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const jdKeywords = extractKeywords(parsed.data.jobDescription);
    const resumeText = parsed.data.resume.toLowerCase();

    const matched = jdKeywords.filter((kw) => resumeText.includes(kw));
    const missing = jdKeywords.filter((kw) => !resumeText.includes(kw));

    const score = jdKeywords.length > 0
      ? Math.round((matched.length / jdKeywords.length) * 100)
      : 0;

    return NextResponse.json({
      score,
      matched,
      missing: missing.slice(0, 20),
      total: jdKeywords.length,
    });
  } catch {
    return NextResponse.json({ error: "Scoring failed" }, { status: 500 });
  }
}
