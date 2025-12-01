import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RiskCategory {
  label: string;
  level: "Low" | "Medium" | "High";
  explanation: string;
}

interface RiskAssessmentPanelProps {
  risks?: RiskCategory[];
}

export const RiskAssessmentPanel = ({ risks }: RiskAssessmentPanelProps) => {
  const defaultRisks: RiskCategory[] = [
    {
      label: "Overall Risk",
      level: "Medium",
      explanation: "Computed based on weighted average of all risk categories including health, financial, lifestyle, and documentation completeness."
    },
    {
      label: "Health Risk",
      level: "Low",
      explanation: "Based on BMI, blood pressure, medical history, smoking status, and family medical history. Current indicators show healthy profile."
    },
    {
      label: "Financial Stability",
      level: "High",
      explanation: "Based on income-to-premium ratio, net worth, ITR availability, and income source verification. Some documentation pending."
    },
    {
      label: "Lifestyle Risk",
      level: "Low",
      explanation: "Derived from occupation type, smoking/alcohol habits, and declared lifestyle patterns. Non-smoker with stable occupation."
    }
  ];

  const displayRisks = risks || defaultRisks;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "High":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRiskWidth = (level: string) => {
    switch (level) {
      case "Low":
        return "w-1/3";
      case "Medium":
        return "w-2/3";
      case "High":
        return "w-full";
      default:
        return "w-1/2";
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {displayRisks.map((risk, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <span className="font-medium">{risk.label}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="inline-flex text-muted-foreground hover:text-foreground">
                          <Info className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">{risk.explanation}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className={
                  risk.level === "Low" ? "text-green-600" :
                  risk.level === "Medium" ? "text-yellow-600" :
                  "text-red-600"
                }>
                  {risk.level}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${getRiskColor(risk.level)} ${getRiskWidth(risk.level)}`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
