"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronDown, MoreVertical, Filter, Settings2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function CommitmentDetailContent({ commitment }: { commitment: any }) {
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
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border-default px-6 py-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-semibold text-foreground-primary">{commitment.title}</h1>
            <div className="flex items-center gap-4 text-sm text-foreground-secondary">
              <span>
                <span className="font-medium">Number:</span> {commitment.number}
              </span>
              <span className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge
                  variant={getStatusBadgeVariant(commitment.status) as any}
                  className={`font-normal ${getStatusBadgeClassName(commitment.status)}`}
                >
                  {commitment.status}
                </Badge>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Send With Docusign
            </Button>
            <Button size="sm">
              Create
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="h-auto w-full justify-start rounded-none border-b border-border-default bg-transparent p-0">
            <TabsTrigger
              value="general"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 data-[state=active]:border-foreground-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="subcontractor-sov"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 data-[state=active]:border-foreground-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Subcontractor SOV
            </TabsTrigger>
            <TabsTrigger
              value="change-orders"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 data-[state=active]:border-foreground-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Change Orders
            </TabsTrigger>
            <TabsTrigger
              value="rfqs"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 data-[state=active]:border-foreground-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              RFQs
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 data-[state=active]:border-foreground-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Invoices
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 data-[state=active]:border-foreground-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Payments Issued
            </TabsTrigger>
            <TabsTrigger
              value="emails"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 data-[state=active]:border-foreground-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Emails
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 data-[state=active]:border-foreground-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Change History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-0">
            <GeneralTab commitment={commitment} />
          </TabsContent>
          <TabsContent value="subcontractor-sov" className="mt-0">
            <div className="p-6 text-foreground-secondary">Subcontractor SOV content coming soon...</div>
          </TabsContent>
          <TabsContent value="change-orders" className="mt-0">
            <div className="p-6 text-foreground-secondary">Change Orders content coming soon...</div>
          </TabsContent>
          <TabsContent value="rfqs" className="mt-0">
            <div className="p-6 text-foreground-secondary">RFQs content coming soon...</div>
          </TabsContent>
          <TabsContent value="invoices" className="mt-0">
            <div className="p-6 text-foreground-secondary">Invoices content coming soon...</div>
          </TabsContent>
          <TabsContent value="payments" className="mt-0">
            <div className="p-6 text-foreground-secondary">Payments Issued content coming soon...</div>
          </TabsContent>
          <TabsContent value="emails" className="mt-0">
            <div className="p-6 text-foreground-secondary">Emails content coming soon...</div>
          </TabsContent>
          <TabsContent value="history" className="mt-0">
            <div className="p-6 text-foreground-secondary">Change History content coming soon...</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function GeneralTab({ commitment }: { commitment: any }) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <Accordion type="single" collapsible defaultValue="general-info" className="w-full">
          {/* General Information */}
          <AccordionItem value="general-info" className="border-b border-border-default">
            <AccordionTrigger className="py-4 text-base font-semibold text-foreground-primary hover:no-underline">
              General Information
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pb-4">
                {/* Grid layout for fields */}
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Title</div>
                    <div className="text-sm text-foreground-secondary">{commitment.generalInfo.title}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Executed</div>
                    <div className="text-sm text-foreground-secondary">{commitment.generalInfo.executed}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Default range</div>
                    <div className="text-sm text-foreground-secondary">{commitment.generalInfo.defaultRange}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Attachments</div>
                    <button className="flex items-center gap-1 text-sm text-link underline hover:text-link-hover transition-colors">
                      {commitment.generalInfo.attachments}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="mb-2 text-sm font-medium text-foreground-primary">Description</div>
                  <div className="text-sm leading-relaxed text-foreground-secondary">
                    {commitment.generalInfo.description}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Contract Summary */}
          <AccordionItem value="contract-summary" className="border-b border-border-default">
            <AccordionTrigger className="py-4 text-base font-semibold text-foreground-primary hover:no-underline">
              Contract Summary
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pb-4">
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Original Contract Amount</div>
                    <div className="text-sm text-foreground-secondary">$749,770.00</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Pending Change Orders</div>
                    <div className="text-sm text-foreground-secondary">$0.00</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Invoices</div>
                    <div className="text-sm text-foreground-secondary">$0.00</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Payments Issued</div>
                    <div className="text-sm text-foreground-secondary">$0.00</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Approved Change Orders</div>
                    <div className="text-sm text-foreground-secondary">$0.00</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">
                      Pending Revised Contract Amount
                    </div>
                    <div className="text-sm text-foreground-secondary">$749,770.00</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Remaining Balance</div>
                    <div className="text-sm text-foreground-secondary">$749,770.00</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Percent Paid</div>
                    <div className="text-sm text-foreground-secondary">0%</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Revised Contract Amount</div>
                    <div className="text-sm text-foreground-secondary">$749,770.00</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Draft Change Orders</div>
                    <div className="text-sm text-foreground-secondary">$0.00</div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Schedule Of Values */}
          <AccordionItem value="schedule-values" className="border-b border-border-default">
            <AccordionTrigger className="py-4 text-base font-semibold text-foreground-primary hover:no-underline">
              Schedule Of Values
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pb-4">
                {/* Search and Actions Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative w-64">
                      <Input type="search" placeholder="Search" className="h-9 pr-8" />
                    </div>
                    <Button variant="outline" size="sm" className="h-9 bg-transparent" iconLeading={Filter}>
                      Filter
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 bg-transparent" iconLeading={Settings2}>
                      Configure
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 bg-transparent">
                      Import From CSV
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 bg-transparent">
                      Add Line Item
                    </Button>
                  </div>
                </div>

                {/* Table */}
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
                      <TableRow>
                        <TableCell className="font-medium">09-680 S.</TableCell>
                        <TableCell>Carpet</TableCell>
                        <TableCell className="text-right">$150,000.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">09-700 S.</TableCell>
                        <TableCell>Wood</TableCell>
                        <TableCell className="text-right">$87,988.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Inclusions And Exclusions */}
          <AccordionItem value="inclusions-exclusions" className="border-b border-border-default">
            <AccordionTrigger className="py-4 text-base font-semibold text-foreground-primary hover:no-underline">
              Inclusions And Exclusions
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-6 pb-4">
                <div>
                  <div className="mb-2 text-sm font-medium text-foreground-primary">Inclusions</div>
                  <div className="text-sm leading-relaxed text-foreground-secondary">
                    Furnish and install all material, labor, and equipment, for complete floor covering scope as per the
                    plans listed on exhibit "B" and specifications.
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-foreground-primary">Exclusions</div>
                  <div className="text-sm leading-relaxed text-foreground-secondary">Concrete polishing.</div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Contract Dates */}
          <AccordionItem value="contract-dates" className="border-b border-border-default">
            <AccordionTrigger className="py-4 text-base font-semibold text-foreground-primary hover:no-underline">
              Contract Dates
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pb-4">
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Start Date</div>
                    <div className="text-sm text-foreground-secondary">02/14/2026</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Estimated Completion Date</div>
                    <div className="text-sm text-foreground-secondary">03/18/2026</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Actual Completion Date</div>
                    <div className="text-sm text-foreground-secondary">---</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Contract Date</div>
                    <div className="text-sm text-foreground-secondary">02/08/2026</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">
                      Signed Contract Received Date
                    </div>
                    <div className="text-sm text-foreground-secondary">02/10/2026</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-foreground-primary">Issued On Date</div>
                    <div className="text-sm text-foreground-secondary">02/12/2026</div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Contract Privacy */}
          <AccordionItem value="contract-privacy" className="border-b-0">
            <AccordionTrigger className="py-4 text-base font-semibold text-foreground-primary hover:no-underline">
              Contract Privacy
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-6 pb-4">
                <div>
                  <div className="mb-1 text-sm font-medium text-foreground-primary">Settings</div>
                  <div className="text-sm text-foreground-secondary">Private</div>
                </div>
                <div>
                  <div className="mb-1 text-sm font-medium text-foreground-primary">Invoice Contacts</div>
                  <div className="text-sm text-foreground-secondary">03/18/2026</div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
