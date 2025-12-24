import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Upload, FolderDown } from "lucide-react";

interface Document {
  name: string;
  uploadDate: string;
  path?: string;
  quality?: "High" | "Medium" | "Low";
  ocrConfidence?: "High" | "Medium" | "Low";
  ocrScore?: number;
}

interface DocumentStatusCardProps {
  documents: Document[];
  missingDocuments?: string[];
  onSelectDocument: (docName: string) => void;
}

export const DocumentStatusCard = ({ 
  documents, 
  missingDocuments = [],
  onSelectDocument 
}: DocumentStatusCardProps) => {
  // Calculate OCR confidence
  const avgOcrScore = documents.reduce((acc, doc) => acc + (doc.ocrScore || 0), 0) / documents.length;
  const ocrLevel = avgOcrScore >= 80 ? "High" : avgOcrScore >= 60 ? "Medium" : "Low";
  
  const getOcrColor = (level: string) => {
    switch (level) {
      case "High": return "text-green-600";
      case "Medium": return "text-amber-600";
      case "Low": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="h-full flex flex-col border border-border rounded-lg bg-muted/30">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <h3 className="text-sm font-semibold">Documents & OCR</h3>
      </div>

      {/* Status Card */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-center">Document Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-lg font-bold">{documents.length}</p>
                  <p className="text-xs text-muted-foreground">Documents processed</p>
                </div>
              </div>
              
              {missingDocuments.length > 0 ? (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="text-lg font-bold text-destructive">{missingDocuments.length}</p>
                    <p className="text-xs text-muted-foreground">Missing</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-lg font-bold">0</p>
                    <p className="text-xs text-muted-foreground">Missing</p>
                  </div>
                </div>
              )}
            </div>

            {/* OCR Confidence */}
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
              <span className="text-xs text-muted-foreground">OCR Confidence:</span>
              <span className={`text-sm font-semibold ${getOcrColor(ocrLevel)}`}>
                {ocrLevel} ({Math.round(avgOcrScore)}%)
              </span>
            </div>

            {/* Missing Documents */}
            {missingDocuments.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Missing documents:</p>
                <div className="flex flex-wrap gap-1">
                  {missingDocuments.map((doc, idx) => (
                    <Badge key={idx} variant="destructive" className="text-xs">
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Document List */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Available documents:</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {documents.map((doc, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectDocument(doc.name)}
                    className="w-full text-left px-3 py-2 rounded-md text-xs hover:bg-muted transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate">{doc.name}</span>
                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">
                      View →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <Upload className="h-3 w-3 mr-1.5" />
                Upload Documents
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <FolderDown className="h-3 w-3 mr-1.5" />
                Fetch from IDOC
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
