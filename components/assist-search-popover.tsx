"use client"

import type React from "react"

import { useState } from "react"
import { ArrowUp, BookOpen, Plus, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWorkspace } from "./workspace-shell"
import { cn } from "@/lib/utils"

interface AssistSearchPopoverProps {
  onClose: () => void
}

const promptSuggestions = ["Set up your Daily Game Plan", "Set Up Project with Kickoff", "Start a chat with Assist"]

const listRowClass =
  "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-md text-left text-sm transition-colors text-asphalt-700 hover:bg-asphalt-100 hover:text-asphalt-900"

export function AssistSearchPopover({ onClose }: AssistSearchPopoverProps) {
  const [query, setQuery] = useState("")
  const { openAssistWithContext, openGettingStarted } = useWorkspace()

  const handleSubmit = () => {
    if (query.trim()) {
      openAssistWithContext(query)
      onClose()
      setQuery("")
    }
  }

  const handlePromptClick = (prompt: string) => {
    openAssistWithContext(prompt)
    onClose()
  }

  const handleGettingStarted = () => {
    openGettingStarted()
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  return (
    <div className="w-full min-w-0 max-w-[560px]">
      {/* Header — matches project / tools popover chrome */}
      <div className="flex items-center justify-between border-b border-asphalt-200 px-3 py-3">
        <h2 className="text-base font-semibold text-asphalt-900">Assist</h2>
        <div className="flex items-center gap-2 text-xs text-asphalt-500">
          <span>Powered by</span>
          <span className="font-bold text-asphalt-900">HELIX</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-asphalt-900"
            aria-hidden
          >
            <path d="M8 2L10 6L14 8L10 10L8 14L6 10L2 8L6 6L8 2Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Suggestions — same row treatment as project selector list */}
      <div className="space-y-1 border-b border-asphalt-200 p-2">
        <button type="button" onClick={handleGettingStarted} className={cn(listRowClass, "group")}>
          <div className="flex min-w-0 items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-asphalt-600" />
            <span className="truncate">Getting started (application template)</span>
          </div>
          <ArrowUp className="h-4 w-4 shrink-0 text-asphalt-400 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>

        {promptSuggestions.map((prompt, index) => (
          <button
            type="button"
            key={index}
            onClick={() => handlePromptClick(prompt)}
            className={cn(listRowClass, "group")}
          >
            <span className="min-w-0 truncate">{prompt}</span>
            <ArrowUp className="h-4 w-4 shrink-0 text-asphalt-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        ))}
      </div>

      {/* Search — project selector search field pattern */}
      <div className="border-b border-asphalt-200 p-3">
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Assist anything"
            className={cn(
              "h-11 w-full rounded-md border border-slate-300 bg-white pr-12 text-sm text-asphalt-900 shadow-none",
              "placeholder:text-asphalt-500",
              "focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400/40",
            )}
          />
          <Button
            type="button"
            variant="default"
            onClick={handleSubmit}
            disabled={!query.trim()}
            size="icon"
            className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full disabled:bg-asphalt-200 disabled:text-asphalt-500"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Footer actions — compact ghost row */}
      <div className="flex flex-wrap items-center gap-1 px-2 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 rounded-md text-asphalt-700 hover:bg-asphalt-100 hover:text-asphalt-900"
        >
          <Plus className="h-4 w-4" />
          Upload Document
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 rounded-md text-asphalt-700 hover:bg-asphalt-100 hover:text-asphalt-900"
        >
          <Zap className="h-4 w-4" />
          Workflows Agent
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 rounded-md text-asphalt-700 hover:bg-asphalt-100 hover:text-asphalt-900"
        >
          <Plus className="h-4 w-4" />
          Build Your Agent
        </Button>
      </div>
    </div>
  )
}
