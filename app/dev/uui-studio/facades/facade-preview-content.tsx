"use client"

import * as React from "react"
import { getLocalTimeZone, today } from "@internationalized/date"
import { useForm } from "react-hook-form"
import {
  Archive,
  ChevronDown,
  Download,
  FileText,
  InfoIcon,
  ListPlus,
  MoreHorizontal,
  Trash2,
  Users,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UntitledBadge, badgeTypes } from "@/components/ui/badges-untitled"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import { CloseButton } from "@/components/ui/close-button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { DatePicker } from "@/components/ui/date-picker"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  SlideOut,
  SlideOutClose,
  SlideOutContent,
  SlideOutDescription,
  SlideOutFooter,
  SlideOutHeader,
  SlideOutTitle,
  SlideOutTrigger,
} from "@/components/ui/slide-out"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ProcoreLogo } from "@/components/ui/procore-logo"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabsFacadeDemos } from "./tabs-facade-demos"
import { Textarea } from "@/components/ui/textarea"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, UntitledTooltip, UntitledTooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/lib/toast"

const previewWrap = "flex w-full min-w-0 max-w-none flex-col gap-4 self-stretch"

const chartFacadeData = [
  { month: "January", planned: 220, actual: 186, forecast: 170 },
  { month: "February", planned: 280, actual: 305, forecast: 240 },
  { month: "March", planned: 260, actual: 237, forecast: 250 },
  { month: "April", planned: 290, actual: 273, forecast: 265 },
  { month: "May", planned: 240, actual: 209, forecast: 230 },
  { month: "June", planned: 250, actual: 214, forecast: 245 },
]

/** Legacy §12 series fills: explicit `--color-chart-*` so tokens resolve under `[data-theme="legacy"]`. */
const chartFacadeConfig = {
  planned: { label: "Planned", color: "var(--color-chart-1)" },
  actual: { label: "Actual", color: "var(--color-chart-2)" },
  forecast: { label: "Forecast", color: "var(--color-chart-3)" },
} satisfies ChartConfig

function DatePickerFacadePreview() {
  const [defaultValue] = React.useState(() => today(getLocalTimeZone()))
  return (
    <div className={previewWrap}>
      <p className="text-muted-foreground text-xs">
        Untitled <code className="text-[0.7rem]">DatePicker</code> via{" "}
        <code className="text-[0.7rem]">components/ui/date-picker.tsx</code>. Selection / Apply / date-field focus use neutral
        legacy chrome (<code className="text-[0.7rem]">legacy-theme.css</code>,{" "}
        <code className="text-[0.7rem]">data-slot=&quot;date-picker-dialog&quot;</code> /{" "}
        <code className="text-[0.7rem]">calendar</code> / <code className="text-[0.7rem]">date-input</code>).
      </p>
      <div className="flex w-full min-w-0 flex-wrap items-start gap-4">
        <DatePicker aria-label="Facade preview date picker" defaultValue={defaultValue} />
      </div>
    </div>
  )
}

/** Slide-Out (z-30): `Interaction-Model-Architecture` — workspace scrim `bg-white/20`; panel via Design-System `slideout-menu`. */
function SlideOutFacadePreview() {
  return (
    <div className={previewWrap}>
      <p className="text-muted-foreground text-xs">
        <code className="text-[0.7rem]">SlideOut</code> in <code className="text-[0.7rem]">components/ui/slide-out.tsx</code> — right-edge panel only (Design-System slideout shell);{" "}
        <code className="text-[0.7rem]">data-slot=&quot;slide-out-*&quot;</code> in <code className="text-[0.7rem]">legacy-theme.css</code>. Use{" "}
        <code className="text-[0.7rem]">sheet.tsx</code> for other edges or bottom/top.
      </p>
      <div className="flex w-full min-w-0 flex-wrap items-start gap-3">
        <SlideOut>
          <SlideOutTrigger asChild>
            <Button type="button" variant="outline">
              Open slide-out
            </Button>
          </SlideOutTrigger>
          <SlideOutContent className="p-0">
            <SlideOutHeader>
              <SlideOutTitle>Slide-out</SlideOutTitle>
              <SlideOutDescription>Slides in from the right with workspace scrim.</SlideOutDescription>
            </SlideOutHeader>
            <div className="text-muted-foreground px-4 pb-4 text-sm">Detail or form body goes here.</div>
            <SlideOutFooter className="flex-col-reverse border-t border-border-default">
              <SlideOutClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </SlideOutClose>
              <Button type="button">Apply</Button>
            </SlideOutFooter>
          </SlideOutContent>
        </SlideOut>
      </div>
    </div>
  )
}

