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

interface DeclineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string, comments: string) => void;
}

export const DeclineDialog = ({ open, onOpenChange, onConfirm }: DeclineDialogProps) => {
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");

  const handleConfirm = () => {
    onConfirm(reason, comments);
    setReason("");
    setComments("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Decline Proposal</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide a reason for declining this case.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="decline-reason">Decline Reason *</Label>
            <Textarea
              id="decline-reason"
              placeholder="Reason for decline..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="decline-comments">Additional Comments</Label>
            <Textarea
              id="decline-comments"
              placeholder="Any additional comments..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Confirm Decline
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
