import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    financialInfo?: { label: string; value: string }[];
    medicalInfo?: { label: string; value: string }[];
  };
}

export const WorksheetTab = ({ caseData }: WorksheetTabProps) => {
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
              <div key={idx} className="flex justify-between items-center">
                <span className="text-muted-foreground">{item.label}:</span>
                <span className="font-medium flex items-center gap-1">
                  {item.value}
                  {item.value.toLowerCase().includes('pending') && (
                    <span className="text-destructive">❌</span>
                  )}
                </span>
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
              <div key={idx} className="flex justify-between items-center">
                <span className="text-muted-foreground">{item.label}:</span>
                <span className="font-medium flex items-center gap-1">
                  {item.value}
                  {(item.label === "Medical History" && item.value !== "No significant conditions") && (
                    <span className="text-destructive">❌</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* UW Summary Panel */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">UW Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-foreground">
{caseData.uwSummary}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};
