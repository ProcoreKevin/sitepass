"use client"

import { useEffect, useState } from "react"
import { RiUpload2Line } from "react-icons/ri"

type DirectoryUser = {
  id: string
  name: string
  jobTitle: string
  email: string
  address: string
  status: "Invite" | "Re-Invite"
  companyName?: string
  source?: "site-pass"
}

const directoryUsers: DirectoryUser[] = [
  { id: "u-01", name: "Carlos Gomez", jobTitle: "Project Engineer", email: "carlos.gomez@procore.com", address: "US", status: "Invite" },
  { id: "u-02", name: "Steven Johnson", jobTitle: "Superintendent", email: "steven.johnson@procore.com", address: "US", status: "Re-Invite" },
  { id: "u-03", name: "Cate Knuff", jobTitle: "Project Manager", email: "cate.knuff@procore.com", address: "US", status: "Invite" },
  { id: "u-04", name: "Yunpeng Liu", jobTitle: "Coordinator", email: "yunpeng.liu+readonly@procore.com", address: "US", status: "Invite" },
  { id: "u-05", name: "Spencer N", jobTitle: "Estimator", email: "spencerneste@gmail.com", address: "US", status: "Invite" },
  { id: "u-06", name: "Spencer Neste", jobTitle: "Assistant PM", email: "spencer@procore.com", address: "US", status: "Invite" },
  { id: "u-07", name: "Spencer Neste (Sub)", jobTitle: "Subcontractor", email: "spencer+standard@procore.com", address: "US", status: "Re-Invite" },
]

const directoryContacts: DirectoryUser[] = [
  { id: "c-01", name: "Maya Reynolds", jobTitle: "Office Manager", email: "maya.reynolds@buildnorth.com", address: "US", status: "Invite", companyName: "Northline Groundworks Ltd." },
  { id: "c-02", name: "Andre Wallace", jobTitle: "Permit Coordinator", email: "andre.wallace@buildnorth.com", address: "US", status: "Invite", companyName: "Northline Groundworks Ltd." },
  { id: "c-03", name: "Nina Alvarez", jobTitle: "Project Accountant", email: "nina.alvarez@buildnorth.com", address: "US", status: "Re-Invite", companyName: "Harborline Scaffolding" },
  { id: "c-04", name: "Derrick Boone", jobTitle: "Safety Lead", email: "derrick.boone@buildnorth.com", address: "US", status: "Invite", companyName: "Harborline Scaffolding" },
  { id: "c-05", name: "Sofia Chen", jobTitle: "Procurement Specialist", email: "sofia.chen@buildnorth.com", address: "US", status: "Invite", companyName: "Redwood Interiors" },
  { id: "c-06", name: "Landon Pierce", jobTitle: "Document Control", email: "landon.pierce@buildnorth.com", address: "US", status: "Re-Invite", companyName: "Redwood Interiors" },
]

const topTabs = [
  "Users",
  "Contacts",
  "Companies",
  "Distribution Groups",
  "Inactive Users",
  "Inactive Contacts",
  "Inactive Companies",
] as const

