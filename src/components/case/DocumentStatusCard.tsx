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
    <div className="h-full flex flex-col border border-border rounded-lg bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Documents & OCR</h3>
          <Badge variant="outline" className="text-[10px]">
            {documents.length} files
          </Badge>
        </div>
      </div>

      {/* Primary Actions - Top */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 text-xs">
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            Upload Documents
          </Button>
          <Button variant="secondary" size="sm" className="flex-1 text-xs">
            <FolderDown className="h-3.5 w-3.5 mr-1.5" />
            Fetch from IDOC
          </Button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="p-4 space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-lg font-bold">{documents.length}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Processed</p>
          </div>
          
          <div className={`p-3 rounded-lg border ${missingDocuments.length > 0 ? 'bg-destructive/10 border-destructive/30' : 'bg-muted/50 border-border'}`}>
            <div className="flex items-center gap-2 mb-1">
              {missingDocuments.length > 0 ? (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
              <span className={`text-lg font-bold ${missingDocuments.length > 0 ? 'text-destructive' : ''}`}>
                {missingDocuments.length}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">Missing</p>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-lg font-bold ${getOcrColor(ocrLevel)}`}>
                {Math.round(avgOcrScore)}%
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">OCR Confidence</p>
          </div>
        </div>

        {/* Missing Documents - Clickable Pills */}
        {missingDocuments.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-destructive">Missing Documents:</p>
            <div className="flex flex-wrap gap-1.5">
              {missingDocuments.map((doc, idx) => (
                <Badge 
                  key={idx} 
                  variant="destructive" 
                  className="text-xs cursor-pointer hover:bg-destructive/90 transition-colors"
                  onClick={() => onSelectDocument(doc)}
                >
                  {doc}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Available Documents */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Available Documents:</p>
          <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
            {documents.map((doc, idx) => (
              <button
                key={idx}
                onClick={() => onSelectDocument(doc.name)}
                className="w-full text-left px-3 py-2.5 rounded-md text-xs bg-muted/30 hover:bg-muted border border-transparent hover:border-border transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                  <span className="truncate">{doc.name}</span>
                </div>
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-[10px] flex-shrink-0 ml-2">
                  View →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
