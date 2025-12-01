import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ExternalLink } from "lucide-react";
import { useState } from "react";

interface Document {
  name: string;
  uploadDate: string;
  path?: string;
}

interface DocumentViewerProps {
  documents: Document[];
}

export const DocumentViewer = ({ documents }: DocumentViewerProps) => {
  const [selectedDoc, setSelectedDoc] = useState(documents[0]?.name || "");

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
        <h3 className="text-sm font-semibold mb-3">Document Viewer</h3>
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
      <ScrollArea className="flex-1">
        <div className="p-4">
          {documentPath ? (
            <div className="bg-background border border-border rounded-lg overflow-hidden">
              <img 
                src={documentPath} 
                alt={selectedDoc}
                className="w-full h-auto"
              />
            </div>
          ) : (
            <div className="h-[600px] border border-border rounded bg-background flex flex-col items-center justify-center text-muted-foreground">
              <FileText className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-sm">No document selected</p>
              <p className="text-xs mt-2">Select a document from the dropdown above</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
