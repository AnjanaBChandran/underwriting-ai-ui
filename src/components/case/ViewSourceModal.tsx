import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  docName: string;
  docPath?: string;
  highlight?: {
    fieldName?: string;
    value?: string;
    confidence?: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const ViewSourceModal = ({ 
  isOpen, 
  onClose, 
  docName, 
  docPath,
  highlight 
}: ViewSourceModalProps) => {
  const getConfidenceColor = (confidence?: string) => {
    switch (confidence) {
      case "High": return "bg-green-500/20 text-green-600 border-green-500/30";
      case "Medium": return "bg-amber-500/20 text-amber-600 border-amber-500/30";
      case "Low": return "bg-red-500/20 text-red-600 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <DialogTitle className="text-base font-semibold">{docName}</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Extracted Field Info */}
        {highlight?.fieldName && (
          <div className="px-6 py-3 bg-muted/50 border-b flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Field:</span>
              <span className="text-sm font-medium">{highlight.fieldName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Value:</span>
              <span className="text-sm font-semibold text-primary">{highlight.value}</span>
            </div>
            <Badge variant="outline" className={`text-xs ${getConfidenceColor(highlight.confidence)}`}>
              {highlight.confidence} Confidence
            </Badge>
          </div>
        )}

        {/* Document Preview with Highlight */}
        <div className="flex-1 overflow-auto p-4 bg-muted/30">
          <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
            {docPath ? (
              <div className="relative">
                <img 
                  src={docPath} 
                  alt={docName}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                />
                {/* Highlight Overlay */}
                {highlight && (
                  <div 
                    className="absolute border-2 border-primary bg-primary/10 rounded animate-pulse pointer-events-none"
                    style={{
                      left: `${highlight.x * 100}%`,
                      top: `${highlight.y * 100}%`,
                      width: `${highlight.width * 100}%`,
                      height: `${highlight.height * 100}%`,
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-sm">Document preview not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-card flex-shrink-0">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Page 1 of 1</span>
            <span>Source document for extracted field</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
