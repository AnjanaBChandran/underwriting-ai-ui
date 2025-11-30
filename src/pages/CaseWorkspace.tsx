import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { sampleCases } from "@/data/sampleCases";
import { ArrowLeft, FileText, ClipboardList, Database, Clock } from "lucide-react";
import { DocumentViewer } from "@/components/case/DocumentViewer";
import { WorksheetTab } from "@/components/case/WorksheetTab";
import { IIBTab } from "@/components/case/IIBTab";
import { AuditLogsTab } from "@/components/case/AuditLogsTab";

const CaseWorkspace = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  
  const caseData = sampleCases.find((c) => c.id === caseId);

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Case not found</p>
      </div>
    );
  }

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

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Document Viewer */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="h-full p-6">
            <DocumentViewer documents={caseData.documents || []} />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Tabs */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full p-6 overflow-auto">
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
                <WorksheetTab caseData={caseData} />
              </TabsContent>

              <TabsContent value="iib">
                <IIBTab iibData={caseData.iibData} />
              </TabsContent>

              <TabsContent value="audit">
                <AuditLogsTab auditLogs={caseData.auditLogs} />
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline">Request More Info</Button>
              <Button variant="destructive">Decline</Button>
              <Button>Approve</Button>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CaseWorkspace;
