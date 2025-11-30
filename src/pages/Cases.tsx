import { useNavigate } from "react-router-dom";
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
import { sampleCases } from "@/data/sampleCases";
import { FileText } from "lucide-react";

const Cases = () => {
  const navigate = useNavigate();

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default";
      case "In Review":
        return "secondary";
      case "Pending":
        return "outline";
      case "Declined":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">UW Kitty</h1>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Underwriting Cases</h2>
          <p className="text-muted-foreground">
            Review and manage underwriting cases with AI-powered summaries
          </p>
        </div>

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Sum Assured</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated By</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleCases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell className="font-medium">{caseItem.id}</TableCell>
                  <TableCell>{caseItem.applicantName}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(caseItem.priority)}>
                      {caseItem.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{caseItem.sumAssured}</TableCell>
                  <TableCell>{caseItem.premium}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(caseItem.status)}>
                      {caseItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{caseItem.createdDate}</TableCell>
                  <TableCell>{caseItem.updatedBy}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/case/${caseItem.id}`)}
                    >
                      Open
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Cases;
