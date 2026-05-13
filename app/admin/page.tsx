"use client"

import { useState } from "react"
import { RiSettings3Fill } from "react-icons/ri"
import { cn } from "@/lib/utils"

const SIC_TRADES = [
  { code: "1521", name: "General Contractors - Single-Family Houses" },
  { code: "1522", name: "Framing" },
  { code: "1711", name: "Plumbing, Heating, and Air-Conditioning" },
  { code: "1712", name: "HVAC" },
  { code: "1731", name: "Electrical Work" },
  { code: "1742", name: "Plastering, Drywall, and Insulation" },
  { code: "1751", name: "Carpentry Work" },
  { code: "1761", name: "Roofing, Siding, and Sheet Metal Work" },
  { code: "1771", name: "Concrete Work" },
  { code: "1797", name: "Fire Protection" },
  { code: "1796", name: "Installation or Erection of Building Equipment" },
]

const QUALIFICATION_OPTIONS = ["CSCS", "Asbestos Awareness", "First Aid", "IEC"]

function EditorToolbar() {
  const controls = ["B", "I", "U", "S", "-", "-", "-", "-", "-", "-", "12pt", "•••"]

  return (
    <div className="flex items-center gap-1 border-b border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-2 py-1">
      {controls.map((control, index) => {
        const isLabel = control === "12pt"
        const isDots = control === "•••"
        const isDivider = control === "-"

        if (isDivider) {
          return <span key={`${control}-${index}`} className="mx-0.5 h-4 w-px bg-[var(--color-border-default)]" />
        }

        return (
          <button
            key={`${control}-${index}`}
            type="button"
            className={cn(
              "inline-flex h-6 items-center justify-center rounded px-1.5 text-[10px] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]",
              !isLabel && !isDots && "font-semibold",
              isLabel && "min-w-11 border border-[var(--color-border-default)] font-normal",
              isDots && "text-sm"
            )}
          >
            {control}
          </button>
        )
      })}
    </div>
  )
}

function EditorBlock({
  value,
  onChange,
  rows = 5,
}: {
  value: string
  onChange: (value: string) => void
  rows?: number
}) {
  return (
    <div className="border border-[var(--color-border-default)] bg-[var(--color-bg-primary)]">
      <EditorToolbar />
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full resize-none border-0 bg-[var(--color-bg-primary)] px-3 py-2 text-[12px] leading-5 text-[var(--color-text-primary)] outline-none"
      />
    </div>
  )
}

