import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface AIInsight {
  type: "warning" | "error" | "info";
  message: string;
}

interface AIInsightsPanelProps {
  insights?: AIInsight[];
  missingDocuments?: string[];
}

export const AIInsightsPanel = ({ insights = [], missingDocuments = [] }: AIInsightsPanelProps) => {
  const defaultInsights: AIInsight[] = [
    ...(missingDocuments.length > 0 ? missingDocuments.map(doc => ({
      type: "error" as const,
      message: `${doc} missing (mandatory)`
    })) : []),
    { type: "warning" as const, message: "Income declared = 12L; extracted = 15L (Mismatch)" },
    { type: "warning" as const, message: "Nominee = Mother but document indicates no nominee information" },
    { type: "error" as const, message: "Signature mismatch detected (High confidence)" },
    { type: "info" as const, message: "OCR confidence low on Medical Examination Report" },
  ];

  const allInsights = insights.length > 0 ? insights : defaultInsights;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "•";
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            AI Insights
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {allInsights.length} findings
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {allInsights.map((insight, idx) => (
            <div key={idx} className="flex gap-2 text-xs">
              <span className="shrink-0">{getInsightIcon(insight.type)}</span>
              <span className={
                insight.type === "error" ? "text-red-600" :
                insight.type === "warning" ? "text-yellow-600" :
                "text-muted-foreground"
              }>
                {insight.message}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
