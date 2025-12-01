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
}

export const DocumentViewer = ({ 
  documents, 
  selectedDocName, 
  highlight,
  onClearHighlight 
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
          <h3 className="text-sm font-semibold">Document Viewer</h3>
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
        <div className="flex gap-2 items-center">
          <Select value={selectedDoc} onValueChange={setSelectedDoc}>
            <SelectTrigger className="bg-background flex-1">
              <SelectValue placeholder="Select document" />
            </SelectTrigger>
            <SelectContent>
              {documents.map((doc) => (
                <SelectItem key={doc.name} value={doc.name}>
                  {doc.name}
                </SelectItem>
              ))}
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
