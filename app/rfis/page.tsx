"use client"


import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  LayoutList,
  LayoutGrid,
  Download,
  X,
  MoreHorizontal,
  Trash2,
  Lock,
  Paperclip,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  SlidersHorizontal,
  Users,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination-uui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { DeleteRFIModal } from "@/components/delete-rfi-modal"
import { StatusBadge } from "@/components/status-badge"
import { RFIFiltersPopover, type FilterValue } from "@/components/rfi-filters-popover"
import { RFIConfigureViewsPopover, type ColumnConfig } from "@/components/rfi-configure-views-popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RFIDetailView } from "@/components/rfi-detail-view"
import { RFIFullPageView } from "@/components/rfi-full-page-view"
import { RFICreateSlideout } from "@/components/rfi-create-slideout"
import { MOCK_RFI_DATA, type RFIData } from "@/components/rfi-types"
import { useState, useMemo, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"

// "All RFIs" dropdown options (replaces old tab bar)
const RFI_FILTER_OPTIONS = [
  { id: "all", label: "All RFIs" },
  { id: "open", label: "Open" },
  { id: "draft", label: "Draft" },
  { id: "closed", label: "Closed" },
] as const

// Saved Views types
interface SavedView {
  id: string
  name: string
  description: string
  type: "personal" | "shared"
  isNew?: boolean
  recordCount: number
  filters: FilterValue[]
  columns: ColumnConfig[]
}

// Mock saved views data
const MOCK_PERSONAL_VIEWS: SavedView[] = [
  {
    id: "pv-1",
    name: "Open Structural RFIs",
    description: "All open RFIs related to structural work",
    type: "personal",
    recordCount: 8,
    filters: [{ field: "status", label: "Status", operator: "is_any_of", values: ["Open"] }],
    columns: [],
  },
  {
    id: "pv-2",
    name: "My Overdue RFIs",
    description: "RFIs past their due date",
    type: "personal",
    recordCount: 3,
    filters: [],
    columns: [],
  },
]

const MOCK_SHARED_VIEWS: SavedView[] = [
  {
    id: "sv-1",
    name: "Critical Safety RFIs",
    description: "Safety-related RFIs requiring immediate attention",
    type: "shared",
    isNew: true,
    recordCount: 12,
    filters: [],
    columns: [],
  },
  {
    id: "sv-2",
    name: "Pending Approvals",
    description: "RFIs awaiting approval from project managers",
    type: "shared",
    recordCount: 5,
    filters: [],
    columns: [],
  },
]

// Default column config
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: "rfiNumber", label: "RFI Number", visible: true, locked: true },
  { id: "status", label: "Status", visible: true, locked: true },
  { id: "subject", label: "Subject / Question", visible: true, locked: false },
  { id: "rfiManager", label: "RFI Manager", visible: true, locked: false },
  { id: "assignee", label: "Ball in Court", visible: true, locked: false },
  { id: "dueDate", label: "Due Date", visible: true, locked: false },
  { id: "costImpact", label: "Cost Impact", visible: false, locked: false },
  { id: "scheduleImpact", label: "Schedule Impact", visible: false, locked: false },
]

export default function RFIsPage() {
  return <RFIContent />
}

