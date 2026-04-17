"use client"

import { useState, useEffect } from "react"
import { RichPopover, RichPopoverTrigger, RichPopoverContent } from "@/components/rich-popover"
import { AssistSearchPopover } from "@/components/assist-search-popover"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface AssistSearchBarProps {
  assistOpen?: boolean
  onAssistToggle?: (open: boolean) => void
}

// Inline keyframe style injected once into the document head
const SPARKLE_STYLE = `
@keyframes assist-pulse-sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.85); }
}
.assist-sparkle-lg {
  transform-origin: 15px 5px;
}
.assist-sparkle-sm {
  transform-origin: 9px 13px;
}
.assist-icon-animated .assist-sparkle-lg {
  animation: assist-pulse-sparkle 1.5s ease-in-out infinite;
}
.assist-icon-animated .assist-sparkle-sm {
  animation: assist-pulse-sparkle 1.5s ease-in-out infinite 0.3s;
}
`

function AssistIcon({ animated }: { animated: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={animated ? "assist-icon-animated" : ""}
      aria-hidden="true"
    >
      {/* Magnifying glass */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.314 20.899L18.031 16.617C19.3082 15.0237 20.0029 13.042 20 11C20 10.4548 19.9514 9.92083 19.8584 9.40224C19.4715 9.6912 19.0875 10.016 18.7183 10.3816C18.4569 10.6404 18.2178 10.8962 17.9987 11.1478C17.9641 12.9149 17.2597 14.6052 16.025 15.875L15.875 16.025C14.5699 17.2941 12.8204 18.0029 11 18C7.132 18 4 14.867 4 11C4 7.132 7.132 4 11 4C11.0411 4 11.0822 4.00035 11.1232 4.00106C11.2819 3.85784 11.4383 3.7067 11.5915 3.54708C12.0207 3.09988 12.3959 2.63293 12.7247 2.16531C12.1664 2.05683 11.5898 2 11 2C6.032 2 2 6.032 2 11C2 15.968 6.032 20 11 20C13.042 20.0029 15.0237 19.3082 16.617 18.031L20.899 22.314L22.314 20.899Z"
        fill="currentColor"
      />
      {/* Large sparkle */}
      <path
        className="assist-sparkle-lg"
        d="M17.2331 9.01253C15.2394 10.9866 15.416 12.6646 15.1046 12.6646C14.793 12.6646 14.9518 11.0006 12.9637 9.01253C10.9756 7.02447 9.39062 7.35419 9.39062 7.03353C9.39062 6.71287 11.4612 6.5388 12.9912 4.94464C14.5212 3.35049 14.8969 1.33496 15.1076 1.33496C15.3183 1.33496 15.541 3.54377 17.2331 5.08208C18.9524 6.64505 20.7054 6.85025 20.7054 7.006C20.7054 7.16175 18.7575 7.50316 17.2331 9.01253Z"
        fill="#FF5200"
      />
      {/* Small sparkle */}
      <path
        className="assist-sparkle-sm"
        d="M10.4436 13.837C9.34373 14.926 9.44119 15.8518 9.26934 15.8518C9.0975 15.8518 9.1851 14.9338 8.08833 13.837C6.99157 12.7402 6.11719 12.9221 6.11719 12.7452C6.11719 12.5684 7.25944 12.4723 8.10349 11.5929C8.94756 10.7135 9.15477 9.60156 9.27102 9.60156C9.38727 9.60156 9.51011 10.8201 10.4436 11.6687C11.3921 12.5309 12.3591 12.6442 12.3591 12.73C12.3591 12.816 11.2846 13.0044 10.4436 13.837Z"
        fill="#FF5200"
      />
    </svg>
  )
}

export function AssistSearchBar({ assistOpen, onAssistToggle }: AssistSearchBarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [animated, setAnimated] = useState(false)

  // Inject keyframe styles once
  useEffect(() => {
    const id = "assist-sparkle-styles"
    if (!document.getElementById(id)) {
      const style = document.createElement("style")
      style.id = id
      style.textContent = SPARKLE_STYLE
      document.head.appendChild(style)
    }
  }, [])

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
        setAnimated(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Stop animation when popover closes
  useEffect(() => {
    if (!searchOpen) setAnimated(false)
  }, [searchOpen])

  const handleOpen = () => {
    setSearchOpen(true)
    setAnimated(true)
  }

  return (
    <RichPopover open={searchOpen} onOpenChange={(open) => {
      setSearchOpen(open)
      if (!open) setAnimated(false)
    }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <RichPopoverTrigger asChild>
            <button
              type="button"
              data-assist-search
              onClick={handleOpen}
              className="inline-flex h-8 min-h-8 w-full min-w-[220px] max-w-[300px] cursor-pointer select-none items-center gap-2 rounded px-2 text-sm font-normal"
            >
              <AssistIcon animated={animated} />
              <span className="assist-trigger-placeholder flex-1 text-left">
                Ask Assist
              </span>
              <div className="flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-[22px] select-none items-center border-0 px-1.5 font-sans text-[11px] shadow-none">
                  Ctrl
                </kbd>
                <kbd className="pointer-events-none inline-flex h-[22px] select-none items-center border-0 px-1.5 font-sans text-[11px] shadow-none">
                  K
                </kbd>
              </div>
            </button>
          </RichPopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Quick search & AI assistance</p>
        </TooltipContent>
      </Tooltip>
      <RichPopoverContent
        align="start"
        scrollClassName="p-0"
        className="w-auto min-w-0 max-w-[min(560px,calc(100vw-2rem))] rounded-xl border border-asphalt-200 bg-white p-0 text-asphalt-900 shadow-lg"
      >
        <AssistSearchPopover onClose={() => { setSearchOpen(false); setAnimated(false) }} />
      </RichPopoverContent>
    </RichPopover>
  )
}
