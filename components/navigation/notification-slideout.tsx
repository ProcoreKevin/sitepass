"use client"

import { useMemo, useState, type ComponentProps } from "react"
import {
  RiCloseLine,
  RiSearchLine,
  RiArrowDownSLine,
  RiMore2Line,
  RiFileList3Fill,
} from "react-icons/ri"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SlideOut, SlideOutClose, SlideOutContent } from "@/components/ui/slide-out"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

type NotificationType = "action-required" | "informational" | "mention"
type TabType = "all" | "action-required" | "mentions" | "informational"

interface Notification {
  id: string
  type: NotificationType
  title: string
  itemLabel: string
  company: string
  project: string
  timeAgo: string
  unread: boolean
  mention?: string
  group: "Today" | "Yesterday" | "Earlier"
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "action-required",
    title: "M. Stegner updated this submittal. Ball is in your court.",
    itemLabel: "Submittal S 22-0500 - Fire Alarm System Drawings",
    company: "Universal Construction",
    project: "093487 - Cottage Hospital",
    timeAgo: "2 hours ago",
    unread: true,
    group: "Today",
  },
  {
    id: "2",
    type: "informational",
    title: "P. Gomez updated this submittal. Ball is in your court.",
    itemLabel: "Submittal S 22-0500 - Fire Alarm System Drawings",
    company: "Universal Construction",
    project: "093487 - Cottage Hospital",
    timeAgo: "2 hours ago",
    unread: true,
    group: "Today",
  },
  {
    id: "3",
    type: "mention",
    title: "You were mentioned on a submittal",
    itemLabel: "Submittal S 22-0500 - Fire Alarm System Drawings",
    mention: "@mstegner here is a comment that you should pay attention to.",
    company: "Universal Construction",
    project: "093487 - Cottage Hospital",
    timeAgo: "2 hours ago",
    unread: true,
    group: "Today",
  },
  {
    id: "4",
    type: "informational",
    title: "S. Kassaei updated this submittal. Ball is in your court.",
    itemLabel: "Submittal S 22-0500 - Fire Alarm System Drawings",
    company: "Universal Construction",
    project: "093487 - Cottage Hospital",
    timeAgo: "2 hours ago",
    unread: true,
    group: "Today",
  },
  {
    id: "5",
    type: "action-required",
    title: "M. Stegner updated this submittal. Ball is in your court.",
    itemLabel: "Submittal S 22-0500 - Fire Alarm System Drawings",
    company: "Universal Construction",
    project: "093487 - Cottage Hospital",
    timeAgo: "3 hours ago",
    unread: false,
    group: "Today",
  },
  {
    id: "6",
    type: "informational",
    title: "New RFI submitted for review on Phase 2 scope.",
    itemLabel: "RFI 0088 - Structural Load Path Clarification",
    company: "Universal Construction",
    project: "093487 - Cottage Hospital",
    timeAgo: "Yesterday",
    unread: false,
    group: "Yesterday",
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function typeBadgeVariant(type: NotificationType): ComponentProps<typeof Badge>["variant"] {
  switch (type) {
    case "action-required":
      return "warning"
    case "informational":
      return "information"
    case "mention":
      return "outline"
    default:
      return "default"
  }
}

function typeBadgeLabel(type: NotificationType): string {
  switch (type) {
    case "action-required":
      return "Action Required"
    case "informational":
      return "Informational"
    case "mention":
      return "Mention"
    default:
      return ""
  }
}

function notificationMatchesTab(n: Notification, tab: TabType): boolean {
  if (tab === "all") return true
  if (tab === "action-required") return n.type === "action-required"
  if (tab === "mentions") return n.type === "mention"
  if (tab === "informational") return n.type === "informational"
  return true
}

function filterNotifications(
  tab: TabType,
  onlyUnread: boolean,
  search: string,
): Notification[] {
  const q = search.trim().toLowerCase()
  return MOCK_NOTIFICATIONS.filter(n => {
    if (onlyUnread && !n.unread) return false
    if (q && !n.title.toLowerCase().includes(q) && !n.itemLabel.toLowerCase().includes(q)) return false
    return notificationMatchesTab(n, tab)
  })
}

// ─── Subcomponents ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: NotificationType }) {
  return (
    <Badge variant={typeBadgeVariant(type)}>
      {typeBadgeLabel(type)}
    </Badge>
  )
}

function NotificationRow({ n }: { n: Notification }) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "flex cursor-pointer gap-3 border-b border-[var(--color-border-default)] px-5 py-3 transition-colors duration-150",
        "hover:bg-[var(--color-bg-row-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-border-input-focus)]",
        n.unread ? "bg-[var(--color-bg-secondary)]" : "bg-[var(--color-bg-primary)]",
      )}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          /* demo — wire to navigation */
        }
      }}
    >
      <div className="flex w-2.5 shrink-0 justify-center pt-1.5">
        {n.unread ? (
          <span
            className="block h-2 w-2 shrink-0 rounded-full bg-[var(--color-text-link)]"
            aria-hidden
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1">
          <TypeBadge type={n.type} />
        </div>

        <p className="my-1 text-sm font-medium leading-snug text-[var(--color-text-primary)]">
          {n.title}
        </p>

        <div className="my-1 flex min-w-0 items-center gap-1.5">
          <RiFileList3Fill
            className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-link)]"
            aria-hidden
          />
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto min-w-0 justify-start truncate p-0 text-sm font-normal"
          >
            {n.itemLabel}
          </Button>
        </div>

        {n.mention ? (
          <div
            className="my-2 rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] px-2.5 py-2 text-sm italic leading-normal text-[var(--color-text-secondary)]"
          >
            {n.mention}
          </div>
        ) : null}

        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-xs text-[var(--color-text-secondary)]">
            {n.company} · {n.project}
          </span>
          <span className="shrink-0 text-xs italic text-[var(--color-text-tertiary)]">
            {n.timeAgo}
          </span>
        </div>
      </div>
    </div>
  )
}

