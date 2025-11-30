import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleCases } from "@/data/sampleCases";
import { ArrowLeft, FileText, Brain, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen bg-background">
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
            <Badge variant={getPriorityVariant(caseData.priority)}>
              {caseData.priority} Priority
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Sum Assured</CardDescription>
              <CardTitle className="text-2xl">{caseData.sumAssured}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Premium</CardDescription>
              <CardTitle className="text-2xl">{caseData.premium}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Status</CardDescription>
              <CardTitle className="text-2xl">{caseData.status}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList>
            <TabsTrigger value="summary">
              <Brain className="h-4 w-4 mr-2" />
              AI Summary
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="risks">
              <AlertCircle className="h-4 w-4 mr-2" />
              Risk Assessment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Summary</CardTitle>
                <CardDescription>
                  Automated analysis of applicant documents and risk factors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Applicant Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    {caseData.applicantName} is a 42-year-old professional seeking life insurance coverage
                    of {caseData.sumAssured}. Medical examination shows good overall health with no
                    significant pre-existing conditions.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Key Findings</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>BMI within normal range (23.5)</li>
                    <li>Non-smoker for 10+ years</li>
                    <li>Regular exercise routine documented</li>
                    <li>No family history of major hereditary conditions</li>
                    <li>Stable employment history</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Recommendation</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on the AI analysis, this application presents a{" "}
                    <span className="font-semibold text-success">low to medium risk profile</span>.
                    Standard premium rates are appropriate for this applicant.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Submitted Documents</CardTitle>
                <CardDescription>Review all documents uploaded by the applicant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Medical Examination Report</p>
                        <p className="text-sm text-muted-foreground">Uploaded on 2024-11-25</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Financial Statements</p>
                        <p className="text-sm text-muted-foreground">Uploaded on 2024-11-24</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Identity Verification</p>
                        <p className="text-sm text-muted-foreground">Uploaded on 2024-11-24</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>AI-powered risk analysis and scoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Risk Score</span>
                    <Badge>Low Risk</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Health Risk</span>
                    <Badge variant="secondary">Minimal</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Financial Stability</span>
                    <Badge variant="secondary">Strong</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Lifestyle Risk</span>
                    <Badge variant="secondary">Low</Badge>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Risk Factors</h3>
                  <p className="text-sm text-muted-foreground">
                    No significant risk factors identified. All standard underwriting criteria met.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline">Request More Info</Button>
          <Button variant="destructive">Decline</Button>
          <Button>Approve</Button>
        </div>
      </main>
    </div>
  );
};

export default CaseWorkspace;
