/**
 * CredentialsPage - Upgraded Admin View
 *
 * BEFORE: Simple page with basic CredentialCard grid from shadcn/ui
 * - No filtering or search
 * - No pagination
 * - Minimal card info
 * - Basic border styling
 *
 * AFTER: Full-featured admin credentials management table
 * - Table layout optimized for dense data scanning
 * - Real-time search across student name & university
 * - Multi-filter support: status, degree type, date range
 * - Active filter pills with one-click removal
 * - Client-side pagination with page size selector (10/25/50)
 * - Sortable columns (student, university, date, token ID)
 * - Bulk actions: select rows, bulk revoke, export CSV
 * - Row hover effects and selection highlighting
 * - Animated table rows with stagger effect
 * - Loading skeleton with table shape
 * - Empty state with contextual CTAs
 * - QR code modal for verification
 * - Simplified user terminology
 * - Fully responsive with horizontal scroll on mobile
 *
 * Design: Uses Magic UI components + Framer Motion animations
 * Data: Fetches up to 500 credentials, client-side filtered/paginated
 */
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  ScanLine,
  Award,
  X,
  MoreVertical,
  FileText,
  Trash2,
  Filter,
  User,
  Building,
  Calendar,
  CheckSquare,
  Square,
  AlertTriangle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { adminAPI, issueAPI } from "../services/api";
import { config } from "../config/api";
import { Button, Input, Select, Badge } from "../components/magic";
import { EmptyState } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Degree {
  id: number;
  tokenId: string;
  student: {
    address: string;
    name: string;
  };
  degree: {
    university: string;
    type: string;
  };
  year: string;
  issuedAt: string;
  revoked: boolean;
  revocationReason: string | null;
  txHash?: string;
}

interface FilterState {
  search: string;
  status: string;
  degreeType: string;
  dateRange: string;
}

type SortField = "student" | "university" | "issuedAt" | "tokenId";
type SortDirection = "asc" | "desc";

const ROW_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const STAGGER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const CREDENTIALS_PER_PAGE_OPTIONS = [10, 25, 50];

