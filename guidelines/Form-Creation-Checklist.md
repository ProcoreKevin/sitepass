# Form Creation Checklist

This checklist defines the comprehensive rules for generating all forms in the NGX Design System. Apply these rules for both **Quick Create** (Pattern 3 - Slide-Out) and **Guided Create** (multi-step) patterns.

> **Document Role:** This checklist governs form field rules, validation, and interaction patterns. It is one component of the NGX Design System enforcement contract:
> - **[Interaction-Model-Architecture.md](/guidelines/Interaction-Model-Architecture.md)** — Workspace layout, z-index hierarchy, pane rules
> - **[Guidelines.md](/guidelines/Guidelines.md)** — Master rulebook (Rules 0.1–1.13); Rule 0.1 governs the token mandate enforced throughout this document
> - **[Pattern-Component-Library.md](/guidelines/Pattern-Component-Library.md)** — `SplitViewDetail`, `ManualSaveFooter`, `StatusBadge` components used by form patterns
> - **[Form-Based Detail Page PRD](/guidelines/Form-Based-Detail-Page-PRD.md)** — Zone architecture, five-tier framework, role taxonomy, and popover system that govern form detail pages

**Cross-Reference:**
- **Pattern 3: Slide-Out** (Interaction Model) - For create workflows
- **Pattern 1: Split-View** (Interaction Model) - For edit workflows with manual save
- **Design System Token Reference** - For field styling and validation states

---

## 1. FUNDAMENTAL PRINCIPLES

### 1.1 Non-Negotiable Rules

✅ **ALWAYS** use single-column layout. Exceptions: short logically-related fields on the same row (City / State / ZIP, First / Last Name); Guided Create multi-step layouts
✅ **ALWAYS** use Slide-Out Pattern (z-30) for create forms
✅ **NEVER** ask for information that can be derived, collected later, or omitted
✅ **ALWAYS** group related fields together with section headers
✅ **ALWAYS** order fields by decision relevance — primary decision-driving fields first, administrative metadata last (see Section 3: Zone Architecture, Zone 2 rules)
✅ **NEVER** use placeholder text as a replacement for labels

### 1.2 Field Count Limits

| Form Type | Field Range | Approach |
|-----------|-------------|----------|
| **Quick Create** | 3–10 | Single view with sections |
| **Guided Create** | 11+ | Multi-step with progress indicator |

> **Five-Tier Framework:** The Quick Create / Guided Create model covers create-flow entry points. Full form detail pages follow a five-tier complexity framework (Tier 1 through Tier 5) defined in Section 3 (Zone Architecture) and the Quick Reference at the end of this document. The two-bucket model above governs only the Slide-Out create pattern; use the five-tier model when designing the form detail page that the draft flows into.

---

## 2. CRUD OPERATION PATTERNS

### 2.1 CREATE

**Entry Point:** "Add [Entity]" or "Create [Entity]" button
**Location:** Top-right of list views (primary button style)

**🎯 CRITICAL: Draft Creation Flow (MANDATORY)**

When user clicks "+ Create" button:
1. ✅ **Slide-out opens immediately** (Pattern 3, 480px width)
2. ✅ **Draft row is IMMEDIATELY created** in parent table/grid
3. ✅ **Draft row is AUTO-SELECTED** (highlighted with bg-asphalt-100)
4. ✅ **Split-view detail opens automatically** at 67% width (Pattern 1 only)
5. ✅ **Status badge shows "Incomplete"** (red) until all required fields complete
6. ✅ **Status badge updates to "Draft"** (gray) when required fields complete
7. ✅ **Draft persists** when slide-out closes (even if incomplete)
8. ✅ User can click draft row to continue editing later

**See:** [DRAFT_CREATION_FLOW.md](/DRAFT_CREATION_FLOW.md) for complete specification

**Form Rules:**
1. ✅ Auto-focus first input field
2. ✅ Pre-populate smart defaults
3. ✅ Implement autosave for Slide-Out forms (Pattern 3)
4. ✅ **Create draft row immediately on slide-out open**
5. ✅ **Sync autosave data to draft row in real-time**
6. ✅ **Update status badge based on required field validation**
7. ✅ On success: Redirect to list/detail + confirmation toast
8. ✅ On error: Preserve data, show inline errors, scroll to first error

### 2.2 READ

**List View Requirements:**
- **Display:** Name/ID, Status, Key attributes
- **Actions:** Edit, Delete (accessible per row)
- **Features:** Sort, Filter, Pagination (for 10+ items)
- **Empty State:** Clear CTA to create first item

