import { z } from "zod";

const MAX_JD_LENGTH = 10000;
const MAX_RESUME_LENGTH = 15000;

export const generateSchema = z.object({
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters")
    .max(MAX_JD_LENGTH, `Job description must be under ${MAX_JD_LENGTH} characters`),
  resume: z
    .string()
    .min(100, "Resume must be at least 100 characters")
    .max(MAX_RESUME_LENGTH, `Resume must be under ${MAX_RESUME_LENGTH} characters`),
  jobTitle: z.string().max(200).optional(),
  tone: z.enum(["CONCISE", "IMPACT", "LEADERSHIP"]).default("CONCISE"),
});

export type GenerateInput = z.infer<typeof generateSchema>;

export const outputSchema = z.object({
  resumeOptimized: z.string(),
  coverLetter: z.string(),
  atsScore: z.number().min(0).max(100),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
});

export type GenerateOutput = z.infer<typeof outputSchema>;
