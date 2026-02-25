import * as fs from "fs";
import * as path from "path";

const API_URL = process.env.API_URL || "http://localhost:3001";

async function main() {
  const jdPath = path.join(__dirname, "jd.txt");
  const resumePath = path.join(__dirname, "resume.txt");

  if (!fs.existsSync(jdPath) || !fs.existsSync(resumePath)) {
    console.error("Missing jd.txt or resume.txt in scripts/ directory");
    console.log("Create scripts/jd.txt with a job description");
    console.log("Create scripts/resume.txt with your resume");
    process.exit(1);
  }

  const jobDescription = fs.readFileSync(jdPath, "utf-8");
  const resume = fs.readFileSync(resumePath, "utf-8");

  console.log("Sending generation request...");
  console.log(`JD length: ${jobDescription.length} chars`);
  console.log(`Resume length: ${resume.length} chars`);

  const res = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobDescription,
      resume,
      tone: "CONCISE",
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("Error:", error);
    process.exit(1);
  }

  const data = await res.json();
  console.log("\nGeneration ID:", data.id);

  const genRes = await fetch(`${API_URL}/api/generation/${data.id}`);
  const gen = await genRes.json();

  const outputDir = path.join(__dirname, "..", "outputs");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(
    path.join(outputDir, "resume_optimized.txt"),
    gen.resumeOptimized
  );
  fs.writeFileSync(
    path.join(outputDir, "cover_letter.txt"),
    gen.coverLetter
  );
  fs.writeFileSync(
    path.join(outputDir, "analysis.json"),
    JSON.stringify(
      {
        atsScore: gen.atsScore,
        matchedKeywords: gen.matchedKeywords,
        missingKeywords: gen.missingKeywords,
        tone: gen.tone,
      },
      null,
      2
    )
  );

  console.log("\nResults:");
  console.log(`  ATS Score: ${gen.atsScore}/100`);
  console.log(`  Matched Keywords: ${gen.matchedKeywords.length}`);
  console.log(`  Missing Keywords: ${gen.missingKeywords.length}`);
  console.log(`\nOutputs written to ${outputDir}/`);
}

main().catch(console.error);
