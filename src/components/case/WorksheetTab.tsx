import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Star, Info, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfidenceLevel } from "./ConfidenceIndicator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Compact confidence dot component
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

// Compact source link
const CompactSourceLink = ({ onClick, fieldName }: { onClick: () => void; fieldName: string }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-0.5 text-[10px] text-primary hover:text-primary/80 transition-colors"
    aria-label={`Open source document for ${fieldName}`}
  >
    <ExternalLink className="h-2 w-2" />
    <span>Source</span>
  </button>
);

// Compact info button
const CompactInfoButton = ({ onClick, fieldName }: { onClick: () => void; fieldName: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          aria-label={`Explain how ${fieldName} was extracted`}
        >
          <Info className="h-2.5 w-2.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">Explain extraction</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
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
    financialInfo?: ExtractedField[];
    medicalInfo?: ExtractedField[];
  };
  onViewSource?: (docName: string, highlight: any) => void;
  onExplainExtraction?: (field: ExtractedField) => void;
  onAddAuditLog?: (log: {
    timestamp: string;
    user: string;
    action: string;
    comment?: string;
    meta?: Record<string, any>;
    immutable?: boolean;
  }) => void;
  currentUser?: { id: string; name: string };
}

export const WorksheetTab = ({ caseData, onViewSource, onExplainExtraction, onAddAuditLog, currentUser }: WorksheetTabProps) => {
  const { toast } = useToast();
  const [starRating, setStarRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");

  const handleSubmitComment = async () => {
    // Validate
    if (!feedbackComment.trim()) {
      setCommentError("Please enter a comment to submit.");
      return;
    }
    setCommentError("");
    setIsSubmitting(true);

    // Simulate async save
    await new Promise(resolve => setTimeout(resolve, 800));

    // Save to audit log
    const auditEntry = {
      timestamp: new Date().toISOString(),
      user: currentUser?.name || "Current User",
      action: "Comment added",
      comment: feedbackComment.trim(),
      meta: {
        case_id: caseData.id,
        policy_no: caseData.policyNumber || caseData.id,
        actor_id: currentUser?.id || "user_001",
      },
      immutable: true,
    };

    onAddAuditLog?.(auditEntry);

    setIsSubmitting(false);
    setFeedbackComment("");
    
    toast({
      title: "Comment submitted.",
      duration: 3000,
    });
  };

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
          <div className="grid grid-cols-2 gap-x-6 text-xs">
            {/* Left Column */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Policy No:</span>
                <span className="font-semibold text-foreground">{caseData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age/Gender:</span>
                <span className="font-semibold text-foreground">{caseData.age}/{caseData.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Channel:</span>
                <span className="font-semibold text-foreground">{caseData.channel || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sum Assured:</span>
                <span className="font-semibold text-foreground">{caseData.sumAssured}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nominee:</span>
                <span className="font-semibold text-foreground">{caseData.nominee}</span>
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-semibold text-foreground">{caseData.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product:</span>
                <span className="font-semibold text-foreground">{caseData.product || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Occupation:</span>
                <span className="font-semibold text-foreground">{caseData.occupation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Premium:</span>
                <span className="font-semibold text-foreground">{caseData.premium}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information Panel */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {caseData.financialInfo?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-0.5 flex-wrap md:flex-nowrap gap-y-0.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground shrink-0">{item.label}:</span>
                  <span className="font-semibold truncate">
                    {item.value}
                    {item.value.toLowerCase().includes('pending') && <span className="text-destructive ml-1">❌</span>}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                  {item.confidence && (
                    <>
                      <ConfidenceDot percentage={item.confidencePercentage} />
                      <span className="text-border">|</span>
                    </>
                  )}
                  {item.sourceDoc && (
                    <>
                      <CompactSourceLink onClick={() => handleViewSource(item)} fieldName={item.label} />
                      <span className="text-border">|</span>
                      <CompactInfoButton onClick={() => onExplainExtraction?.(item)} fieldName={item.label} />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical Information Panel */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Medical Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {caseData.medicalInfo?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-0.5 flex-wrap md:flex-nowrap gap-y-0.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground shrink-0">{item.label}:</span>
                  <span className="font-semibold truncate">
                    {item.value}
                    {(item.label === "Medical History" && item.value !== "No significant conditions") && (
                      <span className="text-destructive ml-1">❌</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                  {item.confidence && (
                    <>
                      <ConfidenceDot percentage={item.confidencePercentage} />
                      <span className="text-border">|</span>
                    </>
                  )}
                  {item.sourceDoc && (
                    <>
                      <CompactSourceLink onClick={() => handleViewSource(item)} fieldName={item.label} />
                      <span className="text-border">|</span>
                      <CompactInfoButton onClick={() => onExplainExtraction?.(item)} fieldName={item.label} />
                    </>
                  )}
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
          <div className="bg-muted/50 rounded border border-border p-4 max-h-64 overflow-y-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap break-words leading-relaxed text-foreground">
{uwSummary}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary Feedback */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">AI Summary Feedback</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">How accurate was this AI Summary?</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setStarRating(star);
                    toast({
                      title: "Thanks! Feedback recorded.",
                    });
                  }}
                  className="text-lg transition-colors hover:scale-110"
                >
                  <Star 
                    className={`h-5 w-5 ${star <= starRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/40'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Issue Flag Buttons */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Flag an issue (optional):</p>
            <div className="flex flex-wrap gap-2">
              {['Missing Info', 'Incorrect Data', 'Formatting Issue'].map((issue) => (
                <Badge
                  key={issue}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary transition-colors text-xs px-3 py-1"
                  onClick={() => {
                    toast({
                      title: "Issue flagged. Thanks for your feedback.",
                    });
                  }}
                >
                  {issue}
                </Badge>
              ))}
            </div>
          </div>

          {/* Additional Comments */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Additional Comments (optional):</p>
            <Textarea
              placeholder="Write your comments here…"
              value={feedbackComment}
              onChange={(e) => {
                setFeedbackComment(e.target.value);
                if (commentError) setCommentError("");
              }}
              className={`w-full min-h-[90px] max-h-[110px] rounded-lg border-border hover:border-primary/50 transition-colors text-sm resize-none ${commentError ? 'border-destructive' : ''}`}
            />
            {commentError && (
              <p className="text-xs text-destructive">{commentError}</p>
            )}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={isSubmitting}
                size="sm"
                className="h-8 px-4 text-xs"
              >
                {isSubmitting && <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />}
                Submit comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
