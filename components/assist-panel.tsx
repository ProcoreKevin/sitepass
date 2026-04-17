"use client"

import {
  X,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Sparkles,
  ArrowRight,
  Lightbulb,
  MessageSquarePlus,
  ChevronDown,
  Mic,
  Paperclip,
  ChevronRight,
  CornerDownLeft,
  BookOpen,
  Search,
  Plus,
  Gem,
  CircleDollarSign,
  BarChart3,
  History,
  ArrowUp,
  Zap,
  LayoutList,
  ChevronUp,
  Globe,
  Link2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useEffect, useState, useMemo, useRef, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { getSOPForTool, getHighPriorityActions, type SOPDefinition, type SOPAction } from "@/lib/sop-definitions"

/** Default assist width; `WorkspaceLayout` reserves this margin when the panel is open. */
export const ASSIST_PANEL_WIDTH_PX = 400

/** Open: decelerate into place. Close: accelerate off-screen (matches NGX interaction doc). */
const ASSIST_PANEL_EASE_OPEN = "cubic-bezier(0, 0, 0.2, 1)"
const ASSIST_PANEL_EASE_CLOSE = "cubic-bezier(0.4, 0, 1, 1)"

// ── Pulse-sparkle loading animation in chat bubble ────────────────────────────
function SparkleLoadingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        className="sparkle-large"
        d="M17.2331 9.01253C15.2394 10.9866 15.416 12.6646 15.1046 12.6646C14.793 12.6646 14.9518 11.0006 12.9637 9.01253C10.9756 7.02447 9.39062 7.35419 9.39062 7.03353C9.39062 6.71287 11.4612 6.5388 12.9912 4.94464C14.5212 3.35049 14.8969 1.33496 15.1076 1.33496C15.3183 1.33496 15.541 3.54377 17.2331 5.08208C18.9524 6.64505 20.7054 6.85025 20.7054 7.006C20.7054 7.16175 18.7575 7.50316 17.2331 9.01253Z"
        fill="#FF5200"
      />
      <path
        className="sparkle-small"
        d="M10.4436 13.837C9.34373 14.926 9.44119 15.8518 9.26934 15.8518C9.0975 15.8518 9.1851 14.9338 8.08833 13.837C6.99157 12.7402 6.11719 12.9221 6.11719 12.7452C6.11719 12.5684 7.25944 12.4723 8.10349 11.5929C8.94756 10.7135 9.15477 9.60156 9.27102 9.60156C9.38727 9.60156 9.51011 10.8201 10.4436 11.6687C11.3921 12.5309 12.3591 12.6442 12.3591 12.73C12.3591 12.816 11.2846 13.0044 10.4436 13.837Z"
        fill="#FF5200"
      />
    </svg>
  )
}

// ── Loading bar below panel header — idle: gray shadow; loading: orange → cyan steps + glow ──
const ASSIST_LOADER_GRADIENT = {
  start: "#FF5200",
  end: "#43C7FE",
} as const

const ASSIST_LOADER_SEGMENT_COUNT = 12

function interpolateHex(color1: string, color2: string, factor: number): string {
  const h = (c: string) => parseInt(c, 16)
  const r1 = h(color1.slice(1, 3))
  const g1 = h(color1.slice(3, 5))
  const b1 = h(color1.slice(5, 7))
  const r2 = h(color2.slice(1, 3))
  const g2 = h(color2.slice(3, 5))
  const b2 = h(color2.slice(5, 7))
  const r = Math.round(r1 + (r2 - r1) * factor)
    .toString(16)
    .padStart(2, "0")
  const g = Math.round(g1 + (g2 - g1) * factor)
    .toString(16)
    .padStart(2, "0")
  const b = Math.round(b1 + (b2 - b1) * factor)
    .toString(16)
    .padStart(2, "0")
  return `#${r}${g}${b}`
}