export default function AdminPage() {
  const [projectInfo, setProjectInfo] = useState(
    "Gutsa Development Services would like to invite you to participate in the bidding process for this construction project by utilizing our Construction Project Management Software, Procore. Procore helps to streamline the bidding process by allowing bid invitees to download relevant bidding documents and submit their bids electronically. In this system, all electronic correspondence is tracked and archived, and bidders are provided with the most up to date information available for the project. We feel that this tool will simplify the bidding process for your project team by cutting down on the amount of filing and paperwork that typically accompanies bid management."
  )
  const [biddingInstructions, setBiddingInstructions] = useState(
    "If you need assistance accessing the bidding documents, please email Procore's customer support department at support@procore.com, and one of their support representatives will provide you with assistance.\n\nGutsa Development Services looks forward to the opportunity to work with your project team in your new bidding process."
  )
  const [bidSubmissionMessage, setBidSubmissionMessage] = useState("")
  const [sendBidDocumentsFrom, setSendBidDocumentsFrom] = useState("Company")
  const [selectedTradeCodes, setSelectedTradeCodes] = useState<string[]>(["1731", "1771"])
  const [tradeQualifications, setTradeQualifications] = useState<Record<string, string[]>>({
    "1731": ["CSCS", "First Aid"],
    "1771": ["CSCS", "Asbestos Awareness"],
  })

  const projectSettings = [
    "General",
    "Tax",
    "Tool Settings",
    "Work Breakdown Structure",
    "Working Days",
    "Locations",
    "Classifications",
    "Equipment",
    "Webhooks",
    "Unit Quantity Based Budget",
  ]
  const toolConfiguration = ["Home", "Emails", "Bidding", "Punch List", "Documents"]

  const toggleTradeSelection = (tradeCode: string) => {
    setSelectedTradeCodes((current) =>
      current.includes(tradeCode) ? current.filter((code) => code !== tradeCode) : [...current, tradeCode]
    )
  }

  const toggleQualification = (tradeCode: string, qualification: string) => {
    setTradeQualifications((current) => {
      const existing = current[tradeCode] ?? []
      const next = existing.includes(qualification)
        ? existing.filter((item) => item !== qualification)
        : [...existing, qualification]

      return { ...current, [tradeCode]: next }
    })
  }

  return (
    <div className="flex h-full min-h-0 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <main className="flex-1 border-r border-[var(--color-border-default)]">
        <div className="border-b border-[var(--color-border-default)] px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <RiSettings3Fill className="h-3.5 w-3.5 text-[var(--color-brand-500)]" />
            <span>ADMIN</span>
          </div>
        </div>

        <div className="space-y-4 px-4 py-3">
          <div className="grid grid-cols-[280px_1fr] items-start gap-4 border-b border-[var(--color-border-default)] pb-3">
            <label className="pt-2 text-[12px] text-[var(--color-text-primary)]">Project Information:</label>
            <EditorBlock value={projectInfo} onChange={setProjectInfo} rows={7} />
          </div>

          <div className="grid grid-cols-[280px_1fr] items-start gap-4 border-b border-[var(--color-border-default)] pb-3">
            <label className="pt-2 text-[12px] text-[var(--color-text-primary)]">Bidding Instructions:</label>
            <EditorBlock value={biddingInstructions} onChange={setBiddingInstructions} rows={6} />
          </div>

          <div className="grid grid-cols-[280px_1fr] items-center gap-4 border-b border-[var(--color-border-default)] pb-3">
            <label className="text-[12px] text-[var(--color-text-primary)]">Bid Submission Confirmation Message:</label>
            <textarea
              value={bidSubmissionMessage}
              onChange={(event) => setBidSubmissionMessage(event.target.value)}
              rows={2}
              className="w-full resize-none border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-2 py-1 text-[12px] text-[var(--color-text-primary)] outline-none"
            />
          </div>

          <div className="grid grid-cols-[280px_1fr] items-center gap-4 pb-3">
            <label className="text-[12px] text-[var(--color-text-primary)]">Send Bid Documents from:</label>
            <div>
              <select
                value={sendBidDocumentsFrom}
                onChange={(event) => setSendBidDocumentsFrom(event.target.value)}
                className="h-7 min-w-24 border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-2 text-[11px] text-[var(--color-text-primary)] outline-none"
              >
                <option value="Company">Company</option>
                <option value="Project">Project</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-[280px_1fr] items-start gap-4 border-t border-[var(--color-border-default)] pt-3">
            <label className="pt-1 text-[12px] text-[var(--color-text-primary)]">Trades & Packages:</label>
            <div className="space-y-2">
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                Select trades using Standard Industrial Classification (SIC) codes and assign qualifications.
              </p>
              <div className="border border-[var(--color-border-default)]">
                <div className="grid grid-cols-[28px_90px_1fr_300px] border-b border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] px-2 py-1 text-[11px] font-semibold text-[var(--color-text-secondary)]">
                  <span />
                  <span>SIC Code</span>
                  <span>Trade</span>
                  <span>Qualifications</span>
                </div>
                {SIC_TRADES.map((trade) => {
                  const isSelected = selectedTradeCodes.includes(trade.code)
                  const selectedQualifications = tradeQualifications[trade.code] ?? []
                  return (
                    <div
                      key={trade.code}
                      className={cn(
                        "grid grid-cols-[28px_90px_1fr_300px] items-center gap-2 border-b border-[var(--color-border-default)] px-2 py-1.5 text-[12px] last:border-b-0",
                        isSelected && "bg-[var(--color-bg-row-active)]"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTradeSelection(trade.code)}
                        className="h-3.5 w-3.5"
                        aria-label={`Select SIC ${trade.code}`}
                      />
                      <span className="font-semibold text-[var(--color-text-primary)]">{trade.code}</span>
                      <span className="text-[var(--color-text-primary)]">{trade.name}</span>
                      <div className="flex flex-wrap items-center gap-2">
                        {QUALIFICATION_OPTIONS.map((qualification) => (
                          <label
                            key={qualification}
                            className={cn(
                              "inline-flex items-center gap-1 rounded border border-[var(--color-border-default)] px-2 py-1 text-[11px] text-[var(--color-text-primary)]",
                              !isSelected && "opacity-60"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={selectedQualifications.includes(qualification)}
                              disabled={!isSelected}
                              onChange={() => toggleQualification(trade.code, qualification)}
                              className="h-3 w-3"
                            />
                            <span>{qualification}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-[var(--color-border-default)] pt-3">
            <button
              type="button"
              className="h-8 min-w-14 bg-[var(--color-bg-inverse)] px-3 text-[12px] font-semibold text-[var(--color-text-inverse)]"
            >
              Update
            </button>
          </div>
        </div>
      </main>

      <aside className="w-[260px] bg-[var(--color-bg-primary)] px-4 py-4">
        <section className="border-b border-[var(--color-border-default)] pb-4">
          <h2 className="mb-3 text-[12px] font-bold uppercase tracking-wide">Project Settings</h2>
          <nav className="space-y-1">
            {projectSettings.map((item) => (
              <button
                key={item}
                type="button"
                className="block w-full text-left text-[12px] text-[var(--color-text-primary)] hover:underline"
              >
                {item}
                {item === "Tax" && (
                  <span className="ml-2 inline-flex rounded bg-[var(--color-bg-feedback-success)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-text-success)]">
                    NEW
                  </span>
                )}
                {item === "Equipment" && (
                  <span className="ml-2 inline-flex rounded bg-[var(--color-bg-secondary)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-text-secondary)]">
                    LEGACY
                  </span>
                )}
              </button>
            ))}
          </nav>
        </section>

        <section className="pt-4">
          <h2 className="mb-3 text-[12px] font-bold uppercase tracking-wide">Tool Configuration</h2>
          <nav className="space-y-1">
            {toolConfiguration.map((item) => (
              <button
                key={item}
                type="button"
                className={cn(
                  "block w-full px-2 py-1 text-left text-[12px]",
                  item === "Bidding"
                    ? "bg-[var(--color-bg-secondary)] font-semibold text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-primary)] hover:underline"
                )}
              >
                {item}
              </button>
            ))}
          </nav>
        </section>
      </aside>
    </div>
  )
}
