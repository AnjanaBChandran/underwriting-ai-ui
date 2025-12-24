import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, User, DollarSign, Heart, FileText, ExternalLink, Info, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface RiskItem {
  text: string;
  severity: "warning" | "error" | "ok";
  sourceDoc?: string;
  tooltip?: string;
  ruleId?: string;
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
    drcScore?: string;
  };
  onViewSource?: (docName: string) => void;
  caseType?: "term-medical" | "non-term-non-medical" | "non-medical";
}

export const RiskBuckets = ({ caseData, onViewSource, caseType = "term-medical" }: RiskBucketsProps) => {
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

  // Lifestyle & Profile - Always visible
  if (caseData.nominee?.toLowerCase() === 'mother') {
    lifestyleRisks.push({
      text: "Nominee is Mother — verify relationship",
      severity: "warning",
      tooltip: "Unusual nominee relationship for term insurance. Check if insurable interest exists.",
      ruleId: "LIFE_NOM_01"
    });
  }
  
  // IAR Q8 check
  lifestyleRisks.push({
    text: "IAR Q8 answered 'Yes' — needs detailed explanation",
    severity: "warning",
    tooltip: "Additional health/lifestyle disclosure required. Request clarification before proceeding.",
    ruleId: "LIFE_IAR_08"
  });

  // Financial risks
  caseData.financialInfo?.forEach(field => {
    if (field.value.toLowerCase().includes('pending')) {
      financialRisks.push({
        text: `${field.label} verification pending`,
        severity: "error",
        sourceDoc: "Financial Statements",
        tooltip: "Income proof not yet verified. Block decision until complete.",
        ruleId: "FIN_INC_01"
      });
    }
  });
  
  // Signature mismatch
  financialRisks.push({
    text: "Specimen signatures mismatch detected",
    severity: "error",
    tooltip: "Signatures on different documents don't match. Request fresh KYC.",
    ruleId: "FIN_SIG_01"
  });

  // Entry criteria check
  financialRisks.push({
    text: "SAR above 5 Cr — SRUW sign-off required",
    severity: "warning",
    tooltip: "High sum assured requires senior underwriter approval.",
    ruleId: "FIN_SAR_01"
  });

  // Medical risks - Only for term-medical and non-medical
  if (caseType !== "non-term-non-medical") {
    caseData.medicalInfo?.forEach(field => {
      if (field.label === "Smoking Status" && field.confidence === "Low") {
        medicalRisks.push({
          text: "Smoking status has low confidence — verify",
          severity: "warning",
          sourceDoc: "Medical Examination Report",
          tooltip: "OCR confidence low on smoking declaration. Cross-check with MER.",
          ruleId: "MED_SMK_01"
        });
      }
    });
  }

  // Data & Compliance - Always visible
  if (caseData.missingDocuments && caseData.missingDocuments.length > 0) {
    caseData.missingDocuments.forEach(doc => {
      dataRisks.push({
        text: `Missing document: ${doc}`,
        severity: "error",
        tooltip: "Required document not uploaded. Case cannot be decisioned.",
        ruleId: "DATA_DOC_01"
      });
    });
  }

  // IIB check placeholder
  dataRisks.push({
    text: "IIB match found — review previous policy history",
    severity: "warning",
    tooltip: "Applicant has existing/prior policies. Check for adverse history.",
    ruleId: "DATA_IIB_01"
  });

  // Build categories based on case type
  const allCategories: RiskCategory[] = [
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
      label: "Data, Compliance & History",
      icon: <FileText className="h-4 w-4" />,
      items: dataRisks
    }
  ];

  // Filter categories based on case type
  const categories = caseType === "non-term-non-medical" 
    ? allCategories.filter(c => c.id !== "medical")
    : allCategories;

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
    
    if (errors > 0) return { icon: "❗", count: errors, color: "text-destructive", bg: "bg-destructive/10" };
    if (warnings > 0) return { icon: "⚠", count: warnings, color: "text-amber-500", bg: "bg-amber-500/10" };
    return { icon: "✔", count: 0, color: "text-green-500", bg: "bg-green-500/10" };
  };

  // Auto-expand categories with errors
  useEffect(() => {
    const errorCategories = categories
      .filter(c => c.items.some(i => i.severity === "error"))
      .map(c => c.id);
    if (errorCategories.length > 0) {
      setOpenBuckets(errorCategories);
    }
  }, []);

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
                <div className={cn(
                  "flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors text-xs",
                  isOpen && status.bg
                )}>
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
                      <div key={idx} className="flex items-start gap-2 text-xs py-1">
                        <span className="shrink-0 mt-0.5">{getSeverityIcon(item.severity)}</span>
                        <span className="flex-1 text-foreground">{item.text}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.sourceDoc && onViewSource && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewSource(item.sourceDoc!);
                              }}
                              className="inline-flex items-center gap-0.5 text-primary hover:text-primary/80"
                              title="View Source"
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
                                <TooltipContent side="left" className="max-w-xs">
                                  <div className="space-y-1">
                                    <p className="text-xs">{item.tooltip}</p>
                                    {item.ruleId && (
                                      <p className="text-[10px] text-muted-foreground">Rule: {item.ruleId}</p>
                                    )}
                                  </div>
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
