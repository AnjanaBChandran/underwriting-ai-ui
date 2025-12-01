import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, User, Calendar, GraduationCap, Briefcase, DollarSign, Building, Activity, Heart, Cigarette, FileText, Link2, Info, AlertCircle, FileCheck, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfidenceLevel } from "./ConfidenceIndicator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

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
    priority?: "High" | "Medium" | "Low";
    missingDocuments?: string[];
    documents?: { quality?: "High" | "Medium" | "Low"; ocrConfidence?: "High" | "Medium" | "Low" }[];
  };
  onViewSource?: (docName: string, highlight: any) => void;
  onExplainExtraction?: (field: ExtractedField) => void;
}

// Helper component for confidence pill
const ConfidencePill = ({ level, percentage }: { level: ConfidenceLevel; percentage?: number }) => {
  const colorClass = level === "High" ? "bg-success/20 text-success border-success/30" :
                     level === "Medium" ? "bg-warning/20 text-warning border-warning/30" :
                     "bg-destructive/20 text-destructive border-destructive/30";
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${colorClass}`}>
            {percentage ? `${percentage}%` : level}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">AI extraction confidence: {level} {percentage ? `(${percentage}%)` : ""}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

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

  // Generate UW Summary as bullet list
  const generateSummary = () => {
    const sumAssuredShort = caseData.sumAssured
      .replace('₹', '')
      .replace(',', '')
      .replace('L', '')
      .replace('Cr', '');
    
    const sumLabel = caseData.sumAssured.includes('Cr') ? 'cr' : 'L';

    const bullets = [
      '• No potential match found',
      `• DRC: ${caseData.drcScore || 'Standard'}`,
      `• ${caseData.age}/${caseData.gender}, ${caseData.education}, ${caseData.occupation}, AI ${sumAssuredShort}${sumLabel}`,
    ];
    
    // Nominee check
    if (caseData.nominee?.toLowerCase() === 'mother') {
      bullets.push(`• Nominee: Mother ❌ mismatch`);
    } else {
      bullets.push(`• Nominee: ${caseData.nominee} ✔️`);
    }
    
    bullets.push('• KYC OK');
    
    // Medical checks
    const medicalInfo = caseData.medicalInfo || [];
    const smoking = medicalInfo.find(m => m.label === 'Smoking Status');
    if (smoking && smoking.value.toLowerCase().includes('non-smoker')) {
      bullets.push('• Non-smoker verified ✔️');
    }
    
    bullets.push('• IAR Q8 answered "Yes" — needs detailed explanation');
    bullets.push('• Signatures mismatch ❌');
    
    // Financial checks
    const financialInfo = caseData.financialInfo || [];
    const income = financialInfo.find(f => f.label === 'Annual Income');
    if (income && income.value.includes('Pending')) {
      bullets.push('• Income proof verification pending');
    }
    
    return bullets.join('\n');
  };

  const uwSummary = caseData.uwSummary || generateSummary();

  const handleCopySummary = () => {
    navigator.clipboard.writeText(uwSummary);
    toast({
      title: "Summary copied",
      description: "UW summary copied to clipboard",
    });
  };

  // Calculate quick flags
  const quickFlags = [];
  if (caseData.priority === "High") {
    quickFlags.push({ label: "High Priority", color: "destructive", icon: AlertCircle });
  }
  
  const avgQuality = caseData.documents?.reduce((acc, doc) => {
    const score = doc.quality === "High" ? 3 : doc.quality === "Medium" ? 2 : 1;
    return acc + score;
  }, 0) || 0;
  const avgQualityLevel = avgQuality / (caseData.documents?.length || 1);
  if (avgQualityLevel < 2.5) {
    quickFlags.push({ label: "Medium OCR Quality", color: "warning", icon: AlertTriangle });
  }
  
  if (caseData.missingDocuments && caseData.missingDocuments.length > 0) {
    quickFlags.push({ 
      label: `${caseData.missingDocuments.length} Missing Document${caseData.missingDocuments.length > 1 ? 's' : ''}`, 
      color: "warning", 
      icon: FileText 
    });
  }
  
  quickFlags.push({ label: "KYC OK", color: "success", icon: Shield });

  const getBMICategory = (bmi: string) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { label: "Underweight", color: "warning" };
    if (bmiValue < 25) return { label: "Normal", color: "success" };
    if (bmiValue < 30) return { label: "Overweight", color: "warning" };
    return { label: "Obese", color: "destructive" };
  };

  return (
    <div className="space-y-4">
      {/* Quick Flags Row */}
      <div className="flex flex-wrap gap-2">
        {quickFlags.map((flag, idx) => {
          const FlagIcon = flag.icon;
          const colorClass = flag.color === "destructive" ? "bg-destructive/10 text-destructive border-destructive/20" :
                            flag.color === "warning" ? "bg-warning/10 text-warning border-warning/20" :
                            "bg-success/10 text-success border-success/20";
          return (
            <div key={idx} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${colorClass}`}>
              <FlagIcon className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{flag.label}</span>
            </div>
          );
        })}
      </div>
      {/* Applicant Data Panel */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">Applicant Data</CardTitle>
            {caseData.drcScore && (
              <Badge variant="secondary" className="text-xs">
                {caseData.drcScore}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3.5 w-3.5 opacity-60" />
                  <span>Name</span>
                </div>
                <span className="font-semibold text-sm">{caseData.applicantName}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 opacity-60" />
                  <span>Age/Gender</span>
                </div>
                <span className="font-semibold text-sm">{caseData.age}/{caseData.gender}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5 opacity-60" />
                  <span>Education</span>
                </div>
                <span className="font-semibold text-sm">{caseData.education}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5 opacity-60" />
                  <span>Occupation</span>
                </div>
                <span className="font-semibold text-sm">{caseData.occupation}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-3.5 w-3.5 opacity-60" />
                  <span>Sum Assured</span>
                </div>
                <span className="font-semibold text-sm">{caseData.sumAssured}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3.5 w-3.5 opacity-60" />
                  <span>Nominee</span>
                </div>
                <span className="font-semibold text-sm">{caseData.nominee}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information Panel */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold">Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Income Section */}
            {caseData.financialInfo?.filter(f => f.label.includes("Income") || f.label.includes("Source")).length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Income</h4>
                <div className="space-y-3">
                  {caseData.financialInfo?.filter(f => f.label.includes("Income") || f.label.includes("Source")).map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between py-2 border-b border-border/40">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-3.5 w-3.5 opacity-60" />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{item.value}</span>
                          {item.confidence && (
                            <ConfidencePill level={item.confidence} percentage={item.confidencePercentage} />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.sourceDoc && (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => handleViewSource(item)}
                                      className="text-primary hover:text-primary/80 transition-colors"
                                      aria-label="Open source document"
                                    >
                                      <Link2 className="h-3 w-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Open source document</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => onExplainExtraction?.(item)}
                                      className="text-primary hover:text-primary/80 transition-colors"
                                      aria-label="Explain how this value was extracted"
                                    >
                                      <Info className="h-3 w-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Explain extraction</p>
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
                <Separator className="my-3" />
              </div>
            )}

            {/* Tax Section */}
            {caseData.financialInfo?.filter(f => f.label.includes("ITR") || f.label.includes("Tax")).length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Tax</h4>
                <div className="space-y-3">
                  {caseData.financialInfo?.filter(f => f.label.includes("ITR") || f.label.includes("Tax")).map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between py-2 border-b border-border/40">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-3.5 w-3.5 opacity-60" />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{item.value}</span>
                          {item.confidence && (
                            <ConfidencePill level={item.confidence} percentage={item.confidencePercentage} />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.sourceDoc && (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => handleViewSource(item)}
                                      className="text-primary hover:text-primary/80 transition-colors"
                                      aria-label="Open source document"
                                    >
                                      <Link2 className="h-3 w-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Open source document</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => onExplainExtraction?.(item)}
                                      className="text-primary hover:text-primary/80 transition-colors"
                                      aria-label="Explain how this value was extracted"
                                    >
                                      <Info className="h-3 w-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Explain extraction</p>
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
                <Separator className="my-3" />
              </div>
            )}

            {/* Assets Section */}
            {caseData.financialInfo?.filter(f => f.label.includes("Net Worth") || f.label.includes("Assets")).length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Assets</h4>
                <div className="space-y-3">
                  {caseData.financialInfo?.filter(f => f.label.includes("Net Worth") || f.label.includes("Assets")).map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between py-2 border-b border-border/40">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-3.5 w-3.5 opacity-60" />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{item.value}</span>
                          {item.confidence && (
                            <ConfidencePill level={item.confidence} percentage={item.confidencePercentage} />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.sourceDoc && (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => handleViewSource(item)}
                                      className="text-primary hover:text-primary/80 transition-colors"
                                      aria-label="Open source document"
                                    >
                                      <Link2 className="h-3 w-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Open source document</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => onExplainExtraction?.(item)}
                                      className="text-primary hover:text-primary/80 transition-colors"
                                      aria-label="Explain how this value was extracted"
                                    >
                                      <Info className="h-3 w-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Explain extraction</p>
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Medical Information Panel */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold">Medical Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {caseData.medicalInfo?.map((item, idx) => {
              const icon = item.label.includes("BMI") ? Activity :
                          item.label.includes("Blood Pressure") ? Heart :
                          item.label.includes("Smoking") ? Cigarette :
                          FileCheck;
              
              const IconComponent = icon;
              const bmiCategory = item.label === "BMI" ? getBMICategory(item.value.split(" ")[0]) : null;
              const isSmokingStatus = item.label === "Smoking Status";
              
              return (
                <div key={idx} className="flex items-start justify-between py-2 border-b border-border/40">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconComponent className="h-3.5 w-3.5 opacity-60" />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      {item.label === "BMI" && bmiCategory ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{item.value.split(" ")[0]}</span>
                          <Badge 
                            variant={bmiCategory.color === "success" ? "outline" : "secondary"}
                            className={`text-[10px] ${
                              bmiCategory.color === "success" 
                                ? "bg-success/10 text-success border-success/20" 
                                : bmiCategory.color === "warning"
                                ? "bg-warning/10 text-warning border-warning/20"
                                : "bg-destructive/10 text-destructive border-destructive/20"
                            }`}
                          >
                            {bmiCategory.label}
                          </Badge>
                        </div>
                      ) : isSmokingStatus ? (
                        <Badge 
                          variant="outline"
                          className="text-[11px] bg-success/10 text-success border-success/20 font-medium"
                        >
                          {item.value}
                        </Badge>
                      ) : (
                        <span className="font-semibold text-sm">{item.value}</span>
                      )}
                      {item.confidence && (
                        <ConfidencePill level={item.confidence} percentage={item.confidencePercentage} />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.sourceDoc && (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleViewSource(item)}
                                  className="text-primary hover:text-primary/80 transition-colors"
                                  aria-label="Open source document"
                                >
                                  <Link2 className="h-3 w-3" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Open source document</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => onExplainExtraction?.(item)}
                                  className="text-primary hover:text-primary/80 transition-colors"
                                  aria-label="Explain how this value was extracted"
                                >
                                  <Info className="h-3 w-3" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Explain extraction</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* UW Summary Panel */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">UW Summary</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopySummary}
              className="h-8 text-xs"
            >
              <Copy className="h-3 w-3 mr-1.5" />
              Copy Summary
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-muted/50 rounded border border-border p-4 max-h-64 overflow-y-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap break-words leading-relaxed text-foreground">
{uwSummary}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