function RFIContent() {
  // Data
  const [rfiData, setRfiData] = useState<RFIData[]>(MOCK_RFI_DATA)

  // Top-level tabs: Requests / Recycle Bin
  const [activeTopTab, setActiveTopTab] = useState<"requests" | "recycle">("requests")

  // Status filter from dropdown (All RFIs / Open / Draft / Closed)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Search + Advanced filters
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterValue[]>([])

  // View mode
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  // Column config
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(DEFAULT_COLUMNS)

  // Saved Views state
  const [activeTabs, setActiveTabs] = useState<SavedView[]>([])
  const [availablePersonalViews, setAvailablePersonalViews] = useState<SavedView[]>(MOCK_PERSONAL_VIEWS)
  const [availableSharedViews, setAvailableSharedViews] = useState<SavedView[]>(MOCK_SHARED_VIEWS)
  const [activeViewId, setActiveViewId] = useState<string | null>(null)
  const [recentlyAddedViewId, setRecentlyAddedViewId] = useState<string | null>(null)
  const [addViewDropdownOpen, setAddViewDropdownOpen] = useState(false)

  // Create View Dialog state
  const [createViewDialogOpen, setCreateViewDialogOpen] = useState(false)
  const [newViewName, setNewViewName] = useState("")
  const [newViewDescription, setNewViewDescription] = useState("")
  const [newViewShareType, setNewViewShareType] = useState<"private" | "team" | "everyone">("private")

  // Check if there are new shared views
  const hasNewSharedViews = useMemo(
    () => availableSharedViews.some((v) => v.isNew),
    [availableSharedViews]
  )

  // Reset columns to defaults
  const handleResetColumns = useCallback(() => {
    setColumnConfig(DEFAULT_COLUMNS)
  }, [])

  // Computed: total number of individual filter values selected
  const totalFilterValues = useMemo(
    () => filters.reduce((sum, f) => sum + f.values.length, 0),
    [filters]
  )

  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16 // Max 16 rows per page

  // Row selection
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // Split view
  const [selectedRfi, setSelectedRfi] = useState<RFIData | null>(null)

  // Full page view
  const [fullPageRfi, setFullPageRfi] = useState<RFIData | null>(null)

  // Create slideout
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [draftData, setDraftData] = useState<Partial<RFIData>>({})

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [rfiToDelete, setRfiToDelete] = useState<RFIData | null>(null)

  // Derived: visible columns
  const visibleColumns = useMemo(
    () => columnConfig.filter((c) => c.visible),
    [columnConfig]
  )

  // Get the dropdown label
  const statusFilterLabel = RFI_FILTER_OPTIONS.find(o => o.id === statusFilter)?.label || "All RFIs"

  // Configure views popover state (controlled)
  const [configureViewsOpen, setConfigureViewsOpen] = useState(false)

  // Add a personal view to tabs
  const handleAddPersonalView = useCallback((view: SavedView) => {
    setActiveTabs((prev) => [...prev, view])
    setAvailablePersonalViews((prev) => prev.filter((v) => v.id !== view.id))
    setActiveViewId(view.id)
    setAddViewDropdownOpen(false)
  }, [])

  // Add a shared view to tabs
  const handleAddSharedView = useCallback((view: SavedView) => {
    // Mark as no longer new
    const updatedView = { ...view, isNew: false }
    setActiveTabs((prev) => [...prev, updatedView])
    setAvailableSharedViews((prev) => prev.filter((v) => v.id !== view.id))
    setActiveViewId(view.id)
    setRecentlyAddedViewId(view.id)
    setAddViewDropdownOpen(false)
    
    // Clear the sparkle animation after 2 seconds
    setTimeout(() => {
      setRecentlyAddedViewId(null)
    }, 2000)
  }, [])

  // Remove a view tab
  const handleRemoveViewTab = useCallback((viewId: string) => {
    const viewToRemove = activeTabs.find((v) => v.id === viewId)
    if (!viewToRemove) return
    
    setActiveTabs((prev) => prev.filter((v) => v.id !== viewId))
    
    // Return to appropriate available list
    if (viewToRemove.type === "personal") {
      setAvailablePersonalViews((prev) => [...prev, viewToRemove])
    } else {
      setAvailableSharedViews((prev) => [...prev, viewToRemove])
    }
    
    // Reset active view if it was the removed one
    if (activeViewId === viewId) {
      setActiveViewId(null)
    }
  }, [activeTabs, activeViewId])

  // Select a view tab
  const handleSelectViewTab = useCallback((viewId: string) => {
    setActiveViewId(viewId)
    const view = activeTabs.find((v) => v.id === viewId)
    if (view && view.filters.length > 0) {
      setFilters(view.filters)
    }
  }, [activeTabs])

  // Derived: filtered + sorted RFIs
  const filteredRfis = useMemo(() => {
    let rfis = [...rfiData]

    // 1. Status filter from dropdown
    if (statusFilter === "open") rfis = rfis.filter((r) => r.status === "Open")
    else if (statusFilter === "draft") rfis = rfis.filter((r) => r.status === "Draft")
    else if (statusFilter === "closed") rfis = rfis.filter((r) => r.status === "Closed")

    // 2. Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      rfis = rfis.filter(
        (r) =>
          r.rfiNumber.toLowerCase().includes(q) ||
          r.subject.toLowerCase().includes(q) ||
          r.rfiManager.toLowerCase().includes(q) ||
          r.assignee.toLowerCase().includes(q)
      )
    }

    // 3. Advanced filters (AND across fields, OR within field)
    if (filters.length > 0) {
      const byField: Record<string, string[]> = {}
      filters.forEach((f) => {
        if (!byField[f.field]) byField[f.field] = []
        byField[f.field].push(...f.values)
      })
      Object.entries(byField).forEach(([field, values]) => {
        rfis = rfis.filter((r) => {
          const val = r[field as keyof RFIData]
          return values.includes(val as string)
        })
      })
    }

    // 4. Sort
    if (sortColumn) {
      rfis.sort((a, b) => {
        const aVal = a[sortColumn as keyof RFIData]
        const bVal = b[sortColumn as keyof RFIData]
        if (typeof aVal === "string" && typeof bVal === "string") {
          const cmp = aVal.localeCompare(bVal)
          return sortDirection === "asc" ? cmp : -cmp
        }
        return 0
      })
    }

    return rfis
  }, [rfiData, statusFilter, searchQuery, filters, sortColumn, sortDirection])

  // Pagination calculations
  const totalPages = Math.ceil(filteredRfis.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRfis = filteredRfis.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filters, statusFilter])

  // Create new view handler
  const handleCreateView = useCallback(() => {
    if (!newViewName.trim()) return
    
    const newViewId = `${newViewShareType === "private" ? "personal" : "shared"}-${Date.now()}`
    
    const newView: SavedView = {
      id: newViewId,
      name: newViewName.trim(),
      description: newViewDescription.trim(),
      type: newViewShareType === "private" ? "personal" : "shared",
      isNew: true,
      recordCount: filteredRfis.length,
      filters: filters,
      columns: columnConfig,
    }
    
    // Add to active tabs
    setActiveTabs((prev) => [...prev, newView])
    setActiveViewId(newViewId)
    setRecentlyAddedViewId(newViewId)
    
    // Reset form
    setNewViewName("")
    setNewViewDescription("")
    setNewViewShareType("private")
    setCreateViewDialogOpen(false)
    
    // Clear highlight after 2 seconds
    setTimeout(() => {
      setRecentlyAddedViewId(null)
      // Also remove isNew flag
      setActiveTabs((prev) => prev.map((v) => 
        v.id === newViewId ? { ...v, isNew: false } : v
      ))
    }, 2000)
  }, [newViewName, newViewDescription, newViewShareType, filters, columnConfig, filteredRfis.length])

  // Handlers
  const handleSort = useCallback(
    (columnId: string) => {
      if (sortColumn === columnId) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
      } else {
        setSortColumn(columnId)
        setSortDirection("asc")
      }
    },
    [sortColumn]
  )

  const handleSelectAll = useCallback(() => {
    if (selectedRows.length === filteredRfis.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredRfis.map((r) => r.id))
    }
  }, [selectedRows.length, filteredRfis])

  const handleSelectRow = useCallback((id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }, [])

  const handleRowClick = useCallback((rfi: RFIData) => {
    setSelectedRfi(rfi)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedRfi(null)
  }, [])

  const handleOpenFullView = useCallback(() => {
    if (selectedRfi) {
      setFullPageRfi(selectedRfi)
      setSelectedRfi(null)
    }
  }, [selectedRfi])

  const handleNavigateUp = useCallback(() => {
    if (!selectedRfi) return
    const idx = filteredRfis.findIndex((r) => r.id === selectedRfi.id)
    if (idx > 0) setSelectedRfi(filteredRfis[idx - 1])
  }, [selectedRfi, filteredRfis])

  const handleNavigateDown = useCallback(() => {
    if (!selectedRfi) return
    const idx = filteredRfis.findIndex((r) => r.id === selectedRfi.id)
    if (idx < filteredRfis.length - 1) setSelectedRfi(filteredRfis[idx + 1])
  }, [selectedRfi, filteredRfis])

  const canNavigateUp = selectedRfi
    ? filteredRfis.findIndex((r) => r.id === selectedRfi.id) > 0
    : false
  const canNavigateDown = selectedRfi
    ? filteredRfis.findIndex((r) => r.id === selectedRfi.id) < filteredRfis.length - 1
    : false

  const handleDeleteClick = useCallback((rfi: RFIData) => {
    setRfiToDelete(rfi)
    setDeleteModalOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (rfiToDelete) {
      setRfiData((prev) => prev.filter((r) => r.id !== rfiToDelete.id))
      if (selectedRfi?.id === rfiToDelete.id) setSelectedRfi(null)
    }
    setDeleteModalOpen(false)
    setRfiToDelete(null)
  }, [rfiToDelete, selectedRfi])

  const handleCreateOpen = useCallback(() => {
    const newId = (rfiData.length + 1).toString()
    const newNumber = `RFI-${242 + rfiData.length}`
    setDraftData({
      id: newId,
      rfiNumber: newNumber,
      status: "Draft" as const,
      subject: "",
      rfiManager: "",
      assignee: "",
      dueDate: "",
      createdBy: "Current User",
      creationDate: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      officialResponse: "",
      costImpact: "TBD" as const,
      scheduleImpact: "TBD" as const,
      location: "",
      costCode: "",
      responsibleContractor: "",
      isPrivate: false,
      hasRelatedItems: false,
      hasChangeHistory: false,
    })
    setIsCreateOpen(true)
  }, [rfiData.length])

  const handleDraftUpdate = useCallback(
    (data: Partial<RFIData>) => {
      setDraftData(data)
      setRfiData((prev) => {
        const exists = prev.find((r) => r.id === data.id)
        if (exists) {
          return prev.map((r) => (r.id === data.id ? { ...r, ...data } as RFIData : r))
        }
        return [...prev, data as RFIData]
      })
    },
    []
  )

  const removeFilterChip = useCallback((filterToRemove: FilterValue) => {
    setFilters((prev) => prev.filter((f) => f.field !== filterToRemove.field))
  }, [])

  const clearAllFilterChips = useCallback(() => {
    setFilters([])
  }, [])

  // Full page view
  if (fullPageRfi) {
    return (
      <RFIFullPageView
        rfiData={fullPageRfi}
        onBack={() => setFullPageRfi(null)}
      />
    )
  }

  // Render cell content
  const renderCell = (rfi: RFIData, columnId: string) => {
    switch (columnId) {
      case "rfiNumber":
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground-primary">{rfi.rfiNumber}</span>
            {rfi.isPrivate && <Lock className="w-3.5 h-3.5 text-foreground-tertiary" />}
            {rfi.hasRelatedItems && <Paperclip className="w-3.5 h-3.5 text-foreground-tertiary" />}
          </div>
        )
      case "status":
        return <StatusBadge status={rfi.status} />
      case "subject":
        return <span className="line-clamp-1 text-foreground-primary">{rfi.subject}</span>
      case "rfiManager":
        return <span className="text-foreground-secondary">{rfi.rfiManager}</span>
      case "assignee":
        return <span className="text-foreground-secondary">{rfi.assignee || "\u2014"}</span>
      case "dueDate":
        return <span className="text-foreground-secondary">{rfi.dueDate || "\u2014"}</span>
      case "costImpact":
        return <span className="text-foreground-secondary">{rfi.costImpact}</span>
      case "scheduleImpact":
        return <span className="text-foreground-secondary">{rfi.scheduleImpact}</span>
      default:
        return null
    }
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 flex-shrink-0 bg-white">
        <div>
          <h1 className="text-xl font-semibold text-foreground-primary">
            Skyline Tower: RFIs
          </h1>
          <p className="text-sm text-foreground-tertiary mt-0.5">
            Request for Information tracking and management - Phase 6 Complete
          </p>
        </div>
        <Button
          size="sm"
          className="bg-foreground-primary text-foreground-inverse hover:bg-foreground-primary/90 gap-1.5"
          onClick={handleCreateOpen}
        >
          <Plus className="w-4 h-4" />
          Create
        </Button>
      </div>

      {/* ── Top-Level Tabs: Requests / Recycle Bin ── */}
      <div className="border-border-default bg-background-primary flex flex-shrink-0 gap-2 border-b px-6">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "-mb-px h-auto rounded-none border-b-2 border-transparent px-2 py-3 text-sm font-medium shadow-none ring-0",
            activeTopTab === "requests"
              ? "border-foreground-primary text-foreground-primary"
              : "text-foreground-tertiary hover:text-foreground-primary",
          )}
          onClick={() => setActiveTopTab("requests")}
        >
          Requests
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "-mb-px h-auto rounded-none border-b-2 border-transparent px-2 py-3 text-sm font-medium shadow-none ring-0",
            activeTopTab === "recycle"
              ? "border-foreground-primary text-foreground-primary"
              : "text-foreground-tertiary hover:text-foreground-primary",
          )}
          onClick={() => setActiveTopTab("recycle")}
        >
          Recycle Bin
        </Button>
      </div>

      {/* ── Recycle Bin placeholder ── */}
      {activeTopTab === "recycle" && (
        <div className="flex-1 flex items-center justify-center text-foreground-tertiary text-sm">
          No deleted RFIs
        </div>
      )}

      {/* ── Requests content ── */}
      {activeTopTab === "requests" && (
        <>
          {/* ── Sub-header row: "All RFIs" dropdown + View Tabs + "Add View" ── */}
          <div className="bg-background-primary flex flex-shrink-0 items-center justify-between px-6 py-3">
            {/* Left: Status filter dropdown + View Tabs */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("gap-2 font-normal", activeViewId && "opacity-50")}
                    iconTrailing={ChevronDown}
                    onClick={() => {
                      if (activeViewId) {
                        setActiveViewId(null)
                      }
                    }}
                  >
                    {statusFilterLabel}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[160px]">
                  {RFI_FILTER_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.id}
                      onSelect={() => {
                        setStatusFilter(option.id)
                        setActiveViewId(null)
                      }}
                      className={cn("cursor-pointer", statusFilter === option.id && "font-medium")}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Active View Tabs - inline with dropdown */}
              {activeTabs.map((view) => (
                <div
                  key={view.id}
                  onClick={() => handleSelectViewTab(view.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors",
                    activeViewId === view.id
                      ? "bg-foreground-primary text-foreground-inverse"
                      : "bg-background-primary border border-border-default hover:border-border-hover"
                  )}
                >
                  {recentlyAddedViewId === view.id && (
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                  )}
                  {view.type === "shared" && recentlyAddedViewId !== view.id && (
                    <Users className="w-3.5 h-3.5" />
                  )}
                  <span className="truncate max-w-[150px]">{view.name}</span>
                  <Badge 
                    variant={activeViewId === view.id ? "outline" : "secondary"} 
                    className={cn(
                      "text-xs",
                      activeViewId === view.id && "border-foreground-inverse/30 text-foreground-inverse"
                    )}
                  >
                    {view.recordCount}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "ml-1 h-6 w-6 shrink-0 rounded-full",
                      activeViewId === view.id ? "hover:bg-foreground-inverse/15" : "hover:bg-asphalt-200/80",
                    )}
                    onClick={e => {
                      e.stopPropagation()
                      handleRemoveViewTab(view.id)
                    }}
                    aria-label={`Remove ${view.name} tab`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Right: Add View dropdown with saved views */}
            <DropdownMenu open={addViewDropdownOpen} onOpenChange={setAddViewDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="relative gap-2 font-normal text-foreground-secondary"
                  iconLeading={Plus}
                  iconTrailing={ChevronDown}
                >
                  Add View
                  {hasNewSharedViews ? (
                    <span className="absolute -top-1 -right-1 size-2.5 animate-pulse rounded-full bg-amber-500" />
                  ) : null}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {/* Create New View */}
                <DropdownMenuItem
                  onSelect={() => {
                    setAddViewDropdownOpen(false)
                    setCreateViewDialogOpen(true)
                  }}
                  className="cursor-pointer"
                >
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <Plus className="size-4 shrink-0" />
                    <span>Create New View</span>
                  </span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Your Views Section */}
                {availablePersonalViews.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-medium text-foreground-tertiary">
                      Your Views
                    </div>
                    {availablePersonalViews.map((view) => (
                      <DropdownMenuItem
                        key={view.id}
                        onSelect={() => handleAddPersonalView(view)}
                        className="cursor-pointer flex items-center justify-between"
                      >
                        <span className="truncate">{view.name}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {view.recordCount}
                        </Badge>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                )}
                
                {/* Shared Views Section */}
                {availableSharedViews.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-medium text-foreground-tertiary">
                      Shared Views
                    </div>
                    {availableSharedViews.map((view) => (
                      <DropdownMenuItem
                        key={view.id}
                        onSelect={() => handleAddSharedView(view)}
                        className="cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Users className="w-3.5 h-3.5 text-foreground-tertiary flex-shrink-0" />
                          <span className="truncate">{view.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 ml-2">
                          {view.isNew && (
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] px-1.5">
                              NEW
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {view.recordCount}
                          </Badge>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
                
                {/* Empty state */}
                {availablePersonalViews.length === 0 && availableSharedViews.length === 0 && (
                  <div className="px-2 py-3 text-xs text-foreground-tertiary text-center">
                    No saved views available
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Main content area: flex row for split view */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left pane: table */}
            <div
              className={cn(
                "flex flex-col transition-all duration-300 overflow-hidden",
                selectedRfi ? "w-1/3 min-w-[300px] flex-shrink-0" : "w-full"
              )}
            >
              {/* ── Toolbar Row ── */}
              {!selectedRfi && selectedRows.length === 0 && (
                <div className="flex items-center justify-between px-6 py-3 border-b border-border-default bg-white flex-shrink-0">
                  <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative w-60">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
                      <Input
                        placeholder="Search RFIs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 text-sm"
                      />
                    </div>

                    {/* Filters */}
                    <RFIFiltersPopover
                      filters={filters}
                      onFiltersChange={setFilters}
                      activeCount={totalFilterValues}
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    {/* View Mode Toggle */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-9 w-9",
                        viewMode === "list" && "bg-asphalt-100"
                      )}
                      onClick={() => setViewMode("list")}
                    >
                      <LayoutList className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-9 w-9",
                        viewMode === "grid" && "bg-asphalt-100"
                      )}
                      onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </Button>

                    {/* Column Configuration */}
                    <RFIConfigureViewsPopover
                      columns={columnConfig}
                      onConfigChange={setColumnConfig}
                      onReset={handleResetColumns}
                      open={configureViewsOpen}
                      onOpenChange={setConfigureViewsOpen}
                    />
                  </div>
                </div>
              )}

              {/* Bulk Actions Row */}
              {selectedRows.length > 0 && (
                <div className="flex items-center justify-between px-6 py-3 border-b border-border-default bg-background-primary flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground-primary">
                      {selectedRows.length} selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => setSelectedRows([])}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}

              {/* Filter Pills Row */}
              {filters.length > 0 && !selectedRfi && (
                <div className="border-border-default bg-background-primary flex flex-shrink-0 flex-wrap items-center gap-2 border-b px-6 py-2">
                  {filters.map((filter, index) => {
                    const fieldLabels: Record<string, string> = {
                      status: "Status",
                      assignee: "Ball in Court",
                      rfiManager: "RFI Manager",
                      costImpact: "Cost Impact",
                      scheduleImpact: "Schedule Impact",
                      responsibleContractor: "Contractor",
                    }
                    return (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1"
                      >
                        <span className="text-xs">
                          {fieldLabels[filter.field] || filter.field}: {filter.values.join(", ")}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="ml-1 h-5 w-5 shrink-0 rounded-full"
                          onClick={() => removeFilterChip(filter)}
                          aria-label="Remove filter"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )
                  })}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={clearAllFilterChips}
                  >
                    Clear all
                  </Button>
                </div>
              )}

              {/* ── Data Table / Grid ── */}
              <div className="flex-1 overflow-hidden relative">
                {viewMode === "list" ? (
                  <div className="h-full overflow-x-auto overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border-default">
                          {/* Sticky Checkbox */}
                          <TableHead
                            className={cn(
                              "w-[48px] min-w-[48px] max-w-[48px] pl-6 pr-0",
                              "sticky left-0 z-20 bg-background-primary"
                            )}
                          >
                            <Checkbox
                              checked={
                                selectedRows.length === filteredRfis.length &&
                                filteredRfis.length > 0
                              }
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          {visibleColumns.map((column, index) => (
                            <TableHead
                              key={column.id}
                              className={cn(
                                "cursor-pointer group",
                                index === 0 &&
                                  "sticky left-[48px] z-20 bg-background-primary w-[140px] min-w-[140px] max-w-[140px] pl-3 pr-2 shadow-[2px_0_4px_rgba(0,0,0,0.05)]"
                              )}
                              onClick={() => handleSort(column.id)}
                            >
                              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground-secondary hover:text-foreground-primary transition-colors">
                                {column.label}
                                {sortColumn === column.id ? (
                                  sortDirection === "asc" ? (
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  ) : (
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  )
                                ) : (
                                  <ArrowUpDown className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 transition-opacity" />
                                )}
                              </div>
                            </TableHead>
                          ))}
                          {/* Sticky Actions */}
                          <TableHead
                            className={cn(
                              "w-[60px] min-w-[60px] max-w-[60px]",
                              "sticky right-0 z-20 bg-background-primary shadow-[-2px_0_4px_rgba(0,0,0,0.05)]"
                            )}
                          />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedRfis.map((rfi) => (
                          <TableRow
                            key={rfi.id}
                            onClick={() => handleRowClick(rfi)}
                            className={cn(
                              "group cursor-pointer bg-background-primary",
                              selectedRfi?.id === rfi.id
                                ? "bg-asphalt-100 hover:bg-asphalt-100"
                                : "hover:bg-asphalt-50"
                            )}
                          >
                            {/* Sticky Checkbox Cell */}
                            <TableCell
                              onClick={(e) => e.stopPropagation()}
                              className={cn(
                                "w-[48px] min-w-[48px] max-w-[48px] pl-6 pr-0",
                                "sticky left-0 z-10",
                                selectedRfi?.id === rfi.id
                                  ? "bg-asphalt-100"
                                  : "bg-background-primary group-hover:bg-asphalt-50"
                              )}
                            >
                              <Checkbox
                                checked={selectedRows.includes(rfi.id)}
                                onCheckedChange={() => handleSelectRow(rfi.id)}
                              />
                            </TableCell>
                            {visibleColumns.map((column, index) => (
                              <TableCell
                                key={column.id}
                                className={cn(
                                  index === 0 &&
                                    "sticky left-[48px] z-10 w-[140px] min-w-[140px] max-w-[140px] pl-3 pr-2 shadow-[2px_0_4px_rgba(0,0,0,0.05)]",
                                  index === 0 &&
                                    (selectedRfi?.id === rfi.id
                                      ? "bg-asphalt-100"
                                      : "bg-background-primary group-hover:bg-asphalt-50")
                                )}
                              >
                                {renderCell(rfi, column.id)}
                              </TableCell>
                            ))}
                            {/* Sticky Actions Cell */}
                            <TableCell
                              onClick={(e) => e.stopPropagation()}
                              className={cn(
                                "sticky right-0 z-10",
                                selectedRfi?.id === rfi.id
                                  ? "bg-asphalt-100"
                                  : "bg-background-primary group-hover:bg-asphalt-50",
                                "shadow-[-2px_0_4px_rgba(0,0,0,0.05)]"
                              )}
                            >
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onSelect={() => setFullPageRfi(rfi)}
                                  >
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-foreground-danger cursor-pointer"
                                    onSelect={() => handleDeleteClick(rfi)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  /* Grid View */
                  <div className="bg-background-primary h-full overflow-auto">
                    <div className="p-2">
                      <div
                        className={cn(
                          "grid gap-2",
                          selectedRfi
                            ? "grid-cols-1"
                            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        )}
                      >
                        {paginatedRfis.map((rfi) => (
                          <div
                            key={rfi.id}
                            className={cn(
                              "relative flex flex-col text-left p-4 rounded-sm shadow-sm transition-all cursor-pointer bg-white overflow-hidden",
                              selectedRfi?.id === rfi.id &&
                                "ring-2 ring-foreground-primary"
                            )}
                            onClick={() => handleRowClick(rfi)}
                          >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold text-foreground-primary">
                                    {rfi.rfiNumber}
                                  </span>
                                  {rfi.isPrivate && (
                                    <Lock className="w-3.5 h-3.5 text-foreground-tertiary flex-shrink-0" />
                                  )}
                                  {rfi.hasRelatedItems && (
                                    <Paperclip className="w-3.5 h-3.5 text-foreground-tertiary flex-shrink-0" />
                                  )}
                                </div>
                                <StatusBadge status={rfi.status} />
                              </div>
                              <div onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 -mr-2 -mt-1"
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onSelect={() => setFullPageRfi(rfi)}
                                    >
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-foreground-danger cursor-pointer"
                                      onSelect={() => handleDeleteClick(rfi)}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            {/* Subject */}
                            <div className="mb-3">
                              <p className="text-sm font-medium text-foreground-primary line-clamp-2">
                                {rfi.subject}
                              </p>
                            </div>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                              <div>
                                <span className="text-foreground-tertiary">
                                  {"Manager: "}
                                </span>
                                <span className="text-foreground-secondary">
                                  {rfi.rfiManager}
                                </span>
                              </div>
                              <div>
                                <span className="text-foreground-tertiary">
                                  {"Assignee: "}
                                </span>
                                <span className="text-foreground-secondary">
                                  {rfi.assignee || "\u2014"}
                                </span>
                              </div>
                              <div>
                                <span className="text-foreground-tertiary">
                                  {"Due: "}
                                </span>
                                <span className="text-foreground-secondary">
                                  {rfi.dueDate || "\u2014"}
                                </span>
                              </div>
                              <div>
                                <span className="text-foreground-tertiary">
                                  {"Cost: "}
                                </span>
                                <span className="text-foreground-secondary">
                                  {rfi.costImpact}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Pagination Footer — DS Pagination primitive (ellipsis when many pages) */}
                {totalPages > 1 && (
                  <div className="border-border-default bg-card flex flex-shrink-0 flex-wrap items-center justify-between gap-3 border-t px-6 py-3">
                    <div className="text-foreground-secondary text-sm">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredRfis.length)} of {filteredRfis.length} RFIs
                    </div>
                    <Pagination.Root
                      page={currentPage}
                      total={totalPages}
                      onPageChange={setCurrentPage}
                      siblingCount={1}
                      className="flex items-center gap-2"
                    >
                      <Pagination.PrevTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" aria-label="Previous page">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </Pagination.PrevTrigger>
                      <Pagination.Context>
                        {({ pages }) => (
                          <>
                            <div className="hidden items-center gap-0.5 sm:flex">
                              {pages.map((pageItem, index) =>
                                pageItem.type === "page" ? (
                                  <Pagination.Item
                                    key={index}
                                    value={pageItem.value}
                                    isCurrent={pageItem.isCurrent}
                                  >
                                    {({ isSelected: pageIsCurrent, onClick, "aria-current": ariaCurrent }) => (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        className={cn(
                                          "outline-focus-ring text-quaternary hover:bg-primary_hover hover:text-secondary focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 flex size-9 min-h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg p-0 text-sm font-medium shadow-none ring-0 transition-[color,background-color] duration-ds-short ease-ds-standard",
                                          pageIsCurrent && "bg-primary_hover text-secondary",
                                        )}
                                        onClick={onClick}
                                        aria-current={ariaCurrent}
                                      >
                                        {pageItem.value}
                                      </Button>
                                    )}
                                  </Pagination.Item>
                                ) : (
                                  <Pagination.Ellipsis
                                    key={index}
                                    className="text-tertiary flex size-9 shrink-0 items-center justify-center"
                                  >
                                    &#8230;
                                  </Pagination.Ellipsis>
                                ),
                              )}
                            </div>
                            <span className="text-foreground-secondary text-sm whitespace-pre sm:hidden">
                              Page {currentPage} of {totalPages}
                            </span>
                          </>
                        )}
                      </Pagination.Context>
                      <Pagination.NextTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" aria-label="Next page">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Pagination.NextTrigger>
                    </Pagination.Root>
                  </div>
                )}
              </div>
            </div>

            {/* Split View Detail Pane */}
            {selectedRfi && (
              <div className="flex-1 border-l border-border-default bg-white overflow-hidden">
                <RFIDetailView
                  rfiData={selectedRfi}
                  onClose={handleCloseDetail}
                  onOpenFullView={handleOpenFullView}
                  onNavigateUp={handleNavigateUp}
                  onNavigateDown={handleNavigateDown}
                  canNavigateUp={canNavigateUp}
                  canNavigateDown={canNavigateDown}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Create Slideout */}
      <RFICreateSlideout
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        draftData={draftData}
        onDraftUpdate={handleDraftUpdate}
      />

      {/* Delete Modal */}
      <DeleteRFIModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        rfiNumber={rfiToDelete ? parseInt(rfiToDelete.rfiNumber.replace("RFI-", "")) : 0}
        onConfirm={handleConfirmDelete}
      />

      {/* Create View Dialog */}
      <Dialog open={createViewDialogOpen} onOpenChange={setCreateViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New View</DialogTitle>
            <DialogDescription>
              Save your current filters and column settings as a reusable view.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="view-name">View Name</Label>
              <Input
                id="view-name"
                placeholder="e.g., My Open RFIs"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="view-description">Description (optional)</Label>
              <Textarea
                id="view-description"
                placeholder="Describe what this view shows..."
                value={newViewDescription}
                onChange={(e) => setNewViewDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="view-share">Share With</Label>
              <Select
                value={newViewShareType}
                onValueChange={(value: "private" | "team" | "everyone") => setNewViewShareType(value)}
              >
                <SelectTrigger id="view-share">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>Private - Only you</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="team">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Team - Your team members</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="everyone">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Everyone - All project members</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Current Filters Summary */}
            {filters.length > 0 && (
              <div className="rounded-md bg-background-primary p-3">
                <p className="text-xs font-medium text-foreground-secondary mb-2">
                  This view will include {filters.length} active filter{filters.length > 1 ? "s" : ""}:
                </p>
                <div className="flex flex-wrap gap-1">
                  {filters.map((filter, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {filter.label}: {filter.values.join(", ")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateViewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateView} disabled={!newViewName.trim()}>
              Create View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
