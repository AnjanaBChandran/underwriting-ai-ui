import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Clock, RefreshCw, Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { generateUWSummaryDoc } from "@/lib/generateUWSummaryDoc";

interface ViewSourceLink {
  text: string;
  docName: string;
  highlight?: {
    x: number;
    y: number;
    width: number;
    height: number;
    fieldName: string;
    value: string;
  };
}

interface UWSummaryNOVAProps {
  caseData: {
    id: string;
    policyNumber?: string;
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
    uwSummary?: string;
    financialInfo?: any[];
    medicalInfo?: any[];
    iib?: any[];
    iibData?: { label: string; value: string }[];
    documents?: any[];
    missingDocuments?: string[];
    createdDate?: string;
    updatedBy?: string;
    lastDocumentUpload?: Date;
  };
  criticalRisks?: number;
  currentUser?: { id: string; name: string };
  onAddAuditLog?: (log: any) => void;
  onViewSource?: (docName: string, highlight?: any) => void;
}

// View Source Link Component
const ViewSourceButton = ({ 
  docName, 
  highlight, 
  onViewSource 
}: { 
  docName: string; 
  highlight?: any; 
  onViewSource?: (docName: string, highlight?: any) => void;
}) => (
  <button
    onClick={() => onViewSource?.(docName, highlight)}
    className="inline-flex items-center gap-0.5 text-primary hover:text-primary/80 hover:underline transition-colors ml-1"
  >
    <ExternalLink className="h-3 w-3" />
    <span className="text-[10px]">View Source</span>
  </button>
);

