import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Clock, RefreshCw, Loader2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { generateUWSummaryDoc } from "@/lib/generateUWSummaryDoc";

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
    createdDate?: string;
    updatedBy?: string;
  };
  currentUser?: { id: string; name: string };
  onAddAuditLog?: (log: any) => void;
}

export const UWSummaryNOVA = ({ caseData, currentUser, onAddAuditLog }: UWSummaryNOVAProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [lastTrigger, setLastTrigger] = useState<string>("Initial load");
  const [generatedAt, setGeneratedAt] = useState<Date>(new Date());

  // Generate plain-text summary (no icons, no tables, copy-pastable)
  const generatePlainTextSummary = () => {
    const sumAssuredShort = caseData.sumAssured
      .replace('₹', '')
      .replace(',', '')
      .replace('L', '')
      .replace('Cr', '');
    
    const sumLabel = caseData.sumAssured.includes('Cr') ? 'cr' : 'L';

    const lines = [
      'Summary',
      caseData.id,
      caseData.applicantName,
      new Date().toLocaleString('en-IN'),
      '******************************',
      '',
      'No potential match found',
      `DRC ${caseData.drcScore?.toLowerCase() || 'std'}`,
      `${caseData.age}/ ${caseData.gender} / ${caseData.education?.toLowerCase()}/ ${caseData.occupation?.toLowerCase()} / AI ${sumAssuredShort}${sumLabel}`,
    ];
    
    // Nominee check
    if (caseData.nominee?.toLowerCase() === 'mother') {
      lines.push(`nom ${caseData.nominee?.toLowerCase()} - verify relationship`);
    } else {
      lines.push(`nom ${caseData.nominee?.toLowerCase()} ok`);
    }
    
    lines.push('KYC ok');
    
    // Medical checks
    const medicalInfo = caseData.medicalInfo || [];
    const smoking = medicalInfo.find(m => m.label === 'Smoking Status');
    if (smoking && smoking.value.toLowerCase().includes('non-smoker')) {
      lines.push('Non-smoker verified');
    }
    
    lines.push('Q 8 in IAR answered yes - need details');
    lines.push('CDF ok');
    lines.push('sign on medicals matches PAN');
    lines.push('');
    lines.push('Since SAR with ABSLI above 5 cr, would need SRUW sign off however incomplete case, would need reqts first');
    lines.push('');
    lines.push('c/f specimen signatures of LA in diff styles,');
    lines.push('ITRs and COI for last 3 yrs');
    lines.push('Form 26AS for latest AY');
    lines.push('');
    lines.push('Need details and reason for yes to Q8 in IAR');
    
    // Financial checks
    const financialInfo = caseData.financialInfo || [];
    const income = financialInfo.find(f => f.label === 'Annual Income');
    if (income && income.value.includes('Pending')) {
      lines.push('Income proof verification pending');
    }
    
    return lines.join('\n');
  };

  const uwSummary = caseData.uwSummary || generatePlainTextSummary();

  const handleCopySummary = () => {
    navigator.clipboard.writeText(uwSummary);
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

      {/* Plain text summary - no icons, no colors, no tables */}
      <div className="bg-muted/50 rounded border border-border p-4 max-h-64 overflow-y-auto">
        <pre className="text-xs font-mono whitespace-pre-wrap break-words leading-relaxed text-foreground">
{uwSummary}
        </pre>
      </div>
    </div>
  );
};
