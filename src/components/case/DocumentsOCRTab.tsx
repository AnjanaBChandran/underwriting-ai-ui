import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FolderDown, Eye, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentRow {
  formId: string;
  mainDocument: string;
  subDocument: string;
  ocrConfidence: number | null;
  status: "Processed" | "Missing" | "Low OCR";
  scanDate?: string;
}

interface IDOCDocument {
  formId: string;
  mainDocument: string;
  subDocument: string;
  scanDate: string;
}

interface DocumentsOCRTabProps {
  onViewDocument: (docName: string, highlight?: any) => void;
  onRegenerateSummary?: () => void;
}

// Sample documents data based on the screenshot
const sampleDocuments: DocumentRow[] = [
  {
    formId: "111001",
    mainDocument: "APPLICATION FORM",
    subDocument: "Application Form Major",
    ocrConfidence: 92,
    status: "Processed",
  },
  {
    formId: "121083",
    mainDocument: "UW NON-MEDICAL REQUIREMENT",
    subDocument: "IAR completed & signed by IA",
    ocrConfidence: 88,
    status: "Processed",
  },
  {
    formId: "121102",
    mainDocument: "UW NON-MEDICAL REQUIREMENT",
    subDocument: "Income Proof required",
    ocrConfidence: 74,
    status: "Low OCR",
  },
  {
    formId: "131001",
    mainDocument: "ECS DOCUMENT",
    subDocument: "ECS Mandate Form",
    ocrConfidence: 90,
    status: "Processed",
  },
  {
    formId: "121317",
    mainDocument: "Video FMR",
    subDocument: "Video FMR",
    ocrConfidence: 82,
    status: "Processed",
  },
  {
    formId: "—",
    mainDocument: "BANK STATEMENT",
    subDocument: "6 Months Bank Statement",
    ocrConfidence: null,
    status: "Missing",
  },
];

// Sample IDOC documents for fetching
const idocDocuments: IDOCDocument[] = [
  { formId: "111002", mainDocument: "APPLICATION FORM", subDocument: "Application Form Minor", scanDate: "2024-01-15" },
  { formId: "121084", mainDocument: "UW NON-MEDICAL REQUIREMENT", subDocument: "Address Proof", scanDate: "2024-01-14" },
  { formId: "121103", mainDocument: "UW NON-MEDICAL REQUIREMENT", subDocument: "ID Proof", scanDate: "2024-01-14" },
  { formId: "131002", mainDocument: "MEDICAL DOCUMENT", subDocument: "CBC Report", scanDate: "2024-01-16" },
  { formId: "131003", mainDocument: "MEDICAL DOCUMENT", subDocument: "ECG Report", scanDate: "2024-01-16" },
  { formId: "141001", mainDocument: "FINANCIAL DOCUMENT", subDocument: "ITR Form", scanDate: "2024-01-12" },
];

