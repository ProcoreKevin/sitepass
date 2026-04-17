"use client"
import { useEffect } from "react"
import { ChevronUp, ChevronDown, Edit, ExternalLink, X, Plus, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDownIcon } from "lucide-react"

export type RiskHeatmapIncidentItem = {
  id: string
  number: string
  title: string
  date: string
  severity: "Low" | "Medium" | "High"
}

export type RiskHeatmapObservationItem = {
  id: string
  number: string
  title: string
  date: string
}

interface SplitViewPanelProps {
  isOpen: boolean
  onClose: () => void
  width: 37 | 67
  onWidthChange: (width: 37 | 67) => void
  assistWidth: number
  workspaceWidth: number
  rfiData?: {
    type?: "rfi" | "commitment" | "risk-heatmap-cell"
    number?: number | string
    status?: string
    subject?: string
    title?: string
    description?: string
    contractCompany?: string
    executed?: string
    ssovStatus?: string
    originalContractAmount?: string
    approvedChangeOrders?: string
    generalInfo?: any
    dueDate?: string
    manager?: string
    receivedFrom?: string
    location?: string
    ballInCourt?: string
    assignees?: string
    /** Risk-Ratio Heatmap cell detail */
    heatmapCategory?: string
    heatmapProject?: string
    heatmapScore?: number
    dateRangeLabel?: string
    incidentWeightLabel?: string
    incidents?: RiskHeatmapIncidentItem[]
    observations?: RiskHeatmapObservationItem[]
  }
  onNavigateUp?: () => void
  onNavigateDown?: () => void
  canNavigateUp?: boolean
  canNavigateDown?: boolean
}

