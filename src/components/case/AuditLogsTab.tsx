import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Lock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Case } from "@/data/sampleCases";

interface AuditLog {
  timestamp: string;
  user: string;
  action: string;
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

export const AuditLogsTab = ({ auditLogs = [], caseData }: AuditLogsTabProps) => {
  const { toast } = useToast();
  const [searchText, setSearchText] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch = 
        log.user.toLowerCase().includes(searchText.toLowerCase()) ||
        log.action.toLowerCase().includes(searchText.toLowerCase());

      const matchesAction = 
        actionFilter === "all" ||
        log.action.toLowerCase().includes(actionFilter.toLowerCase());

      return matchesSearch && matchesAction;
    });
  }, [auditLogs, searchText, actionFilter]);

  const exportToCSV = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = now.toTimeString().split(':').slice(0, 2).join('');
    const filename = `audit_${caseData.id}_${dateStr}_${timeStr}.csv`;

    // CSV Header
    let csvContent = "# Case Audit Export\n";
    csvContent += `# Case ID: ${caseData.id}\n`;
    csvContent += `# Applicant: ${caseData.applicantName}\n`;
    csvContent += `# Created: ${caseData.createdDate}\n`;
    csvContent += `# Sum Assured: ${caseData.sumAssured}\n`;
    csvContent += `# Export Date: ${now.toISOString()}\n`;
    csvContent += "\n";

    // Column headers
    csvContent += "caseId,caseCreatedAt,auditTimestamp,auditTimestamp_human,action,actor,notes,extra\n";

    // Data rows
    auditLogs.forEach((log) => {
      const [action, ...notesParts] = log.action.split(' - ');
      const notes = notesParts.join(' - ') || '';
      const extra = log.extra ? JSON.stringify(log.extra).replace(/"/g, '""') : '';
      
      csvContent += `"${caseData.id}","${caseData.createdDate}","${log.timestamp}","${log.timestamp}","${action}","${log.user}","${notes}","${extra}"\n`;
    });

    // Trigger download
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

  const getActionBadgeVariant = (action: string) => {
    if (action.toLowerCase().includes("approved")) return "default";
    if (action.toLowerCase().includes("declined")) return "destructive";
    if (action.toLowerCase().includes("requested")) return "secondary";
    return "outline";
  };

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
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            placeholder="Search by actor, action, or notes..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1"
          />
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="requested">More Info</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Audit Log Entries */}
        {filteredLogs && filteredLogs.length > 0 ? (
          <div className="space-y-3">
            {filteredLogs.map((log, idx) => {
              const [action, ...notesParts] = log.action.split(' - ');
              const notes = notesParts.join(' - ');
              
              return (
                <div 
                  key={idx} 
                  className="flex flex-col gap-2 py-3 px-4 border rounded-md bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getActionBadgeVariant(action)}>
                          {action}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp}
                        </span>
                      </div>
                      <div className="text-sm font-medium">{log.user}</div>
                      {notes && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {notes}
                        </div>
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
                      {(log.extra?.riskClass || log.extra?.extraPremium_pct) && (
                        <div className="text-xs text-muted-foreground mt-2">
                          {log.extra.riskClass && (
                            <Badge variant="outline" className="mr-2">
                              Risk: {log.extra.riskClass}
                            </Badge>
                          )}
                          {log.extra.extraPremium_pct && (
                            <Badge variant="outline">
                              Extra Premium: {log.extra.extraPremium_pct}%
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <Lock className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              {searchText || actionFilter !== "all" 
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