export const UWSummaryNOVA = ({ 
  caseData, 
  criticalRisks = 0, 
  currentUser, 
  onAddAuditLog,
  onViewSource 
}: UWSummaryNOVAProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [lastTrigger, setLastTrigger] = useState<string>("Initial load");
  const [generatedAt, setGeneratedAt] = useState<Date>(new Date());

  // Calculate summary readiness
  const missingDocs = caseData.missingDocuments || [];
  const hasMissingDocs = missingDocs.length > 0;
  const hasCriticalRisks = criticalRisks > 0;
  const lastUpload = caseData.lastDocumentUpload || new Date(0);
  const summaryOutdated = lastUpload > generatedAt;
  
  const isReady = !hasMissingDocs && !hasCriticalRisks && !summaryOutdated;
  
  const getBlockingReasons = () => {
    const reasons: string[] = [];
    if (hasMissingDocs) {
      reasons.push(`Missing documents: ${missingDocs.join(', ')}`);
    }
    if (hasCriticalRisks) {
      reasons.push(`${criticalRisks} unresolved critical risk${criticalRisks > 1 ? 's' : ''}`);
    }
    if (summaryOutdated) {
      reasons.push('Summary outdated — regenerate after latest upload');
    }
    return reasons;
  };

  // Generate plain text for copy
  const getPlainTextSummary = () => {
    return `Policy No: ${caseData.policyNumber || caseData.id}

A. General Details
Advisor Level: LEV3A | Channel: DSF Individual Agent | Branch: Mira Road E
Blacklisted Reason: NIL
DRC/RSM Score: ${caseData.drcScore || 'STD'}
Policy Type: TERM
CIBIL Score: 759 | Income Estimator: >2.5 Cr

B. Premium / SAR Details
Total Premium: ${caseData.premium}
Sum Assured: ${caseData.sumAssured}
Financial SAR: ₹5 Cr
Medical SAR: ₹2.55 Cr
WOP/CCI Risk: Not Applicable

C. Life Assured Information
Major Life: ${caseData.age} / ${caseData.gender} / Married / Indian / ${caseData.education} / ${caseData.occupation} /
Business Owner / Annual Income ₹2.55 Cr
DOB Pattern: Normal
Country of Birth: India
PEP: No
Address: Mira Road, PIN XXXXX
Insurance History: NIL
Previous ABSLI History: NIL
Lifestyle History: NIL
Medical History: NIL
Family History: NIL
IAR Q8 answered 'Yes' – detailed explanation required.

D. Proposer Information
Life Assured and Proposer are same.

F. Nominee
Nominee: ${caseData.nominee} – relationship to be verified.

G. KYC
KYC Provided: Aadhaar & PAN
Live Photo: Yes
Photo Match with KYC: Yes

H. IAR
IAR Received: Yes
Adverse Information: Pending explanation for Q8

I. IIB Information
Total In-force Risk: ₹1.04 Cr
Lapsed / Paid-up Risk: NIL
Adverse IIB Information: NIL

L. Financials
ITR: Last 3 years available
Income Source: Business Income
Eligibility: Within limits

M. Medical Information
Required Tests: CBC, BSL, ECG, HbA1c
Received Tests: CBC, BSL, ECG
Adverse Findings: ECG – T wave changes
Video FMR: Smoking status requires verification

N. AML
Premium to Income Ratio: Within acceptable limits

O. Adverse Information Summary
• Nominee relationship requires verification
• IAR Q8 explanation pending
• ECG abnormality – medical review required

Decision:
Financial: Acceptable
Medical: Refer to CMO
AML: Justified`;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(getPlainTextSummary());
    toast({
      title: "Summary copied",
      description: "Ready to paste into NOVA",
    });
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setGeneratedAt(new Date());
    setLastTrigger("Manual user trigger");
    setIsRegenerating(false);
    toast({
      title: "Summary regenerated",
      description: "Updated with latest case data",
    });
  };

  const handleExportDoc = async () => {
    setIsExporting(true);
    try {
      const exportId = await generateUWSummaryDoc({
        caseData: {
          ...caseData,
          documents: caseData.documents,
          createdDate: caseData.createdDate,
          updatedBy: caseData.updatedBy,
          iib: caseData.iib,
          iibData: caseData.iibData,
        },
        userName: currentUser?.name || "Current User",
        starRating: 0,
        flags: [],
        caseUrl: window.location.href,
      });

      onAddAuditLog?.({
        timestamp: new Date().toISOString(),
        user: currentUser?.name || "Current User",
        action: "UW Summary exported",
        meta: {
          case_id: caseData.id,
          policy_no: caseData.policyNumber || caseData.id,
          export_id: exportId,
          format: "docx",
        },
        immutable: true,
      });

      toast({
        title: "Document exported",
        description: "UW Summary downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to generate document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getTimeAgo = () => {
    const diff = Date.now() - generatedAt.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins === 1) return "1 min ago";
    return `${mins} mins ago`;
  };

  // Section component with optional adverse styling
  const SummaryLine = ({ 
    children, 
    isAdverse, 
    viewSource 
  }: { 
    children: React.ReactNode; 
    isAdverse?: boolean;
    viewSource?: { docName: string; highlight?: any };
  }) => (
    <div className={`flex items-start gap-1 ${isAdverse ? 'text-amber-700 dark:text-amber-400' : ''}`}>
      <span className="flex-1">{children}</span>
      {viewSource && (
        <ViewSourceButton 
          docName={viewSource.docName} 
          highlight={viewSource.highlight}
          onViewSource={onViewSource}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            Generated {getTimeAgo()}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-[10px] text-muted-foreground/60 cursor-help">
                  ({lastTrigger})
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Last trigger reason</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="h-7 text-xs"
          >
            {isRegenerating ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3 mr-1" />
            )}
            Regenerate
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopySummary}
            className="h-7 text-xs"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy Summary
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportDoc}
                  disabled={isExporting}
                  className="h-7 w-7 p-0"
                >
                  {isExporting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Download detailed UW summary (.docx)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Structured Summary with View Source links */}
      <div className="bg-muted/50 rounded border border-border p-4 max-h-[400px] overflow-y-auto">
        <div className="text-xs font-mono space-y-4 text-foreground">
          {/* Header */}
          <div className="font-semibold text-sm">Policy No: {caseData.policyNumber || caseData.id}</div>

          {/* A. General Details */}
          <div className="space-y-1">
            <div className="font-semibold text-primary">A. General Details</div>
            <div>Advisor Level: LEV3A | Channel: DSF Individual Agent | Branch: Mira Road E</div>
            <div>Blacklisted Reason: NIL</div>
            <div>DRC/RSM Score: {caseData.drcScore || 'STD'}</div>
            <div>Policy Type: TERM</div>
            <div>CIBIL Score: 759 | Income Estimator: &gt;2.5 Cr</div>
          </div>

          {/* B. Premium / SAR Details */}
          <div className="space-y-1">
            <div className="font-semibold text-primary">B. Premium / SAR Details</div>
            <div>Total Premium: {caseData.premium}</div>
            <div>Sum Assured: {caseData.sumAssured}</div>
            <div>Financial SAR: ₹5 Cr</div>
            <div>Medical SAR: ₹2.55 Cr</div>
            <div>WOP/CCI Risk: Not Applicable</div>
          </div>

          {/* C. Life Assured Information */}
          <div className="space-y-1">
            <div className="font-semibold text-primary">C. Life Assured Information</div>
            <div>Major Life: {caseData.age} / {caseData.gender} / Married / Indian / {caseData.education} / {caseData.occupation} /</div>
            <div>Business Owner / Annual Income ₹2.55 Cr</div>
            <div>DOB Pattern: Normal</div>
            <div>Country of Birth: India</div>
            <div>PEP: No</div>
            <div>Address: Mira Road, PIN XXXXX</div>
            <div>Insurance History: NIL</div>
            <div>Previous ABSLI History: NIL</div>
            <div>Lifestyle History: NIL</div>
            <div>Medical History: NIL</div>
            <div>Family History: NIL</div>
            <SummaryLine 
              isAdverse 
              viewSource={{ 
                docName: "Identity Verification", 
                highlight: { x: 0.1, y: 0.6, width: 0.8, height: 0.08, fieldName: "IAR Q8", value: "Yes" } 
              }}
            >
              ❗ IAR Q8 answered &apos;Yes&apos; – detailed explanation required.
            </SummaryLine>
          </div>

          {/* D. Proposer Information */}
          <div className="space-y-1">
            <div className="font-semibold text-primary">D. Proposer Information</div>
            <div>Life Assured and Proposer are same.</div>
          </div>

          {/* F. Nominee */}
          <div className="space-y-1">
            <div className="font-semibold text-primary">F. Nominee</div>
            <SummaryLine 
              isAdverse 
              viewSource={{ 
                docName: "Identity Verification", 
                highlight: { x: 0.1, y: 0.35, width: 0.4, height: 0.05, fieldName: "Nominee", value: caseData.nominee || "Mother" } 
              }}
            >
              ❗ Nominee: {caseData.nominee || 'Mother'} – relationship to be verified.
            </SummaryLine>
          </div>

          {/* G. KYC */}
          <div className="space-y-1">
            <div className="font-semibold text-primary">G. KYC</div>
            <div>KYC Provided: Aadhaar &amp; PAN</div>
            <div>Live Photo: Yes</div>
            <div>Photo Match with KYC: Yes</div>
          </div>

          {/* H. IAR */}
          <div className="space-y-1">
            <div className="font-semibold text-primary">H. IAR</div>
            <div>IAR Received: Yes</div>
            <SummaryLine 
              isAdverse 
              viewSource={{ 
                docName: "Identity Verification", 
                highlight: { x: 0.1, y: 0.6, width: 0.8, height: 0.08, fieldName: "IAR Adverse", value: "Q8 Pending" } 
              }}
            >
              ❗ Adverse Information: Pending explanation for Q8
            </SummaryLine>
          </div>

          {/* I. IIB Information */}
          <div className="space-y-1">
            <div className="font-semibold text-primary">I. IIB Information</div>
            <div>Total In-force Risk: ₹1.04 Cr</div>
            <div>Lapsed / Paid-up Risk: NIL</div>
            <div>Adverse IIB Information: NIL</div>
          </div>

          {/* L. Financials */}
          <div className="space-y-1">
            <div className="font-semibold text-primary">L. Financials</div>
            <div>ITR: Last 3 years available</div>
            <div>Income Source: Business Income</div>
            <div>Eligibility: Within limits</div>
          </div>

          {/* M. Medical Information */}
          <div className="space-y-1">
            <div className="font-semibold text-primary">M. Medical Information</div>
            <div>Required Tests: CBC, BSL, ECG, HbA1c</div>
            <div>Received Tests: CBC, BSL, ECG</div>
            <SummaryLine 
              isAdverse 
              viewSource={{ 
                docName: "Medical Exam", 
                highlight: { x: 0.1, y: 0.45, width: 0.8, height: 0.1, fieldName: "ECG Finding", value: "T wave changes" } 
              }}
            >
              ❗ Adverse Findings: ECG – T wave changes
            </SummaryLine>
            <SummaryLine 
              isAdverse 
              viewSource={{ 
                docName: "Medical Exam", 
                highlight: { x: 0.1, y: 0.7, width: 0.6, height: 0.08, fieldName: "Smoking Status", value: "Requires verification" } 
              }}
            >
              ⚠ Video FMR: Smoking status requires verification
            </SummaryLine>
          </div>

          {/* N. AML */}
          <div className="space-y-1">
            <div className="font-semibold text-primary">N. AML</div>
            <div>Premium to Income Ratio: Within acceptable limits</div>
          </div>

          {/* O. Adverse Information Summary */}
          <div className="space-y-1 pt-2 border-t border-border">
            <div className="font-semibold text-destructive">O. Adverse Information Summary</div>
            <div className="space-y-1 pl-2">
              <SummaryLine 
                isAdverse 
                viewSource={{ 
                  docName: "Identity Verification", 
                  highlight: { x: 0.1, y: 0.35, width: 0.4, height: 0.05, fieldName: "Nominee", value: "Mother" } 
                }}
              >
                • Nominee relationship requires verification
              </SummaryLine>
              <SummaryLine 
                isAdverse 
                viewSource={{ 
                  docName: "Identity Verification", 
                  highlight: { x: 0.1, y: 0.6, width: 0.8, height: 0.08, fieldName: "IAR Q8", value: "Yes" } 
                }}
              >
                • IAR Q8 explanation pending
              </SummaryLine>
              <SummaryLine 
                isAdverse 
                viewSource={{ 
                  docName: "Medical Exam", 
                  highlight: { x: 0.1, y: 0.45, width: 0.8, height: 0.1, fieldName: "ECG", value: "T wave changes" } 
                }}
              >
                • ECG abnormality – medical review required
              </SummaryLine>
            </div>
          </div>

          {/* Decision */}
          <div className="space-y-1 pt-2 border-t border-border">
            <div className="font-semibold">Decision:</div>
            <div className="text-green-600 dark:text-green-400">Financial: Acceptable</div>
            <div className="text-amber-600 dark:text-amber-400">Medical: Refer to CMO</div>
            <div className="text-green-600 dark:text-green-400">AML: Justified</div>
          </div>
        </div>
      </div>

      {/* Summary Readiness Indicator */}
      <div className="flex justify-end pt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-default transition-colors ${
                  isReady
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                }`}
              >
                {isReady ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Summary ready for NOVA
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3.5 w-3.5" />
                    Summary incomplete — pending inputs
                  </>
                )}
              </div>
            </TooltipTrigger>
            {!isReady && (
              <TooltipContent side="top" align="end" className="max-w-xs">
                <div className="space-y-1">
                  <p className="text-xs font-medium">Blocking issues:</p>
                  <ul className="text-xs space-y-0.5">
                    {getBlockingReasons().map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-amber-500">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
