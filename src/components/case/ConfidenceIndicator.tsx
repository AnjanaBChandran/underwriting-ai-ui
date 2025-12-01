import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type ConfidenceLevel = "High" | "Medium" | "Low" | "Unknown";

interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
  percentage?: number;
  sourceDocs?: string[];
  fieldName?: string;
}

export const ConfidenceIndicator = ({ 
  level, 
  percentage, 
  sourceDocs = [],
  fieldName 
}: ConfidenceIndicatorProps) => {
  const [open, setOpen] = useState(false);

  const getColor = (level: ConfidenceLevel) => {
    switch (level) {
      case "High": return "text-green-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-red-600";
      default: return "text-gray-500";
    }
  };

  const getDot = (level: ConfidenceLevel) => {
    switch (level) {
      case "High": return "🟢";
      case "Medium": return "🟡";
      case "Low": return "🔴";
      default: return "⚪";
    }
  };

  const getTooltip = (level: ConfidenceLevel) => {
    switch (level) {
      case "High": return "Confidence: High — source provides strong evidence";
      case "Medium": return "Confidence: Medium — source provides moderate evidence";
      case "Low": return "Confidence: Low — source evidence is weak or unclear";
      default: return "Confidence: Unknown — confidence not available";
    }
  };

  const getRecommendation = (level: ConfidenceLevel) => {
    switch (level) {
      case "High": return "No action needed";
      case "Medium": return "Verify source if decision is borderline";
      case "Low": return "Manual verification recommended";
      default: return "Please verify manually";
    }
  };

  return (
    <TooltipProvider>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={`inline-flex items-center gap-1 text-[10px] ${getColor(level)} hover:opacity-80 transition-opacity`}
            aria-label={`Confidence: ${level}`}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">
                  {getDot(level)} {level}
                  {percentage && <span className="ml-0.5">({percentage}%)</span>}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{getTooltip(level)}</p>
              </TooltipContent>
            </Tooltip>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3 text-xs" align="start">
          <div className="space-y-2">
            {fieldName && (
              <div>
                <span className="font-semibold">Field:</span> {fieldName}
              </div>
            )}
            <div>
              <span className="font-semibold">Confidence:</span> {level}
              {percentage && <span> ({percentage}%)</span>}
            </div>
            {sourceDocs.length > 0 && (
              <div>
                <span className="font-semibold">Source documents:</span>
                <ul className="list-disc list-inside mt-1">
                  {sourceDocs.map((doc, idx) => (
                    <li key={idx} className="text-muted-foreground">{doc}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="pt-1 border-t border-border">
              <span className="font-semibold">Recommendation:</span>
              <p className="text-muted-foreground mt-0.5">{getRecommendation(level)}</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
