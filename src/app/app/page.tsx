import { getOrCreateDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, FileText, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AtsScore } from "@/components/ats-score";
import { formatDate, truncate } from "@/lib/utils";

export default async function DashboardPage() {
  const dbUser = await getOrCreateDbUser();
  const generations = await prisma.generation.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your resume generation history
          </p>
        </div>
        <Link
          href="/app/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          New Generation
        </Link>
      </div>

      {generations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No generations yet
            </h3>
            <p className="mb-6 max-w-sm text-center text-sm text-gray-500">
              Paste a job description and your resume to generate an ATS-optimized
              resume and tailored cover letter.
            </p>
            <Link
              href="/app/new"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Create Your First Generation
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {generations.map((gen) => (
            <Link key={gen.id} href={`/app/result/${gen.id}`}>
              <Card className="transition-shadow hover:shadow-md cursor-pointer">
                <CardContent className="flex items-center gap-6 p-6">
                  <AtsScore score={gen.atsScore} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {gen.jobTitle || "Untitled Position"}
                      </h3>
                      <Badge>{gen.tone}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 truncate">
                      {truncate(gen.jobDescription, 120)}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {formatDate(gen.createdAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
