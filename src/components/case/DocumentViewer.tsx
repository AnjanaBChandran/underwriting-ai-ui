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
    <div className="h-full flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedDoc} onValueChange={setSelectedDoc}>
            <SelectTrigger>
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
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardContent className="pt-6 h-full flex flex-col items-center justify-center text-muted-foreground">
          <FileText className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-sm">Preview: {selectedDoc}</p>
          <p className="text-xs mt-2">Document viewer placeholder</p>
        </CardContent>
      </Card>
    </div>
  );
};
