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
import { sampleCases, Case, formatSAR, formatPremium } from "@/data/sampleCases";
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

type SortField = "policyNo" | "priority" | "planName" | "sar" | "premium" | "ageing" | "lastUpdDt";
type SortOrder = "asc" | "desc" | null;

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const Cases = () => {
  const navigate = useNavigate();
  
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [medicalFilter, setMedicalFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // Filter and search logic
  const filteredCases = useMemo(() => {
    let filtered = sampleCases.filter((caseItem) => {
      const matchesSearch =
        searchQuery === "" ||
        caseItem.policyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.lastAssignedID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.channelName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = priorityFilter === "all" || caseItem.priority === priorityFilter;
      const matchesChannel = channelFilter === "all" || caseItem.channelName.includes(channelFilter);
      const matchesMedical = medicalFilter === "all" || caseItem.medical === medicalFilter;

      return matchesSearch && matchesPriority && matchesChannel && matchesMedical;
    });

    // Sorting
    if (sortField && sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        let aVal: any = a[sortField];
        let bVal: any = b[sortField];

        // Handle numerical comparisons
        if (sortField === "sar" || sortField === "premium") {
          aVal = parseFloat(a[sortField]) || 0;
          bVal = parseFloat(b[sortField]) || 0;
        }

        if (sortField === "ageing") {
          aVal = a.ageing === "-" ? 0 : parseInt(a.ageing) || 0;
          bVal = b.ageing === "-" ? 0 : parseInt(b.ageing) || 0;
        }

        if (sortField === "lastUpdDt") {
          aVal = new Date(a.lastUpdDt).getTime();
          bVal = new Date(b.lastUpdDt).getTime();
        }

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchQuery, priorityFilter, channelFilter, medicalFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredCases.length / pageSize);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // KPI calculations
  const kpis = useMemo(() => ({
    total: sampleCases.length,
    priority1: sampleCases.filter((c) => c.priority === "1").length,
    priority2: sampleCases.filter((c) => c.priority === "2").length,
    medicalCases: sampleCases.filter((c) => c.medical === "MEDICAL CASE").length,
    highAgeing: sampleCases.filter((c) => parseInt(c.ageing) > 10).length,
  }), []);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setPriorityFilter("all");
    setChannelFilter("all");
    setMedicalFilter("all");
    setSortField(null);
    setSortOrder(null);
    setCurrentPage(1);
  };

  // Export functions
  const exportToCSV = () => {
    const headers = ["PolicyNo", "Priority", "PlanName", "SAR", "Premium", "AdvisorLevel", "ChannelName", "Medical/NonMedical", "ResumptionDate", "LastUpdDt", "Ageing", "Activity", "LastAssignedID"];
    const rows = filteredCases.map((c) => [
      c.policyNo,
      c.priority,
      c.planName,
      c.sar,
      c.premium,
      c.advisorLevel,
      c.channelName,
      c.medical,
      c.resumptionDate,
      c.lastUpdDt,
      c.ageing,
      c.activity,
      c.lastAssignedID,
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
      case "1":
        return "destructive";
      case "2":
        return "default";
      default:
        return "secondary";
    }
  };

  const handleCaseClick = (caseItem: Case) => {
    navigate(`/case/${caseItem.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">{getGreeting()}, Anjana</h1>
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
                  <p className="text-sm text-muted-foreground mb-1">Priority 1</p>
                  <p className="text-3xl font-bold text-destructive">{kpis.priority1}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-destructive opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Priority 2</p>
                  <p className="text-3xl font-bold text-primary">{kpis.priority2}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Medical Cases</p>
                  <p className="text-3xl font-bold text-warning">{kpis.medicalCases}</p>
                </div>
                <Clock className="h-8 w-8 text-warning opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">High Ageing</p>
                  <p className="text-3xl font-bold text-success">{kpis.highAgeing}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by Policy No, Plan Name, Channel, or Assigned ID..."
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
                    <SelectItem value="1">Priority 1</SelectItem>
                    <SelectItem value="2">Priority 2</SelectItem>
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
                    <SelectItem value="DSF Individual Agent">DSF Individual Agent</SelectItem>
                    <SelectItem value="D2C INSURANCE">D2C Insurance Broking</SelectItem>
                    <SelectItem value="POLICY BAZAAR">Policy Bazaar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium mb-2 block">Medical/Non-Medical</label>
                <Select value={medicalFilter} onValueChange={setMedicalFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="MEDICAL CASE">Medical Case</SelectItem>
                    <SelectItem value="NON-MEDICAL CASE">Non-Medical Case</SelectItem>
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
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("policyNo")}>
                    <div className="flex items-center">
                      PolicyNo
                      {getSortIcon("policyNo")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("priority")}>
                    <div className="flex items-center">
                      Priority
                      {getSortIcon("priority")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("planName")}>
                    <div className="flex items-center">
                      PlanName
                      {getSortIcon("planName")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("sar")}>
                    <div className="flex items-center">
                      SAR
                      {getSortIcon("sar")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("premium")}>
                    <div className="flex items-center">
                      Premium
                      {getSortIcon("premium")}
                    </div>
                  </TableHead>
                  <TableHead>AdvisorLevel</TableHead>
                  <TableHead>ChannelName</TableHead>
                  <TableHead>Medical/NonMedical</TableHead>
                  <TableHead>ResumptionDate</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("lastUpdDt")}>
                    <div className="flex items-center">
                      LastUpdDt
                      {getSortIcon("lastUpdDt")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("ageing")}>
                    <div className="flex items-center">
                      Ageing
                      {getSortIcon("ageing")}
                    </div>
                  </TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>LastAssignedID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCases.map((caseItem) => (
                  <TableRow
                    key={caseItem.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <button
                        onClick={() => handleCaseClick(caseItem)}
                        className="text-primary hover:underline font-medium"
                      >
                        {caseItem.policyNo}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(caseItem.priority)}>
                        {caseItem.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={caseItem.planName}>
                      {caseItem.planName}
                    </TableCell>
                    <TableCell className="font-medium">{formatSAR(caseItem.sar)}</TableCell>
                    <TableCell>{formatPremium(caseItem.premium)}</TableCell>
                    <TableCell>{caseItem.advisorLevel}</TableCell>
                    <TableCell className="max-w-[150px] truncate" title={caseItem.channelName}>
                      {caseItem.channelName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {caseItem.medical}
                      </Badge>
                    </TableCell>
                    <TableCell>{caseItem.resumptionDate}</TableCell>
                    <TableCell>{caseItem.lastUpdDt}</TableCell>
                    <TableCell>
                      <span className={parseInt(caseItem.ageing) > 10 ? "text-destructive font-medium" : ""}>
                        {caseItem.ageing}
                      </span>
                    </TableCell>
                    <TableCell>{caseItem.activity}</TableCell>
                    <TableCell className="font-mono text-sm">{caseItem.lastAssignedID}</TableCell>
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
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
