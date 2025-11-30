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
    <div className="space-y-4">
      {/* Applicant Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Applicant Data</CardTitle>
            {caseData.drcScore && (
              <Badge variant="secondary">DRC: {caseData.drcScore}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <p className="font-medium">{caseData.applicantName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Age/Gender:</span>
              <p className="font-medium">{caseData.age}/{caseData.gender}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Education:</span>
              <p className="font-medium">{caseData.education}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Occupation:</span>
              <p className="font-medium">{caseData.occupation}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Sum Assured:</span>
              <p className="font-medium">{caseData.sumAssured}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Nominee:</span>
              <p className="font-medium">{caseData.nominee}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {caseData.financialInfo?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">• {item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {caseData.medicalInfo?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">• {item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* UW Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">UW Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm font-mono whitespace-pre-wrap leading-tight">
            {caseData.uwSummary}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};
