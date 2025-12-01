import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { sampleCases, Case } from "@/data/sampleCases";
import { ArrowLeft, FileText, ClipboardList, Database, Clock } from "lucide-react";
import { DocumentViewer } from "@/components/case/DocumentViewer";
import { WorksheetTab } from "@/components/case/WorksheetTab";
import { IIBTab } from "@/components/case/IIBTab";
import { AuditLogsTab } from "@/components/case/AuditLogsTab";
import { ApproveDialog } from "@/components/case/ApproveDialog";
import { DeclineDialog } from "@/components/case/DeclineDialog";
import { RequestInfoDialog } from "@/components/case/RequestInfoDialog";
import { useToast } from "@/hooks/use-toast";

const CaseWorkspace = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentCase, setCurrentCase] = useState<Case | undefined>(
    sampleCases.find((c) => c.id === caseId)
  );

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [requestInfoDialogOpen, setRequestInfoDialogOpen] = useState(false);
  
  const [highlightedDoc, setHighlightedDoc] = useState<string | undefined>();
  const [highlight, setHighlight] = useState<any>();

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
      user: "DemoUnderwriter",
      action: notes ? `${action} - ${notes}` : action,
      ...(extra && { extra })
    };

    setCurrentCase({
      ...currentCase,
      auditLogs: [newLog, ...(currentCase.auditLogs || [])]
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
  };

  const getPriorityVariant = (priority: string) => {
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/cases")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">{caseData.id}</h1>
                <p className="text-sm text-muted-foreground">{caseData.applicantName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={getPriorityVariant(caseData.priority)}>
                {caseData.priority} Priority
              </Badge>
              <span className="text-sm text-muted-foreground">{caseData.status}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Document Viewer */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full p-6">
              <DocumentViewer 
                documents={caseData.documents || []} 
                selectedDocName={highlightedDoc}
                highlight={highlight}
                onClearHighlight={handleClearHighlight}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Tabs */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="h-full overflow-auto p-6 pb-24">
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
                  <WorksheetTab caseData={caseData} onViewSource={handleViewSource} />
                </TabsContent>

                <TabsContent value="iib">
                  <IIBTab iibData={caseData.iibData} />
                </TabsContent>

                <TabsContent value="audit">
                  <AuditLogsTab auditLogs={caseData.auditLogs} caseData={caseData} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sticky Footer Bar */}
            <div className="fixed bottom-0 right-0 left-0 md:left-auto md:right-0 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 z-50">
              <div className="container mx-auto px-6 py-3 flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setRequestInfoDialogOpen(true)}
                >
                  Request More Info
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => setDeclineDialogOpen(true)}
                >
                  Decline
                </Button>
                <Button onClick={() => setApproveDialogOpen(true)}>
                  Approve
                </Button>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

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
    </div>
  );
};

export default CaseWorkspace;
