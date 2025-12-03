import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, ExternalLink, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Document {
  name: string;
  uploadDate: string;
  path?: string;
  quality?: "High" | "Medium" | "Low";
  ocrConfidence?: "High" | "Medium" | "Low";
  ocrScore?: number;
}

interface Highlight {
  fieldName: string;
  value: string;
  confidence: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DocumentViewerProps {
  documents: Document[];
  selectedDocName?: string;
  highlight?: Highlight;
  onClearHighlight?: () => void;
  missingDocuments?: string[];
  selectorRef?: React.RefObject<HTMLSelectElement>;
}

export const DocumentViewer = ({ 
  documents, 
  selectedDocName, 
  highlight,
  onClearHighlight,
  missingDocuments = [],
  selectorRef
}: DocumentViewerProps) => {
  const [selectedDoc, setSelectedDoc] = useState(documents[0]?.name || "");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Update selected doc when prop changes
  useEffect(() => {
    if (selectedDocName) {
      setSelectedDoc(selectedDocName);
    }
  }, [selectedDocName]);

  // Scroll to highlight when it changes
  useEffect(() => {
    if (highlight && scrollAreaRef.current && imageRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        // Calculate scroll position to show highlight in top half of viewport
        const scrollTop = highlight.y * imageRef.current.height - 100;
        scrollContainer.scrollTop = Math.max(0, scrollTop);
      }
    }
  }, [highlight]);

  const currentDocument = documents.find(doc => doc.name === selectedDoc);
  const documentPath = currentDocument?.path;

  const getQualityColor = (quality?: string) => {
    switch (quality) {
      case "High": return "text-green-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-red-600";
      default: return "text-gray-500";
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

  // Calculate document health
  const avgQuality = documents.reduce((acc, doc) => {
    const score = doc.quality === "High" ? 3 : doc.quality === "Medium" ? 2 : doc.quality === "Low" ? 1 : 0;
    return acc + score;
  }, 0) / documents.length;
  
  const avgOCR = documents.reduce((acc, doc) => {
    const score = doc.ocrConfidence === "High" ? 3 : doc.ocrConfidence === "Medium" ? 2 : doc.ocrConfidence === "Low" ? 1 : 0;
    return acc + score;
  }, 0) / documents.length;

  const overallQuality = avgQuality >= 2.5 ? "High" : avgQuality >= 1.5 ? "Medium" : "Low";
  const overallOCR = avgOCR >= 2.5 ? "High" : avgOCR >= 1.5 ? "Medium" : "Low";

  const handleOpenInNewTab = () => {
    if (documentPath) {
      window.open(documentPath, '_blank');
    }
  };

  return (
    <div className="h-full flex flex-col border border-border rounded-lg bg-muted/30">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-semibold">Document Viewer</h3>
            {missingDocuments.length > 0 && (
              <div className="flex gap-1">
                {missingDocuments.map((doc, idx) => (
                  <Badge key={idx} variant="destructive" className="text-[10px] h-5">
                    Missing: {doc}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {highlight && onClearHighlight && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHighlight}
              className="h-6 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear highlight
            </Button>
          )}
        </div>
        
        {/* Document Health Banner */}
        <div className="mb-3 p-2 rounded-md bg-muted/50 border border-border">
          <div className="flex items-center gap-4 text-[10px]">
            <span className="font-semibold text-muted-foreground">Document Health:</span>
            <span className={getQualityColor(overallQuality)}>
              {getQualityDot(overallQuality)} Quality: {overallQuality}
            </span>
            <span className={getQualityColor(overallOCR)}>
              {getQualityDot(overallOCR)} OCR: {overallOCR}
            </span>
            {missingDocuments.length > 0 && (
              <Badge variant="destructive" className="text-[10px] h-4">
                Missing Documents: {missingDocuments.length}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={selectedDoc} onValueChange={setSelectedDoc}>
            <SelectTrigger className="bg-background flex-1" ref={selectorRef as any}>
              <SelectValue placeholder="Select document" />
            </SelectTrigger>
            <SelectContent>
              {documents.map((doc) => {
                const isLowQuality = doc.quality === "Low" || doc.ocrConfidence === "Low";
                return (
                  <SelectItem key={doc.name} value={doc.name}>
                    <div className="flex items-center gap-2">
                      {isLowQuality && <span className="text-red-600">❗</span>}
                      <span>{doc.name}</span>
                      {doc.quality && (
                        <span className={`text-[10px] ${getQualityColor(doc.quality)}`}>
                          — Quality: {doc.quality}
                        </span>
                      )}
                      {doc.ocrConfidence && (
                        <span className={`text-[10px] ${getQualityColor(doc.ocrConfidence)}`}>
                          OCR: {doc.ocrConfidence}
                          {doc.ocrScore && ` (${doc.ocrScore}%)`}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleOpenInNewTab}
            disabled={!documentPath}
            title="Open in New Tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Document Preview Area */}
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4">
          {documentPath ? (
            <div className="bg-background border border-border rounded-lg overflow-hidden relative">
              <img 
                ref={imageRef}
                src={documentPath} 
                alt={selectedDoc}
                className="w-full h-auto"
              />
              {highlight && (
                <div
                  className="absolute border-2 border-yellow-400 bg-yellow-400/20 pointer-events-none"
                  style={{
                    left: `${highlight.x * 100}%`,
                    top: `${highlight.y * 100}%`,
                    width: `${highlight.width * 100}%`,
                    height: `${highlight.height * 100}%`,
                  }}
                >
                  <div className="absolute -top-6 left-0 right-0 flex justify-center">
                    <Badge 
                      variant="secondary" 
                      className="text-[10px] bg-yellow-100 text-yellow-900 border-yellow-400 shadow-sm whitespace-nowrap"
                    >
                      AI extracted: {highlight.fieldName} = {highlight.value} (confidence: {highlight.confidence})
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[600px] border border-border rounded bg-background flex flex-col items-center justify-center text-muted-foreground">
              <FileText className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-sm">Preview not available</p>
              <p className="text-xs mt-2">Extracted source shown as text below</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
