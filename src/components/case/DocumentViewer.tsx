import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";
import { useState } from "react";

interface Document {
  name: string;
  uploadDate: string;
}

interface DocumentViewerProps {
  documents: Document[];
}

export const DocumentViewer = ({ documents }: DocumentViewerProps) => {
  const [selectedDoc, setSelectedDoc] = useState(documents[0]?.name || "");

  return (
    <div className="h-full border border-border rounded-lg bg-muted/30 p-4 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold mb-3">Document Viewer</h3>
        <Select value={selectedDoc} onValueChange={setSelectedDoc}>
          <SelectTrigger className="bg-background">
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
      </div>

      <div className="flex-1 border border-border rounded bg-background flex flex-col items-center justify-center text-muted-foreground p-8">
        <FileText className="h-16 w-16 mb-4 opacity-50" />
        <p className="text-sm">Preview: {selectedDoc}</p>
        <p className="text-xs mt-2">Document viewer placeholder</p>
      </div>
    </div>
  );
};