**Detail View Requirements:**
- Group information in logical sections
- Edit/Delete actions in header or action bar
- Audit info (created/modified) in secondary position

### 2.3 UPDATE

**Form Rules:**
1. ✅ Pre-populate ALL fields with current values
2. ✅ Clearly distinguish editable vs read-only fields
3. ✅ Track unsaved changes (Pattern 1 - manual save workflow)
4. ✅ Warn before navigation with unsaved changes
5. ✅ Label: "Save Changes" or "Update [Entity]"

**Inline Editing** (use sparingly):
- Only for single, low-stakes fields
- Clear visual edit affordance
- Save on blur or explicit button
- Show loading state

### 2.4 DELETE

**Friction must be proportional to consequence.** Apply the risk tier that matches the action — never a flat modal for all deletions, and never no confirmation for irreversible ones.

#### Risk Tier 1 — Low-Risk Reversible
Actions that are soft-deleted, can be undone, or have no downstream impact.

- ✅ **Undo toast only** — no modal dialog
- ✅ Toast window: **5–7 seconds** with explicit Undo action
- ✅ Use soft delete / void where possible
- ⛔ Do NOT show a modal confirmation for low-risk reversible actions

**Examples:** Removing a tag, detaching a non-critical reference, discarding a draft the user created moments ago

#### Risk Tier 2 — High-Risk Irreversible
Actions that permanently remove data or have significant downstream impact, but affect a bounded scope.

- ✅ **Modal confirmation required** (z-50)
- ✅ State consequences clearly and specifically
- ✅ Use destructive (`text-danger` / `bg-danger`) button styling
- ✅ Buttons: [Cancel] [Delete [Entity]] — verb + object, never just "Delete"

**Modal structure:**
```
Title:   Delete [Entity Name]?
Body:    This will permanently delete [entity] and [specific consequence].
         This action cannot be undone.
Buttons: [Cancel]  [Delete [Entity Name]]
```

**Examples:** Deleting a submitted RFI, removing a document with linked items, voiding a change order

#### Risk Tier 3 — Critical Cascading
Actions that trigger irreversible downstream effects across multiple records, financial state, or legal audit trail.

- ✅ **Typed confirmation required** — Confirm button disabled until user types exact entity name or phrase
- ✅ Enumerate specific cascading consequences in the modal body (list them explicitly)
- ✅ Require authority check — only users with documented execution authority should reach this step

**Modal structure:**
```
Title:   Permanently delete [Entity Name]?
Body:    This will permanently delete:
         • [Entity] and all associated [X] records
         • [Y] linked items in [Tool]
         • [Z] financial references
         This action affects [N] other records and cannot be undone.
         Type "[Entity Name]" to confirm.
Input:   [text field — confirm button disabled until match]
Buttons: [Cancel]  [Confirm Delete] (disabled until typed)
```

**Examples:** Deleting a prime contract with linked change orders, removing a company with active commitments, purging a project

**Role-scoped delete authority:**
- **Author** — may delete drafts they own only
- **Controller** — may void or archive documents; may delete within their managed set
- **Reviewer / Consumer** — no destructive actions on any form or document

**Universal delete anti-patterns:**
- ⛔ Delete action in a popover quick-view — popovers are preview surfaces only
- ⛔ Flat modal for all deletes regardless of risk
- ⛔ No confirmation for irreversible actions
- ⛔ Generic "Delete" label without object (always "Delete [Entity]" or "Void [Entity]")

---

## 3. ZONE ARCHITECTURE

Every form detail page in the NGX Design System is built from four invariant zones. Zone proportions and content density shift by form tier — but the zone structure is fixed across all form types.

> **Source:** Zone architecture is defined in the [Form-Based Detail Page PRD](/guidelines/Form-Based-Detail-Page-PRD.md), Section 05. This section is the implementation-level binding of that specification to form creation rules.

### 3.1 The Four Zones

```
┌─────────────────────────────────────────────────────┐
│  ZONE 1 — Identity Strip (sticky Tier 3–5)          │
│  Form type · Number · Title · Status · Timestamps   │
├──────────────────────────────────┬──────────────────┤
│  ZONE 2 — Primary Content        │  ZONE 3          │
│  All decision-driving fields     │  Context Panel   │
│  Single column, decision order   │  Conversations   │
│  Labels above fields             │  Related Items   │
│  Progressive disclosure for      │  Workflow log    │
│  tertiary metadata               │  Audit trail     │
│                                  │  (collapsible)   │
├──────────────────────────────────┴──────────────────┤
│  ZONE 4 — Action Bar (fixed bottom)                 │
│  Role-aware · Lifecycle-aware · Max 2 actions        │
└─────────────────────────────────────────────────────┘
```

