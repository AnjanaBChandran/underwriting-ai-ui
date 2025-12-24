import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RiskBuckets } from "./RiskBuckets";

interface ExtractedField {
  label: string;
  value: string;
  confidence?: string;
  confidencePercentage?: number;
  sourceDoc?: string;
  highlightLocation?: any;
}

interface UWAnalysisTabProps {
  caseData: {
    id: string;
    applicantName: string;
    age?: number;
    gender?: string;
    education?: string;
    occupation?: string;
    sumAssured: string;
    premium: string;
    product?: string;
    channel?: string;
    drcScore?: string;
    nominee?: string;
    financialInfo?: ExtractedField[];
    medicalInfo?: ExtractedField[];
    missingDocuments?: string[];
  };
  caseType: "term-medical" | "non-term-non-medical" | "non-medical";
  onViewSource?: (docName: string, highlight?: any) => void;
  onExplainExtraction?: (field: ExtractedField) => void;
}

// Compact confidence dot
const ConfidenceDot = ({ percentage }: { percentage?: number }) => {
  const pct = percentage ?? 0;
  const color = pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
      <span>{pct}%</span>
    </span>
  );
};

export const UWAnalysisTab = ({ 
  caseData, 
  caseType, 
  onViewSource, 
  onExplainExtraction 
}: UWAnalysisTabProps) => {
  
  const handleViewSource = (field: ExtractedField) => {
    if (!field.sourceDoc) return;
    onViewSource?.(field.sourceDoc, {
      fieldName: field.label,
      value: field.value,
      confidence: field.confidence,
      ...field.highlightLocation
    });
  };

  const showMedical = caseType !== "non-term-non-medical";
  const isDetailedMedical = caseType === "term-medical";

  return (
    <div className="space-y-4">
      {/* Risk Buckets Accordion */}
      <RiskBuckets 
        caseData={caseData} 
        onViewSource={(docName) => onViewSource?.(docName, {})}
        caseType={caseType}
      />

      {/* Applicant Data - Always visible */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Applicant Profile</CardTitle>
            {caseData.drcScore && (
              <Badge variant="secondary" className="text-xs">
                DRC: {caseData.drcScore}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-x-6 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Policy No:</span>
                <span className="font-semibold">{caseData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age/Gender:</span>
                <span className="font-semibold">{caseData.age}/{caseData.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sum Assured:</span>
                <span className="font-semibold">{caseData.sumAssured}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-semibold">{caseData.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Occupation:</span>
                <span className="font-semibold">{caseData.occupation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Premium:</span>
                <span className="font-semibold">{caseData.premium}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1.5">
            {caseData.financialInfo?.slice(0, caseType === "non-term-non-medical" ? 2 : undefined).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{item.label}:</span>
                  <span className="font-semibold">{item.value}</span>
                  {item.value.toLowerCase().includes('pending') && (
                    <XCircle className="h-3 w-3 text-destructive" />
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <ConfidenceDot percentage={item.confidencePercentage} />
                  {item.sourceDoc && (
                    <button
                      onClick={() => handleViewSource(item)}
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical Information - Conditional */}
      {showMedical && (
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              {isDetailedMedical ? "Medical Analysis" : "Medical Declarations"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isDetailedMedical ? (
              <div className="space-y-1.5">
                {caseData.medicalInfo?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{item.label}:</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ConfidenceDot percentage={item.confidencePercentage} />
                      {item.sourceDoc && (
                        <button
                          onClick={() => handleViewSource(item)}
                          className="text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-2.5 w-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No medical tests required. Declaration-based underwriting.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
