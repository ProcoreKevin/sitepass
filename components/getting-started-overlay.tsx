"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"
import { X, Copy, Check, Layers, Palette, Sparkles, Compass } from "lucide-react"

const STORAGE_KEY_PERMANENT = "ngx_getting_started_dismissed"
const STORAGE_KEY_SESSION = "ngx_getting_started_session_dismissed"

/** Shown in-app and copied for Cursor; keep in sync with `.cursor/skills/guide-innovation/SKILL.md`. */
export const CURSOR_INNOVATION_GUIDE_CLIPBOARD = `Core UX Application Template — Cursor reference (Cursor chat)

DEFAULT PATH — no workshop required
- Use this repo like any app: run it locally, read docs/, and build with normal Cursor chat, Agent, and project skills (NGX, legacy theme, etc.). Nothing here forces an innovation workshop.

OPTIONAL — Innovation Canvas (gated checkpoints)
- Guided checkpoints run ONLY after you explicitly trigger /guide-innovation or /innovate-guide (type / in Cursor and pick the command) or invoke the guide-innovation skill. Until then, skip the workshop entirely.

If you choose the optional workshop:
1. Plan Mode FIRST (/plan) — start here. Do not paste the trigger into Agent expecting implementation; the workshop is no-code and Agent may refuse changes — you can get stuck.
2. Then trigger checkpoints: type / in Cursor and pick guide-innovation or innovate-guide, or paste a command line only after Plan Mode is on. Use Cursor chat or Composer — not the in-app Assist panel (layout prototype only).
3. No application code during checkpoints 0–5.
4. One checkpoint per turn (0–5); answer before continuing.
5. Save the Innovation Canvas under docs/specs/ when complete.

Skill: .cursor/skills/guide-innovation/SKILL.md
`

/** Minimal paste: only the command line. Read Plan / anti-Agent steps in the overlay first. */
export const CURSOR_GUIDE_INNOVATION_MINIMAL = `/guide-innovation`

/** Long-form paste: same guidance as on-card (support, sharing, paste-first users). */
export const CURSOR_GUIDE_INNOVATION_FULL_INSTRUCTIONS = `1) Open Plan Mode in Cursor (/plan) first. Do not paste only into Agent — the workshop is no-code; Agent may say no code changes and you stall.

2) Then run /guide-innovation or /innovate-guide from the / menu, or paste one of the lines below after step 1 (same workshop).

/guide-innovation
/innovate-guide

(Optional — template use does not require this.) Checkpoints 0–5 run in Cursor chat or Composer, not the in-app Assist panel. See .cursor/skills/guide-innovation/SKILL.md.
`

/** @deprecated Use CURSOR_GUIDE_INNOVATION_FULL_INSTRUCTIONS */
export const CURSOR_GUIDE_INNOVATION_SLASH_CLIPBOARD = CURSOR_GUIDE_INNOVATION_FULL_INSTRUCTIONS

type CopiedKind = null | "minimal" | "instructions" | "full"

interface GettingStartedOverlayProps {
  forceOpenCount?: number
}