export function SplitViewPanel({
  isOpen,
  onClose,
  width,
  onWidthChange,
  assistWidth,
  workspaceWidth,
  rfiData,
  onNavigateUp,
  onNavigateDown,
  canNavigateUp = false,
  canNavigateDown = false,
}: SplitViewPanelProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Default data if none provided
  const data = rfiData || {
    number: 349,
    status: "Open",
    subject: "Broadway Electrical Upgrade",
    description:
      "The electrical panel location shown on Drawing E-201 Rev. 3 (Fire Pump Room Layout) conflicts with the fire pump controller installation and creates multiple code compliance issues. Panel EP-B1-FP cannot be installed as shown due to physical obstructions and NEC clearance violations.",
    dueDate: "10/22/2025",
    manager: "T. Kim",
    receivedFrom: "J. Morrison, AIA",
    location: "Southwest Floor Data Room C1021",
    ballInCourt: "Sateesh Kadiyala",
    assignees: "Jennifer Morrison",
  }

  const fullWorkspaceWidth = window.innerWidth - assistWidth
  const actualWidth = (fullWorkspaceWidth * width) / 100

  const isCommitment = data?.type === "commitment"
  const isRiskHeatmap = data?.type === "risk-heatmap-cell"

  return (
    <div
      className="fixed top-14 z-30 flex h-[calc(100dvh-3.5rem)] flex-col border-l border-border-default bg-background-primary transition-all duration-300"
      style={{
        right: `${assistWidth}px`,
        width: `${actualWidth}px`,
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default px-6 py-4 border-none">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {!isRiskHeatmap && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNavigateUp} disabled={!canNavigateUp}>
                <ChevronUp className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onNavigateDown}
                disabled={!canNavigateDown}
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>
          )}
          <div className="min-w-0 flex flex-col gap-0.5">
            {isRiskHeatmap ? (
              <>
                <h2 className="truncate text-lg font-semibold">
                  {data.heatmapCategory} · {data.heatmapProject}
                </h2>
                <p className="text-sm text-foreground-secondary">
                  Safety score {data.heatmapScore}
                  {data.dateRangeLabel ? ` · ${data.dateRangeLabel}` : ""}
                  {data.incidentWeightLabel ? ` · Weight ${data.incidentWeightLabel}` : ""}
                </p>
              </>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">
                  {isCommitment ? `Commitment ${data.number}` : `RFI #${data.number}`}
                </h2>
                <Badge variant="secondary" className="bg-background-secondary text-foreground-primary">
                  {data.status}
                </Badge>
              </div>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {!isRiskHeatmap && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-5 w-5" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Close panel">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isRiskHeatmap ? (
        <RiskHeatmapCellContent data={data} />
      ) : isCommitment ? (
        <CommitmentContent data={data} />
      ) : (
        <RFIContent data={data} />
      )}

      {/* Sticky Footer */}
      <div className="flex h-14 items-center justify-between border-t border-border-default px-6">
        {isRiskHeatmap ? (
          <div className="flex w-full justify-end">
            <Button
              type="button"
              size="sm"
              className="bg-foreground-primary text-background-primary hover:bg-foreground-primary/90"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        ) : isCommitment ? (
          <>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Change Order
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Invoice
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-foreground-primary text-background-primary hover:bg-foreground-primary/90"
              >
                Send With Docusign
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Correspondence
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Change Event
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-foreground-primary text-background-primary hover:bg-foreground-primary/90"
              >
                Close RFI
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function RiskHeatmapCellContent({ data }: { data: NonNullable<SplitViewPanelProps["rfiData"]> }) {
  const incidents = data.incidents ?? []
  const observations = data.observations ?? []

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <p className="mb-6 text-sm leading-relaxed text-foreground-secondary">
        Incidents and observations in this period that were tagged with this hazard category and counted toward the
        score for this project.
      </p>

      <section className="mb-8">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-secondary">Incidents</h3>
        {incidents.length === 0 ? (
          <p className="text-sm text-foreground-secondary">No incidents in this cell for the selected range.</p>
        ) : (
          <ul className="divide-y divide-border-default rounded-md border border-border-default">
            {incidents.map((item) => (
              <li key={item.id} className="flex flex-col gap-1 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs text-foreground-secondary">{item.number}</span>
                  <Badge
                    variant="secondary"
                    className={
                      item.severity === "High"
                        ? "border-destructive/30 bg-destructive/10 text-destructive"
                        : item.severity === "Medium"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
                          : "bg-background-secondary text-foreground-primary"
                    }
                  >
                    {item.severity}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-foreground-primary">{item.title}</p>
                <p className="text-xs text-foreground-secondary">{item.date}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-secondary">Observations</h3>
        {observations.length === 0 ? (
          <p className="text-sm text-foreground-secondary">No observations in this cell for the selected range.</p>
        ) : (
          <ul className="divide-y divide-border-default rounded-md border border-border-default">
            {observations.map((item) => (
              <li key={item.id} className="flex flex-col gap-1 px-4 py-3">
                <span className="font-mono text-xs text-foreground-secondary">{item.number}</span>
                <p className="text-sm font-medium text-foreground-primary">{item.title}</p>
                <p className="text-xs text-foreground-secondary">{item.date}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function RFIContent({ data }: { data: any }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <h3 className="mb-4 text-xl font-semibold">{data.subject}</h3>

      <div className="mb-6">
        <h4 className="mb-2 text-sm font-semibold text-foreground-secondary">Description</h4>
        <p className="text-sm leading-relaxed text-foreground-secondary">{data.description}</p>
      </div>

      <Tabs defaultValue="general" className="mb-6">
        <TabsList className="w-full justify-start border-b border-border-default bg-transparent p-0">
          <TabsTrigger
            value="general"
            className="rounded-none px-4 py-2 data-[state=active]:border-foreground-primary data-[state=active]:bg-transparent border-primary border-b-2 border-solid border-t-0 border-r-0 border-l-0"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="responses"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-foreground-primary data-[state=active]:bg-transparent border-none"
          >
            Responses
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-6">
          <div className="mb-6 grid grid-cols-2 gap-3">
            <img
              src="/electrical-panel-room-construction-site.jpg"
              alt="Construction site photo 1"
              className="h-auto w-full rounded-lg border border-border-default object-cover"
            />
            <img
              src="/fire-pump-controller-installation.jpg"
              alt="Construction site photo 2"
              className="h-auto w-full rounded-lg border border-border-default object-cover"
            />
            <img
              src="/electrical-panel-clearance-issue.jpg"
              alt="Construction site photo 3"
              className="h-auto w-full rounded-lg border border-border-default object-cover"
            />
            <img
              src="/nec-code-compliance-construction.jpg"
              alt="Construction site photo 4"
              className="h-auto w-full rounded-lg border border-border-default object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1 text-xs font-semibold text-foreground-secondary">Number</div>
                <div className="text-sm">{data.number}</div>
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-foreground-secondary">Due Date</div>
                <div className="text-sm">{data.dueDate}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1 text-xs font-semibold text-foreground-secondary">RFI Manager</div>
                <div className="text-sm">{data.manager}</div>
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-foreground-secondary">Received From</div>
                <div className="text-sm">{data.receivedFrom}</div>
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold text-foreground-secondary">Location</div>
              <div className="text-sm">{data.location}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1 text-xs font-semibold text-foreground-secondary">Ball In Court</div>
                <div className="text-sm">{data.ballInCourt}</div>
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-foreground-secondary">Assignees</div>
                <div className="text-sm">{data.assignees}</div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="responses" className="mt-6">
          <p className="text-sm text-foreground-secondary">No responses yet.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CommitmentContent({ data }: { data: any }) {
  const getStatusBadgeClassName = (status: string) => {
    if (status === "Approved") {
      return "bg-success-25 text-success-800 border-success-400 hover:bg-success-25"
    }
    return ""
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default"
      case "Out For Signature":
        return "secondary"
      case "Out For Bid":
        return "secondary"
      case "Draft":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 py-6">
        <h3 className="mb-4 text-xl font-semibold">{data.title}</h3>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="mb-1 text-xs font-semibold text-foreground-secondary">Contract Company</div>
            <div className="text-sm">{data.contractCompany}</div>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold text-foreground-secondary">Executed</div>
            <div className="text-sm">{data.executed}</div>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold text-foreground-secondary">Original Contract Amount</div>
            <div className="text-sm font-medium">{data.originalContractAmount}</div>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold text-foreground-secondary">Approved Change Orders</div>
            <div className="text-sm font-medium">{data.approvedChangeOrders}</div>
          </div>
        </div>

        <Tabs defaultValue="general" className="mb-6">
          <TabsList className="w-full justify-start border-b border-border-default bg-transparent p-0">
            <TabsTrigger
              value="general"
              className="rounded-none px-4 py-2 data-[state=active]:border-foreground-primary data-[state=active]:bg-transparent border-primary border-b-2 border-solid border-t-0 border-r-0 border-l-0"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="sov"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-foreground-primary data-[state=active]:bg-transparent border-none"
            >
              SOV
            </TabsTrigger>
            <TabsTrigger
              value="change-orders"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-foreground-primary data-[state=active]:bg-transparent border-none"
            >
              Change Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <Accordion type="single" collapsible defaultValue="general-info" className="w-full">
              <AccordionItem value="general-info" className="border-b border-border-default">
                <AccordionTrigger className="py-4 text-base font-semibold text-foreground-primary hover:no-underline">
                  General Information
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pb-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="mb-1 text-sm font-medium text-foreground-primary">Title</div>
                        <div className="text-sm text-foreground-secondary">{data.generalInfo?.title}</div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm font-medium text-foreground-primary">Executed</div>
                        <div className="text-sm text-foreground-secondary">{data.generalInfo?.executed}</div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm font-medium text-foreground-primary">Default range</div>
                        <div className="text-sm text-foreground-secondary">{data.generalInfo?.defaultRange}</div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm font-medium text-foreground-primary">Attachments</div>
                        <button className="flex items-center gap-1 text-sm text-link underline hover:text-link-hover transition-colors">
                          {data.generalInfo?.attachments}
                          <ChevronDownIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium text-foreground-primary">Description</div>
                      <div className="text-sm leading-relaxed text-foreground-secondary">
                        {data.generalInfo?.description}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="contract-summary" className="border-b border-border-default">
                <AccordionTrigger className="py-4 text-base font-semibold text-foreground-primary hover:no-underline">
                  Contract Summary
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pb-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="mb-1 text-sm font-medium text-foreground-primary">Original Contract Amount</div>
                        <div className="text-sm text-foreground-secondary">{data.originalContractAmount}</div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm font-medium text-foreground-primary">Pending Change Orders</div>
                        <div className="text-sm text-foreground-secondary">$0.00</div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm font-medium text-foreground-primary">Approved Change Orders</div>
                        <div className="text-sm text-foreground-secondary">{data.approvedChangeOrders}</div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm font-medium text-foreground-primary">Revised Contract Amount</div>
                        <div className="text-sm text-foreground-secondary">{data.originalContractAmount}</div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="sov" className="mt-6">
            <div className="space-y-4">
              <div className="rounded-md border border-border-default">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Budget Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">09-300.S</TableCell>
                      <TableCell>Tile</TableCell>
                      <TableCell className="text-right">$145,000.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">09-400 S.</TableCell>
                      <TableCell>Terrazzo</TableCell>
                      <TableCell className="text-right">$98,560.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">09-600 S.</TableCell>
                      <TableCell>Flooring</TableCell>
                      <TableCell className="text-right">$356,210.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="change-orders" className="mt-6">
            <p className="text-sm text-foreground-secondary">No change orders yet.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
