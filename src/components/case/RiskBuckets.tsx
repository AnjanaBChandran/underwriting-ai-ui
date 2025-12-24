import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, User, DollarSign, Heart, FileText, ExternalLink, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface RiskItem {
  text: string;
  severity: "warning" | "error" | "ok";
  sourceDoc?: string;
  tooltip?: string;
}

interface RiskCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: RiskItem[];
}

interface RiskBucketsProps {
  caseData: {
    nominee?: string;
    medicalInfo?: { label: string; value: string; confidence?: string }[];
    financialInfo?: { label: string; value: string; confidence?: string }[];
    missingDocuments?: string[];
  };
  onViewSource?: (docName: string) => void;
}

export const RiskBuckets = ({ caseData, onViewSource }: RiskBucketsProps) => {
  const [openBuckets, setOpenBuckets] = useState<string[]>([]);

  const toggleBucket = (id: string) => {
    setOpenBuckets(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  // Build risk items from case data
  const lifestyleRisks: RiskItem[] = [];
  const financialRisks: RiskItem[] = [];
  const medicalRisks: RiskItem[] = [];
  const dataRisks: RiskItem[] = [];

  // Lifestyle & Profile
  if (caseData.nominee?.toLowerCase() === 'mother') {
    lifestyleRisks.push({
      text: "Nominee is Mother — verify relationship",
      severity: "warning",
      tooltip: "Unusual nominee relationship for term insurance"
    });
  }
  
  // IAR Q8 check (hardcoded for demo)
  lifestyleRisks.push({
    text: "IAR Q8 answered 'Yes' — needs detailed explanation",
    severity: "warning",
    tooltip: "Additional health/lifestyle disclosure required"
  });

  // Financial risks
  caseData.financialInfo?.forEach(field => {
    if (field.value.toLowerCase().includes('pending')) {
      financialRisks.push({
        text: `${field.label} verification pending`,
        severity: "error",
        sourceDoc: "Financial Statements"
      });
    }
  });
  
  // Signature mismatch (demo)
  financialRisks.push({
    text: "Specimen signatures mismatch detected",
    severity: "error",
    tooltip: "Signatures on different documents don't match"
  });

  // Medical risks
  caseData.medicalInfo?.forEach(field => {
    if (field.label === "Smoking Status" && field.confidence === "Low") {
      medicalRisks.push({
        text: "Smoking status has low confidence — verify",
        severity: "warning",
        sourceDoc: "Medical Examination Report"
      });
    }
  });

  // Data & Compliance
  if (caseData.missingDocuments && caseData.missingDocuments.length > 0) {
    caseData.missingDocuments.forEach(doc => {
      dataRisks.push({
        text: `Missing document: ${doc}`,
        severity: "error",
        tooltip: "Required document not uploaded"
      });
    });
  }

  const categories: RiskCategory[] = [
    {
      id: "lifestyle",
      label: "Lifestyle & Profile Risk",
      icon: <User className="h-4 w-4" />,
      items: lifestyleRisks
    },
    {
      id: "financial",
      label: "Financial & Eligibility",
      icon: <DollarSign className="h-4 w-4" />,
      items: financialRisks
    },
    {
      id: "medical",
      label: "Medical Risk",
      icon: <Heart className="h-4 w-4" />,
      items: medicalRisks
    },
    {
      id: "data",
      label: "Data & Compliance",
      icon: <FileText className="h-4 w-4" />,
      items: dataRisks
    }
  ];

  const getExceptionCount = (items: RiskItem[]) => {
    return items.filter(i => i.severity !== "ok").length;
  };

  const getSeverityIcon = (severity: "warning" | "error" | "ok") => {
    switch (severity) {
      case "error":
        return <span className="text-destructive">❗</span>;
      case "warning":
        return <span className="text-amber-500">⚠</span>;
      case "ok":
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
    }
  };

  const getCategoryStatus = (items: RiskItem[]) => {
    const errors = items.filter(i => i.severity === "error").length;
    const warnings = items.filter(i => i.severity === "warning").length;
    
    if (errors > 0) return { icon: "❗", count: errors, color: "text-destructive" };
    if (warnings > 0) return { icon: "⚠", count: warnings, color: "text-amber-500" };
    return { icon: "✔", count: 0, color: "text-green-500" };
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Risk Overview</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {categories.map(category => {
          const status = getCategoryStatus(category.items);
          const isOpen = openBuckets.includes(category.id);
          
          return (
            <Collapsible 
              key={category.id}
              open={isOpen}
              onOpenChange={() => toggleBucket(category.id)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors text-xs">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span className="font-medium">{category.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("font-semibold", status.color)}>
                      {status.icon} {status.count > 0 ? status.count : ""}
                    </span>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      isOpen && "rotate-180"
                    )} />
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-8 pr-3 pb-2 space-y-1.5">
                  {category.items.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No issues detected</p>
                  ) : (
                    category.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span className="shrink-0 mt-0.5">{getSeverityIcon(item.severity)}</span>
                        <span className="flex-1 text-foreground">{item.text}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {item.sourceDoc && onViewSource && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewSource(item.sourceDoc!);
                              }}
                              className="inline-flex items-center gap-0.5 text-primary hover:text-primary/80"
                            >
                              <ExternalLink className="h-2.5 w-2.5" />
                            </button>
                          )}
                          {item.tooltip && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className="text-muted-foreground hover:text-foreground">
                                    <Info className="h-2.5 w-2.5" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs max-w-48">{item.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
};
