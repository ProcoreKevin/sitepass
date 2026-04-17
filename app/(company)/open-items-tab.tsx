"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Users,
  Lock,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableCard } from "@/components/ui/table-collection"
import { Checkbox } from "@/components/ui/checkbox"
import { OpenItemsFiltersPopover, type OpenItemFilterValue } from "@/components/open-items-filters-popover"
import {
  OpenItemsConfigureViewsPopover,
  type OpenItemColumnConfig,
  DEFAULT_OPEN_ITEM_COLUMNS,
} from "@/components/open-items-configure-views-popover"
import { OpenItemsDetailView } from "@/components/open-items-detail-view"
import { MOCK_OPEN_ITEMS, type OpenItem } from "@/lib/open-items-types"

// ── Saved View type ──
interface OpenItemSavedView {
  id: string
  name: string
  description: string
  type: "personal" | "shared"
  isNew?: boolean
  recordCount: number
  filters: OpenItemFilterValue[]
  columns: OpenItemColumnConfig[]
}

const MOCK_OI_PERSONAL_VIEWS: OpenItemSavedView[] = [
  {
    id: "oi-pv-1",
    name: "My Overdue Items",
    description: "All items past their due date",
    type: "personal",
    recordCount: 7,
    filters: [{ field: "overdue", label: "Overdue", operator: "is_any_of", values: ["true"] }],
    columns: [],
  },
  {
    id: "oi-pv-2",
    name: "Open RFIs & Submittals",
    description: "Open RFIs and submittals only",
    type: "personal",
    recordCount: 9,
    filters: [{ field: "type", label: "Item Type", operator: "is_any_of", values: ["RFI", "Submittal"] }],
    columns: [],
  },
]

const MOCK_OI_SHARED_VIEWS: OpenItemSavedView[] = [
  {
    id: "oi-sv-1",
    name: "Safety Observations",
    description: "All safety-related observations",
    type: "shared",
    isNew: true,
    recordCount: 4,
    filters: [{ field: "type", label: "Item Type", operator: "is_any_of", values: ["Observation"] }],
    columns: [],
  },
]

const STATUS_FILTER_OPTIONS = [
  { id: "all",    label: "All Items" },
  { id: "open",   label: "Open" },
  { id: "review", label: "Pending Review" },
  { id: "active", label: "In Progress" },
] as const

const STATUS_STYLES: Record<string, string> = {
  "Open":           "bg-success-25 text-success-800",
  "Pending Review": "bg-asphalt-100 text-asphalt-500",
  "In Progress":    "bg-asphalt-50 text-asphalt-800",
}