const ASSIST_LOADER_STOPS: readonly string[] = Array.from({ length: ASSIST_LOADER_SEGMENT_COUNT }, (_, i) =>
  interpolateHex(
    ASSIST_LOADER_GRADIENT.start,
    ASSIST_LOADER_GRADIENT.end,
    i / (ASSIST_LOADER_SEGMENT_COUNT - 1),
  ),
)

function AssistLoader({ active }: { active: boolean }) {
  if (!active) {
    return <div className="assist-loader assist-loader--idle" aria-hidden />
  }
  return (
    <div
      className="assist-loader assist-loader--loading"
      role="progressbar"
      aria-busy="true"
      aria-valuetext="Loading"
    >
      {ASSIST_LOADER_STOPS.map((hex, i) => (
        <div key={i} className="loader-segment" style={{ background: hex, color: hex }} />
      ))}
    </div>
  )
}

type AgentRunMode = "fastest" | "ask" | "agent"

const AGENT_RUN_MODE_LABEL: Record<AgentRunMode, string> = {
  fastest: "Fastest",
  ask: "Ask",
  agent: "Agent",
}

const DEMO_AGENTS: { id: string; name: string; Icon: typeof Gem }[] = [
  { id: "fred", name: "(Fred)", Icon: Gem },
  { id: "aaron", name: "Aaron's Unnamed Agent", Icon: Sparkles },
  { id: "anz", name: "ANZ Sliding-Scale Retention Agent", Icon: CircleDollarSign },
  { id: "assets", name: "Assets Data Automation (Beta)", Icon: BarChart3 },
  { id: "bill", name: "Bill's Deep Search Agent", Icon: Gem },
]

/** Demo user row (reference layout — initials + display name). */
const ASSIST_DEMO_USER = { name: "Guy", initials: "GP" } as const

const assistSuggestionClass =
  "flex items-center gap-3 self-end rounded-2xl px-4 py-3 text-left text-sm font-medium [background-color:#EFE5DC]"

const ASSIST_TRAY_ACTIONS = [
  { id: "slack", label: "Slack", category: "connected" as const, kind: "slack" as const },
  { id: "web", label: "Web Search", category: "tools" as const, kind: "web" as const },
  { id: "links", label: "Access Links", category: "tools" as const, kind: "links" as const },
]

function TrayActionRowIcon({ kind }: { kind: (typeof ASSIST_TRAY_ACTIONS)[number]["kind"] }) {
  switch (kind) {
    case "slack":
      return (
        <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-inset ring-black/5">
          <Image
            src="/brands/connector-slack.svg"
            alt=""
            width={24}
            height={24}
            unoptimized
            className="h-5 w-5"
          />
        </div>
      )
    case "web":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white">
          <Globe className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </div>
      )
    case "links":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
          <Link2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </div>
      )
    default:
      return <div className="bg-muted h-8 w-8 shrink-0 rounded-full" />
  }
}

