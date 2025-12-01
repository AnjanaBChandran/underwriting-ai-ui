import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface Document {
  name: string;
  uploadDate: string;
  path?: string;
  quality?: "High" | "Medium" | "Low";
  ocrConfidence?: "High" | "Medium" | "Low";
  ocrScore?: number;
}

interface DocumentMetadataPanelProps {
  document?: Document;
  detectedFields?: number;
  missingFields?: number;
  showHighlights: boolean;
  onToggleHighlights: () => void;
  onViewSource?: () => void;
}

export const DocumentMetadataPanel = ({
  document,
  detectedFields = 0,
  missingFields = 0,
  showHighlights,
  onToggleHighlights,
  onViewSource
}: DocumentMetadataPanelProps) => {
  const getQualityColor = (quality?: string) => {
    switch (quality) {
      case "High": return "text-green-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  const getQualityDot = (quality?: string) => {
    switch (quality) {
      case "High": return "🟢";
      case "Medium": return "🟡";
      case "Low": return "🔴";
      default: return "⚪";
    }
  };

  if (!document) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Select a document to view metadata
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-3 p-4">
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold">Document Quality</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Scan Quality:</span>
              <div className="flex items-center gap-1">
                <span className={getQualityColor(document.quality)}>
                  {getQualityDot(document.quality)} {document.quality || "Unknown"}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">OCR Confidence:</span>
              <div className="flex items-center gap-1">
                <span className={getQualityColor(document.ocrConfidence)}>
                  {getQualityDot(document.ocrConfidence)} {document.ocrConfidence || "Unknown"}
                </span>
                {document.ocrScore && (
                  <span className="text-muted-foreground">({document.ocrScore}%)</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold">Field Detection</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Detected Fields:</span>
              <Badge variant="secondary" className="text-xs">
                {detectedFields}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Missing Fields:</span>
              <Badge variant={missingFields > 0 ? "destructive" : "secondary"} className="text-xs">
                {missingFields}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold">Controls</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleHighlights}
            className="w-full h-8 text-xs"
          >
            {showHighlights ? (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Hide Highlights
              </>
            ) : (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Show Highlights
              </>
            )}
          </Button>
          {onViewSource && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewSource}
              className="w-full h-8 text-xs"
            >
              View Source Location
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold">Upload Info</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-muted-foreground">
            Uploaded: {document.uploadDate}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
