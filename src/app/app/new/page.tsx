"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const tones = [
  { value: "CONCISE", label: "Concise", description: "Short, direct bullet points" },
  { value: "IMPACT", label: "Impact", description: "Metrics and measurable results" },
  { value: "LEADERSHIP", label: "Leadership", description: "Strategic contributions" },
] as const;

export default function NewGenerationPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [tone, setTone] = useState<"CONCISE" | "IMPACT" | "LEADERSHIP">("CONCISE");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, resume, jobTitle, tone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      toast.success("Resume optimized successfully!");
      router.push(`/app/result/${data.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Generation</h1>
        <p className="mt-1 text-sm text-gray-500">
          Paste your job description and resume to generate an ATS-optimized version
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Paste the job description you&apos;re targeting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                Job Title (optional)
              </label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="jd" className="block text-sm font-medium text-gray-700">
                Job Description *
              </label>
              <Textarea
                id="jd"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                required
                rows={10}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-gray-400">
                {jobDescription.length}/10,000 characters
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Resume</CardTitle>
            <CardDescription>Paste your current resume text</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your full resume text here..."
              required
              rows={12}
            />
            <p className="mt-1 text-xs text-gray-400">
              {resume.length}/15,000 characters
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tone</CardTitle>
            <CardDescription>Choose the writing style for your optimized resume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {tones.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTone(t.value)}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    tone === t.value
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">{t.label}</div>
                  <div className="mt-1 text-xs text-gray-500">{t.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={loading} size="lg">
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Optimized Resume
          </Button>
        </div>
      </form>
    </div>
  );
}