export function GettingStartedOverlay({ forceOpenCount = 0 }: GettingStartedOverlayProps) {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [copiedKind, setCopiedKind] = useState<CopiedKind>(null)
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevForceCount = useRef(forceOpenCount)

  const dismissSession = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY_SESSION, "true")
    setVisible(false)
    setCopiedKind(null)
  }, [])

  const dismissPermanent = useCallback(() => {
    localStorage.setItem(STORAGE_KEY_PERMANENT, "true")
    setVisible(false)
    setCopiedKind(null)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (forceOpenCount > 0 && forceOpenCount !== prevForceCount.current) {
      prevForceCount.current = forceOpenCount
      setVisible(true)
    }
  }, [forceOpenCount, mounted])

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden"
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") dismissSession()
      }
      document.addEventListener("keydown", onKeyDown)
      return () => {
        document.removeEventListener("keydown", onKeyDown)
        document.body.style.overflow = ""
      }
    }
    document.body.style.overflow = ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [visible, dismissSession])

  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current)
    }
  }, [])

  const copyWithFeedback = useCallback(async (text: string, kind: "minimal" | "instructions" | "full") => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKind(kind)
      if (copyResetRef.current) clearTimeout(copyResetRef.current)
      copyResetRef.current = setTimeout(() => setCopiedKind(null), 2500)
    } catch {
      setCopiedKind(null)
    }
  }, [])

  if (!mounted || !visible) return null

  const overlay = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Getting started — Core UX application template"
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "720px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "#111111",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        <button
          type="button"
          onClick={dismissSession}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#555",
            borderRadius: "6px",
            zIndex: 1,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#eee")}
          onMouseLeave={e => (e.currentTarget.style.color = "#555")}
        >
          <X size={16} />
        </button>

        <div style={{ padding: "40px 40px 36px" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#94a3b8",
              marginBottom: "12px",
            }}
          >
            Read this first
          </p>

          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              lineHeight: 1.35,
              color: "#f0f0f0",
              margin: "0 0 14px",
            }}
          >
            A practice app for building screens that look like Procore tools.
          </h1>

          <div
            style={{
              backgroundColor: "#0f1419",
              border: "1px solid #2a3f5f",
              borderRadius: "8px",
              padding: "16px 18px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Compass size={16} style={{ color: "#60a5fa", flexShrink: 0 }} />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#e8e8e8" }}>Start here</span>
            </div>
            <ul
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#c4c4c4",
                margin: 0,
                paddingLeft: "20px",
              }}
            >
              <li style={{ marginBottom: "10px" }}>Run this app. Click buttons and menus. Look around.</li>
              <li style={{ marginBottom: "10px" }}>
                Build for real in <strong style={{ color: "#e8e8e8" }}>Cursor</strong> (the code editor). Use{" "}
                <code style={{ color: "#94a3b8" }}>docs/</code> when you need help.
              </li>
              <li>
                Dev only: open <code style={{ color: "#94a3b8" }}>/dev/uui-studio</code> to see UI lists and scores.
              </li>
            </ul>
          </div>

          <ul
            style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#a3a3a3",
              margin: "0 0 24px",
              paddingLeft: "20px",
            }}
          >
            <li style={{ marginBottom: "8px" }}>
              The <strong style={{ color: "#d4d4d4" }}>Assist</strong> side panel here is just pretend — for layout
              only.
            </li>
            <li style={{ marginBottom: "8px" }}>
              Real buttons and colors live in <code style={{ color: "#94a3b8" }}>components/ui</code>.
            </li>
            <li>Optional: a planning game in Cursor — see the orange box below.</li>
          </ul>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                backgroundColor: "#181818",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <Palette size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#555",
                  }}
                >
                  Visual system
                </span>
              </div>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#e8e8e8", margin: "0 0 10px" }}>
                Look and colors
              </h2>
              <ul
                style={{
                  listStyle: "disc",
                  paddingLeft: "18px",
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#a3a3a3",
                  lineHeight: 1.5,
                }}
              >
                <li>Old Procore style uses <code style={{ color: "#888" }}>legacy</code> theme.</li>
                <li>Color rules are in the docs — don&apos;t invent random hex colors.</li>
                <li>Match spacing and type to the guides, not your own guesses.</li>
              </ul>
            </div>

            <div
              style={{
                backgroundColor: "#181818",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <Layers size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#555",
                  }}
                >
                  Structure
                </span>
              </div>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#e8e8e8", margin: "0 0 10px" }}>
                Rules and pieces
              </h2>
              <ul
                style={{
                  listStyle: "disc",
                  paddingLeft: "18px",
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#a3a3a3",
                  lineHeight: 1.5,
                }}
              >
                <li>Big rules live in <code style={{ color: "#888" }}>guidelines/</code>.</li>
                <li>Reuse <code style={{ color: "#888" }}>components/ui</code> — don&apos;t clone new basics.</li>
                <li>Ask Cursor to use the NGX / layout skills when you build.</li>
              </ul>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#181818",
              border: "1px solid #2a2a2a",
              borderRadius: "8px",
              padding: "16px 18px",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Sparkles size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#e8e8e8" }}>
                Optional: planning workshop in Cursor
              </span>
            </div>
            <p style={{ fontSize: "13px", lineHeight: 1.55, color: "#a3a3a3", margin: "0 0 12px" }}>
              Cursor asks you easy questions one at a time. At the end you get a small write-up in{" "}
              <code style={{ color: "#888" }}>docs/specs/</code>. You can skip this if you already know your idea.
            </p>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#e8e8e8", margin: "0 0 8px" }}>Do this in order</p>
            <ol
              style={{
                fontSize: "14px",
                lineHeight: 1.65,
                color: "#d4d4d4",
                margin: "0 0 12px",
                paddingLeft: "22px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                Open <strong style={{ color: "#fff" }}>Plan Mode</strong> in Cursor (type{" "}
                <code style={{ color: "#a3a3a3" }}>/plan</code> or use the Plan switch).
              </li>
              <li style={{ marginBottom: "8px" }}>
                Either: press <code style={{ color: "#a3a3a3" }}>/</code> and pick{" "}
                <strong style={{ color: "#fff" }}>guide-innovation</strong> or{" "}
                <strong style={{ color: "#fff" }}>innovate-guide</strong>
                <br />
                <span style={{ color: "#888", fontSize: "13px" }}>Or: click the orange button, then </span>
                <strong style={{ color: "#fff" }}>paste into Cursor chat</strong>
                <span style={{ color: "#888", fontSize: "13px" }}> (still in Plan Mode).</span>
              </li>
              <li style={{ marginBottom: "8px" }}>
                Answer the questions. Don&apos;t ask Cursor to write app code during this part.
              </li>
              <li>Do this in Cursor — not in the fake Assist panel in this browser app.</li>
            </ol>
            <p style={{ fontSize: "13px", lineHeight: 1.5, color: "#ca8a04", margin: "0 0 12px" }}>
              <strong style={{ color: "#fbbf24" }}>Don&apos;t</strong> paste into <strong>Agent</strong> before Plan
              Mode — you can get stuck with &quot;no code&quot; messages.
            </p>
            <p style={{ fontSize: "12px", lineHeight: 1.5, color: "#666", margin: "0 0 14px" }}>
              Orange button = one line to paste (<code style={{ color: "#888" }}>/guide-innovation</code> — same
              workshop as <code style={{ color: "#888" }}>/innovate-guide</code>). You don&apos;t need to change it.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => copyWithFeedback(CURSOR_GUIDE_INNOVATION_MINIMAL, "minimal")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  backgroundColor: "#FF5200",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#fff",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e04800")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#FF5200")}
              >
                {copiedKind === "minimal" ? <Check size={16} /> : <Copy size={16} />}
                {copiedKind === "minimal" ? "Copied" : "Copy for chat"}
              </button>
              <button
                type="button"
                onClick={() => copyWithFeedback(CURSOR_GUIDE_INNOVATION_FULL_INSTRUCTIONS, "instructions")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  background: "none",
                  border: "1px solid #444",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#aaa",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#666")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#444")}
              >
                {copiedKind === "instructions" ? <Check size={16} /> : <Copy size={16} />}
                {copiedKind === "instructions" ? "Copied" : "Copy longer help"}
              </button>
              <button
                type="button"
                onClick={() => copyWithFeedback(CURSOR_INNOVATION_GUIDE_CLIPBOARD, "full")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  background: "none",
                  border: "1px solid #444",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#aaa",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#666")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#444")}
              >
                {copiedKind === "full" ? <Check size={16} /> : <Copy size={16} />}
                {copiedKind === "full" ? "Copied" : "Copy everything"}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button
              type="button"
              onClick={dismissPermanent}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                color: "#444",
                padding: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#777")}
              onMouseLeave={e => (e.currentTarget.style.color = "#444")}
            >
              Don&apos;t show this again
            </button>

            <button
              type="button"
              onClick={dismissSession}
              style={{
                background: "none",
                border: "1px solid #333",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                color: "#777",
                padding: "8px 16px",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#555")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#333")}
            >
              Dismiss for now
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(overlay, document.body)
}
