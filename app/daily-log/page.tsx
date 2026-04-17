"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Upload, Plus } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export default function DailyLogPage() {
  const [selectedDate, setSelectedDate] = useState("October 28, 2025")

  return (
    <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h1 className="text-2xl font-semibold">Daily Log</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button variant="outline" size="sm">
              Reports
            </Button>
            <Button size="sm">
              Create
            </Button>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between border-b px-6 py-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4" />
              Week
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{selectedDate}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Add Filter
            </Button>
            <Button variant="outline" size="sm">
              Collapse All
            </Button>
          </div>
        </div>

        {/* Content - Scrollable Accordion Sections */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Accordion type="multiple" className="space-y-2">
            {/* Observed Weather Conditions */}
            <AccordionItem value="weather" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <span className="font-semibold">Observed Weather Conditions</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Temperature</label>
                    <Input type="number" placeholder="°F" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Conditions</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunny">Sunny</SelectItem>
                        <SelectItem value="cloudy">Cloudy</SelectItem>
                        <SelectItem value="rainy">Rainy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Wind Speed</label>
                    <Input type="number" placeholder="mph" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Precipitation</label>
                    <Input type="number" placeholder="inches" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Manpower */}
            <AccordionItem value="manpower" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Manpower</span>
                  <Badge variant="secondary" className="text-xs">
                    0 Workers | 0 Total Hours
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Workers</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Total Hours Worked</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead className="w-32">Attachments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="company1">Company 1</SelectItem>
                            <SelectItem value="company2">Company 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input type="number" className="w-20" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" className="w-20" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" className="w-24" disabled />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select a location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="loc1">Location 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Add comment" />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Attach Photo
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Button variant="ghost" size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Row
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Notes */}
            <AccordionItem value="notes" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <span className="font-semibold">Notes</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Attachments</TableHead>
                      <TableHead>Related Items</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Input className="w-20" disabled />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select a Location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="author1">Author 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select a Location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="loc1">Location 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Add comment" />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Attach Photo
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Save
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

            {/* Timecards */}
            <AccordionItem value="timecards" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <span className="font-semibold">Timecards</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Classification</TableHead>
                      <TableHead>Cost Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Workers</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="emp1">Employee 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="class1">Classification 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="code1">Cost Code 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Regular Time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">Regular Time</SelectItem>
                            <SelectItem value="overtime">Overtime</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input type="number" className="w-20" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" className="w-20" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Add comment" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

            {/* Equipment */}
            <AccordionItem value="equipment" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Equipment</span>
                  <Badge variant="secondary" className="text-xs">
                    LEGACY
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Equipment Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Hours Use</TableHead>
                      <TableHead>Cost Code</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Inspected</TableHead>
                      <TableHead>Inspection Time</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eq1">Equipment 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input type="number" className="w-20" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" className="w-20" />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="code1">Cost Code 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="loc1">Location 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Input type="time" className="w-28" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Add comment" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

            {/* Visitors */}
            <AccordionItem value="visitors" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <span className="font-semibold">Visitors</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Visitor</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Attachments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visitor1">Visitor 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input type="time" className="w-28" />
                      </TableCell>
                      <TableCell>
                        <Input type="time" className="w-28" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Add comment" />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Attach Photo
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

            {/* Phone Calls */}
            <AccordionItem value="phone-calls" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <span className="font-semibold">Phone Calls</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Call From</TableHead>
                      <TableHead>Call To</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Attachments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="person1">Person 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="person2">Person 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input type="time" className="w-28" />
                      </TableCell>
                      <TableCell>
                        <Input type="time" className="w-28" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Add comment" />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Attach Photo
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

            {/* Inspections */}
            <AccordionItem value="inspections" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <span className="font-semibold">Inspections</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Inspection Type</TableHead>
                      <TableHead>Inspector Name</TableHead>
                      <TableHead>Inspector Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Input type="time" className="w-28" />
                      </TableCell>
                      <TableCell>
                        <Input type="time" className="w-28" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Search" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Search" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Search" />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="loc1">Location 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Area" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Add comment" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

            {/* Deliveries */}
            <AccordionItem value="deliveries" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <span className="font-semibold">Deliveries</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Delivery From</TableHead>
                      <TableHead>Tracking Number</TableHead>
                      <TableHead>Contents</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Input type="time" className="w-28" />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="company1">Company 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Tracking #" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Contents" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Add comment" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

            {/* Safety Violations */}
            <AccordionItem value="safety-violations" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <span className="font-semibold">Safety Violations</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Safety Notice</TableHead>
                      <TableHead>Issued To</TableHead>
                      <TableHead>Compliance Due</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Input type="time" className="w-28" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Subject" />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="notice1">Notice 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Issued To" />
                      </TableCell>
                      <TableCell>
                        <Input type="date" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Add comment" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

            {/* Accidents */}
            <AccordionItem value="accidents" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <span className="font-semibold">Accidents</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Injury Involved</TableHead>
                      <TableHead>Company Involved</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Attachments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Input type="time" className="w-28" />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="company1">Company 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Add comment" />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Attach Photo
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

            {/* Quantities */}
            <AccordionItem value="quantities" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <span className="font-semibold">Quantities</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Cost Code</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Attachments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="code1">Cost Code 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input type="number" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Units" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="loc1">Location 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Add comment" />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Attach Photo
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

            {/* Productivity */}
            <AccordionItem value="productivity" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <span className="font-semibold">Productivity</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Contract</TableHead>
                      <TableHead>Line Item or Description ID</TableHead>
                      <TableHead>Previously Delivered</TableHead>
                      <TableHead>Portion</TableHead>
                      <TableHead>Quantity Delivered</TableHead>
                      <TableHead>Quantity In Place</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="company1">Company 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Contract" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Line Item" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Add comment" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

            {/* Photos */}
            <AccordionItem value="photos" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <span className="font-semibold">Photos</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border-default py-12">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Upload photos from your daily log</p>
                    <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                      Choose Files
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Delays */}
            <AccordionItem value="delays" className="rounded-lg border bg-background-primary">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Delays</span>
                  <Badge variant="secondary" className="text-xs">
                    0 Total Hours
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Delay Type</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Duration (Calculated)</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Search" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weather">Weather</SelectItem>
                            <SelectItem value="material">Material Delay</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input type="time" className="w-28" />
                      </TableCell>
                      <TableCell>
                        <Input type="time" className="w-28" />
                      </TableCell>
                      <TableCell>
                        <Input disabled className="w-28" />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="loc1">Location 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Add comment" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
  )
}
