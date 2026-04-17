"use client"

import { useState, useRef, useEffect } from "react"
import { RiCloseLine, RiBuilding4Line, RiUploadCloud2Line, RiArrowDownSLine, RiCheckLine } from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { SlideOut, SlideOutClose, SlideOutContent } from "@/components/ui/slide-out"

const COMPANIES = [
  { id: "miller-design",     name: "Miller Design",        logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Company%20Logo-Z5UGWf2OYQoCPOt5ZKarKjxnp71DSK.png" },
  { id: "apex-construction", name: "Apex Construction",    logo: null },
  { id: "tri-state-build",   name: "Tri-State Builders",   logo: null },
]

interface CompanyEditSlideoutProps {
  open: boolean
  onClose: () => void
  currentCompanyId?: string
}

interface FormState {
  officeName: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  fax: string
  corporateOffice: boolean
  numProjects: string
  logo: string | null
  selectedCompanyId: string
}

export function CompanyEditSlideout({ open, onClose, currentCompanyId = "miller-design" }: CompanyEditSlideoutProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState<FormState>({
    officeName:        "Miller Design HQ",
    address:           "1234 Commerce Drive, Suite 400",
    city:              "Austin",
    state:             "TX",
    zip:               "78701",
    country:           "United States",
    phone:             "(512) 555-0100",
    fax:               "(512) 555-0101",
    corporateOffice:   true,
    numProjects:       "5",
    logo:              null,
    selectedCompanyId: currentCompanyId,
  })

  const selectedCompany = COMPANIES.find(c => c.id === form.selectedCompanyId) ?? COMPANIES[0]

  const set = (field: keyof FormState, value: string | boolean | null) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set("logo", ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    setSaved(true)
  }

  useEffect(() => {
    if (!saved) return
    const t = window.setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1200)
    return () => clearTimeout(t)
  }, [saved, onClose])

  const handleOpenChange = (next: boolean) => {
    if (!next) onClose()
  }

  // ── Legacy design tokens via CSS variables ──────────────────────────────────
  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "var(--foreground-secondary)",
    marginBottom: 4,
    display: "block",
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    fontSize: 14,
    color: "var(--foreground-primary)",
    background: "var(--background-primary)",
    border: "1px solid var(--border-default)",
    borderRadius: 6,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  }

  const cardStyle: React.CSSProperties = {
    background: "var(--background-primary)",
    border: "1px solid var(--border-inactive)",
    borderRadius: 8,
  }

  const dividerStyle: React.CSSProperties = {
    height: 1,
    background: "var(--border-inactive)",
    marginBottom: 20,
  }

  return (
    <SlideOut open={open} onOpenChange={handleOpenChange}>
      <SlideOutContent className="h-full max-h-dvh w-full min-w-0 gap-0 overflow-hidden border-0 bg-[var(--color-bg-secondary)] p-0 shadow-none ring-0 ring-transparent">
        <div
          data-theme="legacy"
          className="flex h-full min-h-0 w-full min-w-0 flex-col bg-[var(--color-bg-secondary)]"
        >
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-default)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--color-bg-secondary)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <RiBuilding4Line style={{ width: 20, height: 20, color: "var(--color-text-primary)" }} />
            <span style={{ fontSize: 17, fontWeight: 700, color: "var(--foreground-primary)" }}>
              Company Information
            </span>
          </div>
          <SlideOutClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-[var(--color-text-tertiary)] transition-colors duration-150 hover:bg-[var(--color-bg-primary)]"
              aria-label="Close company information"
            >
              <RiCloseLine className="h-5 w-5" />
            </Button>
          </SlideOutClose>
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────────────── */}
        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto bg-[var(--color-bg-secondary)] p-5">

          {/* Switch Company */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Switch Company</label>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setCompanyDropdownOpen(v => !v)}
                style={{
                  ...inputStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {selectedCompany.logo ? (
                    <img src={selectedCompany.logo} alt="" style={{ width: 20, height: 20, objectFit: "contain", borderRadius: 3 }} />
                  ) : (
                    <div style={{ width: 20, height: 20, borderRadius: 3, background: "var(--background-tertiary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <RiBuilding4Line style={{ width: 12, height: 12, color: "var(--foreground-disabled)" }} />
                    </div>
                  )}
                  <span style={{ fontSize: 14, color: "var(--foreground-primary)" }}>{selectedCompany.name}</span>
                </div>
                <RiArrowDownSLine style={{
                  width: 16,
                  height: 16,
                  color: "var(--foreground-tertiary)",
                  transform: companyDropdownOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.15s",
                }} />
              </button>

              {companyDropdownOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  right: 0,
                  background: "var(--background-secondary, #ffffff)",
                  border: "1px solid var(--border-default)",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
                  zIndex: 10,
                }}>
                  {COMPANIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { set("selectedCompanyId", c.id); setCompanyDropdownOpen(false) }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        padding: "9px 12px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--background-primary)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "none")}
                    >
                      {c.logo ? (
                        <img src={c.logo} alt="" style={{ width: 20, height: 20, objectFit: "contain", borderRadius: 3 }} />
                      ) : (
                        <div style={{ width: 20, height: 20, borderRadius: 3, background: "var(--background-tertiary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <RiBuilding4Line style={{ width: 12, height: 12, color: "var(--foreground-disabled)" }} />
                        </div>
                      )}
                      <span style={{ fontSize: 14, color: "var(--foreground-primary)", flex: 1 }}>{c.name}</span>
                      {c.id === form.selectedCompanyId && (
                        <RiCheckLine style={{ width: 14, height: 14, color: "var(--foreground-primary, #111827)" }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Logo upload */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Company Logo</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 72,
                height: 48,
                borderRadius: 8,
                border: "1px solid var(--border-default)",
                background: "var(--background-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}>
                {form.logo ? (
                  <img src={form.logo} alt="Logo preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : selectedCompany.logo ? (
                  <img src={selectedCompany.logo} alt="Current logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : (
                  <RiBuilding4Line style={{ width: 24, height: 24, color: "var(--foreground-disabled)" }} />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--foreground-secondary)",
                  background: "var(--background-primary)",
                  border: "1px solid var(--border-default)",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                <RiUploadCloud2Line style={{ width: 15, height: 15 }} />
                Upload Image
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
            </div>
            <p style={{ fontSize: 11, color: "var(--foreground-disabled)", marginTop: 6 }}>
              PNG or JPG, recommended 200×80px
            </p>
          </div>

          <div style={dividerStyle} />

          {/* Office Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Office Name</label>
            <input style={inputStyle} value={form.officeName} onChange={e => set("officeName", e.target.value)} placeholder="e.g. Headquarters" />
          </div>

          {/* Address */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Address</label>
            <input style={inputStyle} value={form.address} onChange={e => set("address", e.target.value)} placeholder="Street address" />
          </div>

          {/* City / State */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>City</label>
              <input style={inputStyle} value={form.city} onChange={e => set("city", e.target.value)} placeholder="City" />
            </div>
            <div>
              <label style={labelStyle}>State / Province</label>
              <input style={inputStyle} value={form.state} onChange={e => set("state", e.target.value)} placeholder="State" />
            </div>
          </div>

          {/* ZIP / Country */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>ZIP / Postal Code</label>
              <input style={inputStyle} value={form.zip} onChange={e => set("zip", e.target.value)} placeholder="00000" />
            </div>
            <div>
              <label style={labelStyle}>Country</label>
              <input style={inputStyle} value={form.country} onChange={e => set("country", e.target.value)} placeholder="Country" />
            </div>
          </div>

          {/* Phone / Fax */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(555) 000-0000" />
            </div>
            <div>
              <label style={labelStyle}>Fax</label>
              <input style={inputStyle} value={form.fax} onChange={e => set("fax", e.target.value)} placeholder="(555) 000-0000" />
            </div>
          </div>

          {/* # Projects */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}># Projects</label>
            <input
              style={{ ...inputStyle, width: 120 }}
              type="number"
              min={0}
              value={form.numProjects}
              onChange={e => set("numProjects", e.target.value)}
              placeholder="0"
            />
          </div>

          {/* Corporate Office toggle */}
          <div style={{
            ...cardStyle,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
          }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "var(--foreground-primary)", margin: 0 }}>
                Corporate Office
              </p>
              <p style={{ fontSize: 12, color: "var(--foreground-tertiary)", margin: "2px 0 0" }}>
                Designate as the primary corporate office
              </p>
            </div>
            <button
              role="switch"
              aria-checked={form.corporateOffice}
              onClick={() => set("corporateOffice", !form.corporateOffice)}
              style={{
                width: 40,
                height: 22,
                borderRadius: 11,
                border: "none",
                cursor: "pointer",
                background: form.corporateOffice ? "var(--asphalt-900)" : "var(--asphalt-300)",
                position: "relative",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute",
                top: 2,
                left: form.corporateOffice ? 20 : 2,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "var(--color-bg-primary)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
                transition: "left 0.2s",
              }} />
            </button>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div
          className="flex flex-shrink-0 items-center justify-end gap-2 border-t border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] px-5 py-3"
        >
          <SlideOutClose asChild>
            <Button type="button" variant="outline" className="h-9 px-4 text-sm font-medium transition-colors duration-150">
              Cancel
            </Button>
          </SlideOutClose>
          <Button
            type="button"
            variant="default"
            className="h-9 gap-2 px-5 text-sm font-semibold transition-colors duration-150"
            onClick={handleSave}
            isDisabled={saved}
          >
            {saved ? <RiCheckLine className="h-4 w-4 shrink-0" /> : null}
            {saved ? "Saved" : "Save Changes"}
          </Button>
        </div>
        </div>
      </SlideOutContent>
    </SlideOut>
  )
}
