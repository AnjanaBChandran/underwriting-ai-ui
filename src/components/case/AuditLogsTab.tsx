import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuditLog {
  timestamp: string;
  user: string;
  action: string;
}

interface AuditLogsTabProps {
  auditLogs?: AuditLog[];
}

export const AuditLogsTab = ({ auditLogs }: AuditLogsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Audit Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {auditLogs && auditLogs.length > 0 ? (
          <div className="space-y-3">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="flex gap-4 py-2 border-b last:border-0">
                <span className="text-xs text-muted-foreground w-32 shrink-0">{log.timestamp}</span>
                <span className="text-sm font-medium w-32 shrink-0">{log.user}</span>
                <span className="text-sm">{log.action}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No audit logs available</p>
        )}
      </CardContent>
    </Card>
  );
};
