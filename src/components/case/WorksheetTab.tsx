import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Info, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfidenceLevel } from "./ConfidenceIndicator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UWSummaryNOVA } from "./UWSummaryNOVA";
import { UWAnalysisTab } from "./UWAnalysisTab";

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

interface IIBEntry {
  policy_no: string;
  company: string;
  sum_assured: string;
  match_status: string;
  reason: string;
  effective_date: string;
  product_type: string;
  medical_flag: string;
  standard_life: string;
  reason_decline: string;
  reason_postpone: string;
  reason_repudiation: string;
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
    iib?: IIBEntry[];
    iibData?: { label: string; value: string }[];
    documents?: any[];
    createdDate?: string;
    updatedBy?: string;
    missingDocuments?: string[];
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
  const [feedbackFlags, setFeedbackFlags] = useState<string[]>([]);

  // Determine case type based on product
  const getCaseType = (): "term-medical" | "non-term-non-medical" | "non-medical" => {
    const product = caseData.product?.toLowerCase() || "";
    if (product.includes("term")) return "term-medical";
    if (product.includes("endowment") || product.includes("ulip")) return "non-term-non-medical";
    return "non-medical";
  };

  const caseType = getCaseType();

  const handleSubmitComment = async () => {
    if (!feedbackComment.trim()) {
      setCommentError("Please enter a comment to submit.");
      return;
    }
    setCommentError("");
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 800));

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

  const handleViewSourceFromAnalysis = (docName: string, highlight?: any) => {
    onViewSource?.(docName, highlight || {});
  };

  return (
    <div className="space-y-4">
      {/* Sub-tabs: UW Summary (NOVA) and UW Analysis */}
      <Tabs defaultValue="nova-summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nova-summary" className="text-xs">
            UW Summary (NOVA)
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs">
            UW Analysis
          </TabsTrigger>
        </TabsList>

        {/* UW Summary (NOVA) Tab - Plain text, copy-pastable */}
        <TabsContent value="nova-summary" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">UW Summary (NOVA)</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <UWSummaryNOVA 
                caseData={caseData}
                currentUser={currentUser}
                onAddAuditLog={onAddAuditLog}
              />
            </CardContent>
          </Card>

          {/* AI Summary Feedback - Only in NOVA tab */}
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
                        toast({ title: "Thanks! Feedback recorded." });
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
                      variant={feedbackFlags.includes(issue) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors text-xs px-3 py-1 ${
                        feedbackFlags.includes(issue) ? '' : 'hover:bg-secondary'
                      }`}
                      onClick={() => {
                        setFeedbackFlags((prev) =>
                          prev.includes(issue)
                            ? prev.filter((f) => f !== issue)
                            : [...prev, issue]
                        );
                        toast({
                          title: feedbackFlags.includes(issue) ? "Flag removed." : "Issue flagged. Thanks for your feedback.",
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
                  className={`w-full min-h-[80px] max-h-[100px] rounded-lg border-border hover:border-primary/50 transition-colors text-sm resize-none ${commentError ? 'border-destructive' : ''}`}
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
        </TabsContent>

        {/* UW Analysis Tab - Structured with icons, highlights, confidence */}
        <TabsContent value="analysis">
          <UWAnalysisTab 
            caseData={caseData}
            caseType={caseType}
            onViewSource={handleViewSourceFromAnalysis}
            onExplainExtraction={onExplainExtraction}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