function ContextMenuFacadePreview() {
  const [starred, setStarred] = React.useState(false)
  return (
    <div className={previewWrap}>
      <p className="text-muted-foreground text-xs">
        Untitled-aligned surface (<code className="text-[0.7rem]">bg-primary</code>,{" "}
        <code className="text-[0.7rem]">MenuItem</code> tokens) via RAC <code className="text-[0.7rem]">Popover</code> +{" "}
        <code className="text-[0.7rem]">Menu</code>. Right-click the region below.
      </p>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="border-border bg-muted/30 text-foreground-secondary flex min-h-[120px] w-full min-w-0 cursor-context-menu items-center justify-center rounded-lg border border-dashed px-4 text-center text-sm">
            Right-click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="min-w-[11rem]">
          <ContextMenuLabel className="text-foreground-tertiary">Document</ContextMenuLabel>
          <ContextMenuItem onClick={() => {}}>Open</ContextMenuItem>
          <ContextMenuItem onClick={() => {}}>Duplicate</ContextMenuItem>
          <ContextMenuCheckboxItem checked={starred} onCheckedChange={setStarred}>
            Starred
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => {}}>Copy link</ContextMenuItem>
              <ContextMenuItem onClick={() => {}}>Email…</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onClick={() => {}}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

function DropdownMenuFacadePreview() {
  const [statusBar, setStatusBar] = React.useState(true)
  const [compactRows, setCompactRows] = React.useState(false)
  const [rfiStatus, setRfiStatus] = React.useState("open")
  const [panelSide, setPanelSide] = React.useState("bottom")

  return (
    <div className={previewWrap} data-theme="legacy">
      <p className="text-foreground-secondary text-xs leading-relaxed">
        The facade list on the left uses <code className="text-[0.7rem]">Select</code> (
        <code className="text-[0.7rem]">RACSelect</code> + listbox), not this menu. This preview is{" "}
        <code className="text-[0.7rem]">DropdownMenu</code> (<code className="text-[0.7rem]">MenuTrigger</code> +{" "}
        <code className="text-[0.7rem]">Menu</code>) — the trigger ref must reach the real{" "}
        <code className="text-[0.7rem]">&lt;button&gt;</code> (see <code className="text-[0.7rem]">forwardRef</code> on app{" "}
        <code className="text-[0.7rem]">Button</code>). Legacy chrome:{" "}
        <code className="text-[0.7rem]">data-slot=&quot;dropdown-menu-content&quot;</code> and{" "}
        <code className="text-[0.7rem]">data-slot=&quot;menu-item&quot;</code> in{" "}
        <code className="text-[0.7rem]">legacy-theme.css</code> (scoped with{" "}
        <code className="text-[0.7rem]">data-theme=&quot;legacy&quot;</code> on <code className="text-[0.7rem]">&lt;html&gt;</code>{" "}
        or this preview root).
      </p>

      <div className="grid w-full min-w-0 gap-6 md:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-foreground-tertiary text-[0.65rem] font-semibold uppercase tracking-wide">
            Outline · row actions
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                iconTrailing={<ChevronDown className="size-4" data-icon aria-hidden />}
              >
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[11rem]">
              <DropdownMenuLabel className="text-foreground-tertiary">Open items</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => {}}>
                <FileText className="size-4 shrink-0" />
                View detail
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>
                <ListPlus className="size-4 shrink-0" />
                Add to view
                <DropdownMenuShortcut>⌘↵</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => {}}>
                <Trash2 className="size-4 shrink-0" />
                Remove from log
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-foreground-tertiary text-[0.65rem] font-semibold uppercase tracking-wide">
            Secondary · filters
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                iconTrailing={<ChevronDown className="size-4" data-icon aria-hidden />}
              >
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[10rem]">
              <DropdownMenuRadioGroup value={rfiStatus} onValueChange={setRfiStatus}>
                <DropdownMenuRadioItem value="open">Open</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="answered">Answered</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="closed">Closed</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={compactRows} onCheckedChange={setCompactRows}>
                Compact density
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-foreground-tertiary text-[0.65rem] font-semibold uppercase tracking-wide">
            Ghost · overflow
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="px-2"
                iconLeading={<MoreHorizontal className="size-4" data-icon aria-hidden />}
                iconTrailing={<ChevronDown className="size-4" data-icon aria-hidden />}
              >
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[10rem]">
              <DropdownMenuItem onSelect={() => {}}>Duplicate row</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>Copy link</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>
                Show assignee column
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border-border-default bg-background-primary w-full rounded-lg border p-4 shadow-none">
        <p className="text-foreground-tertiary mb-1 text-[0.65rem] font-semibold uppercase tracking-wide">
          Simulated · coordination toolbar
        </p>
        <p className="text-foreground-secondary mb-4 text-xs leading-relaxed">
          Submittal / RFI-style bulk actions, export paths, and distribution — same facade, denser copy.
        </p>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                iconTrailing={<ChevronDown className="size-4" data-icon aria-hidden />}
              >
                Bulk actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[15rem]">
              <DropdownMenuLabel className="text-foreground-tertiary">RFIs & submittals</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => {}}>
                <FileText className="size-4 shrink-0" />
                Create RFI from selection
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>
                <Users className="size-4 shrink-0" />
                Assign ball in court…
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="min-w-[12rem]">
                  <DropdownMenuItem onSelect={() => {}}>
                    <Download className="size-4 shrink-0" />
                    PDF summary
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => {}}>
                    <Download className="size-4 shrink-0" />
                    CSV (Excel)
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => {}}>
                <Archive className="size-4 shrink-0" />
                Archive selected
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={() => {}}>
                <Trash2 className="size-4 shrink-0" />
                Delete draft RFIs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                iconTrailing={<ChevronDown className="size-4" data-icon aria-hidden />}
              >
                View options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[13rem]">
              <DropdownMenuLabel className="text-foreground-tertiary">Layout</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={panelSide} onValueChange={setPanelSide}>
                <DropdownMenuRadioItem value="top">List + detail (top)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bottom">List + detail (bottom)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="right">Split (detail right)</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>
                Pin summary strip
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={compactRows} onCheckedChange={setCompactRows}>
                Tighter row height
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