export function OpenItemsTab() {
  const [items] = useState<OpenItem[]>(MOCK_OPEN_ITEMS)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<OpenItemFilterValue[]>([])
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [columnConfig, setColumnConfig] = useState<OpenItemColumnConfig[]>(DEFAULT_OPEN_ITEM_COLUMNS)
  const [configureViewsOpen, setConfigureViewsOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<OpenItem | null>(null)
  const [activeTabs, setActiveTabs] = useState<OpenItemSavedView[]>([])
  const [availablePersonalViews, setAvailablePersonalViews] = useState<OpenItemSavedView[]>(MOCK_OI_PERSONAL_VIEWS)
  const [availableSharedViews, setAvailableSharedViews] = useState<OpenItemSavedView[]>(MOCK_OI_SHARED_VIEWS)
  const [activeViewId, setActiveViewId] = useState<string | null>(null)
  const [recentlyAddedViewId, setRecentlyAddedViewId] = useState<string | null>(null)
  const [addViewDropdownOpen, setAddViewDropdownOpen] = useState(false)
  const [createViewDialogOpen, setCreateViewDialogOpen] = useState(false)
  const [newViewName, setNewViewName] = useState("")
  const [newViewDescription, setNewViewDescription] = useState("")
  const [newViewShareType, setNewViewShareType] = useState<"private" | "team" | "everyone">("private")

  const visibleColumns = useMemo(() => columnConfig.filter(c => c.visible), [columnConfig])
  const totalFilterValues = useMemo(() => filters.reduce((s, f) => s + f.values.length, 0), [filters])
  const hasNewSharedViews = useMemo(() => availableSharedViews.some(v => v.isNew), [availableSharedViews])
  const statusFilterLabel = STATUS_FILTER_OPTIONS.find(o => o.id === statusFilter)?.label ?? "All Items"

  const filteredItems = useMemo(() => {
    let result = [...items]
    if (statusFilter === "open")   result = result.filter(i => i.status === "Open")
    if (statusFilter === "review") result = result.filter(i => i.status === "Pending Review")
    if (statusFilter === "active") result = result.filter(i => i.status === "In Progress")
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(i =>
        i.description.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q) ||
        i.assignee.toLowerCase().includes(q)
      )
    }
    if (filters.length > 0) {
      const byField: Record<string, string[]> = {}
      filters.forEach(f => { byField[f.field] = [...(byField[f.field] ?? []), ...f.values] })
      Object.entries(byField).forEach(([field, values]) => {
        result = result.filter(item => {
          if (field === "overdue") return values.includes(String(item.overdue ?? false))
          const val = item[field as keyof OpenItem]
          return values.includes(val as string)
        })
      })
    }
    if (sortColumn) {
      result.sort((a, b) => {
        const av = String(a[sortColumn as keyof OpenItem] ?? "")
        const bv = String(b[sortColumn as keyof OpenItem] ?? "")
        const cmp = av.localeCompare(bv)
        return sortDirection === "asc" ? cmp : -cmp
      })
    }
    return result
  }, [items, statusFilter, searchQuery, filters, sortColumn, sortDirection])

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

  useEffect(() => { setCurrentPage(1) }, [searchQuery, filters, statusFilter])

  const handleAddPersonalView = useCallback((view: OpenItemSavedView) => {
    setActiveTabs(prev => [...prev, view])
    setAvailablePersonalViews(prev => prev.filter(v => v.id !== view.id))
    setActiveViewId(view.id)
    setAddViewDropdownOpen(false)
  }, [])

  const handleAddSharedView = useCallback((view: OpenItemSavedView) => {
    const updated = { ...view, isNew: false }
    setActiveTabs(prev => [...prev, updated])
    setAvailableSharedViews(prev => prev.filter(v => v.id !== view.id))
    setActiveViewId(view.id)
    setRecentlyAddedViewId(view.id)
    setAddViewDropdownOpen(false)
    setTimeout(() => setRecentlyAddedViewId(null), 2000)
  }, [])

  const handleRemoveViewTab = useCallback((viewId: string) => {
    const view = activeTabs.find(v => v.id === viewId)
    if (!view) return
    setActiveTabs(prev => prev.filter(v => v.id !== viewId))
    if (view.type === "personal") setAvailablePersonalViews(prev => [...prev, view])
    else setAvailableSharedViews(prev => [...prev, view])
    if (activeViewId === viewId) setActiveViewId(null)
  }, [activeTabs, activeViewId])

  const handleSelectViewTab = useCallback((viewId: string) => {
    setActiveViewId(viewId)
    const view = activeTabs.find(v => v.id === viewId)
    if (view && view.filters.length > 0) setFilters(view.filters)
  }, [activeTabs])

  const handleSort = useCallback((columnId: string) => {
    if (sortColumn === columnId) setSortDirection(prev => prev === "asc" ? "desc" : "asc")
    else { setSortColumn(columnId); setSortDirection("asc") }
  }, [sortColumn])

  const handleSelectAll = useCallback(() => {
    if (selectedRows.length === filteredItems.length) setSelectedRows([])
    else setSelectedRows(filteredItems.map(i => i.id))
  }, [selectedRows.length, filteredItems])

  const handleSelectRow = useCallback((id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }, [])

  const canNavigateUp = selectedItem ? filteredItems.findIndex(i => i.id === selectedItem.id) > 0 : false
  const canNavigateDown = selectedItem ? filteredItems.findIndex(i => i.id === selectedItem.id) < filteredItems.length - 1 : false

  const handleNavigateUp = useCallback(() => {
    if (!selectedItem) return
    const idx = filteredItems.findIndex(i => i.id === selectedItem.id)
    if (idx > 0) setSelectedItem(filteredItems[idx - 1])
  }, [selectedItem, filteredItems])

  const handleNavigateDown = useCallback(() => {
    if (!selectedItem) return
    const idx = filteredItems.findIndex(i => i.id === selectedItem.id)
    if (idx < filteredItems.length - 1) setSelectedItem(filteredItems[idx + 1])
  }, [selectedItem, filteredItems])

  const removeFilterChip = useCallback((f: OpenItemFilterValue) => {
    setFilters(prev => prev.filter(x => x.field !== f.field))
  }, [])

  const handleCreateView = useCallback(() => {
    if (!newViewName.trim()) return
    const id = `oi-${Date.now()}`
    const newView: OpenItemSavedView = {
      id,
      name: newViewName.trim(),
      description: newViewDescription.trim(),
      type: newViewShareType === "private" ? "personal" : "shared",
      isNew: true,
      recordCount: filteredItems.length,
      filters,
      columns: columnConfig,
    }
    setActiveTabs(prev => [...prev, newView])
    setActiveViewId(id)
    setRecentlyAddedViewId(id)
    setNewViewName("")
    setNewViewDescription("")
    setNewViewShareType("private")
    setCreateViewDialogOpen(false)
    setTimeout(() => {
      setRecentlyAddedViewId(null)
      setActiveTabs(prev => prev.map(v => v.id === id ? { ...v, isNew: false } : v))
    }, 2000)
  }, [newViewName, newViewDescription, newViewShareType, filters, columnConfig, filteredItems.length])

  const handleResetColumns = useCallback(() => setColumnConfig(DEFAULT_OPEN_ITEM_COLUMNS), [])

  const renderCell = (item: OpenItem, columnId: string) => {
    switch (columnId) {
      case "type":
        return <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-asphalt-100 text-asphalt-600">{item.type}</span>
      case "description":
        return <span className="line-clamp-1 text-foreground-primary">{item.description}</span>
      case "status": {
        const style = STATUS_STYLES[item.status] ?? "bg-asphalt-100 text-asphalt-600"
        return <span className={cn("inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded", style)}>{item.status}</span>
      }
      case "dueDate":
        return <span className={cn("text-sm", item.overdue ? "text-destructive font-medium" : "text-foreground-secondary")}>{item.dueDate}</span>
      case "assignee":
        return <span className="text-foreground-secondary">{item.assignee}</span>
      case "project":
        return <span className="text-foreground-secondary">{item.project ?? "Universal Construction"}</span>
      default:
        return null
    }
  }

  return (
    <div className="bg-background-primary flex h-full flex-col">

      {/* Sub-header: status filter + view tabs + Add View */}
      <div className="border-border-default bg-background-primary flex flex-shrink-0 items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" className="font-normal" iconTrailing={ChevronDown}>
                {statusFilterLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[160px]">
              {STATUS_FILTER_OPTIONS.map(opt => (
                <DropdownMenuItem key={opt.id} onSelect={() => { setStatusFilter(opt.id); setActiveViewId(null) }} className={cn("cursor-pointer", statusFilter === opt.id && "font-medium")}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {activeTabs.map(view => (
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
              {recentlyAddedViewId === view.id && <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />}
              {view.type === "shared" && recentlyAddedViewId !== view.id && <Users className="w-3.5 h-3.5" />}
              <span className="truncate max-w-[150px]">{view.name}</span>
              <Badge variant={activeViewId === view.id ? "outline" : "secondary"} className={cn("text-xs", activeViewId === view.id && "border-foreground-inverse/30 text-foreground-inverse")}>
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

        <div className="relative inline-flex shrink-0">
          {hasNewSharedViews ? (
            <span
              className="pointer-events-none absolute -right-1 -top-1 z-10 h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"
              aria-hidden
            />
          ) : null}
          <DropdownMenu open={addViewDropdownOpen} onOpenChange={setAddViewDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="font-normal text-foreground-secondary"
                iconLeading={Plus}
                iconTrailing={ChevronDown}
              >
                Add View
              </Button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
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
            {availablePersonalViews.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-xs font-medium text-foreground-tertiary">Your Views</div>
                {availablePersonalViews.map(view => (
                  <DropdownMenuItem key={view.id} onSelect={() => handleAddPersonalView(view)} className="cursor-pointer flex items-center justify-between">
                    <span className="truncate">{view.name}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">{view.recordCount}</Badge>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            {availableSharedViews.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-xs font-medium text-foreground-tertiary">Shared Views</div>
                {availableSharedViews.map(view => (
                  <DropdownMenuItem key={view.id} onSelect={() => handleAddSharedView(view)} className="cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <Users className="w-3.5 h-3.5 text-foreground-tertiary flex-shrink-0" />
                      <span className="truncate">{view.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      {view.isNew && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] px-1.5">NEW</Badge>}
                      <Badge variant="secondary" className="text-xs">{view.recordCount}</Badge>
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            )}
            {availablePersonalViews.length === 0 && availableSharedViews.length === 0 && (
              <div className="px-2 py-3 text-xs text-foreground-tertiary text-center">No saved views available</div>
            )}
          </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main area: split layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left pane */}
        <div className={cn("flex flex-col transition-all duration-300 overflow-hidden", selectedItem ? "w-1/3 min-w-[280px] flex-shrink-0" : "w-full")}>

          {/* Toolbar */}
          {!selectedItem && selectedRows.length === 0 && (
            <div className="border-border-default bg-background-primary flex flex-shrink-0 items-center justify-between border-b px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="relative w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
                  <Input placeholder="Search items..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-9 text-sm" />
                </div>
                <OpenItemsFiltersPopover filters={filters} onFiltersChange={setFilters} activeCount={totalFilterValues} />
              </div>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" className={cn("h-9 w-9", viewMode === "list" && "bg-asphalt-100")} onClick={() => setViewMode("list")}>
                  <LayoutList className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className={cn("h-9 w-9", viewMode === "grid" && "bg-asphalt-100")} onClick={() => setViewMode("grid")}>
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <OpenItemsConfigureViewsPopover columns={columnConfig} onConfigChange={setColumnConfig} onReset={handleResetColumns} open={configureViewsOpen} onOpenChange={setConfigureViewsOpen} />
              </div>
            </div>
          )}

          {/* Bulk actions */}
          {selectedRows.length > 0 && (
            <div className="flex items-center justify-between px-6 py-3 border-b border-border-default bg-background-primary flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground-primary">{selectedRows.length} selected</span>
                <Button variant="ghost" size="sm" className="h-8" iconLeading={X} onClick={() => setSelectedRows([])}>
                  Clear
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8" iconLeading={Download}>
                  Export
                </Button>
                <Button variant="outline" size="sm" className="h-8" iconLeading={Trash2}>
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Filter chips */}
          {filters.length > 0 && !selectedItem && (
            <div className="border-border-default bg-background-primary flex flex-shrink-0 flex-wrap items-center gap-2 border-b px-6 py-2">
              {filters.map((filter, idx) => (
                <Badge key={idx} variant="secondary" className="flex items-center gap-1 pr-1">
                  <span className="text-xs">{filter.label}: {filter.values.join(", ")}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-5 w-5 rounded-full"
                    onClick={() => removeFilterChip(filter)}
                    aria-label={`Remove filter ${filter.label}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setFilters([])}>Clear all</Button>
            </div>
          )}

          {/* Data area */}
          <div className="flex-1 overflow-hidden relative">
            {viewMode === "list" ? (
              <div className="flex h-full min-h-0 flex-col p-3 md:p-4">
                <TableCard.Root className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  <div className="min-h-0 flex-1 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border-default">
                      <TableHead className="w-[48px] min-w-[48px] max-w-[48px] pl-6 pr-0 sticky left-0 z-20 bg-background-primary">
                        <Checkbox checked={selectedRows.length === filteredItems.length && filteredItems.length > 0} onCheckedChange={handleSelectAll} />
                      </TableHead>
                      {visibleColumns.map((col, idx) => (
                        <TableHead
                          key={col.id}
                          className={cn("cursor-pointer group", idx === 0 && "sticky left-[48px] z-20 bg-background-primary w-[130px] min-w-[130px] max-w-[130px] pl-3 pr-2")}
                          onClick={() => handleSort(col.id)}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground-secondary hover:text-foreground-primary transition-colors">
                            {col.label}
                            {sortColumn === col.id
                              ? (sortDirection === "asc" ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />)
                              : <ArrowUpDown className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 transition-opacity" />
                            }
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="w-[60px] min-w-[60px] max-w-[60px] sticky right-0 z-20 bg-background-primary" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={visibleColumns.length + 2} className="py-16 text-center text-foreground-tertiary text-sm">
                          No items match the current filters.
                        </TableCell>
                      </TableRow>
                    ) : paginatedItems.map(item => (
                      <TableRow
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={cn(
                          "group cursor-pointer bg-background-primary",
                          selectedItem?.id === item.id ? "bg-asphalt-100 hover:bg-asphalt-100" : "hover:bg-asphalt-50",
                        )}
                      >
                        <TableCell
                          onClick={e => e.stopPropagation()}
                          className={cn(
                            "sticky left-0 z-10 w-[48px] min-w-[48px] max-w-[48px] pl-6 pr-0",
                            selectedItem?.id === item.id ? "bg-asphalt-100" : "bg-background-primary group-hover:bg-asphalt-50",
                          )}
                        >
                          <Checkbox checked={selectedRows.includes(item.id)} onCheckedChange={() => handleSelectRow(item.id)} />
                        </TableCell>
                        {visibleColumns.map((col, idx) => (
                          <TableCell
                            key={col.id}
                            className={cn(
                              idx === 0 && "sticky left-[48px] z-10 w-[130px] min-w-[130px] max-w-[130px] pl-3 pr-2",
                              idx === 0 && (selectedItem?.id === item.id ? "bg-asphalt-100" : "bg-background-primary group-hover:bg-asphalt-50"),
                            )}
                          >
                            {renderCell(item, col.id)}
                          </TableCell>
                        ))}
                        <TableCell
                          onClick={e => e.stopPropagation()}
                          className={cn(
                            "sticky right-0 z-10",
                            selectedItem?.id === item.id ? "bg-asphalt-100" : "bg-background-primary group-hover:bg-asphalt-50",
                          )}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer" onSelect={() => setSelectedItem(item)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-foreground-danger cursor-pointer"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                  </div>
                </TableCard.Root>
              </div>
            ) : (
              <div className="bg-background-primary h-full overflow-auto p-2">
                <div className={cn("grid gap-2", selectedItem ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")}>
                  {paginatedItems.map(item => {
                    const statusStyle = STATUS_STYLES[item.status] ?? "bg-asphalt-100 text-asphalt-600"
                    return (
                      <div key={item.id} onClick={() => setSelectedItem(item)} className={cn("relative flex cursor-pointer flex-col overflow-hidden rounded-sm p-4 text-left shadow-sm transition-all bg-background-primary", selectedItem?.id === item.id && "ring-2 ring-foreground-primary")}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <span className="inline-flex self-start items-center px-2 py-0.5 text-xs font-medium rounded bg-asphalt-100 text-asphalt-600">{item.type}</span>
                            <span className={cn("inline-flex self-start items-center px-2.5 py-0.5 text-xs font-medium rounded", statusStyle)}>{item.status}</span>
                          </div>
                          <div onClick={e => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-1"><MoreHorizontal className="w-4 h-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer" onSelect={() => setSelectedItem(item)}>View Details</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-foreground-danger cursor-pointer"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-foreground-primary line-clamp-2 mb-3">{item.description}</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mt-auto">
                          <div><span className="text-foreground-tertiary">Assignee: </span><span className="text-foreground-secondary">{item.assignee}</span></div>
                          <div><span className={cn(item.overdue ? "text-destructive" : "text-foreground-tertiary")}>Due: </span><span className={cn("text-foreground-secondary", item.overdue && "text-destructive font-medium")}>{item.dueDate}</span></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {totalPages > 1 && (
              <div className="border-border-default bg-background-primary flex flex-shrink-0 items-center justify-between border-t px-6 py-3">
                <div className="text-sm text-foreground-secondary">
                  Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length} items
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8 p-0"><ChevronLeft className="h-4 w-4" /></Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="h-8 w-8 p-0">{page}</Button>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8 p-0"><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right pane: detail view */}
        {selectedItem && (
          <div className="border-border-default bg-background-primary flex-1 overflow-hidden border-l">
            <OpenItemsDetailView
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              onNavigateUp={handleNavigateUp}
              onNavigateDown={handleNavigateDown}
              canNavigateUp={canNavigateUp}
              canNavigateDown={canNavigateDown}
            />
          </div>
        )}
      </div>

      {/* Create View Dialog */}
      <Dialog open={createViewDialogOpen} onOpenChange={setCreateViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New View</DialogTitle>
            <DialogDescription>Save your current filters and column settings as a reusable view.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="oi-view-name">View Name</Label>
              <Input id="oi-view-name" placeholder="e.g., My Open RFIs" value={newViewName} onChange={e => setNewViewName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="oi-view-desc">Description (optional)</Label>
              <Textarea id="oi-view-desc" placeholder="Describe what this view shows..." value={newViewDescription} onChange={e => setNewViewDescription(e.target.value)} className="resize-none" rows={3} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="oi-view-share">Share With</Label>
              <Select value={newViewShareType} onValueChange={(v: "private" | "team" | "everyone") => setNewViewShareType(v)}>
                <SelectTrigger id="oi-view-share"><SelectValue placeholder="Select visibility" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="private"><div className="flex items-center gap-2"><Lock className="w-4 h-4" /><span>Private — Only you</span></div></SelectItem>
                  <SelectItem value="team"><div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>Team — Your team members</span></div></SelectItem>
                  <SelectItem value="everyone"><div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>Everyone — All project members</span></div></SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filters.length > 0 && (
              <div className="rounded-md bg-background-primary p-3">
                <p className="text-xs font-medium text-foreground-secondary mb-2">This view will include {filters.length} active filter{filters.length > 1 ? "s" : ""}:</p>
                <div className="flex flex-wrap gap-1">
                  {filters.map((f, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{f.label}: {f.values.join(", ")}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateViewDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateView} disabled={!newViewName.trim()}>Create View</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
