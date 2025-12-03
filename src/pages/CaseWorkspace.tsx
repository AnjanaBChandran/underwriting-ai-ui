import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { sampleCases, Case } from "@/data/sampleCases";
import { ArrowLeft, FileText, ClipboardList, Database, Clock, LogOut, Star } from "lucide-react";
import { DocumentViewer } from "@/components/case/DocumentViewer";
import { WorksheetTab } from "@/components/case/WorksheetTab";
import { IIBTab } from "@/components/case/IIBTab";
import { AuditLogsTab } from "@/components/case/AuditLogsTab";
import { ApproveDialog } from "@/components/case/ApproveDialog";
import { DeclineDialog } from "@/components/case/DeclineDialog";
import { RequestInfoDialog } from "@/components/case/RequestInfoDialog";
import { ExplainExtractionPanel } from "@/components/case/ExplainExtractionPanel";
import { useToast } from "@/hooks/use-toast";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const CaseWorkspace = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const documentSelectorRef = useRef<HTMLSelectElement>(null);
  
  const [currentCase, setCurrentCase] = useState<Case | undefined>(
    sampleCases.find((c) => c.id === caseId)
  );

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [requestInfoDialogOpen, setRequestInfoDialogOpen] = useState(false);
  const [explainPanelOpen, setExplainPanelOpen] = useState(false);
  const [explainField, setExplainField] = useState<any>(null);
  
  const [highlightedDoc, setHighlightedDoc] = useState<string | undefined>();
  const [highlight, setHighlight] = useState<any>();
  const [feedbackRating, setFeedbackRating] = useState(0);

  // Focus document selector on mount
  useEffect(() => {
    setTimeout(() => {
      documentSelectorRef.current?.focus();
    }, 100);
  }, []);

  const caseData = currentCase;

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Case not found</p>
      </div>
    );
  }

  const addAuditLog = (action: string, notes: string, extra?: any) => {
    if (!currentCase) return;

    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newLog = {
      timestamp,
      user: "Anjana",
      action: notes ? `${action} - ${notes}` : action,
      ...(extra && { extra })
    };

    setCurrentCase({
      ...currentCase,
      auditLogs: [newLog, ...(currentCase.auditLogs || [])]
    });
  };

  const handleFeedbackRating = (stars: number) => {
    setFeedbackRating(stars);
    addAuditLog("User Feedback", `${stars} stars`);
    toast({
      title: "Thanks! Feedback recorded.",
    });
  };

  const handleFeedbackFlag = (flag: string) => {
    addAuditLog("User Feedback", `Flagged: ${flag}`);
    toast({
      title: "Issue flagged. Thanks for your feedback.",
    });
  };

  const handleApprove = (notes: string) => {
    if (!currentCase) return;
    
    setCurrentCase({
      ...currentCase,
      status: "Approved"
    });
    
    addAuditLog("Approved", notes);
    
    toast({
      title: "Case approved",
      description: "The case has been successfully approved.",
    });
  };

  const handleDecline = (reason: string, comments: string) => {
    if (!currentCase) return;
    
    setCurrentCase({
      ...currentCase,
      status: "Declined"
    });
    
    const fullNote = comments ? `${reason} | ${comments}` : reason;
    addAuditLog("Declined", fullNote);
    
    toast({
      title: "Case declined",
      description: "The case has been declined.",
      variant: "destructive"
    });
  };

  const handleRequestInfo = (documents: string[], reason: string) => {
    if (!currentCase) return;
    
    setCurrentCase({
      ...currentCase,
      status: "Pending"
    });
    
    addAuditLog("Requested More Info", reason, { requestedDocuments: documents });
    
    toast({
      title: "Information request sent",
      description: "Additional information has been requested.",
    });
  };

  const handleViewSource = (docName: string, highlightData: any) => {
    setHighlightedDoc(docName);
    setHighlight(highlightData);
  };

  const handleClearHighlight = () => {
    setHighlight(undefined);
    setHighlightedDoc(undefined);
  };

  const handleExplainExtraction = (field: any) => {
    setExplainField(field);
    setExplainPanelOpen(true);
  };

  const handleExplainViewSource = (docName: string) => {
    if (explainField) {
      handleViewSource(
        explainField.sourceDoc,
        {
          fieldName: explainField.label,
          value: explainField.value,
          confidence: explainField.confidence || "Unknown",
          ...explainField.highlightLocation
        }
      );
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const getPriorityVariant = (priority: string): "destructive" | "default" | "secondary" => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "In Review":
        return "default";
      case "Approved":
        return "outline";
      case "Declined":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b bg-card shrink-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/cases")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-lg font-bold">{caseData.id}</h1>
                <p className="text-sm text-muted-foreground">{caseData.applicantName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden md:inline">
                {getGreeting()}, Anjana
              </span>
              <Badge 
                variant={getPriorityVariant(caseData.priority)}
                className="font-medium"
              >
                {caseData.priority} Priority
              </Badge>
              <Badge 
                variant={getStatusVariant(caseData.status)}
                className={`font-medium ${
                  caseData.status === "Approved" 
                    ? "bg-success/10 text-success border-success/20 hover:bg-success/20" 
                    : ""
                }`}
              >
                {caseData.status}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                aria-label="Logout and return to sign in"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup 
          direction="horizontal" 
          className="h-full"
          onLayout={(sizes) => {
            // Optional: persist layout to localStorage
          }}
        >
          {/* Left Panel - Document Viewer */}
          <ResizablePanel defaultSize={50} minSize={25}>
            <div className="h-full overflow-y-auto p-6">
              <DocumentViewer 
                documents={caseData.documents || []} 
                selectedDocName={highlightedDoc}
                highlight={highlight}
                onClearHighlight={handleClearHighlight}
                missingDocuments={caseData.missingDocuments}
                selectorRef={documentSelectorRef}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle 
            withHandle 
            className="w-2 bg-border/50 hover:bg-border transition-colors data-[resize-handle-active]:bg-primary/50"
          />

          {/* Right Panel - Tabs */}
          <ResizablePanel defaultSize={50} minSize={25}>
            <div className="h-full flex flex-col overflow-hidden">
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-6 pb-40">
                <Tabs defaultValue="worksheet" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="worksheet">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Worksheet
                    </TabsTrigger>
                    <TabsTrigger value="iib">
                      <Database className="h-4 w-4 mr-2" />
                      IIB
                    </TabsTrigger>
                    <TabsTrigger value="audit">
                      <Clock className="h-4 w-4 mr-2" />
                      Audit Logs
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="worksheet">
                    <WorksheetTab 
                      caseData={caseData} 
                      onViewSource={handleViewSource}
                      onExplainExtraction={handleExplainExtraction}
                    />
                  </TabsContent>

                  <TabsContent value="iib">
                    <IIBTab iibData={caseData.iibData} />
                  </TabsContent>

                  <TabsContent value="audit">
                    <AuditLogsTab auditLogs={caseData.auditLogs} caseData={caseData} />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Fixed Bottom Action Bar */}
              <div className="shrink-0 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 p-4">
                {/* Feedback Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">How accurate was this AI summary?</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleFeedbackRating(star)}
                            className="p-0.5 hover:scale-110 transition-transform"
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star 
                              className={`h-4 w-4 ${star <= feedbackRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/40 hover:text-muted-foreground'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {['Missing Info', 'Incorrect Data', 'Formatting Issue'].map((flag) => (
                        <Button
                          key={flag}
                          variant="outline"
                          size="sm"
                          onClick={() => handleFeedbackFlag(flag)}
                          className="h-7 text-xs px-2"
                        >
                          {flag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-center gap-3">
                  <Button 
                    variant="destructive"
                    onClick={() => setDeclineDialogOpen(true)}
                    className="min-w-[140px]"
                  >
                    Decline
                  </Button>
                  <Button 
                    onClick={() => setApproveDialogOpen(true)}
                    className="min-w-[140px] bg-primary hover:bg-primary/90"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile fallback - stacked layout */}
      <style>{`
        @media (max-width: 768px) {
          [data-panel-group-direction="horizontal"] {
            flex-direction: column !important;
          }
          [data-panel-group-direction="horizontal"] > [data-panel] {
            width: 100% !important;
            height: auto !important;
            min-height: 50vh;
          }
          [data-panel-group-direction="horizontal"] > [data-resize-handle] {
            display: none;
          }
        }
      `}</style>

      {/* Dialogs */}
      <ApproveDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        onConfirm={handleApprove}
      />
      <DeclineDialog
        open={declineDialogOpen}
        onOpenChange={setDeclineDialogOpen}
        onConfirm={handleDecline}
      />
      <RequestInfoDialog
        open={requestInfoDialogOpen}
        onOpenChange={setRequestInfoDialogOpen}
        onConfirm={handleRequestInfo}
      />

      <ExplainExtractionPanel
        isOpen={explainPanelOpen}
        onClose={() => setExplainPanelOpen(false)}
        fieldName={explainField?.label || ""}
        value={explainField?.value || ""}
        confidence={explainField?.confidence || "Unknown"}
        sourceDocs={explainField?.sourceDocs || []}
        evidenceSnippets={explainField?.evidenceSnippets || []}
        rationale={explainField?.rationale}
        onViewSource={handleExplainViewSource}
      />
    </div>
  );
};

export default CaseWorkspace;