import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IIBTabProps {
  iibData?: { label: string; value: string }[];
}

export const IIBTab = ({ iibData }: IIBTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">IIB - Insurance Information Bureau</CardTitle>
      </CardHeader>
      <CardContent>
        {iibData && iibData.length > 0 ? (
          <div className="space-y-3">
            {iibData.map((item, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b last:border-0">
                <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No IIB data available</p>
        )}
      </CardContent>
    </Card>
  );
};
