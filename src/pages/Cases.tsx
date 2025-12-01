import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { sampleCases, Case } from "@/data/sampleCases";
import {
  FileText,
  Search,
  Download,
  RotateCcw,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type SortField = "id" | "applicantName" | "priority" | "sumAssured" | "premium" | "status" | "createdDate" | "ageing";
type SortOrder = "asc" | "desc" | null;

const Cases = () => {
  const navigate = useNavigate();
  
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // Filter and search logic
  const filteredCases = useMemo(() => {
    let filtered = sampleCases.filter((caseItem) => {
      const matchesSearch =
        searchQuery === "" ||
        caseItem.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.policyNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.updatedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = priorityFilter === "all" || caseItem.priority === priorityFilter;
      const matchesStatus = statusFilter === "all" || caseItem.status === statusFilter;
      const matchesChannel = channelFilter === "all" || caseItem.channel === channelFilter;
      const matchesProduct = productFilter === "all" || caseItem.product === productFilter;

      return matchesSearch && matchesPriority && matchesStatus && matchesChannel && matchesProduct;
    });

    // Sorting
    if (sortField && sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        let aVal: any = a[sortField];
        let bVal: any = b[sortField];

        // Handle numerical comparisons for ageing
        if (sortField === "ageing") {
          aVal = a.ageing || 0;
          bVal = b.ageing || 0;
        }

        // Handle date comparisons
        if (sortField === "createdDate") {
          aVal = new Date(a.createdDate).getTime();
          bVal = new Date(b.createdDate).getTime();
        }

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchQuery, priorityFilter, statusFilter, channelFilter, productFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredCases.length / pageSize);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // KPI calculations
  const kpis = useMemo(() => ({
    total: sampleCases.length,
    pending: sampleCases.filter((c) => c.status === "Pending").length,
    inReview: sampleCases.filter((c) => c.status === "In Review").length,
    approved: sampleCases.filter((c) => c.status === "Approved").length,
    highPriority: sampleCases.filter((c) => c.priority === "High").length,
  }), []);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setPriorityFilter("all");
    setStatusFilter("all");
    setChannelFilter("all");
    setProductFilter("all");
    setSortField(null);
    setSortOrder(null);
    setCurrentPage(1);
  };

  // Export functions
  const exportToCSV = () => {
    const headers = ["Case ID", "Applicant Name", "Priority", "Status", "Sum Assured", "Premium", "Channel", "Product", "Ageing", "Created Date"];
    const rows = filteredCases.map((c) => [
      c.id,
      c.applicantName,
      c.priority,
      c.status,
      c.sumAssured,
      c.premium,
      c.channel || "",
      c.product || "",
      c.ageing || "",
      c.createdDate,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cases_export_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    // For Excel, we'll use the same CSV format but with .xlsx extension
    // In a real implementation, you'd use a library like xlsx
    exportToCSV();
  };

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortField(null);
        setSortOrder(null);
      }
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-40" />;
    if (sortOrder === "asc") return <ArrowUp className="h-4 w-4 ml-1 text-primary" />;
    if (sortOrder === "desc") return <ArrowDown className="h-4 w-4 ml-1 text-primary" />;
    return <ArrowUpDown className="h-4 w-4 ml-1 opacity-40" />;
  };

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
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
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
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Case Management Dashboard</h2>
          <p className="text-muted-foreground">
            Review and manage underwriting cases with AI-powered insights
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Cases</p>
                  <p className="text-3xl font-bold">{kpis.total}</p>
                </div>
                <FileText className="h-8 w-8 text-primary opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-3xl font-bold text-warning">{kpis.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-warning opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">In Review</p>
                  <p className="text-3xl font-bold text-primary">{kpis.inReview}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Approved</p>
                  <p className="text-3xl font-bold text-success">{kpis.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">High Priority</p>
                  <p className="text-3xl font-bold text-destructive">{kpis.highPriority}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-destructive opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by Case ID, Applicant Name, Policy Number, or Advisor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Filter Toolbar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium mb-2 block">Channel</label>
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                    <SelectItem value="Broker">Broker</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Bancassurance">Bancassurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium mb-2 block">Product</label>
                <Select value={productFilter} onValueChange={setProductFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Term Life Insurance">Term Life Insurance</SelectItem>
                    <SelectItem value="Whole Life Insurance">Whole Life Insurance</SelectItem>
                    <SelectItem value="Investment-Linked Policy">Investment-Linked Policy</SelectItem>
                    <SelectItem value="Critical Illness Cover">Critical Illness Cover</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" onClick={resetFilters} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset Filters
              </Button>

              <Button variant="outline" onClick={exportToCSV} className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>

              <Button variant="outline" onClick={exportToExcel} className="gap-2">
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary & Page Size */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedCases.length} of {filteredCases.length} cases
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select value={pageSize.toString()} onValueChange={(val) => {
              setPageSize(Number(val));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0">
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("id")}>
                    <div className="flex items-center">
                      Case ID
                      {getSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("applicantName")}>
                    <div className="flex items-center">
                      Applicant Name
                      {getSortIcon("applicantName")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("priority")}>
                    <div className="flex items-center">
                      Priority
                      {getSortIcon("priority")}
                    </div>
                  </TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("sumAssured")}>
                    <div className="flex items-center">
                      Sum Assured
                      {getSortIcon("sumAssured")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("premium")}>
                    <div className="flex items-center">
                      Premium
                      {getSortIcon("premium")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("status")}>
                    <div className="flex items-center">
                      Status
                      {getSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("ageing")}>
                    <div className="flex items-center">
                      Ageing (Days)
                      {getSortIcon("ageing")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("createdDate")}>
                    <div className="flex items-center">
                      Created
                      {getSortIcon("createdDate")}
                    </div>
                  </TableHead>
                  <TableHead>Updated By</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCases.map((caseItem) => (
                  <TableRow
                    key={caseItem.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/case/${caseItem.id}`)}
                  >
                    <TableCell className="font-medium">{caseItem.id}</TableCell>
                    <TableCell className="font-medium">{caseItem.applicantName}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(caseItem.priority)} className="font-medium">
                        {caseItem.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{caseItem.channel || "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{caseItem.product || "—"}</TableCell>
                    <TableCell className="font-medium">{caseItem.sumAssured}</TableCell>
                    <TableCell className="text-muted-foreground">{caseItem.premium}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(caseItem.status)} className="font-medium">
                        {caseItem.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-medium ${(caseItem.ageing || 0) > 7 ? "text-destructive" : "text-muted-foreground"}`}>
                        {caseItem.ageing || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{caseItem.createdDate}</TableCell>
                    <TableCell className="text-muted-foreground">{caseItem.updatedBy}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/case/${caseItem.id}`);
                        }}
                        className="h-8"
                      >
                        Open
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cases;