function AgentPickerMenu({
  runMode,
  onRunModeChange,
  autoSelect,
  onAutoSelectChange,
  searchQuery,
  onSearchQueryChange,
  selectedAgentId,
  onSelectAgent,
}: {
  runMode: AgentRunMode
  onRunModeChange: (m: AgentRunMode) => void
  autoSelect: boolean
  onAutoSelectChange: (v: boolean) => void
  searchQuery: string
  onSearchQueryChange: (q: string) => void
  selectedAgentId: string | null
  onSelectAgent: (id: string) => void
}) {
  /** Manual agent list only in Agent mode without auto-select (not an RAC listbox — avoids legacy `[role=listbox]` dark overlay token). */
  const showAgentList = runMode === "agent" && !autoSelect

  const q = searchQuery.trim().toLowerCase()
  const filtered = DEMO_AGENTS.filter((a) => a.name.toLowerCase().includes(q))

  return (
    <div
      data-assist-agent-picker
      className="flex w-80 max-w-[calc(100vw-2rem)] flex-col p-3 text-secondary"
    >
      <div className="flex gap-0.5 rounded-lg bg-muted p-1">
        {(["fastest", "ask", "agent"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onRunModeChange(m)}
            className={cn(
              "flex-1 rounded-md px-2 py-2 text-center text-xs font-medium transition-colors",
              runMode === m
                ? "bg-card text-secondary shadow-sm"
                : "text-muted-foreground hover:text-secondary",
            )}
          >
            {AGENT_RUN_MODE_LABEL[m]}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-sm text-secondary">Auto-Select Agent</span>
        <Switch checked={autoSelect} onCheckedChange={onAutoSelectChange} size="sm" />
      </div>

      {showAgentList ? (
        <>
          <div className="relative mt-3">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              className="w-full rounded-lg border border-input bg-primary py-2 pl-9 pr-3 text-sm text-secondary outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/30"
              placeholder="Search Agents..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              aria-label="Search agents"
            />
          </div>

          <div
            data-assist-agent-scroll
            className="mt-2 max-h-52 min-h-0 space-y-0.5 overflow-y-auto rounded-md bg-primary py-1"
          >
            {filtered.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-muted-foreground">No agents match</p>
            ) : (
              filtered.map(({ id, name, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectAgent(id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-secondary transition-colors",
                    selectedAgentId === id ? "bg-accent" : "hover:bg-primary_hover",
                  )}
                >
                  <span className="bg-secondary text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 truncate">{name}</span>
                </button>
              ))
            )}
          </div>

          <button
            type="button"
            className="mt-2 flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-primary_hover hover:text-secondary"
          >
            <Plus className="h-4 w-4 shrink-0" aria-hidden />
            Create Agent
          </button>
        </>
      ) : null}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

// ── Local useChat replacement ─────────────────────────────────────────────────
// Replaces @ai-sdk/react useChat with the same API surface so no external
// package dependency is needed. Calls /api/assist-chat via streaming fetch.
type ChatMessage = {
  id: string
  role: "user" | "assistant"
  parts: { type: "text"; text: string }[]
}
type ChatStatus = "idle" | "in_progress" | "error"

function useChat({ api }: { api: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<ChatStatus>("idle")
  const abortRef = useRef<AbortController | null>(null)

  const append = useCallback(async (msg: { role: "user"; content: string }) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      parts: [{ type: "text", text: msg.content }],
    }
    setMessages((prev) => [...prev, userMsg])
    setStatus("in_progress")

    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.parts.map((p) => p.text).join("") })) }),
        signal: ctrl.signal,
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const assistantId = (Date.now() + 1).toString()
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", parts: [{ type: "text", text: "" }] }])

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, parts: [{ type: "text", text: m.parts[0].text + chunk }] }
                : m
            )
          )
        }
      }
      setStatus("idle")
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setStatus("error")
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "assistant", parts: [{ type: "text", text: "Something went wrong. Please try again." }] },
        ])
      }
    }
  }, [api, messages])

  return { messages, append, status, setMessages }
}
// ─────────────────────────────────────────────────────────────────────────────

interface AssistPanelProps {
  isOpen: boolean
  onClose: () => void
  initialContext?: string | null
  onGettingStarted?: () => void
  /**
   * `global-header` — fixed under app `UnifiedHeader` (h-14), slides in from the right.
   * `embedded` — flex child for full-screen surfaces (e.g. BIM modal) with a local header.
   */
  dock?: "global-header" | "embedded"
}