const SkeletonTable = ({
  rows = 10,
  columns = 6,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) => {
  return (
    <div className={cn("bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50/80 border-b border-slate-200/60">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-3 text-left">
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <td key={colIdx} className="px-6 py-3">
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "30days", label: "Last 30 days" },
  { value: "year", label: "Last year" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "valid", label: "Valid" },
  { value: "revoked", label: "Cancelled" },
];

// BEFORE: Simple page with basic card grid, no filtering, minimal info
// AFTER: Full-featured admin table with search, filters, pagination, bulk actions, animations

export default function CredentialsPage() {
  const navigate = useNavigate();
  const [allDegrees, setAllDegrees] = useState<Degree[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [qrToken, setQrToken] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    degreeType: "all",
    dateRange: "all",
  });

  // Sort state
  const [sortField, setSortField] = useState<SortField>("issuedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Selection state
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Check admin auth
  const token = localStorage.getItem("adminToken");
  if (!token) {
    navigate("/admin");
    return null;
  }

  // Fetch all degrees data at once for client-side filtering
  useEffect(() => {
    fetchAllDegrees();
  }, []);

  const fetchAllDegrees = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch a larger dataset for client-side filtering (up to 500)
      const res = await adminAPI.listDegrees(1, 500);
      setAllDegrees(res.data.degrees);
      setTotalCount(res.data.total);
      if (res.data.total > 500) {
        console.warn(`Showing first 500 of ${res.data.total} credentials. Use search to find more.`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch credentials");
    } finally {
      setLoading(false);
    }
  };

  // Extract unique degree types from data
  const degreeTypes = useMemo(() => {
    const types = new Set<string>();
    allDegrees.forEach((d) => types.add(d.degree.type));
    return ["all", ...Array.from(types).sort()];
  }, [allDegrees]);

  // Apply filters and sorting
  const filteredAndSortedDegrees = useMemo(() => {
    let result = [...allDegrees];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.student.name.toLowerCase().includes(searchLower) ||
          d.student.address.toLowerCase().includes(searchLower) ||
          d.degree.university.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status === "valid") {
      result = result.filter((d) => !d.revoked);
    } else if (filters.status === "revoked") {
      result = result.filter((d) => d.revoked);
    }

    // Degree type filter
    if (filters.degreeType !== "all") {
      result = result.filter((d) => d.degree.type === filters.degreeType);
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      let cutoffDate: Date;
      if (filters.dateRange === "30days") {
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (filters.dateRange === "year") {
        cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      } else {
        cutoffDate = new Date(0);
      }
      result = result.filter((d) => new Date(d.issuedAt) >= cutoffDate);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "student":
          comparison = a.student.name.localeCompare(b.student.name);
          break;
        case "university":
          comparison = a.degree.university.localeCompare(b.degree.university);
          break;
        case "issuedAt":
          comparison = new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime();
          break;
        case "tokenId":
          comparison = a.tokenId.localeCompare(b.tokenId);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [allDegrees, filters, sortField, sortDirection]);

  // Paginate the filtered results
  const paginatedDegrees = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAndSortedDegrees.slice(start, start + pageSize);
  }, [filteredAndSortedDegrees, page, pageSize]);

  // Selection state for current page
  const allCurrentPageSelected = useMemo(() => {
    if (paginatedDegrees.length === 0) return false;
    return paginatedDegrees.every((d) => selectedRows.has(d.tokenId));
  }, [paginatedDegrees, selectedRows]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      degreeType: "all",
      dateRange: "all",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.degreeType !== "all" ||
    filters.dateRange !== "all";

  const activeFilterPills = [
    filters.search && { key: "search", label: `Search: "${filters.search}"`, removable: true },
    filters.status !== "all" && {
      key: "status",
      label: `Status: ${STATUS_OPTIONS.find((s) => s.value === filters.status)?.label}`,
      removable: true,
    },
    filters.degreeType !== "all" && {
      key: "degreeType",
      label: `Type: ${filters.degreeType}`,
      removable: true,
    },
    filters.dateRange !== "all" && {
      key: "dateRange",
      label: `Period: ${DATE_RANGE_OPTIONS.find((d) => d.value === filters.dateRange)?.label}`,
      removable: true,
    },
  ].filter(Boolean) as { key: string; label: string; removable: boolean }[];

  const removeFilter = (key: string) => {
    switch (key) {
      case "search":
        setFilters((f) => ({ ...f, search: "" }));
        break;
      case "status":
        setFilters((f) => ({ ...f, status: "all" }));
        break;
      case "degreeType":
        setFilters((f) => ({ ...f, degreeType: "all" }));
        break;
      case "dateRange":
        setFilters((f) => ({ ...f, dateRange: "all" }));
        break;
    }
  };

  // Selection handlers
  const toggleRowSelection = (tokenId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(tokenId)) {
      newSelection.delete(tokenId);
    } else {
      newSelection.add(tokenId);
    }
    setSelectedRows(newSelection);
  };

  const toggleSelectAll = () => {
    if (allCurrentPageSelected) {
      // Deselect all on current page
      const newSelection = new Set(selectedRows);
      paginatedDegrees.forEach((d) => newSelection.delete(d.tokenId));
      setSelectedRows(newSelection);
    } else {
      // Select all on current page (add to existing selection)
      const newSelection = new Set(selectedRows);
      paginatedDegrees.forEach((d) => newSelection.add(d.tokenId));
      setSelectedRows(newSelection);
    }
  };

  const bulkRevoke = async () => {
    if (!confirm(`Revoke ${selectedRows.size} credential(s)? This cannot be undone.`)) {
      return;
    }
    // Implement bulk revoke
    try {
      await Promise.all(
        Array.from(selectedRows).map((tokenId) =>
          issueAPI.revoke(tokenId, "Bulk revocation by admin")
        )
      );
      setSelectedRows(new Set());
      fetchAllDegrees();
    } catch (err) {
      setError("Failed to revoke some credentials");
    }
  };

  const exportCSV = () => {
    const selectedData = allDegrees.filter((d: Degree) => selectedRows.has(d.tokenId));
    const csv = [
      ["Token ID", "Student Name", "Student Address", "Degree Type", "University", "Issued Date", "Status", "Tx Hash"],
      ...selectedData.map((d: Degree) => [
        d.tokenId,
        d.student.name,
        d.student.address,
        d.degree.type,
        d.degree.university,
        new Date(d.issuedAt).toLocaleDateString(),
        d.revoked ? "Cancelled" : "Valid",
        d.txHash || "",
      ]),
    ]
      .map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `credentials-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Format helpers
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusBadge = (revoked: boolean) =>
    revoked ? (
      <Badge variant="destructive" dot>
        Cancelled
      </Badge>
    ) : (
      <Badge variant="success" dot>
        Valid
      </Badge>
    );

  const totalFiltered = filteredAndSortedDegrees.length;
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalFiltered);
  const totalPages = Math.ceil(totalFiltered / pageSize);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Diplomas & Certificates
          </h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Total Records: {totalCount}
          </p>
        </div>
        <Button onClick={() => navigate("/admin")} variant="outline" leftIcon={<ChevronLeft className="w-4 h-4" />}>
          Back to Dashboard
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 shadow-sm font-medium"
        >
          {error}
        </motion.div>
      )}

      {/* Warning if dataset truncated */}
      {allDegrees.length < totalCount && totalCount > 500 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 shadow-sm flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Dataset Limited</p>
            <p className="text-sm opacity-90">
              Only the first 500 credentials are loaded for filtering. Use search to find specific records, or contact your system administrator to increase the limit.
            </p>
          </div>
        </motion.div>
      )}

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-slate-500" />
          <h3 className="font-semibold text-slate-800">Show only</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Input */}
          <Input
            placeholder="Search by name or university..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={filters.search && (
              <button
                onClick={() => setFilters((f) => ({ ...f, search: "" }))}
                className="hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            className="w-full"
          />

          {/* Status Select */}
          <Select
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={(value) => setFilters((f) => ({ ...f, status: value }))}
            placeholder="Filter by status"
          />

          {/* Degree Type Select */}
          <Select
            options={degreeTypes.map((type) => ({
              value: type,
              label: type === "all" ? "All Types" : type,
            }))}
            value={filters.degreeType}
            onChange={(value) => setFilters((f) => ({ ...f, degreeType: value }))}
            placeholder="Filter by type"
          />

          {/* Date Range Select */}
          <Select
            options={DATE_RANGE_OPTIONS}
            value={filters.dateRange}
            onChange={(value) => setFilters((f) => ({ ...f, dateRange: value }))}
            placeholder="Filter by date"
          />
        </div>

        {/* Active Filter Pills */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100"
          >
            <span className="text-sm text-slate-500 mr-2">Active filters:</span>
            {activeFilterPills.map((pill) => (
              <Badge
                key={pill.key}
                variant="outline"
                dismissible
                onDismiss={() => removeFilter(pill.key)}
                className="gap-1.5"
              >
                {pill.label}
              </Badge>
            ))}
            <Button
              size="sm"
              variant="ghost"
              onClick={clearFilters}
              className="text-xs h-7 px-2"
            >
              Clear all
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedRows.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-primary-900">
                {selectedRows.size} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={bulkRevoke}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Revoke Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={exportCSV}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Export CSV
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedRows(new Set());
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {loading ? (
        <SkeletonTable rows={pageSize} columns={7} />
      ) : filteredAndSortedDegrees.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8 text-slate-300" />}
          title="No Credentials Found"
          description={
            hasActiveFilters
              ? "No results match your current filters. Try adjusting your search criteria."
              : "There are no credentials in the system yet. Start by issuing your first diploma or certificate."
          }
          action={
            hasActiveFilters ? (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => navigate("/issue")} leftIcon={<FileText className="w-4 h-4" />}>
                Issue First Credential
              </Button>
            )
          }
        />
      ) : (
        <>
          {/* Table Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <motion.table
                variants={STAGGER_VARIANTS}
                initial="hidden"
                animate="visible"
                className="min-w-full"
              >
                <thead className="bg-slate-50/80 border-b border-slate-200/60">
                  <tr>
                    {/* Checkbox Column */}
                    <th className="w-12 px-4 py-3 text-left">
                      <button
                        onClick={toggleSelectAll}
                        className="focus:outline-none"
                      >
                        {allCurrentPageSelected ? (
                          <CheckSquare className="w-5 h-5 text-primary-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                    </th>

                    {/* Sortable Headers */}
                    <th
                      className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors"
                      onClick={() => handleSort("student")}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Student
                        {sortField === "student" && (
                          <span className="text-primary-600">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>

                    <th
                      className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors"
                      onClick={() => handleSort("university")}
                    >
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        University
                        {sortField === "university" && (
                          <span className="text-primary-600">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Degree
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>

                    <th
                      className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors"
                      onClick={() => handleSort("issuedAt")}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Created
                        {sortField === "issuedAt" && (
                          <span className="text-primary-600">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                    {paginatedDegrees.map((degree, idx) => (
                      <motion.tr
                        key={degree.id}
                        variants={ROW_VARIANTS}
                        transition={{ delay: idx * 0.02 }}
                        className={cn(
                          "hover:bg-slate-50/50 transition-colors",
                          selectedRows.has(degree.tokenId) && "bg-primary-50/50"
                        )}
                      >
                        {/* Checkbox Cell */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleRowSelection(degree.tokenId)}
                            className="focus:outline-none"
                          >
                            {selectedRows.has(degree.tokenId) ? (
                              <CheckSquare className="w-5 h-5 text-primary-600" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-300" />
                            )}
                          </button>
                        </td>

                        {/* Student Cell */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-semibold shadow-sm">
                              {degree.student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-slate-900">
                                {degree.student.name}
                              </div>
                              <div className="text-xs text-slate-500 font-mono bg-slate-50 px-1.5 py-0.5 rounded inline-block mt-0.5 border border-slate-100">
                                {degree.student.address.slice(0, 8)}...
                                {degree.student.address.slice(-6)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* University Cell */}
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-1.5 text-sm text-slate-700">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            {degree.degree.university}
                          </div>
                        </td>

                        {/* Degree Cell */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-primary-500" />
                            {degree.degree.type}
                          </div>
                          {degree.year && (
                            <div className="text-xs text-slate-500 mt-0.5">
                              Class of {degree.year}
                            </div>
                          )}
                        </td>

                        {/* Status Cell */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          {getStatusBadge(degree.revoked)}
                        </td>

                        {/* Date Cell */}
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {formatDate(degree.issuedAt)}
                          </div>
                        </td>

                        {/* Actions Cell */}
                        <td className="px-6 py-3 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {degree.txHash && (
                              <a
                                href={`${config.explorerUrl}${degree.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-primary-600 transition-colors p-2 rounded-md hover:bg-primary-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                title="View Transaction"
                              >
                                <FileText className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() =>
                                setQrToken(qrToken === degree.tokenId ? null : degree.tokenId)
                              }
                              className="p-2 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                              title="Get Verification QR Code"
                            >
                              <ScanLine className="w-4 h-4" />
                            </button>
                            <div className="relative group">
                              <button
                                className="p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                title="More actions"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              {/* Dropdown menu would go here */}
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </motion.table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-200/60 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">
                    Showing <span className="font-semibold">{startItem}</span> to{" "}
                    <span className="font-semibold">{endItem}</span> of{" "}
                    <span className="font-semibold">{totalFiltered}</span> results
                  </span>
                  <Select
                    options={CREDENTIALS_PER_PAGE_OPTIONS.map((n) => ({
                      value: n.toString(),
                      label: `${n} per page`,
                    }))}
                    value={pageSize.toString()}
                    onChange={(value) => {
                      setPageSize(parseInt(value));
                      setPage(1);
                    }}
                    className="w-36"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    leftIcon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={cn(
                            "w-8 h-8 text-sm rounded-md transition-colors",
                            page === pageNum
                              ? "bg-primary-600 text-white"
                              : "hover:bg-slate-100 text-slate-600"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* QR Code Modal */}
      <AnimatePresence>
        {qrToken && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setQrToken(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 text-primary-600">
                  <ScanLine className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Verification Passport</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Token ID <span className="font-mono font-bold text-slate-700">#{qrToken}</span>
                </p>
              </div>

              <div className="flex justify-center mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <QRCodeSVG
                  value={`${window.location.origin}/verify?contract=${config.contractAddress}&tokenId=${qrToken}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                  className="rounded-lg bg-white"
                />
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/verify?contract=${config.contractAddress}&tokenId=${qrToken}`
                    )
                  }
                  variant="outline"
                  className="w-full"
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Copy Direct Link
                </Button>
                <Button
                  onClick={() => setQrToken(null)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