export default function DirectoryPage() {
  const [activeTab, setActiveTab] = useState<(typeof topTabs)[number]>("Users")
  const [projectContacts, setProjectContacts] = useState<DirectoryUser[]>([])

  useEffect(() => {
    const storageKey = "project-directory-added-contacts"
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as DirectoryUser[]
      const normalizedContacts = Array.isArray(parsed)
        ? parsed.map((contact) => ({
            ...contact,
            source:
              contact.source === "site-pass" || /-w-\d+$/i.test(contact.id)
                ? "site-pass"
                : undefined,
          }))
        : []
      setProjectContacts(normalizedContacts)
    } catch {
      setProjectContacts([])
    }
  }, [])

  const combinedContacts = [...directoryContacts, ...projectContacts]
  const activeRows = activeTab === "Contacts" ? combinedContacts : directoryUsers
  const displayCount = activeRows.length
  const groupedRows =
    activeTab === "Contacts"
      ? activeRows.reduce<Record<string, DirectoryUser[]>>((groups, row) => {
          const groupName = row.companyName ?? "Unassigned Company"
          if (!groups[groupName]) groups[groupName] = []
          groups[groupName].push(row)
          return groups
        }, {})
      : { "A & D Drywall and Acoustics, Inc.": activeRows }

  return (
    <div className="h-full min-h-0 overflow-auto bg-[var(--color-bg-primary)] p-3 text-[var(--color-text-primary)]">
      <div className="grid min-h-full grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-[length:var(--text-h3-size)] font-semibold leading-[var(--text-h3-lh)] tracking-[var(--text-h3-ls)]">
              Project Directory
            </h1>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-2 rounded border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] px-3 text-[length:var(--text-sm-size)] font-medium"
            >
              Export
              <span aria-hidden>▼</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-b border-[var(--color-border-default)] pb-2">
            {topTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={
                  activeTab === tab
                    ? "border-b-2 border-[var(--color-brand-500)] pb-1 text-[length:var(--text-sm-size)] font-semibold"
                    : "pb-1 text-[length:var(--text-sm-size)] text-[var(--color-text-secondary)]"
                }
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              aria-label="Search users"
              placeholder="Search"
              className="h-8 w-40 rounded border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-2 text-[length:var(--text-sm-size)] outline-none focus:border-[var(--color-border-input-focus)]"
            />
            <button
              type="button"
              className="h-8 rounded border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-2 text-[length:var(--text-sm-size)]"
            >
              🔍
            </button>
            <span className="ml-2 text-[length:var(--text-sm-size)] text-[var(--color-text-secondary)]">Group by:</span>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-2 rounded border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-2 text-[length:var(--text-sm-size)]"
            >
              Company
              <span aria-hidden>▼</span>
            </button>
            <button
              type="button"
              className="ml-2 inline-flex h-8 items-center gap-2 rounded border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-2 text-[length:var(--text-sm-size)]"
            >
              Add Filter
              <span aria-hidden>▼</span>
            </button>
          </div>

          <div className="rounded border border-[var(--color-border-default)] bg-[var(--color-bg-primary)]">
            <div className="border-b border-[var(--color-border-default)] px-3 py-2 text-[length:var(--text-sm-size)] text-[var(--color-text-secondary)]">
              Displaying 1 - {displayCount} of {displayCount}
            </div>

            <div className="grid grid-cols-[36px_1.3fr_1fr_1.3fr_0.6fr_120px] border-b border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              <span />
              <span>Name</span>
              <span>Job Title</span>
              <span>Email / Phone / Fax</span>
              <span>Address</span>
              <span />
            </div>

            {Object.entries(groupedRows).map(([companyName, rows]) => (
              <div key={companyName}>
                <div className="border-b border-[var(--color-border-default)] bg-[var(--color-bg-row-active)] px-3 py-2 text-[length:var(--text-sm-size)] font-semibold">
                  {companyName}
                </div>
                {rows.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-[36px_1.3fr_1fr_1.3fr_0.6fr_120px] items-center border-b border-[var(--color-border-default)] px-3 py-2 text-[length:var(--text-sm-size)] last:border-b-0"
                  >
                    <input type="checkbox" aria-label={`Select ${user.name}`} className="h-3.5 w-3.5" />
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.name}</span>
                      {user.source === "site-pass" && (
                        <span className="rounded-full bg-[var(--color-bg-feedback-info)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-info)]">
                          Added via Site Pass
                        </span>
                      )}
                    </div>
                    <span className="text-[var(--color-text-secondary)]">{user.jobTitle}</span>
                    <span>{user.email}</span>
                    <span>{user.address}</span>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="h-6 rounded bg-[var(--color-brand-500)] px-2 text-[10px] font-semibold text-[var(--color-text-inverse)]"
                      >
                        {user.status}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-3 border-l border-[var(--color-border-default)] pl-3">
          <button
            type="button"
            className="block h-9 w-full rounded bg-[var(--color-brand-500)] px-3 text-left text-[length:var(--text-sm-size)] font-semibold text-[var(--color-text-inverse)]"
          >
            + Add {activeTab === "Contacts" ? "Contact" : "User"}
          </button>
          <button
            type="button"
            className="block h-9 w-full rounded bg-[var(--color-brand-500)] px-3 text-left text-[length:var(--text-sm-size)] font-semibold text-[var(--color-text-inverse)]"
          >
            + Add Company
          </button>
          <button
            type="button"
            className="block h-9 w-full rounded bg-[var(--color-brand-500)] px-3 text-left text-[length:var(--text-sm-size)] font-semibold text-[var(--color-text-inverse)]"
          >
            + Add Distribution Group
          </button>
          <button
            type="button"
            className="block h-9 w-full rounded bg-[var(--color-brand-500)] px-3 text-left text-[length:var(--text-sm-size)] font-semibold text-[var(--color-text-inverse)]"
          >
            + Bulk Add from Co. Directory
          </button>

          <div className="rounded border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] p-3">
            <div className="mb-2 flex items-center gap-2">
              <RiUpload2Line className="h-4 w-4 text-[var(--color-text-secondary)]" />
              <p className="text-[length:var(--text-body-size)] font-semibold">Procore Imports</p>
            </div>
            <p className="text-[length:var(--text-sm-size)] text-[var(--color-text-secondary)]">
              Import your contacts with Procore Imports
            </p>
            <button
              type="button"
              className="mt-3 h-8 rounded border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] px-3 text-[length:var(--text-sm-size)] font-medium"
            >
              Download
            </button>
          </div>

          <div className="border-t border-[var(--color-border-default)] pt-2">
            <p className="mb-2 text-[length:var(--text-sm-size)] font-semibold">IMPORT PEOPLE</p>
            <div className="space-y-1 text-[length:var(--text-sm-size)] text-[var(--color-text-link)]">
              <button type="button" className="block hover:underline">Download Validated Template</button>
              <button type="button" className="block hover:underline">Send Complete Template</button>
            </div>
          </div>

          <div className="border-t border-[var(--color-border-default)] pt-2">
            <p className="mb-2 text-[length:var(--text-sm-size)] font-semibold">IMPORT COMPANIES</p>
            <div className="space-y-1 text-[length:var(--text-sm-size)] text-[var(--color-text-link)]">
              <button type="button" className="block hover:underline">Download Validated Template</button>
              <button type="button" className="block hover:underline">Download Existing Vendors for Import</button>
              <button type="button" className="block hover:underline">Send Complete Template</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
