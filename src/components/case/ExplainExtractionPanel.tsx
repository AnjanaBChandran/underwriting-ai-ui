import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ExplainExtractionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string;
  value: string;
  confidence: string;
  sourceDocs: string[];
  evidenceSnippets?: { text: string; source: string; page?: number }[];
  rationale?: string;
  onViewSource?: (docName: string) => void;
}

export const ExplainExtractionPanel = ({
  isOpen,
  onClose,
  fieldName,
  value,
  confidence,
  sourceDocs,
  evidenceSnippets = [],
  rationale,
  onViewSource,
}: ExplainExtractionPanelProps) => {
  if (!isOpen) return null;

  const defaultRationale = 
    confidence === "High" 
      ? "The value was determined based on the highlighted text in the uploaded document. The information appears clearly in the source."
      : confidence === "Medium"
      ? "The value was extracted from the source document. Confidence is Medium because some text was partially unclear or requires cross-verification."
      : "The value was identified in the document but confidence is Low due to document quality or unclear text. Manual verification is recommended.";

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 animate-in fade-in-0 duration-200"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed top-0 right-0 h-full w-[35%] min-w-[400px] bg-background border-l border-border z-50 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold mb-1">How this value was extracted</h3>
                <p className="text-xs text-muted-foreground">
                  Field: <span className="font-medium text-foreground">{fieldName}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Value: <span className="font-medium text-foreground">{value}</span>
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* A. Documents Used */}
              <div>
                <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                  Documents Used
                </h4>
                <div className="space-y-2">
                  {sourceDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-border"
                    >
                      <span className="text-sm">{doc}</span>
                      {onViewSource && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewSource(doc)}
                          className="h-7 text-xs text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View source
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* B. Key Evidence Snippet */}
              {evidenceSnippets.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                    Key Evidence Snippet
                  </h4>
                  <div className="space-y-3">
                    {evidenceSnippets.slice(0, 3).map((snippet, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-md bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800"
                      >
                        <p className="text-sm font-mono mb-1">"{snippet.text}"</p>
                        <p className="text-xs text-muted-foreground">
                          Source: {snippet.source}
                          {snippet.page && ` – Page ${snippet.page}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* C. Simple Rationale */}
              <div>
                <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                  Extraction Rationale
                </h4>
                <div className="p-3 rounded-md bg-muted/30 border border-border">
                  <p className="text-sm leading-relaxed">
                    {rationale || defaultRationale}
                  </p>
                  <div className="mt-3 pt-3 border-t border-border">
                    <Badge variant={confidence === "High" ? "default" : confidence === "Medium" ? "secondary" : "destructive"}>
                      Confidence: {confidence}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};