function FormPreviewSample() {
  const f = useForm({ defaultValues: { email: "" } })
  return (
    <Form {...f}>
      <form onSubmit={f.handleSubmit(() => {})} className="w-full min-w-0 max-w-md space-y-4">
        <FormField
          control={f.control}
          name="email"
          rules={{ required: "Optional validation demo" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>Facade wiring sample.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}

export function FacadePreviewContent({ slug }: { slug: string }): React.ReactNode {
  switch (slug) {
    case "accordion":
      return (
        <Accordion type="single" collapsible defaultValue="a" className="w-full min-w-0">
          <AccordionItem value="a">
            <AccordionTrigger>First item</AccordionTrigger>
            <AccordionContent>Content for the first section.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Second item</AccordionTrigger>
            <AccordionContent>More content here.</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    case "alert":
      return (
        <Alert className="w-full min-w-0">
          <InfoIcon />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>Alert facade preview under legacy theme tokens.</AlertDescription>
        </Alert>
      )
    case "aspect-ratio":
      return (
        <div className="w-full min-w-0 max-w-full">
          <AspectRatio ratio={16 / 9} className="bg-muted flex items-center justify-center rounded-md">
            <span className="text-muted-foreground text-sm">16:9</span>
          </AspectRatio>
        </div>
      )
    case "avatar":
      return (
        <div className={previewWrap}>
          <Avatar>
            <AvatarImage src="" alt="" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </div>
      )
    case "badge":
      return (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">
            Legacy status tokens (20px pill, <code className="text-[0.7rem]">--color-badge-*</code>) from{" "}
            <code className="text-[0.7rem]">legacy-theme.css</code> §06.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Default / neutral</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="primary">Primary / draft (blue)</Badge>
            <Badge variant="information">Information</Badge>
            <Badge variant="success">Construction</Badge>
            <Badge variant="warranty">Warranty</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="critical">Critical</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>
      )
    case "badges-untitled":
      return (
        <div className="flex flex-wrap gap-2">
          <UntitledBadge type={badgeTypes.pillColor} color="brand" size="sm">
            Untitled pill
          </UntitledBadge>
        </div>
      )
    case "breadcrumb":
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Section</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
    case "button":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button">Primary</Button>
            <Button type="button" variant="secondary">
              Secondary
            </Button>
            <Button type="button" variant="outline">
              Outline
            </Button>
            <Button type="button" isLoading>
              Loading
            </Button>
            <Button type="button" variant="ghost" disabled>
              Disabled
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">Destructive</span>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="destructive">
                Delete
              </Button>
              <Button type="button" variant="destructive" isLoading>
                Deleting…
              </Button>
              <Button type="button" variant="destructive" disabled>
                Disabled
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">Sizes</span>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" size="sm">
                Small
              </Button>
              <Button type="button" size="default">
                Medium
              </Button>
              <Button type="button" size="lg">
                Large
              </Button>
              <Button type="button" size="xl">
                XL
              </Button>
            </div>
          </div>
        </div>
      )
    case "card":
      return (
        <Card className="w-full min-w-0">
          <CardHeader>
            <CardTitle>Card</CardTitle>
            <CardDescription>Short description.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Body content.</p>
          </CardContent>
          <CardFooter>
            <Button type="button">Action</Button>
          </CardFooter>
        </Card>
      )
    case "chart":
      return (
        <div className={`${previewWrap} w-full max-w-none`}>
          <ChartContainer config={chartFacadeConfig} className="aspect-auto h-[240px] w-full min-w-0">
            <BarChart
              accessibilityLayer
              data={chartFacadeData}
              margin={{ left: 4, right: 4, top: 4, bottom: 4 }}
              barCategoryGap="12%"
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={value => String(value).slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="planned" fill="var(--color-planned)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="actual" fill="var(--color-actual)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="forecast" fill="var(--color-forecast)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      )
    case "checkbox":
      return (
        <div className="flex w-full min-w-0 items-start">
          <Checkbox label="Accept terms" />
        </div>
      )
    case "close-button":
      return (
        <div className="flex items-center gap-2">
          <CloseButton aria-label="Close" />
        </div>
      )
    case "collapsible":
      return (
        <Collapsible className="w-full min-w-0">
          <CollapsibleTrigger>Toggle details</CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-muted-foreground mt-2 text-sm">Hidden until expanded.</p>
          </CollapsibleContent>
        </Collapsible>
      )
    case "context-menu":
      return <ContextMenuFacadePreview />
    case "dropdown-menu":
      return <DropdownMenuFacadePreview />
    case "date-picker":
      return <DatePickerFacadePreview />
    case "dialog":
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              Open dialog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Preview</DialogTitle>
              <DialogDescription>Dialog facade sample.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button">
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    case "slide-out":
      return <SlideOutFacadePreview />
    case "form":
      return <FormPreviewSample />
    case "input":
      return (
        <div className={previewWrap}>
          <Input className="max-w-xs" placeholder="Text input" />
          <Input className="max-w-xs" type="search" placeholder="Search" />
        </div>
      )
    case "input-otp":
      return (
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      )
    case "label":
      return (
        <div className={previewWrap}>
          <Label htmlFor="facade-l">Field label</Label>
          <Input id="facade-l" className="max-w-xs" />
        </div>
      )
    case "pagination":
      return (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={e => e.preventDefault()} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive onClick={e => e.preventDefault()}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" onClick={e => e.preventDefault()}>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" onClick={e => e.preventDefault()} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
    case "procore-logo":
      return (
        <div className="flex items-center gap-4">
          <ProcoreLogo size="sm" />
          <ProcoreLogo size="md" />
        </div>
      )
    case "progress":
      return (
        <div className="w-full max-w-xs">
          <Progress value={44} />
        </div>
      )
    case "radio-group":
      return (
        <div className={`${previewWrap} min-w-0`}>
          <RadioGroup defaultValue="a" className="w-full min-w-0 max-w-none" aria-label="Sample radio group">
            <RadioGroupItem
              value="a"
              label="Option A — default"
              hint="Long hint copy wraps normally at the preview width; the group grows with the panel instead of an arbitrary max-width cap."
            />
            <RadioGroupItem value="b" label="Option B" hint="Neutral selected fill matches checkbox under legacy theme." />
          </RadioGroup>
        </div>
      )
    case "resizable":
      return (
        <div className="h-36 w-full max-w-lg rounded-md border">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={40} className="flex items-center justify-center text-sm">
              A
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60} className="flex items-center justify-center text-sm">
              B
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )
    case "scroll-area":
      return (
        <ScrollArea className="h-32 w-full max-w-xs rounded-md border p-3">
          <div className="space-y-2 pr-3 text-sm">
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i}>Row {i + 1}</p>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      )
    case "select":
      return (
        <div className={`${previewWrap} gap-10`}>
          <section className="w-full min-w-0 space-y-3">
            <h4 className="text-foreground-primary w-full min-w-0 text-sm font-medium">Refinement dropdown</h4>
            <p className="text-foreground-secondary w-full min-w-0 max-w-none text-xs leading-relaxed [&_code]:break-words">
              Facade <code className="text-foreground-primary text-[11px]">components/ui/select.tsx</code> — grouped list,{" "}
              <code className="text-foreground-primary text-[11px]">size=&quot;sm&quot;</code>, separator, and disabled item (common filter bar pattern).
            </p>
            <div className="flex w-full min-w-0 max-w-md flex-col gap-2">
              <Label id="facade-select-refine-label" className="text-foreground-secondary text-xs font-medium">
                Refine by
              </Label>
              <Select defaultValue="project" aria-labelledby="facade-select-refine-label">
                <SelectTrigger className="w-full min-w-0 max-w-xs" size="sm">
                  <SelectValue placeholder="Choose scope…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Scope</SelectLabel>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Time</SelectLabel>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month" disabled>
                      Custom range (soon)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </section>
          <section className="w-full min-w-0 space-y-3">
            <h4 className="text-foreground-primary w-full min-w-0 text-sm font-medium">Default size & scroll</h4>
            <p className="text-foreground-secondary max-w-none text-xs leading-relaxed">
              Long menus use the list max-height and scroll within the popover.
            </p>
            <Select defaultValue="5">
              <SelectTrigger className="w-full min-w-0 max-w-[220px]">
                <SelectValue placeholder="Pick a row…" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 16 }, (_, i) => {
                  const n = String(i + 1)
                  return (
                    <SelectItem key={n} value={n}>
                      Option {n}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </section>
        </div>
      )
    case "separator":
      return (
        <div className="w-full max-w-xs space-y-2">
          <p className="text-sm">Above</p>
          <Separator />
          <p className="text-sm">Below</p>
        </div>
      )
    case "skeleton":
      return (
        <div className="flex max-w-xs flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )
    case "slider":
      return (
        <div className="w-full max-w-xs py-4">
          <Slider defaultValue={[40]} max={100} step={1} />
        </div>
      )
    case "switch":
      return (
        <div className="flex items-center gap-2">
          <Switch id="sw" defaultChecked />
          <Label htmlFor="sw">Notifications</Label>
        </div>
      )
    case "table":
      return (
        <div className="w-full min-w-0 overflow-x-auto">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Ada</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Lin</TableCell>
              <TableCell>Editor</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        </div>
      )
    case "tabs":
      return (
        <div className={`${previewWrap} gap-10`}>
          <section className="w-full min-w-0 space-y-3">
            <h4 className="text-foreground-primary w-full min-w-0 text-sm font-medium">Shell tabs</h4>
            <p className="text-foreground-secondary w-full min-w-0 max-w-none text-xs leading-relaxed [&_code]:break-words">
              Facade <code className="text-foreground-primary text-[11px]">components/ui/tabs.tsx</code> (segmented control). Uses{" "}
              <code className="text-foreground-primary text-[11px]">data-list-type=&quot;button-border&quot;</code> for legacy styling.
            </p>
            <Tabs defaultValue="one" className="w-full min-w-0 max-w-md">
              <TabsList>
                <TabsTrigger value="one">One</TabsTrigger>
                <TabsTrigger value="two">Two</TabsTrigger>
              </TabsList>
              <TabsContent value="one">
                <p className="text-sm">First panel</p>
              </TabsContent>
              <TabsContent value="two">
                <p className="text-sm">Second panel</p>
              </TabsContent>
            </Tabs>
          </section>
          <TabsFacadeDemos />
        </div>
      )
    case "textarea":
      return <Textarea className="w-full min-w-0 max-w-full" placeholder="Multiline…" rows={3} />
    case "toggle":
      return (
        <Toggle variant="outline" defaultPressed>
          Toggle
        </Toggle>
      )
    case "toggle-group":
      return (
        <ToggleGroup type="single" defaultValue="left" variant="outline">
          <ToggleGroupItem value="left" aria-label="Left">
            Left
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Right">
            Right
          </ToggleGroupItem>
        </ToggleGroup>
      )
    case "toast":
    case "toaster":
      return (
        <Button
          type="button"
          variant="outline"
          onClick={() => toast({ title: "Notification", description: "Sonner via shell Toaster." })}
        >
          Show toast
        </Button>
      )
    case "tooltip":
      return (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="outline">
                Hover (compound API)
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    case "tooltip-uui":
      return (
        <UntitledTooltip title="Untitled tooltip" description="Design-System base/tooltip">
          <UntitledTooltipTrigger>
            <Button type="button" variant="outline">
              Hover (title API)
            </Button>
          </UntitledTooltipTrigger>
        </UntitledTooltip>
      )
    default:
      return (
        <div className="text-foreground-secondary space-y-2 text-sm">
          <p>No in-app sample is wired for this facade yet.</p>
          <p>
            Use <strong className="text-foreground-primary font-medium">Storybook</strong> (sidebar hint below) and the source file path in the header;
            add a <code className="text-xs">case</code> in <code className="text-xs">facade-preview-content.tsx</code> when you want a live preview here.
          </p>
        </div>
      )
  }
}
