import { Badge } from "@/components/ui/badge";

interface KeywordPillsProps {
  matched: string[];
  missing: string[];
}

export function KeywordPills({ matched, missing }: KeywordPillsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-700">
          Matched Keywords ({matched.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {matched.length === 0 ? (
            <span className="text-sm text-gray-400">No matched keywords yet</span>
          ) : (
            matched.map((kw) => (
              <Badge key={kw} variant="success">
                {kw}
              </Badge>
            ))
          )}
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-700">
          Missing Keywords ({missing.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {missing.length === 0 ? (
            <span className="text-sm text-gray-400">No missing keywords</span>
          ) : (
            missing.map((kw) => (
              <Badge key={kw} variant="danger">
                {kw}
              </Badge>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