export const DocumentsOCRTab = ({ onViewDocument, onRegenerateSummary }: DocumentsOCRTabProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentRow[]>(sampleDocuments);
  const [regenerateModalOpen, setRegenerateModalOpen] = useState(false);
  const [idocSheetOpen, setIdocSheetOpen] = useState(false);
  const [selectedIdocDocs, setSelectedIdocDocs] = useState<string[]>([]);
  const [pendingAction, setPendingAction] = useState<"upload" | "fetch" | null>(null);

  const getOcrColor = (confidence: number | null) => {
    if (confidence === null) return "";
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 70) return "text-amber-600";
    return "text-destructive";
  };

  const getOcrBadgeVariant = (confidence: number | null): "default" | "secondary" | "destructive" | "outline" => {
    if (confidence === null) return "outline";
    if (confidence >= 90) return "default";
    if (confidence >= 70) return "secondary";
    return "destructive";
  };

  const getStatusIcon = (status: DocumentRow["status"]) => {
    switch (status) {
      case "Processed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "Missing":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "Low OCR":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: DocumentRow["status"]) => {
    switch (status) {
      case "Processed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 text-xs">Processed</Badge>;
      case "Missing":
        return <Badge variant="destructive" className="text-xs">Missing</Badge>;
      case "Low OCR":
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs">Low OCR</Badge>;
    }
  };

  const handleUploadClick = () => {
    // Simulate file upload dialog
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setPendingAction("upload");
        setRegenerateModalOpen(true);
        toast({
          title: "Documents uploaded",
          description: `${files.length} file(s) uploaded successfully.`,
        });
      }
    };
    input.click();
  };

  const handleFetchFromIdoc = () => {
    setSelectedIdocDocs([]);
    setIdocSheetOpen(true);
  };

  const handleIdocDocSelect = (formId: string) => {
    setSelectedIdocDocs(prev =>
      prev.includes(formId)
        ? prev.filter(id => id !== formId)
        : [...prev, formId]
    );
  };

  const handleFetchSelected = () => {
    if (selectedIdocDocs.length === 0) {
      toast({
        title: "No documents selected",
        description: "Please select at least one document to fetch.",
        variant: "destructive",
      });
      return;
    }

    // Simulate fetching documents
    const fetchedDocs: DocumentRow[] = selectedIdocDocs.map(formId => {
      const idocDoc = idocDocuments.find(d => d.formId === formId);
      if (!idocDoc) return null;
      return {
        formId: idocDoc.formId,
        mainDocument: idocDoc.mainDocument,
        subDocument: idocDoc.subDocument,
        ocrConfidence: Math.floor(Math.random() * 20) + 80, // Random 80-100%
        status: "Processed" as const,
      };
    }).filter(Boolean) as DocumentRow[];

    setDocuments(prev => [...prev, ...fetchedDocs]);
    setIdocSheetOpen(false);
    setPendingAction("fetch");
    setRegenerateModalOpen(true);

    toast({
      title: "Documents fetched",
      description: `${fetchedDocs.length} document(s) fetched from IDOC.`,
    });
  };

  const handleRegenerateNow = () => {
    setRegenerateModalOpen(false);
    setPendingAction(null);
    onRegenerateSummary?.();
    toast({
      title: "Summary regenerating",
      description: "The underwriting summary is being regenerated.",
    });
  };

  const handleRegenerateLater = () => {
    setRegenerateModalOpen(false);
    setPendingAction(null);
  };

  const handleViewDocument = (doc: DocumentRow) => {
    if (doc.status === "Missing") {
      toast({
        title: "Document not available",
        description: "This document is missing and cannot be viewed.",
        variant: "destructive",
      });
      return;
    }
    // Open in left panel with sample highlights
    onViewDocument(doc.mainDocument, {
      fieldName: doc.subDocument,
      sampleHighlights: [
        { label: "Name", value: "Amit Sharma", confidence: doc.ocrConfidence || 85, x: 15, y: 20, width: 25, height: 3 },
        { label: "DOB", value: "15/03/1982", confidence: doc.ocrConfidence || 85, x: 15, y: 28, width: 20, height: 3 },
        { label: "Income", value: "₹2.55 Cr", confidence: doc.ocrConfidence || 85, x: 15, y: 36, width: 18, height: 3 },
      ],
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Actions - Sticky */}
      <div className="sticky top-0 z-10 bg-background pb-4 border-b">
        <div className="flex gap-3">
          <Button onClick={handleUploadClick} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Documents
          </Button>
          <Button variant="secondary" onClick={handleFetchFromIdoc} className="gap-2">
            <FolderDown className="h-4 w-4" />
            Fetch from IDOC
          </Button>
        </div>
      </div>

      {/* Document Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[60px]">View</TableHead>
              <TableHead className="w-[100px]">Form ID</TableHead>
              <TableHead>Main Document</TableHead>
              <TableHead>Sub Document</TableHead>
              <TableHead className="w-[120px] text-center">OCR Confidence</TableHead>
              <TableHead className="w-[100px] text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc, idx) => (
              <TableRow key={idx} className="hover:bg-muted/30">
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDocument(doc)}
                    disabled={doc.status === "Missing"}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-mono text-sm">{doc.formId}</TableCell>
                <TableCell className="font-medium">{doc.mainDocument}</TableCell>
                <TableCell className="text-muted-foreground">{doc.subDocument}</TableCell>
                <TableCell className="text-center">
                  {doc.ocrConfidence !== null ? (
                    <span className={`font-semibold ${getOcrColor(doc.ocrConfidence)}`}>
                      {doc.ocrConfidence}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(doc.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Regenerate Confirmation Modal */}
      <Dialog open={regenerateModalOpen} onOpenChange={setRegenerateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Documents uploaded successfully</DialogTitle>
            <DialogDescription>
              Do you want to regenerate the underwriting summary now?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleRegenerateLater}>
              ⏳ Later
            </Button>
            <Button onClick={handleRegenerateNow}>
              ✅ Regenerate Summary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* IDOC Fetch Sheet */}
      <Sheet open={idocSheetOpen} onOpenChange={setIdocSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Fetch from IDOC</SheetTitle>
            <SheetDescription>
              Select documents to fetch from the IDOC system.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Form ID</TableHead>
                    <TableHead>Main Document</TableHead>
                    <TableHead>Sub Document</TableHead>
                    <TableHead>Scan Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {idocDocuments.map((doc) => (
                    <TableRow
                      key={doc.formId}
                      className={`cursor-pointer hover:bg-muted/30 ${selectedIdocDocs.includes(doc.formId) ? 'bg-primary/5' : ''}`}
                      onClick={() => handleIdocDocSelect(doc.formId)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIdocDocs.includes(doc.formId)}
                          onCheckedChange={() => handleIdocDocSelect(doc.formId)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{doc.formId}</TableCell>
                      <TableCell className="font-medium text-xs">{doc.mainDocument}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{doc.subDocument}</TableCell>
                      <TableCell className="text-xs">{doc.scanDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-sm text-muted-foreground">
                {selectedIdocDocs.length} document(s) selected
              </span>
              <Button onClick={handleFetchSelected} disabled={selectedIdocDocs.length === 0}>
                Fetch Selected Documents
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