function FilterMenuTrigger({ label }: { label: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 shrink-0 gap-1 px-3 text-sm font-medium transition-colors duration-150"
        >
          {label}
          <RiArrowDownSLine className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        <DropdownMenuItem onSelect={() => {}}>All {label}s</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}}>Recent</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NotificationListBody({
  tab,
  onlyUnread,
  search,
}: {
  tab: TabType
  onlyUnread: boolean
  search: string
}) {
  const filtered = useMemo(
    () => filterNotifications(tab, onlyUnread, search),
    [tab, onlyUnread, search],
  )
  const groups = ["Today", "Yesterday", "Earlier"] as const

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-16">
        <p className="text-center text-sm font-medium text-[var(--color-text-primary)]">
          No notifications to show
        </p>
        <p className="mt-1 max-w-[240px] text-center text-xs text-[var(--color-text-tertiary)]">
          Try another tab or clear filters.
        </p>
      </div>
    )
  }

  return (
    <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
      {groups.map(group => {
        const items = filtered.filter(n => n.group === group)
        if (items.length === 0) return null
        return (
          <div key={group}>
            <div className="px-5 pb-1.5 pt-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
              {group}
            </div>
            {items.map(n => (
              <NotificationRow key={n.id} n={n} />
            ))}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

interface NotificationSlideoutProps {
  open: boolean
  onClose: () => void
}

const TAB_DEFS: { id: TabType; label: string; hasDot?: boolean }[] = [
  { id: "all", label: "All" },
  { id: "action-required", label: "Action Required", hasDot: true },
  { id: "mentions", label: "Mentions", hasDot: true },
  { id: "informational", label: "Informational" },
]

export function NotificationSlideout({ open, onClose }: NotificationSlideoutProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [search, setSearch] = useState("")

  const handleOpenChange = (next: boolean) => {
    if (!next) onClose()
  }

  return (
    <SlideOut open={open} onOpenChange={handleOpenChange}>
      <SlideOutContent className="h-full max-h-dvh w-full min-w-0 gap-0 overflow-hidden border-0 bg-[var(--color-bg-primary)] p-0 shadow-none ring-0 ring-transparent">
        <div data-theme="legacy" className="flex h-full min-h-0 w-full min-w-0 flex-col">
          <header className="shrink-0 border-b border-[var(--color-border-default)] px-5 pt-4 pb-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <h2 className="text-xl font-medium leading-tight text-[var(--color-text-primary)]">
                  Notifications
                </h2>
                <Badge variant="warranty">
                  Beta
                </Badge>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="notif-only-unread"
                    className="cursor-pointer text-sm font-normal whitespace-nowrap text-[var(--color-text-secondary)]"
                  >
                    Only show unread
                  </Label>
                  <Switch
                    id="notif-only-unread"
                    checked={onlyUnread}
                    onCheckedChange={setOnlyUnread}
                    aria-label="Only show unread notifications"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-bg-secondary)]"
                      aria-label="Notification options"
                    >
                      <RiMore2Line className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[200px]">
                    <DropdownMenuItem onSelect={() => {}}>Mark all as read</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => {}}>Notification settings</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <SlideOutClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-bg-secondary)]"
                    aria-label="Close notifications"
                  >
                    <RiCloseLine className="h-5 w-5" />
                  </Button>
                </SlideOutClose>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-0 flex-1 basis-[min(100%,12rem)]">
                <RiSearchLine
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]"
                  aria-hidden
                />
                <Input
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-10 w-full min-w-0 rounded-md border-[var(--color-border-default)] bg-[var(--color-bg-primary)] pl-9 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)]"
                  aria-label="Search notifications"
                />
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <FilterMenuTrigger label="Company" />
                <FilterMenuTrigger label="Project" />
                <FilterMenuTrigger label="Tool" />
              </div>
            </div>
          </header>

          <Tabs
            value={activeTab}
            onValueChange={v => setActiveTab(v as TabType)}
            className="flex min-h-0 min-w-0 flex-1 flex-col gap-0"
            tabPanelsClassName="min-h-0 min-w-0 flex-1 overflow-hidden"
          >
            <TabsList variant="underline" className="h-10 shrink-0 px-5">
              {TAB_DEFS.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="gap-1.5">
                  <span>{tab.label}</span>
                  {tab.hasDot ? (
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-500)]"
                      aria-hidden
                    />
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>

            {TAB_DEFS.map(tab => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="scrollbar-hide !mt-0 !pt-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden outline-none data-[focus-visible]:outline-none"
              >
                <NotificationListBody tab={tab.id} onlyUnread={onlyUnread} search={search} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </SlideOutContent>
    </SlideOut>
  )
}
