"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AtsScore } from "@/components/ats-score";
import { KeywordPills } from "@/components/keyword-pills";
import { Download, Trash2, ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

interface Generation {
  id: string;
  jobTitle: string | null;
  jobDescription: string;
  resumeOriginal: string;
  resumeOptimized: string;
  coverLetter: string;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  tone: string;
  createdAt: string;
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const [gen, setGen] = useState<Generation | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [coverLetterText, setCoverLetterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"resume" | "cover-letter">("resume");

  const fetchGeneration = useCallback(async () => {
    try {
      const res = await fetch(`/api/generation/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setGen(data);
      setResumeText(data.resumeOptimized);
      setCoverLetterText(data.coverLetter);
    } catch {
      toast.error("Failed to load generation");
      router.push("/app");
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchGeneration();
  }, [fetchGeneration]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/generation/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeOptimized: resumeText,
          coverLetter: coverLetterText,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Changes saved!");
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this generation?")) return;
    try {
      const res = await fetch(`/api/generation/${params.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Generation deleted");
      router.push("/app");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleExport = async (type: "resume" | "cover-letter") => {
    try {
      const res = await fetch("/api/export/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationId: params.id,
          type,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Export failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type === "resume" ? "resume" : "cover-letter"}_${gen?.jobTitle || "optimized"}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Downloaded!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Export failed";
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!gen) return null;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/app")}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {gen.jobTitle || "Untitled Position"}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge>{gen.tone}</Badge>
              <span className="text-sm text-gray-500">
                Generated {new Date(gen.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} loading={saving}>
            <Save className="mr-1 h-4 w-4" />
            Save
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Switch */}
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("resume")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "resume"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Optimized Resume
            </button>
            <button
              onClick={() => setActiveTab("cover-letter")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "cover-letter"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Cover Letter
            </button>
          </div>

          {activeTab === "resume" ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Optimized Resume</CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleExport("resume")}>
                  <Download className="mr-1 h-4 w-4" />
                  Export DOCX
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tailored Cover Letter</CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleExport("cover-letter")}>
                  <Download className="mr-1 h-4 w-4" />
                  Export DOCX
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={coverLetterText}
                  onChange={(e) => setCoverLetterText(e.target.value)}
                  rows={20}
                  className="text-sm"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center py-6">
              <AtsScore score={gen.atsScore} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyword Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <KeywordPills
                matched={gen.matchedKeywords}
                missing={gen.missingKeywords}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
