import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface IIBData {
  label: string;
  value: string;
  mismatch?: boolean;
}

interface IIBTabProps {
  iibData?: IIBData[];
  hasExistingPolicies?: boolean;
  declaredNoPolicies?: boolean;
}

export const IIBTab = ({ iibData, hasExistingPolicies = true, declaredNoPolicies = false }: IIBTabProps) => {
  const showMismatchAlert = declaredNoPolicies && hasExistingPolicies;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">IIB - Insurance Information Bureau</CardTitle>
          {showMismatchAlert && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Mismatch Detected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showMismatchAlert && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-destructive">Declaration Mismatch</p>
                <p className="text-muted-foreground mt-1">
                  Applicant declared "No existing policies" but IIB records show active policies. Manual verification required.
                </p>
              </div>
            </div>
          </div>
        )}

        {iibData && iibData.length > 0 ? (
          <div className="space-y-3">
            {iibData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start py-2 border-b last:border-0">
                <span className="text-sm font-medium text-muted-foreground">{item.label}:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-right">{item.value}</span>
                  {item.mismatch && (
                    <Badge variant="destructive" className="text-[10px] h-4">
                      Mismatch
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">No Previous Policies Found</p>
            <p className="text-xs text-muted-foreground mt-1">IIB check complete - No records</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
