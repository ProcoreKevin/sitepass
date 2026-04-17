"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import type { SortDescriptor } from "react-aria-components"
import Link from "next/link"
import { Search, Filter, Settings2, ChevronDown } from "lucide-react"

import { useSplitView } from "@/components/workspace-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableCard } from "@/components/ui/table-collection"
import { ConfigureTableView } from "@/components/configure-table-view"
import { useTranslation } from "@/lib/use-translation"

type CommitmentRow = {
  number: string
  contractCompany: string
  title: string
  erpStatus: string
  status: string
  executed: string
  ssovStatus: string
  originalContractAmount: string
  approvedChangeOrders: string
}

export default function CommitmentsPage() {
  return <CommitmentsContent />
}

function CommitmentsContent() {
  const { openSplitView } = useSplitView()
  const [selectedCommitmentIndex, setSelectedCommitmentIndex] = useState<number>(-1)
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "number",
    direction: "ascending",
  })
  const { t } = useTranslation()
  const [listTab, setListTab] = useState<"contracts" | "recycle">("contracts")

  const commitments: CommitmentRow[] = [
    {
      number: "PO-1119-001",
      contractCompany: "",
      title: "Doors, Frames, Hardware",
      erpStatus: "-- Not Ready",
      status: "Draft",
      executed: "No",
      ssovStatus: "",
      originalContractAmount: "$315,000.00",
      approvedChangeOrders: "$0.00",
    },
    {
      number: "SC-1119-002",
      contractCompany: "",
      title: "Electrical - Power & Lighting",
      erpStatus: "-- Not Ready",
      status: "Draft",
      executed: "No",
      ssovStatus: "Draft",
      originalContractAmount: "$3,198,999.00",
      approvedChangeOrders: "$0.00",
    },
    {
      number: "SC-1119-003",
      contractCompany: "",
      title: "Cast In Place Concrete...",
      erpStatus: "-- Not Ready",
      status: "Draft",
      executed: "Yes",
      ssovStatus: "Draft",
      originalContractAmount: "$1,625,000.00",
      approvedChangeOrders: "$0.00",
    },
    {
      number: "SC-1119-004",
      contractCompany: "",
      title: "Sitework & Excavation",
      erpStatus: "-- Not Ready",
      status: "Draft",
      executed: "Yes",
      ssovStatus: "Draft",
      originalContractAmount: "$1,080,000.00",
      approvedChangeOrders: "$0.00",
    },
  ]

  const sortedCommitments = useMemo(() => {
    const col = sortDescriptor.column as keyof CommitmentRow | undefined
    if (!col) return commitments

    return [...commitments].sort((a, b) => {
      const av = a[col]
      const bv = b[col]
      if (col === "originalContractAmount" || col === "approvedChangeOrders") {
        const na = Number.parseFloat(String(av).replace(/[$,]/g, ""))
        const nb = Number.parseFloat(String(bv).replace(/[$,]/g, ""))
        const cmp = na - nb
        return sortDescriptor.direction === "descending" ? -cmp : cmp
      }
      const sa = String(av ?? "")
      const sb = String(bv ?? "")
      let cmp = sa.localeCompare(sb, undefined, { numeric: true })
      if (sortDescriptor.direction === "descending") cmp *= -1
      return cmp
    })
  }, [commitments, sortDescriptor])

  const grandTotalOriginal = commitments.reduce((sum, c) => {
    const amount = Number.parseFloat(c.originalContractAmount.replace(/[$,]/g, ""))
    return sum + amount
  }, 0)

  const grandTotalApproved = commitments.reduce((sum, c) => {
    const amount = Number.parseFloat(c.approvedChangeOrders.replace(/[$,]/g, ""))
    return sum + amount
  }, 0)

  const handleNavigateUp = () => {
    if (selectedCommitmentIndex > 0) {
      const newIndex = selectedCommitmentIndex - 1
      setSelectedCommitmentIndex(newIndex)
      openCommitmentAtIndex(newIndex)
    }
  }

  const handleNavigateDown = () => {
    if (selectedCommitmentIndex < commitments.length - 1) {
      const newIndex = selectedCommitmentIndex + 1
      setSelectedCommitmentIndex(newIndex)
      openCommitmentAtIndex(newIndex)
    }
  }

  const openCommitmentAtIndex = (index: number) => {
    const commitment = commitments[index]
    openSplitView({
      type: "commitment",
      number: commitment.number,
      status: commitment.status,
      title: commitment.title,
      contractCompany: commitment.contractCompany,
      executed: commitment.executed,
      ssovStatus: commitment.ssovStatus,
      originalContractAmount: commitment.originalContractAmount,
      approvedChangeOrders: commitment.approvedChangeOrders,
      generalInfo: {
        title: commitment.title,
        executed: commitment.executed,
        defaultRange: "30 days",
        attachments: "3 files",
        description:
          "Furnish and install all material, labor, and equipment, for complete floor covering scope as per the plans listed on exhibit 'B' and specifications.",
      },
      onNavigateUp: handleNavigateUp,
      onNavigateDown: handleNavigateDown,
      canNavigateUp: index > 0,
      canNavigateDown: index < commitments.length - 1,
    })
  }

  const openCommitmentByNumber = (number: string) => {
    const idx = commitments.findIndex(c => c.number === number)
    if (idx < 0) return
    setSelectedCommitmentIndex(idx)
    openCommitmentAtIndex(idx)
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-border-default border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Settings2 className="text-foreground-secondary h-5 w-5" />
            <h1 className="text-foreground-primary text-2xl font-semibold">{t("commitments")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              {t("export")}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
            <Button size="sm">+ {t("create")}</Button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-6">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-auto rounded-none border-b-2 border-transparent px-2 pb-3 text-sm font-medium shadow-none ring-0",
              listTab === "contracts"
                ? "text-foreground-primary border-foreground-primary"
                : "text-foreground-tertiary hover:text-foreground-secondary",
            )}
            onClick={() => setListTab("contracts")}
          >
            {t("contracts")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-auto rounded-none border-b-2 border-transparent px-2 pb-3 text-sm font-medium shadow-none ring-0",
              listTab === "recycle"
                ? "text-foreground-primary border-foreground-primary"
                : "text-foreground-tertiary hover:text-foreground-secondary",
            )}
            onClick={() => setListTab("recycle")}
          >
            {t("recycle_bin")}
          </Button>
        </div>
      </div>

      <div className="bg-background-primary border-border-default flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="text-foreground-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input placeholder={t("search")} className="bg-background h-9 pl-9" />
          </div>
          <Button variant="outline" size="sm" className="bg-background gap-2">
            <Filter className="h-4 w-4" />
            {t("filters")}
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="none">
            <SelectTrigger className="bg-background h-9 w-[200px]">
              <SelectValue placeholder={t("select_column_to_group")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t("select_column_to_group")}</SelectItem>
              <SelectItem value="status">{t("status")}</SelectItem>
              <SelectItem value="company">{t("contract_company")}</SelectItem>
            </SelectContent>
          </Select>
          <ConfigureTableView onSave={columns => console.log("[v0] Table view saved:", columns)} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {listTab === "recycle" ? (
          <div className="text-foreground-tertiary flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-border-default bg-background-primary p-8 text-sm">
            {t("recycle_bin")} — Coming soon
          </div>
        ) : (
        <TableCard.Root className="min-w-0">
          <TableCard.Header title={t("contracts")} badge={`${commitments.length}`} />
          <Table
            aria-label={t("commitments")}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            onRowAction={key => openCommitmentByNumber(String(key))}
            size="md"
          >
            <Table.Header>
              <Table.Head id="number" isRowHeader label={t("number")} allowsSorting className="min-w-36" />
              <Table.Head id="contractCompany" label={t("contract_company")} allowsSorting className="min-w-40" />
              <Table.Head id="title" label={t("title")} allowsSorting className="min-w-56" />
              <Table.Head id="erpStatus" label={t("erp_status")} allowsSorting className="min-w-32" />
              <Table.Head id="status" label={t("status")} allowsSorting className="min-w-32" />
              <Table.Head id="executed" label={t("executed")} allowsSorting className="min-w-28" />
              <Table.Head id="ssovStatus" label={t("ssov_status")} className="min-w-32" />
              <Table.Head
                id="originalContractAmount"
                label={t("original_contract_amount")}
                allowsSorting
                className="min-w-40 text-right [&_.flex]:justify-end"
              />
              <Table.Head
                id="approvedChangeOrders"
                label={t("approved_change_orders")}
                allowsSorting
                className="min-w-40 text-right [&_.flex]:justify-end"
              />
              <Table.Head id="actions" className="w-14" />
            </Table.Header>
            <Table.Body items={sortedCommitments}>
              {item => (
                <Table.Row id={item.number}>
                  <Table.Cell className="whitespace-nowrap" textValue={item.number}>
                    <Link
                      href={`/commitments/${item.number}`}
                      className="text-link hover:text-link-hover font-medium underline transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      {item.number}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="text-foreground-secondary whitespace-nowrap">
                    {item.contractCompany || "—"}
                  </Table.Cell>
                  <Table.Cell className="text-foreground-primary whitespace-nowrap">{item.title}</Table.Cell>
                  <Table.Cell className="text-foreground-tertiary text-sm italic whitespace-nowrap">
                    {item.erpStatus}
                  </Table.Cell>
                  <Table.Cell textValue={item.status} onClick={e => e.stopPropagation()}>
                    <Select defaultValue={item.status.toLowerCase()}>
                      <SelectTrigger className="hover:bg-background-secondary/50 h-8 w-32 border-0 bg-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">
                          <Badge variant="outline" className="font-normal">
                            {t("draft")}
                          </Badge>
                        </SelectItem>
                        <SelectItem value="approved">
                          <Badge variant="success" className="font-normal">
                            {t("approved")}
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Table.Cell>
                  <Table.Cell textValue={item.executed} onClick={e => e.stopPropagation()}>
                    <Select defaultValue={item.executed.toLowerCase()}>
                      <SelectTrigger className="hover:bg-background-secondary/50 h-8 w-20 border-0 bg-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">{t("yes")}</SelectItem>
                        <SelectItem value="no">{t("no")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Table.Cell>
                  <Table.Cell>
                    {item.ssovStatus ? (
                      <Badge variant="outline" className="font-normal">
                        {item.ssovStatus}
                      </Badge>
                    ) : null}
                  </Table.Cell>
                  <Table.Cell className="text-foreground-primary text-right font-medium whitespace-nowrap">
                    {item.originalContractAmount}
                  </Table.Cell>
                  <Table.Cell className="text-foreground-primary text-right font-medium whitespace-nowrap">
                    {item.approvedChangeOrders}
                  </Table.Cell>
                  <Table.Cell onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          <div className="border-border-secondary bg-secondary_subtle flex flex-wrap items-center justify-between gap-4 border-t px-4 py-3 md:px-6">
            <span className="text-primary text-sm font-semibold">{t("grand_totals")}</span>
            <div className="flex flex-wrap items-center gap-6 md:gap-10">
              <span className="text-primary text-sm font-semibold tabular-nums">
                $
                {grandTotalOriginal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-primary text-sm font-semibold tabular-nums">
                $
                {grandTotalApproved.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </TableCard.Root>
        )}
      </div>
    </div>
  )
}