---

### 3.2 Zone 1 — Identity Strip

**Purpose:** Persistent record identity. Users should never need to scroll to know what form they are on, what its status is, or when it was last touched.

**Required elements (always present, always in this order):**
1. Form type label (e.g., "RFI", "Change Order", "Daily Log")
2. Form number — **never truncate** — it is a legal identifier
3. Form title
4. Current status badge — `StatusBadge` from Pattern Component Library
5. Key timestamps (submitted date, due date if applicable)

**Scroll behavior by tier:**

| Tier | Zone 1 Behavior |
|------|----------------|
| Tier 1 — Quick Capture | Static (short forms don't scroll far) |
| Tier 2 — Structured Record | Static |
| Tier 3 — Routed Document | **Sticky on scroll** — required |
| Tier 4 — Financial Form | **Sticky on scroll** — required |
| Tier 5 — Guided Process | **Sticky on scroll** — required |

**Token spec:**
- Background: `bg-background-primary`
- Border bottom: `border-b border-border-default`
- Form type: `text-xs font-medium text-foreground-tertiary uppercase tracking-wider`
- Form number + title: `text-2xl font-extrabold text-foreground-primary`
- Status badge: use `StatusBadge` component — never custom badge styling

**Rules:**
- ⛔ Never rely on scroll position to show status — status must be in Zone 1 at all times
- ⛔ Never truncate the form number
- ✅ Overdue due dates render `text-danger-600` with an explicit overdue indicator

---

### 3.3 Zone 2 — Primary Content

**Purpose:** The dominant zone. All decision-driving fields, ordered by decision relevance — not schema order, not database column order, not creation order.

**Field ordering — decision relevance model:**

Fields within Zone 2 follow a strict priority hierarchy. This replaces the former "easiest fields first" commitment principle for all form detail pages.

| Priority | Field Types | Examples |
|----------|------------|---------|
| **Primary** | Status · Due Date · Assigned To · Total Amount · Question/Description · Schedule Impact | The fields that answer: "Who needs to act? By when? What is at stake?" |
| **Secondary** | Submitter · Submitted Date · Spec Reference · Drawing Reference · Revision Number | Supporting context for the primary fields |
| **Tertiary** | Created Date · Created By · Last Modified · System IDs · Internal administrative notes | Hidden by default behind progressive disclosure — never shown at same visual weight as primary |

> **Slide-Out context (Pattern 3 — create workflow):** When a user is filling a new record in a Slide-Out, leading with the identification field (Name/Title/Number) is acceptable to reduce friction on first entry. Decision-relevance ordering fully governs the detail page view once the record exists.

**Progressive disclosure rule:**
- Tertiary fields are hidden by default on all Tier 2–5 forms
- Exposed via a "Show more" or "Record details" disclosure control
- Never rendered at the same visual weight as Primary or Secondary fields

**Single-column rule:**
- All form field content is single-column. No exceptions.
- Permitted same-row groupings: logically inseparable short fields only (City / State / ZIP, First / Last Name)
- ⛔ Multi-column layouts interrupt vertical scanning momentum

**Spacing (8px grid):**
- Field-to-field gap: `gap-2` (8px)
- Label to input: `gap-1` (4px)
- Between section header and first field: `gap-2` (8px)
- Space above section header: `mt-6` (24px) — always 2× the space below it
- Space below section header: `mt-3` (12px)
- Zone 1 to Zone 2 gap: `mt-6` (24px)

**Token spec — field labels:**
- `text-sm font-medium text-foreground-secondary` — sentence case, 14pt

**Token spec — field values (primary):**
- `text-sm font-medium text-foreground-primary`

**Token spec — field values (secondary):**
- `text-sm font-normal text-foreground-secondary`

**Token spec — section headers:**
- `text-xs font-bold text-foreground-tertiary uppercase tracking-widest`

---

### 3.4 Zone 3 — Context Panel

**Purpose:** Conversations, Related Items, Connect, workflow history, and audit trail — accessible inline without navigation.

**Critical behavior rule:**
> Zone 3 opens inline. It is a panel, not a page. The user never navigates away from the form to access contextual tools.

**Default contents by tier:**

| Tier | Zone 3 Default Content |
|------|----------------------|
| Tier 1 | Minimal — audit trail only |
| Tier 2 | Conversations + Related Items |
| Tier 3 | Conversations + Related Items + Workflow routing log |
| Tier 4 | Conversations + Related Items + Workflow routing log + Financial audit trail |
| Tier 5 | All of Tier 4 + Step history + Participant log |

**Responsive behavior:**
- **Desktop:** Right rail, 320px fixed width (`w-80`)
- **Tablet:** Collapses to bottom sheet — trigger button always visible
- **Mobile:** Accessible via sheet trigger only — not visible in default layout

**Rules:**
- ✅ Context Panel trigger must be persistent and visible — never buried in an overflow menu
- ✅ Collapsible — user can dismiss to give Zone 2 full width
- ⛔ Never require navigation to access Conversations, Related Items, or workflow history
- ⛔ Never place audit trail in Zone 2 — it belongs in Zone 3

---

### 3.5 Zone 4 — Action Bar

**Purpose:** The only place primary actions live. Fixed at the bottom of the page. Actions adapt to the user's current role and the form's current lifecycle state.

**Layout:**
- Primary action: right-aligned
- Secondary action: left-aligned
- Maximum 2 actions visible simultaneously
- Additional actions in overflow menu (`...`) if required

**Role-aware action rules:**

The same form at the same status shows different primary actions to different roles. Zone 4 must be built role-aware from the start — never hardcoded to a single action set.

| Role | Example: RFI in "Open" status |
|------|------------------------------|
| **Author** | Follow Up |
| **Reviewer** | Respond |
| **Controller** | Reassign |
| **Consumer** | No action button — read-only |

> **See:** [Form-Based Detail Page PRD](/guidelines/Form-Based-Detail-Page-PRD.md) Section 03 for complete Role × Lifecycle action matrix across all form types.

**Token spec:**
- Background: `bg-background-primary border-t border-border-default`
- Primary action button: `bg-foreground-primary text-foreground-inverse` — `text-xs font-bold uppercase tracking-wider`
- Secondary action: outlined / ghost variant

**Rules:**
- ✅ CTA labels are Verb + Noun, construction-specific (see Section 14 for label reference)
- ✅ Action bar height is always consistent — never resizes based on content
- ⛔ Never place destructive actions (void, delete) in Zone 4 without role-scope check
- ⛔ Destructive actions never appear in popovers — Zone 4 only, with appropriate risk-tier confirmation (see Section 2.4)

---

### 3.6 Zone Architecture Validation Checklist

Before shipping any form detail page, verify:

- [ ] Zone 1 contains form type, number, title, status badge, and key timestamps
- [ ] Zone 1 is sticky on scroll for Tier 3, 4, and 5 forms
- [ ] Form number is never truncated
- [ ] Zone 2 field order follows decision relevance — primary fields before secondary, tertiary hidden by default
- [ ] Zone 2 is single-column
- [ ] Section headers use 24px top margin, 12px bottom margin
- [ ] All labels use `text-sm font-medium text-foreground-secondary` — sentence case
- [ ] Zone 3 opens inline — no navigation required
- [ ] Zone 3 trigger is always visible — not in overflow
- [ ] Zone 4 actions are role-aware and lifecycle-aware
- [ ] Zone 4 maximum 2 visible actions
- [ ] All token classes used — no hex codes, no raw color values
- [ ] Overdue dates render `text-danger-600` with explicit indicator

---

## 4. INPUT FIELD SPECIFICATIONS

### 4.1 Required Elements

**Every input field MUST have:**
- ✅ **Label:** Above field, visible at all times · Sentence case · `text-sm` (14pt) · `font-medium` · `text-foreground-secondary`
- ✅ **Container:** Clear boundaries, min 44px height
- ✅ **Required Indicator:** Asterisk (*) OR mark optional fields if majority required

**Optional elements:**
- **Placeholder:** Format example only (disappears on focus)
- **Helper Text:** Persistent hint below field
- **Error Message:** Inline, below field, with icon

### 4.2 Field States

| State | Token / Class | Behavior |
|-------|--------------|----------|
| **Default** | `border-border-input-default bg-background-primary` | Ready for input |
| **Hover** | `border-border-input-hover` | Indicates interactivity |
| **Focus** | `border-border-input-focus ring-2 ring-ring-focus` | Active input |
| **Filled** | `border-border-input-default` | Contains user input |
| **Error** | `border-danger-500 text-danger-600` + inline message | Invalid, needs correction |
| **Success** | `border-success-500` (use sparingly) | Valid — apply only when format confirmation adds clear value |
| **Disabled** | `opacity-50 cursor-not-allowed bg-background-disabled` | Not interactive |
| **Read-only** | `border-transparent bg-transparent text-foreground-secondary` | Display only — no affordance |

### 4.3 Input Type Selection

| Data Type | Input | Selection Rule |
|-----------|-------|----------------|
| Short text (<100 chars) | Text Input | Names, titles |
| Long text (>100 chars) | Textarea | Descriptions, comments |
| Single choice (2-5 options) | Radio Buttons | Mutually exclusive |
| Single choice (6+ options) | Dropdown/Select | Space-constrained |
| Multiple choices | Checkboxes | Non-exclusive options |
| On/Off setting | Toggle | Immediate effect |
| Date | Date Picker | Reduces format errors |
| Number | Number Input | With min/max constraints |
| Search + Select | Combobox | Large datasets (50+ items) |

### 4.4 Field Width Rules

| Width | Use Case |
|-------|----------|
| 75-150px | ZIP, phone extension, state abbreviation |
| 250px | Phone numbers, dates |
| 350px | Names, emails |
| 500px+ | Addresses, descriptions |

---

## 5. VALIDATION RULES

### 5.1 Timing Strategy (Reward Early, Punish Late)

**DO:**
- ✅ Show success indicators immediately when input is valid
- ✅ Validate on blur (when user leaves field)
- ✅ Show real-time feedback for complex fields (password strength)

**DON'T:**
- ⛔ Validate empty required fields until submission
- ⛔ Show errors while user is still typing
- ⛔ Display premature error messages

### 5.2 Validation Type Matrix

| Validation Type | When | Example |
|----------------|------|---------|
| **Real-time (keypress)** | Complex requirements | Password strength |
| **On blur** | Standard format checks | Email, phone format |
| **On submit** | Required fields, server validation | Uniqueness checks |

### 5.3 Error Message Template

**Structure:** [What's wrong] + [How to fix it]

**Templates:**
- **Required:** "[Field name] is required"
- **Format:** "Please enter a valid [type]. Example: [example]"
- **Length:** "[Field name] must be between [min] and [max] characters"
- **Unique:** "This [field name] is already in use. Please choose another."
- **Range:** "[Field name] must be between [min] and [max]"

**NEVER SAY:**
- ⛔ "Invalid input"
- ⛔ "Error"
- ⛔ "You entered..."

---

## 6. BUTTON SPECIFICATIONS

### 6.1 Placement Rules

**Full Page Forms:**
- **Position:** Bottom left, aligned with fields
- **Order:** Primary (Save) → Secondary (Cancel)
- **Destructive (Delete):** Separated, bottom right or overflow

**Modal Dialogs:**
- **Position:** Bottom right
- **Order:** Cancel → Primary action

**Slide-Out Forms (Pattern 3):**
- ⛔ **NO Save/Cancel buttons** (autosave workflow)
- ✅ Only close mechanism is X button
- ✅ Autosave indicators shown near each field

### 6.2 Button Types

| Type | Style | Use Case |
|------|-------|----------|
| **Primary** | Filled, brand color | Main action: Save, Submit, Create |
| **Secondary** | Outlined/ghost | Cancel, Back, Reset |
| **Destructive** | Red filled | Irreversible deletions ONLY |
| **Tertiary** | Text/link | Learn more, Help |

### 6.3 Button Labels

✅ **USE** action verbs: "Save Changes", "Create Contact"
⛔ **AVOID** generic labels: "OK", "Submit", "Done"
✅ **INCLUDE** object when ambiguous: "Delete Contact" not "Delete"
⛔ **NEVER** disable submit before user attempts submission

### 6.4 Button States

- **Loading:** Spinner + "Saving..." + disabled
- **Success:** Brief state or toast, then redirect
- **Disabled:** Only when prerequisite unmet, explain why

---

## 7. ACCESSIBILITY REQUIREMENTS (WCAG 2.1 AA)

### 7.1 Keyboard

- ✅ All controls reachable via Tab/Shift+Tab/Arrow/Enter/Space
- ✅ Focus order matches visual order
- ✅ Focus states visible (3:1 contrast minimum)
- ✅ Form submittable via Enter

### 7.2 Screen Readers

```html
<!-- Required structure -->
<label for="email">Email address</label>
<input id="email" type="email" aria-describedby="email-hint email-error">
<span id="email-hint">We'll never share your email</span>
<span id="email-error" aria-live="polite"></span>
```

### 7.3 Visual

- ✅ Text contrast: 4.5:1 (normal), 3:1 (large)
- ✅ Never rely on color alone (use icons + text)
- ✅ Touch targets: 44x44px minimum
- ✅ Functional at 200% zoom

---

## 8. GENERATION CHECKLIST

**When generating a form, verify:**

### Structure
- ☐ Single column layout (exceptions: paired short fields; Guided Create multi-step)
- ☐ Logical field grouping with headers aligned to zones
- ☐ Fields ordered by decision relevance — primary fields first, metadata last
- ☐ Multi-step for 11+ fields (Tier 5 Guided Process)

### Fields
- ☐ Only essential fields
- ☐ Visible labels above each field
- ☐ Correct input types
- ☐ Field widths match content
- ☐ Required/optional indicated
- ☐ Smart defaults applied

### Validation
- ☐ Inline validation implemented
- ☐ Errors after blur, not during typing
- ☐ Specific, actionable error messages
- ☐ Required fields on submit only

### Actions
- ☐ Primary action clearly identified
- ☐ Buttons use action verbs
- ☐ Loading states implemented
- ☐ Success confirmation provided
- ☐ Destructive actions use correct risk tier (toast / modal / typed confirmation)

### Accessibility
- ☐ Keyboard navigation works
- ☐ Labels programmatically associated
- ☐ Color not the only indicator
- ☐ Sufficient contrast

---

## 9. ANTI-PATTERNS (NEVER DO)

⛔ Multi-column form layouts
⛔ Placeholder text as labels
⛔ "Invalid input" error messages
⛔ Validation during typing
⛔ Disabled submit buttons before attempt
⛔ Flat modal confirmation for all deletions regardless of risk level
⛔ No confirmation for irreversible or cascading deletes
⛔ Color-only error indication
⛔ Generic "OK" / "Cancel" labels
⛔ Required field errors on empty blur
⛔ Horizontal field arrangements (except paired fields like first/last name)

---

## 10. CONSTRUCTION DOMAIN CONTEXT

### 10.1 Core Domain Model

Construction operates on a **Project-centric hierarchy**. Every form exists within this context:

| Level | Contains / Connects To |
|-------|------------------------|
| **Organization** | GC, Owner, Subcontractor companies; Users; Global settings |
| **Project** | People, Documents, Financial, Field, Coordination, Schedule |
| **People** | Companies (with trade/insurance/contracts), Contacts, Project Team roles |
| **Documents** | Drawings, Specifications, Contracts, Photos, Correspondence |
| **Financial** | Budget, Cost Codes, Change Events/Orders, Commitments, Invoices |
| **Field** | Daily Logs, Safety/Incidents, Inspections, Punch Lists, Quality |
| **Coordination** | RFIs, Submittals, Meetings, Action Items |
| **Schedule** | Tasks, Milestones, Dependencies, Resource allocations |

### 10.2 Entity Relationships

**When generating forms, these associations determine which fields cascade, filter, or auto-populate:**

#### Company → Contact Relationship
- When **Company** is selected, filter **Contacts** to only those belonging to that company
- Auto-populate **Trade/Specialty** from company profile
- Show **insurance expiration warnings** if certificates are due

#### Location Hierarchy
- **Building → Floor → Area/Room** (cascading dropdowns)
- When **Location** selected, suggest relevant **drawings** for that area
- When **Location** selected, show recent items created at that location

#### Spec Section → Trade Mapping
- **Spec Section** determines which subcontractor is responsible (from bid packages)
- Links to related **Cost Codes** for budget allocation
- CSI MasterFormat divisions provide standard categorization

#### Financial Linkages
- **Change Events** connect to: RFIs (cause), Schedule Tasks (impact), Cost Codes (allocation)
- When **Cost Code** selected, validate against remaining budget
- Financial impact thresholds trigger additional approvals automatically

### 10.3 Construction Workflows

**Forms are steps in workflows. Understanding workflow position determines which fields appear:**

#### RFI Workflow
**Create RFI → Assign to Ball-in-Court → Answer → Review Answer → Distribute → Link to Change Order (if cost impact) → Close**
- RFIs are time-sensitive; **Ball-in-Court** and **Due Date** are critical accountability fields

#### Change Order Workflow
**Change Event (trigger) → PCO (Potential) → Request for Quote → COR (Change Order Request) → OCO (Owner CO) → CCO (Commitment CO)**
- Change Events are the financial hub connecting field issues to money
- **Event Type** drives workflow and contractual implications

#### Punch List Workflow
**Create Punch Item → Assign to Subcontractor → Work Complete → Verify/Inspect → Close or Reopen**
- Punch items require precise location
- Photo documentation is near-mandatory for deficiency disputes

### 10.4 User Personas

**Form complexity should adapt to user role and context:**

| Persona | Context | Form Implications |
|---------|---------|-------------------|
| **Superintendent** | Field, mobile, time-pressured | Minimal fields, voice input, offline-capable |
| **Project Manager** | Office + field, coordination | Balanced detail, batch operations |
| **Project Engineer** | Document-heavy, precision | Full detail, robust attachment support |
| **Foreman** | Field, task-focused, hourly | Simple logging, checklist-style inputs |
| **Subcontractor** | Limited access, response focus | Scoped to their assignments only |

---

## 11. SEMANTIC FIELD GROUPING

**When generating any construction form, apply these semantic groupings in order:**

### 11.1 Universal Grouping Order

#### Group 1 — IDENTIFICATION: Who/What is this?
- Name/Title/Number (auto-generated where applicable)
- Type/Category
- Status (often system-managed)

#### Group 2 — ASSIGNMENT: Who's responsible?
- Assignee / Ball-in-Court
- Company / Trade
- Due Date
- Priority

#### Group 3 — CONTEXT: Where does this belong?
- Location (Building/Floor/Area)
- Spec Section
- Cost Code
- Drawing Reference
- Related Schedule Task

#### Group 4 — DETAILS: What specifically?
- Description
- Scope / Impact
- Attachments
- Custom Fields (project-specific)

#### Group 5 — FINANCIAL: What's the cost impact?
- Estimated Cost Impact
- Budget Impact
- Change Order Link

#### Group 6 — AUDIT: (System-managed, read-only)
- Created By / Date
- Modified By / Date
- Revision History

### 11.2 Association Intelligence Rules

**Use these rules to auto-suggest, validate, and intelligently populate field relationships:**

#### When COMPANY is selected:
- Filter **CONTACTS** to those belonging to that company
- Auto-populate **TRADE/SPECIALTY** from company profile
- Show **INSURANCE** expiration warning if certificates are due

#### When LOCATION is selected:
- Suggest recent items at that location
- Show relevant **DRAWINGS** for that area
- Pre-select responsible **COMPANY** for that zone (if trade zones defined)

#### When SPEC SECTION is selected:
- Suggest relevant **SUBMITTAL** types
- Auto-suggest responsible **SUBCONTRACTOR** from bid packages
- Link to related **COST CODES**

#### When FINANCIAL IMPACT exceeds threshold:
- Require additional approvals based on amount
- Mandate supporting documentation attachment
- Trigger notification to PM and/or Owner

#### When SCHEDULE TASK is linked:
- Show task dates and remaining float
- Warn if action will cause delay impact
- Suggest related tasks (predecessors/successors)

---

## 12. FORM GENERATION REASONING

### 12.1 Generation Decision Chain

When generating a construction form, follow this decision framework:

1. **IDENTIFY ENTITY TYPE:** What construction object is being created/edited? (RFI, Punch Item, Change Order, etc.)
2. **DETERMINE WORKFLOW POSITION:** Is this a create action, in-progress update, or close/complete action?
3. **ASSESS USER CONTEXT:** Who is the user? What device? What time pressure?
4. **APPLY GROUPING TEMPLATE:** Use entity-specific template with universal grouping order
5. **FILTER FOR CONTEXT:** Remove irrelevant fields based on permissions, project config, workflow state
6. **SET SMART DEFAULTS:** Pre-fill based on user's recent selections, project defaults, workflow requirements
7. **CONFIGURE VALIDATION:** Apply field-level rules + cross-field validations
8. **OPTIMIZE FOR DEVICE:** Adjust layout, input types, and interactions for mobile/tablet/desktop

### 12.2 Smart Default Logic

#### By User Role
- **Superintendent:** Default location to their assigned area; default assignee to their common subcontractors; simplify financial fields
- **Subcontractor:** Auto-set company to user's company; hide assignee picker; scope location to their work areas

#### By Project Phase
- **Pre-construction:** Emphasize submittal and RFI forms; hide punch list
- **Construction:** Full access to all forms; emphasize daily logs and coordination
- **Close-out:** Punch list becomes primary; change orders require additional justification

#### By Workflow State
- **Draft:** Show all fields for complete data entry
- **In Review:** Limit editable fields to reviewer comments; add approval/rejection actions
- **Closed:** All fields read-only; show audit history; provide reopen action if permitted

### 12.3 Cross-Field Validation Rules

**Construction-specific validations that enforce business rules:**

- ✅ If **Change Event estimated cost > $10,000:** REQUIRE supporting documentation; TRIGGER owner notification
- ✅ If **RFI due date < today + 3 days:** WARN "Expedited RFI"; SUGGEST Priority = High
- ✅ If **Punch Item closed without photo:** WARN "Recommend photo documentation"
- ✅ If **Daily Log has Rain but no delays:** PROMPT "Confirm work proceeded normally?"
- ✅ If **Invoice amount > commitment remaining balance:** ERROR with suggestion to create change order

---

## 13. CONSTRUCTION-SPECIFIC ANTI-PATTERNS

**Never do these in construction forms:**

⛔ Generic dropdowns without project filtering
⛔ Unformatted cost/currency inputs
⛔ Location as free text (always use structured pickers)
⛔ Missing audit trail fields on financial forms
⛔ Hard deletions without soft-delete/void pattern
⛔ Status changes without workflow validation
⛔ Photo uploads without compression
⛔ Date inputs without calendar picker
⛔ Company and Contact as separate unlinked fields
⛔ RFI/Submittal forms without distribution list option

---

## 14. CONSTRUCTION-SPECIFIC BUTTON LABELS

**Use construction-specific action labels:**

| Generic Label | Construction-Specific Label |
|---------------|----------------------------|
| Submit | Submit for Review / Submit Answer |
| Reject | Revise & Resubmit / Reject with Comments |
| Approve | Approve Submittal / Approve & Distribute |
| Delete | Void [Entity] (with confirmation) |
| Complete | Verify Complete / Close [Entity] |

---

## FORM CREATION QUICK REFERENCE

### Zone Architecture (Section 3)
- ✅ **Zone 1** — Identity Strip: form type, number, title, status badge, timestamps (sticky for Tier 3–5)
- ✅ **Zone 2** — Primary Content: decision-relevance field order, single column, 8px grid, semantic tokens
- ✅ **Zone 3** — Context Panel: Conversations, Related Items, workflow log — inline, no navigation
- ✅ **Zone 4** — Action Bar: role-aware, lifecycle-aware, max 2 visible actions, fixed bottom

### Pattern 3 (Slide-Out) - Create Forms
- ✅ Width: 480px default (resizable 33%-67%)
- ✅ Autosave workflow (NO Save/Cancel buttons)
- ✅ Close: X button, scrim click, ESC key
- ✅ Scrim: `bg-white/30` workspace area only (absolute within workspace, below Global Header)
- ✅ Z-index: `z-30` (Slide-Out layer)

### Pattern 1 (Split-View) - Edit Forms
- ✅ Manual save workflow (Save/Cancel buttons required)
- ✅ Dirty state indicators on changed fields
- ✅ Sticky footer appears when form has unsaved changes
- ✅ Both panes fully interactive (no dimming)

### Field Ordering (Zone 2)
- **Primary fields first:** Status · Due Date · Assigned To · Total Amount · Question/Description · Schedule Impact
- **Secondary fields next:** Submitter · Submitted Date · Spec Reference · Drawing Reference
- **Tertiary fields hidden:** Created By · Created Date · System IDs — revealed via progressive disclosure only

### Field Count → Tier Decision
- **3–8 fields (Tier 1):** Quick Capture — single view, Pattern A
- **8–20 fields (Tier 2):** Structured Record — single view with sections, Pattern B
- **15–30 fields (Tier 3):** Routed Document — Pattern C, Zone 1 sticky required
- **20–40 fields (Tier 4):** Financial Form — Pattern D, Zone 1 sticky, financial validation required
- **40+ fields (Tier 5):** Guided Process — multi-step, Pattern E

### Destructive Action Risk Tiers (Section 2.4)
- **Tier 1 (low-risk, reversible):** Undo toast 5–7s — no modal
- **Tier 2 (irreversible, bounded):** Modal confirmation — verb + object CTA
- **Tier 3 (cascading):** Typed confirmation — enumerate consequences — authority check

### Validation Timing
- ✅ Success indicators: Immediately
- ✅ Format validation: On blur
- ✅ Required fields: On submit only
- ⛔ Never validate empty fields on blur

---

**This checklist ensures all forms in the NGX Design System are consistent, accessible, construction-aware, and follow established interaction patterns.**
