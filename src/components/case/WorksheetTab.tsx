import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfidenceIndicator, ConfidenceLevel } from "./ConfidenceIndicator";
import { ViewSourceLink } from "./ViewSourceLink";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ExtractedField {
  label: string;
  value: string;
  confidence?: ConfidenceLevel;
  confidencePercentage?: number;
  sourceDocs?: string[];
  sourceDoc?: string;
  highlightLocation?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  evidenceSnippets?: { text: string; source: string; page?: number }[];
  rationale?: string;
}

interface WorksheetTabProps {
  caseData: {
    id: string;
    applicantName: string;
    age?: number;
    gender?: string;
    education?: string;
    occupation?: string;
    sumAssured: string;
    drcScore?: string;
    nominee?: string;
    uwSummary?: string;
    financialInfo?: ExtractedField[];
    medicalInfo?: ExtractedField[];
  };
  onViewSource?: (docName: string, highlight: any) => void;
  onExplainExtraction?: (field: ExtractedField) => void;
}

export const WorksheetTab = ({ caseData, onViewSource, onExplainExtraction }: WorksheetTabProps) => {
  const { toast } = useToast();

  const handleViewSource = (field: ExtractedField) => {
    if (!onViewSource || !field.sourceDoc || !field.highlightLocation) {
      toast({
        title: "Source not available",
        description: "Document source information is not available for this field",
        variant: "destructive"
      });
      return;
    }

    onViewSource(field.sourceDoc, {
      fieldName: field.label,
      value: field.value,
      confidence: field.confidence || "Unknown",
      ...field.highlightLocation
    });
  };

  // Generate UW Summary dynamically
  const generateSummary = () => {
    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });

    const sumAssuredShort = caseData.sumAssured
      .replace('₹', '')
      .replace(',', '')
      .replace('L', '')
      .replace('Cr', '');
    
    const sumLabel = caseData.sumAssured.includes('Cr') ? 'cr' : 'L';

    let summary = `Summary\n${caseData.id}\n${caseData.applicantName}\n${timestamp}\n******************************\n\n`;
    
    summary += `No potential match found\n`;
    summary += `DRC ${caseData.drcScore?.toLowerCase() || 'std'}\n`;
    summary += `${caseData.age}/ ${caseData.gender} / ${caseData.education?.toLowerCase()} / ${caseData.occupation?.toLowerCase()} / AI ${sumAssuredShort}${sumLabel}\n`;
    
    // Nominee check
    if (caseData.nominee?.toLowerCase() === 'mother') {
      summary += `nom mother  ❌\n`;
    } else {
      summary += `nom ${caseData.nominee?.toLowerCase()}  ✓\n`;
    }
    
    summary += `KYC ok\n`;
    
    // Medical checks
    const medicalInfo = caseData.medicalInfo || [];
    const smoking = medicalInfo.find(m => m.label === 'Smoking Status');
    if (smoking && smoking.value.toLowerCase().includes('non-smoker')) {
      summary += `Non-smoker verified\n`;
    }
    
    summary += `Q 10 in IAR answered yes – need details\n`;
    summary += `CDF ok\n`;
    summary += `sign on medicals diff from PAN\n\n`;
    
    // Financial checks
    const financialInfo = caseData.financialInfo || [];
    const income = financialInfo.find(f => f.label === 'Annual Income');
    if (income && income.value.includes('1.5Cr')) {
      summary += `Since SAR with ABSLI above 5 cr, would need SRUW sign off however incomplete case, would need reqts first\n\n`;
    }
    
    summary += `❌ c/f specimen signatures of LA in diff styles,\n`;
    summary += `ITRs and COI for last 3 yrs\n`;
    summary += `Form 26AS for latest AY\n\n`;
    
    summary += `Need details and reason for yes to Q10 in IAR\n`;
    summary += `Income proof verification pending`;
    
    return summary;
  };

  const uwSummary = caseData.uwSummary || generateSummary();

  const handleCopySummary = () => {
    navigator.clipboard.writeText(uwSummary);
    toast({
      title: "Summary copied",
      description: "UW summary copied to clipboard",
    });
  };

  return (
    <div className="space-y-3">
      {/* Applicant Data Panel */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Applicant Data</CardTitle>
            {caseData.drcScore && (
              <Badge variant="secondary" className="text-xs">
                {caseData.drcScore}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{caseData.applicantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Age/Gender:</span>
              <span className="font-medium">{caseData.age}/{caseData.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Education:</span>
              <span className="font-medium">{caseData.education}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Occupation:</span>
              <span className="font-medium">{caseData.occupation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sum Assured:</span>
              <span className="font-medium">{caseData.sumAssured}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nominee:</span>
              <span className="font-medium">{caseData.nominee}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information Panel */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
            {caseData.financialInfo?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <span className="text-muted-foreground">{item.label}:</span>
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{item.value}</span>
                    {item.value.toLowerCase().includes('pending') && (
                      <span className="text-destructive">❌</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {item.confidence && (
                      <ConfidenceIndicator 
                        level={item.confidence}
                        percentage={item.confidencePercentage}
                        sourceDocs={item.sourceDocs}
                        fieldName={item.label}
                      />
                    )}
                    {item.sourceDoc && (
                      <>
                        <ViewSourceLink onClick={() => handleViewSource(item)} />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => onExplainExtraction?.(item)}
                                className="inline-flex items-center ml-1.5 text-primary hover:text-primary/80 transition-colors"
                                aria-label="Explain how this value was extracted"
                              >
                                <Info className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Explain how this value was extracted</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical Information Panel */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Medical Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
            {caseData.medicalInfo?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <span className="text-muted-foreground">{item.label}:</span>
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{item.value}</span>
                    {(item.label === "Medical History" && item.value !== "No significant conditions") && (
                      <span className="text-destructive">❌</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {item.confidence && (
                      <ConfidenceIndicator 
                        level={item.confidence}
                        percentage={item.confidencePercentage}
                        sourceDocs={item.sourceDocs}
                        fieldName={item.label}
                      />
                    )}
                    {item.sourceDoc && (
                      <>
                        <ViewSourceLink onClick={() => handleViewSource(item)} />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => onExplainExtraction?.(item)}
                                className="inline-flex items-center ml-1.5 text-primary hover:text-primary/80 transition-colors"
                                aria-label="Explain how this value was extracted"
                              >
                                <Info className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Explain how this value was extracted</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* UW Summary Panel */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">UW Summary</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopySummary}
              className="h-7 text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy Summary
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-muted/50 rounded border border-border p-3">
            <pre className="text-[11px] font-mono whitespace-pre leading-[1.4] text-foreground/90">
{uwSummary}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