// SOP Suggestion Card Component
function SOPSuggestionCard({ 
  sop, 
  onActionClick,
  onDismiss 
}: { 
  sop: SOPDefinition
  onActionClick: (action: SOPAction) => void
  onDismiss: () => void
}) {
  const [promptIndex, setPromptIndex] = useState(0)
  const highPriorityActions = getHighPriorityActions(sop)

  // Rotate through prompts every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % sop.prompts.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [sop.prompts.length])

  return (
    <div className="rounded-lg border border-asphalt-200 bg-asphalt-50 p-4 mb-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-asphalt-100">
            <Sparkles className="h-4 w-4 text-asphalt-600" />
          </div>
          <span className="text-xs font-medium text-asphalt-700 uppercase tracking-wide">
            Suggested Actions
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-asphalt-400 hover:text-asphalt-700"
          onClick={onDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <p className="text-sm text-foreground-primary mb-4">
        {sop.prompts[promptIndex]}
      </p>

      <div className="space-y-2">
        {highPriorityActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionClick(action)}
            className="w-full flex items-center justify-between p-3 rounded-md bg-white border border-asphalt-200 hover:border-asphalt-400 hover:bg-asphalt-50 transition-all group"
          >
            <div className="text-left">
              <p className="text-sm font-medium text-foreground-primary group-hover:text-asphalt-800">
                {action.label}
              </p>
              <p className="text-xs text-foreground-secondary mt-0.5">
                {action.description}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-asphalt-400 group-hover:text-asphalt-700 transition-colors" />
          </button>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-asphalt-200">
        <p className="text-xs text-asphalt-600">
          <Lightbulb className="h-3 w-3 inline mr-1" />
          Based on {sop.name}
        </p>
      </div>
    </div>
  )
}

export function AssistPanel({
  isOpen,
  onClose,
  initialContext,
  onGettingStarted,
  dock = "global-header",
}: AssistPanelProps) {
  const [panelTransitionEase, setPanelTransitionEase] = useState(ASSIST_PANEL_EASE_OPEN)
  const prevIsOpen = useRef(isOpen)

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) setPanelTransitionEase(ASSIST_PANEL_EASE_OPEN)
    else if (!isOpen && prevIsOpen.current) setPanelTransitionEase(ASSIST_PANEL_EASE_CLOSE)
    prevIsOpen.current = isOpen
  }, [isOpen])

  const [inputValue, setInputValue] = useState("")
  const [dismissedSOPs, setDismissedSOPs] = useState<string[]>([])
  const [agentMenuOpen, setAgentMenuOpen] = useState(false)
  const [agentRunMode, setAgentRunMode] = useState<AgentRunMode>("agent")
  const [autoSelectAgent, setAutoSelectAgent] = useState(false)
  const [agentSearchQuery, setAgentSearchQuery] = useState("")
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>("fred")
  const [assistActionsOpen, setAssistActionsOpen] = useState(false)
  const [assistActionsSearch, setAssistActionsSearch] = useState("")
  const [assistActionToggles, setAssistActionToggles] = useState<Record<string, boolean>>({})
  const pathname = usePathname()
  const router = useRouter()

  const { messages, append, status, setMessages } = useChat({
    api: "/api/assist-chat",
  })

  // Track previous context to detect changes
  const [lastContext, setLastContext] = useState<string | null>(null)

  // Detect current SOP based on pathname
  const currentSOP = useMemo(() => {
    const sop = getSOPForTool(pathname)
    if (sop && !dismissedSOPs.includes(sop.id)) {
      return sop
    }
    return null
  }, [pathname, dismissedSOPs])

  // Reset dismissed SOPs when changing tools
  useEffect(() => {
    setDismissedSOPs([])
  }, [pathname])

  // Handle initial context when panel opens
  useEffect(() => {
    if (isOpen && initialContext && initialContext !== lastContext) {
      // Clear previous messages and start fresh with new context
      setMessages([])
      setLastContext(initialContext)
      // Small delay to ensure state is cleared before appending
      setTimeout(() => {
        append({ role: "user", content: initialContext })
      }, 50)
    }
  }, [initialContext, isOpen, lastContext, setMessages, append])

  // Reset lastContext when panel closes
  useEffect(() => {
    if (!isOpen) {
      setLastContext(null)
    }
  }, [isOpen])

  const handleSend = () => {
    if (inputValue.trim()) {
      append({ role: "user", content: inputValue })
      setInputValue("")
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setInputValue("")
  }

  const handleSOPAction = (action: SOPAction) => {
    // Navigate to the target tool
    router.push(action.targetHref)
    // Optionally send a context message
    append({ 
      role: "user",
      content: `I'd like to ${action.label.toLowerCase()}. Can you help me with that?` 
    })
  }

  const handleDismissSOP = () => {
    if (currentSOP) {
      setDismissedSOPs((prev) => [...prev, currentSOP.id])
    }
  }

  // Suggestion pills shown in empty state
  const suggestionPills = currentSOP
    ? currentSOP.prompts.slice(0, 2)
    : ["How do I create a submittal?", "What is the impact of this item?"]

  const selectedAgentMeta = useMemo(
    () => DEMO_AGENTS.find((a) => a.id === selectedAgentId) ?? DEMO_AGENTS[0],
    [selectedAgentId],
  )

  const assistActionsFiltered = useMemo(() => {
    const q = assistActionsSearch.trim().toLowerCase()
    if (!q) return ASSIST_TRAY_ACTIONS
    return ASSIST_TRAY_ACTIONS.filter((a) => a.label.toLowerCase().includes(q))
  }, [assistActionsSearch])

  const assistConnectedRows = assistActionsFiltered.filter((a) => a.category === "connected")
  const assistToolsRows = assistActionsFiltered.filter((a) => a.category === "tools")

  const setAssistActionToggle = useCallback((id: string, value: boolean) => {
    setAssistActionToggles((prev) => ({ ...prev, [id]: value }))
  }, [])

  const dockGlobal = dock === "global-header"

  return (
    <aside
      aria-hidden={!isOpen}
      className={cn(
        "bg-card flex flex-col overflow-hidden",
        dockGlobal && "fixed right-0 top-14 z-0 max-w-full shadow-none",
        isOpen ? "border-border border-l" : "border-l-0",
        !dockGlobal && "h-full flex-shrink-0",
      )}
      style={
        dockGlobal
          ? {
              width: ASSIST_PANEL_WIDTH_PX,
              height: "calc(100dvh - 3.5rem)",
              transform: isOpen ? "translate3d(0,0,0)" : "translate3d(100%,0,0)",
              transition: `transform 300ms ${panelTransitionEase}`,
              pointerEvents: isOpen ? "auto" : "none",
            }
          : {
              width: isOpen ? ASSIST_PANEL_WIDTH_PX : 0,
              minWidth: isOpen ? ASSIST_PANEL_WIDTH_PX : 0,
              transition: `width 300ms ${panelTransitionEase}, min-width 300ms ${panelTransitionEase}`,
              backgroundColor: isOpen ? "var(--card)" : "transparent",
              pointerEvents: isOpen ? "auto" : "none",
            }
      }
    >
      {/* ── Header (reference: chat + history left, agent center, collapse right) ── */}
      <div className="border-border bg-card flex h-14 flex-shrink-0 items-center gap-1 border-b px-2 sm:px-3">
        <div className="flex shrink-0 items-center gap-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-accent hover:text-secondary h-8 w-8 shrink-0 [&_svg]:stroke-[1.5]"
            aria-label="New chat"
            title="New chat"
            onClick={handleNewChat}
          >
            <MessageSquarePlus className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-accent hover:text-secondary h-8 w-8 shrink-0 [&_svg]:stroke-[1.5]"
            aria-label="Chat history"
            title="Chat history"
            onClick={() => {}}
          >
            <History className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          <Popover open={agentMenuOpen} onOpenChange={setAgentMenuOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="text-secondary hover:bg-primary_hover flex max-w-full items-center gap-1 rounded-md px-2 py-1.5 text-sm font-semibold [&_svg]:stroke-[1.5]"
                aria-expanded={agentMenuOpen}
                aria-haspopup="dialog"
              >
                <span className="truncate">{AGENT_RUN_MODE_LABEL[agentRunMode]}</span>
                <ChevronDown className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              sideOffset={8}
              className="border-0 bg-primary z-50 w-auto min-w-0 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg p-0 text-secondary shadow-lg ring-1 ring-secondary_alt outline-none"
            >
              <AgentPickerMenu
                runMode={agentRunMode}
                onRunModeChange={setAgentRunMode}
                autoSelect={autoSelectAgent}
                onAutoSelectChange={setAutoSelectAgent}
                searchQuery={agentSearchQuery}
                onSearchQueryChange={setAgentSearchQuery}
                selectedAgentId={selectedAgentId}
                onSelectAgent={(id) => {
                  setSelectedAgentId(id)
                  setAgentMenuOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-accent hover:text-secondary h-8 w-8 shrink-0 [&_svg]:stroke-[1.5]"
          onClick={onClose}
          aria-label="Close assist panel"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* ── Loader strip flush under header border: idle = shadow on chat; loading = gradient glow ── */}
      <div data-assist-loader-rail>
        <AssistLoader active={status === "in_progress"} />
      </div>

      {/* ── Chat body (reference: agent gray bubble, user white + border, tan suggestions) ── */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <Sparkles className="text-foreground-tertiary h-4 w-4" strokeWidth={1.5} aria-hidden />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0">
                  <span className="text-foreground-primary text-sm font-semibold">{selectedAgentMeta.name}</span>
                  <span className="text-foreground-tertiary whitespace-nowrap text-xs">Just now</span>
                </div>
              </div>
            </div>
            <div className="text-foreground-primary rounded-2xl px-4 py-3 text-sm leading-relaxed [background-color:#F3F3F3]">
              Hey {ASSIST_DEMO_USER.name}, take a look at the suggestions below or feel free to ask anything you want.
            </div>
          </div>
        ) : null}

        {messages.map((message) => (
          <div key={message.id} className="flex flex-col gap-2">
            {message.role === "user" ? (
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex flex-row-reverse items-center gap-2">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white"
                    aria-hidden
                  >
                    {ASSIST_DEMO_USER.initials}
                  </div>
                  <span className="text-foreground-primary text-sm font-semibold">{ASSIST_DEMO_USER.name}</span>
                </div>
                <div className="border-border-default text-foreground-primary bg-brand-stone flex max-w-[85%] items-start gap-2 rounded-2xl border px-4 py-3 text-sm">
                  <CornerDownLeft className="text-foreground-tertiary mt-0.5 h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  {message.parts.map((part, i) => part.type === "text" && (
                    <span key={i} className="whitespace-pre-wrap">{part.text}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <Sparkles className="text-foreground-tertiary h-4 w-4" strokeWidth={1.5} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0">
                      <span className="text-foreground-primary text-sm font-semibold">{selectedAgentMeta.name}</span>
                      <span className="text-foreground-tertiary whitespace-nowrap text-xs">Just now</span>
                    </div>
                  </div>
                </div>
                {message.parts.map((part, i) => part.type === "text" && (
                  <div
                    key={i}
                    className="border-border-default bg-primary text-foreground-primary rounded-2xl border px-4 py-3 text-sm whitespace-pre-wrap"
                  >
                    {part.text}
                    <div className="border-border-default mt-2 flex items-center gap-1 border-t pt-2">
                      <Button variant="ghost" size="icon" className="text-foreground-secondary hover:text-foreground-primary h-7 w-7 [&_svg]:stroke-[1.5]">
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-foreground-secondary hover:text-foreground-primary h-7 w-7 [&_svg]:stroke-[1.5]">
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-foreground-secondary hover:text-foreground-primary h-7 w-7 [&_svg]:stroke-[1.5]">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {status === "in_progress" ? (
          <div className="flex items-start gap-2">
            <div className="text-foreground-secondary flex items-center gap-2 rounded-2xl px-4 py-3 text-sm [background-color:#F3F3F3]">
              <SparkleLoadingIcon />
              <span>Thinking…</span>
            </div>
          </div>
        ) : null}

        {messages.length === 0 ? (
          <div className="mt-auto flex flex-col gap-2 pt-6">
            {onGettingStarted ? (
              <div className="flex flex-col gap-2 self-end">
                <button
                  type="button"
                  onClick={() => {
                    onGettingStarted()
                    onClose()
                  }}
                  className="border-border-default bg-muted text-foreground-primary hover:bg-primary_hover flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium"
                >
                  <BookOpen className="text-foreground-secondary h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  Getting started
                </button>
                <p className="text-foreground-tertiary max-w-[280px] text-right text-xs leading-snug">
                  Assist is shell prototyping only. Optional workshop:{" "}
                  <span className="text-foreground-secondary font-medium">Plan Mode first</span>, then{" "}
                  <span className="text-foreground-secondary font-mono text-[11px]">
                    /guide-innovation
                  </span>{" "}
                  or{" "}
                  <span className="text-foreground-secondary font-mono text-[11px]">/innovate-guide</span> — do not
                  paste into Agent first. Not required to use the template.
                </p>
              </div>
            ) : null}

            {suggestionPills.map((pill, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  append({ role: "user", content: pill })
                }}
                className={cn(assistSuggestionClass, "text-foreground-primary [&_svg]:stroke-[1.5]")}
              >
                <CornerDownLeft className="text-foreground-tertiary h-3.5 w-3.5 flex-shrink-0" />
                {pill}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* ── Input + footer: secondary surface strip; primary input field; legacy token text ── */}
      <div className="border-border-default bg-background-secondary flex-shrink-0 border-t">
        <div className="px-3 pb-2 pt-3">
          <div className="border-border-default bg-primary relative overflow-hidden rounded-xl border shadow-sm">
            <Textarea
              placeholder="Ask anything…"
              className="text-foreground-primary placeholder:text-foreground-tertiary min-h-[72px] max-h-[160px] flex-1 resize-none border-0 bg-transparent px-3 pb-10 pt-3 text-sm shadow-none placeholder:italic focus-visible:ring-0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              disabled={status === "in_progress"}
            />
            <button
              type="button"
              className="text-foreground-secondary hover:bg-primary_hover hover:text-foreground-primary absolute right-2 top-2 rounded-md p-1.5 [&_svg]:stroke-[1.5]"
              aria-label="Voice input"
              title="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>
            <div className="text-foreground-secondary pointer-events-none absolute bottom-2 right-3 flex max-w-[calc(100%-1rem)] flex-wrap items-center justify-end gap-x-1 gap-y-0.5 text-right text-[10px] leading-tight">
              <span className="whitespace-nowrap">Procore AI powered by</span>
              <Image
                src="/brands/datagrid-wordmark-light.svg"
                alt=""
                width={58}
                height={20}
                unoptimized
                className="h-auto w-[58px] opacity-90"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-0.5">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-foreground-secondary hover:bg-background-primary hover:text-foreground-primary h-8 w-8 shrink-0 [&_svg]:stroke-[1.5]"
              aria-label="Attach file"
              title="Attach"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Popover
              open={assistActionsOpen}
              onOpenChange={(open) => {
                setAssistActionsOpen(open)
                if (!open) setAssistActionsSearch("")
              }}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "text-foreground-secondary hover:bg-background-primary hover:text-foreground-primary flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium [&_svg]:stroke-[1.5]",
                    assistActionsOpen && "bg-background-primary text-foreground-primary",
                  )}
                  aria-expanded={assistActionsOpen}
                  aria-haspopup="dialog"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Actions
                  {assistActionsOpen ? (
                    <ChevronUp className="text-foreground-tertiary h-3 w-3" aria-hidden />
                  ) : (
                    <ChevronDown className="text-foreground-tertiary h-3 w-3" aria-hidden />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                sideOffset={10}
                className="border-border-default bg-primary text-card-foreground z-[60] w-[min(22rem,calc(100vw-2rem))] max-w-none overflow-hidden rounded-xl border p-0 shadow-lg outline-none"
              >
                <div data-assist-actions-menu className="flex flex-col outline-none">
                  <div className="border-border-default bg-muted border-b p-2">
                    <div className="relative">
                      <Search
                        className="text-foreground-tertiary pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <input
                        type="search"
                        className="border-border-default bg-primary text-foreground-primary placeholder:text-foreground-tertiary focus-visible:ring-ring/30 w-full rounded-lg border py-2 pl-8 pr-2 text-sm outline-none focus-visible:ring-2"
                        placeholder="Search Actions & Tools…"
                        value={assistActionsSearch}
                        onChange={(e) => setAssistActionsSearch(e.target.value)}
                        aria-label="Search actions and tools"
                      />
                    </div>
                  </div>
                  <div className="max-h-[min(20rem,45vh)] min-h-0 overflow-y-auto px-2 py-2">
                  {assistConnectedRows.length > 0 ? (
                    <div className="mb-1">
                      <p className="text-foreground-secondary px-2 pb-1 pt-1 text-xs font-semibold">Connected Actions</p>
                      <ul className="space-y-0.5">
                        {assistConnectedRows.map((row) => (
                          <li
                            key={row.id}
                            className="hover:bg-primary_hover flex items-center gap-3 rounded-lg py-1.5 pl-2 pr-1"
                          >
                            <TrayActionRowIcon kind={row.kind} />
                            <span className="text-foreground-primary min-w-0 flex-1 truncate text-sm font-medium">
                              {row.label}
                            </span>
                            <Switch
                              size="sm"
                              checked={assistActionToggles[row.id] ?? false}
                              onCheckedChange={(v) => setAssistActionToggle(row.id, v)}
                              aria-label={`${row.label} connected`}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {assistConnectedRows.length > 0 && assistToolsRows.length > 0 ? (
                    <div className="border-border-default my-2 border-t" role="separator" />
                  ) : null}

                  {assistToolsRows.length > 0 ? (
                    <div>
                      <p className="text-foreground-secondary px-2 pb-1 pt-1 text-xs font-semibold">Tools</p>
                      <ul className="space-y-0.5">
                        {assistToolsRows.map((row) => (
                          <li
                            key={row.id}
                            className="hover:bg-primary_hover flex items-center gap-3 rounded-lg py-1.5 pl-2 pr-1"
                          >
                            <TrayActionRowIcon kind={row.kind} />
                            <span className="text-foreground-primary min-w-0 flex-1 truncate text-sm font-medium">
                              {row.label}
                            </span>
                            <Switch
                              size="sm"
                              checked={assistActionToggles[row.id] ?? false}
                              onCheckedChange={(v) => setAssistActionToggle(row.id, v)}
                              aria-label={`Enable ${row.label}`}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {assistConnectedRows.length === 0 && assistToolsRows.length === 0 ? (
                    <p className="text-foreground-secondary px-2 py-6 text-center text-sm">No actions match your search.</p>
                  ) : null}
                  </div>

                  <div className="border-border-default border-t p-1">
                    <button
                      type="button"
                      className="text-foreground-primary hover:bg-primary_hover inline-flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-center text-sm font-semibold"
                    >
                      <Plus className="text-foreground-secondary h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
                      Add Action
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <button
              type="button"
              className="text-foreground-secondary hover:bg-background-primary hover:text-foreground-primary flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium [&_svg]:stroke-[1.5]"
            >
              <LayoutList className="h-3.5 w-3.5" />
              Prompts
              <ChevronDown className="text-foreground-tertiary h-3 w-3" />
            </button>
          </div>
          <button
            type="button"
            className="bg-foreground text-background flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm disabled:opacity-40 [&_svg]:stroke-[2]"
            aria-label="Send message"
            title="Send"
            disabled={status === "in_progress" || !inputValue.trim()}
            onClick={handleSend}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
