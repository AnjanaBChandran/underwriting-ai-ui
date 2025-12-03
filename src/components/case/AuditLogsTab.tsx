import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Lock, FileText, Bot, Server, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Case } from "@/data/sampleCases";

type LogType = "ai" | "system" | "underwriter";

interface AuditLog {
  timestamp: string;
  user: string;
  action: string;
  type?: LogType;
  description?: string;
  extra?: {
    requestedDocuments?: string[];
    riskClass?: string;
    extraPremium_pct?: number;
  };
}

interface AuditLogsTabProps {
  auditLogs?: AuditLog[];
  caseData: Case;
}

// AI Agent logs based on document extraction
const aiAgentLogs: AuditLog[] = [
  {
    timestamp: "28/11/2024, 09:15 AM",
    user: "Document Intelligence Agent",
    action: "Field Extraction",
    type: "ai",
    description: "Extracted income = ₹10,45,000 (Confidence 89%)"
  },
  {
    timestamp: "28/11/2024, 09:14 AM",
    user: "Document Intelligence Agent",
    action: "Missing Document Flag",
    type: "ai",
    description: "Flagged missing document: Bank Statement"
  },
  {
    timestamp: "28/11/2024, 09:13 AM",
    user: "Medical Risk Agent",
    action: "Health Data Extraction",
    type: "ai",
    description: "Extracted BMI = 23.5 (Normal)"
  },
  {
    timestamp: "28/11/2024, 09:12 AM",
    user: "Medical Risk Agent",
    action: "Low Confidence Flag",
    type: "ai",
    description: "Flagged smoking status as Low Confidence (58%)"
  },
  {
    timestamp: "28/11/2024, 09:10 AM",
    user: "Summary Generator Agent",
    action: "Summary Generation",
    type: "ai",
    description: "Generated UW summary draft"
  },
  {
    timestamp: "28/11/2024, 09:05 AM",
    user: "Document Intelligence Agent",
    action: "Field Extraction",
    type: "ai",
    description: "Extracted applicant age = 35 years (Confidence 95%)"
  }
];

// System logs
const systemLogs: AuditLog[] = [
  {
    timestamp: "28/11/2024, 09:00 AM",
    user: "System",
    action: "Case Created",
    type: "system",
    description: "New case initiated from policy submission"
  },
  {
    timestamp: "28/11/2024, 09:01 AM",
    user: "System",
    action: "Document Upload",
    type: "system",
    description: "3 documents received and queued for processing"
  },
  {
    timestamp: "28/11/2024, 09:20 AM",
    user: "System",
    action: "Status Update",
    type: "system",
    description: "Case status changed to 'In Review'"
  }
];

export const AuditLogsTab = ({ auditLogs = [], caseData }: AuditLogsTabProps) => {
  const { toast } = useToast();
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | LogType>("all");

  // Combine all logs and sort by timestamp
  const allLogs = useMemo(() => {
    const userLogs = auditLogs.map(log => ({
      ...log,
      type: "underwriter" as LogType
    }));
    return [...aiAgentLogs, ...systemLogs, ...userLogs].sort((a, b) => {
      // Sort by timestamp descending (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [auditLogs]);

  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      const matchesSearch = 
        log.user.toLowerCase().includes(searchText.toLowerCase()) ||
        log.action.toLowerCase().includes(searchText.toLowerCase()) ||
        (log.description?.toLowerCase().includes(searchText.toLowerCase()) ?? false);

      const matchesType = 
        typeFilter === "all" || log.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [allLogs, searchText, typeFilter]);

  const exportToCSV = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = now.toTimeString().split(':').slice(0, 2).join('');
    const filename = `audit_${caseData.id}_${dateStr}_${timeStr}.csv`;

    let csvContent = "# Case Audit Export\n";
    csvContent += `# Case ID: ${caseData.id}\n`;
    csvContent += `# Applicant: ${caseData.applicantName}\n`;
    csvContent += `# Created: ${caseData.createdDate}\n`;
    csvContent += `# Sum Assured: ${caseData.sumAssured}\n`;
    csvContent += `# Export Date: ${now.toISOString()}\n`;
    csvContent += "\n";
    csvContent += "caseId,caseCreatedAt,auditTimestamp,type,action,actor,description,extra\n";

    allLogs.forEach((log) => {
      const extra = log.extra ? JSON.stringify(log.extra).replace(/"/g, '""') : '';
      csvContent += `"${caseData.id}","${caseData.createdDate}","${log.timestamp}","${log.type}","${log.action}","${log.user}","${log.description || ''}","${extra}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export ready",
      description: `Downloaded ${filename}`,
    });
  };

  const exportToPDF = () => {
    toast({
      title: "PDF export coming soon",
      description: "Use CSV export for now",
    });
  };

  const getTypeIcon = (type?: LogType) => {
    switch (type) {
      case "ai":
        return <Bot className="h-4 w-4 text-primary" />;
      case "system":
        return <Server className="h-4 w-4 text-muted-foreground" />;
      case "underwriter":
      default:
        return <User className="h-4 w-4 text-secondary-foreground" />;
    }
  };

  const getActionBadgeVariant = (action: string, type?: LogType) => {
    if (type === "ai") return "secondary";
    if (type === "system") return "outline";
    if (action.toLowerCase().includes("approved")) return "default";
    if (action.toLowerCase().includes("declined")) return "destructive";
    if (action.toLowerCase().includes("requested")) return "secondary";
    return "outline";
  };

  const filterChips: { label: string; value: "all" | LogType }[] = [
    { label: "All Actions", value: "all" },
    { label: "System Actions", value: "system" },
    { label: "AI Agent Actions", value: "ai" },
    { label: "Underwriter Actions", value: "underwriter" }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            Audit Logs
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              aria-label="Export case audit as CSV"
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              aria-label="Export case audit as PDF"
            >
              <FileText className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filterChips.map((chip) => (
            <Badge
              key={chip.value}
              variant={typeFilter === chip.value ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1 text-xs transition-colors ${
                typeFilter === chip.value 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-secondary"
              }`}
              onClick={() => setTypeFilter(chip.value)}
            >
              {chip.value === "ai" && <Bot className="h-3 w-3 mr-1" />}
              {chip.value === "system" && <Server className="h-3 w-3 mr-1" />}
              {chip.value === "underwriter" && <User className="h-3 w-3 mr-1" />}
              {chip.label}
            </Badge>
          ))}
        </div>

        {/* Search */}
        <div className="mb-4">
          <Input
            placeholder="Search by actor, action, or description..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Audit Log Entries */}
        {filteredLogs && filteredLogs.length > 0 ? (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredLogs.map((log, idx) => (
              <div 
                key={idx} 
                className="flex flex-col gap-2 py-3 px-4 border rounded-lg bg-muted/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {getTypeIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-medium">{log.user}</span>
                        <Badge variant={getActionBadgeVariant(log.action, log.type)} className="text-xs">
                          {log.action}
                        </Badge>
                      </div>
                      {log.description && (
                        <p className="text-sm text-muted-foreground">
                          {log.description}
                        </p>
                      )}
                      {log.extra?.requestedDocuments && (
                        <div className="text-xs text-muted-foreground mt-2">
                          <span className="font-medium">Requested Documents:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {log.extra.requestedDocuments.map((doc, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {log.timestamp}
                      </div>
                    </div>
                  </div>
                  <Lock className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              {searchText || typeFilter !== "all" 
                ? "No audit logs match your filters" 
                : "No audit logs available"}
            </p>
          </div>
        )}

        {/* Immutability Notice */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Audit entries are immutable and cannot be edited or deleted</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
