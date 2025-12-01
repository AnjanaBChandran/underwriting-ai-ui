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

interface DecisionConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  action: "approve" | "decline";
  caseId: string;
}

export const DecisionConfirmDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm,
  action,
  caseId
}: DecisionConfirmDialogProps) => {
  const isApprove = action === "approve";
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirm {isApprove ? "Approval" : "Decline"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {isApprove ? "approve" : "decline"} case <strong>{caseId}</strong>?
            {!isApprove && " This action will mark the case as declined and notify relevant parties."}
            {isApprove && " This action will finalize the approval and proceed with policy issuance."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={isApprove ? "" : "bg-destructive text-destructive-foreground hover:bg-destructive/90"}
          >
            {isApprove ? "Confirm Approval" : "Confirm Decline"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
