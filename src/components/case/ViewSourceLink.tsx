import { ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ViewSourceLinkProps {
  onClick: () => void;
}

export const ViewSourceLink = ({ onClick }: ViewSourceLinkProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className="inline-flex items-center gap-0.5 text-[10px] text-primary hover:text-primary/80 transition-colors ml-1.5"
            aria-label="Jump to source document"
          >
            <ExternalLink className="h-2.5 w-2.5" />
            <span>View Source</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Jump to the part of the document used to extract this value</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
