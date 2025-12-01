import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface RequestInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (documents: string[], reason: string) => void;
}

const DOCUMENT_OPTIONS = [
  "Income Tax Returns (Last 3 Years)",
  "Form 26AS (Latest AY)",
  "Certificate of Incorporation",
  "Bank Statements",
  "Medical Examination Report",
  "Identity Proof",
  "Address Proof",
  "Financial Statements",
];

export const RequestInfoDialog = ({ open, onOpenChange, onConfirm }: RequestInfoDialogProps) => {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [reason, setReason] = useState("");

  const handleDocToggle = (doc: string) => {
    setSelectedDocs((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedDocs, reason);
    setSelectedDocs([]);
    setReason("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Request More Information</AlertDialogTitle>
          <AlertDialogDescription>
            Select the required documents and provide a reason for the request.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
          <div className="space-y-2">
            <Label>Required Documents *</Label>
            <div className="space-y-2 border rounded-md p-4">
              {DOCUMENT_OPTIONS.map((doc) => (
                <div key={doc} className="flex items-center space-x-2">
                  <Checkbox
                    id={doc}
                    checked={selectedDocs.includes(doc)}
                    onCheckedChange={() => handleDocToggle(doc)}
                  />
                  <label
                    htmlFor={doc}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {doc}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="request-reason">Reason *</Label>
            <Textarea
              id="request-reason"
              placeholder="Reason for requesting additional information..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={selectedDocs.length === 0 || !reason.trim()}
          >
            Send Request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
