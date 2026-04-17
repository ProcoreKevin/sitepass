# Content system — reference

Detailed tables and rules. Use with [SKILL.md](SKILL.md).

---

## Translation expansion (English source)

| English characters | Avg character count increase |
|-------------------|------------------------------|
| Up to 10 | 100%–300% |
| 11–20 | 180%–200% |
| 21–30 | 160%–180% |
| 31–50 | 140%–160% |
| 51–70 | 151%–170% |
| Over 70 | 130% |

| English characters | Avg space required |
|-------------------|-------------------|
| Up to 10 | 100%–200% |
| 11–20 | 180%–100% |
| 21–30 | 60%–80% |
| 31–50 | 40%–60% |
| 51–70 | 31%–40% |
| Over 70 | 30% |

---

## Dates and times (US English examples)

Use with Procore GTK / localization so connectors and order match locale.

| Preset | Date example | Time example |
|--------|----------------|----------------|
| Short | 1/31/2021 | 2:30 PM |
| Medium | Jan 31, 2021 | 2:30:09 PM |
| Long | January 31, 2021 | 2:30:09 PM EST |
| Full | Wednesday, January 31, 2021 | 2:30:09 PM Eastern Standard Time |

- Together: GTK supplies connector (e.g. `[date] at [time]` or `[date], [time]` in US English). Otherwise separate with comma + space.
- **Time:** Space before AM/PM; include minutes even on the hour.
- **Time zone:** Distinguish standard vs daylight; capitalize words.
- **Range (prose):** `10:00 AM to 2:00 PM`. **Range (schedule/listing):** en dash, no spaces: `10:00 AM–2:00 PM`.
- **Weekday/month abbreviations:** Only if space is tight; second and third letters lowercase, no periods.

---

## Hyphenation / slash capitalization

If the word before a hyphen is capitalized, **capitalize the word after the hyphen**.

---

## Procore-specific capitalization

| Topic | Rule |
|-------|------|
| Navigation | Capitalize **page and tab names**; not arbitrary “parts” of a page. |
| Levels | Capitalize **Project** and **Company**; not the word *level*. May use “project’s” / “company’s” in sentence case. Don’t hyphenate levels. |
| Products | Capitalize full product title. |
| Tools | Capitalize **tool name**; not the word *tool*; don’t capitalize items inside tools. |
| User roles | Capitalize when referring to a **specific** user; lowercase for **general** roles/personas. |
| Permission levels | Capitalize level names; don’t capitalize the word *permissions*; don’t hyphenate *levels*. |
| Features / components / items | **Do not capitalize** these inside the product. |

---

## Measurements (abbreviations)

When superscript isn’t available, use caret (e.g. `yd^3`).

| Measurement | Abbreviation(s) |
|-------------|-----------------|
| Cubic foot | `ft^3`, `ft³` |
| Cubic yard | `yd^3`, `yd³` |
| Cubic meter | `m^3`, `m³` |
| Each | `ea` |
| Inch | `in` |
| Linear foot | `lf` |
| Lump sum | `ls` |
| Price per [unit] | `$/[abbrev]` (e.g. `$/ft^2`) |
| Square foot | `ft^2`, `ft²` |
| Square meter | `m^2`, `m²` |
| Square yard | `yd^2`, `yd²` |
| Ton | `ton` |
| Tonne | `t` |
| Yard | `yd` |

**Numbers:** Spell out zero through nine; numerals for 10+. If space is tight, numerals for all.

---

## In-text formatting

- **Bold** calls to action in instructional text.
- Don’t italicize instructional text; underline **links** only.

---

## Common action glossary

| Action | Usage |
|--------|--------|
| Add | Sub-items on existing items; or people/companies in Directory. |
| Configure | Admin preferences for tool, project, or account. |
| Browser | Web-based tool/feature. **In** the browser, not *on*. |
| Checkbox | One word, not check box / check-box. |
| Copy | Duplicating content from one item into another. |
| Create | Creating new items in Procore. |
| Delete | Permanent removal (e.g. Drawings, Locations, Daily Log). Use **Move to Recycle Bin** when applicable. |
| Distribute | Notify people (email, activity feed, etc.). **Send** for email-only. |
| Download | To user’s device. |
| Dropdown Menu | Full term; not just “dropdown” or drop-down menu. |
| Duplicate | One-to-one copy of an object. **Copy** for content between objects. |
| Edit | Change/update info. **Bulk Edit** for many items. |
| Email | Noun only; use **send** / **receive** for verbs. |
| Enable | Turn on feature, tool, button, or item. |
| Export | Save as PDF/CSV/BCF/etc. |
| Field | Form input (Detail/Edit/Create). |
| Field Set | Group of fields on a form. |
| Fill Out | Fillable PDFs. |
| Filter | Filter dropdown on specific pages. |
| Generate | Automatic creation from other items—not manual “create from.” |
| Go | Navigation, often buttons (e.g. Go to Submittals). |
| Got It | Acknowledge informational non-persistent UI; no other CTA. |
| Grant Permission | Setting/changing user access levels. |
| Home Screen | Mobile app intro UI. |
| Homepage | Web default/intro page. |
| Icon | Not *symbol* for interactive marks. |
| Import | Bulk add via import template. |
| Jobsite | One word. |
| Log in / Log out | **Verbs** — e.g. Log in to Procore; buttons Log In / Log Out. |
| Login / Logout | **Nouns** — place/page. |
| Mark Up | **Verb** — act of adding markups. |
| Markup | **Noun** — the annotations. |
| Move | Relocate within Procore (folder, Recycle Bin, etc.). |
| Mobile device | Not hyphenated; don’t enumerate every device type. |
| Publish | Make project info available to others in the project. |
| Respond | Reply to items in Procore. |
| Retrieve | From Recycle Bin back to list. |
| Review | View and manage in one action. |
| Save | Save edits to existing item. |
| Search | Page-level search. |
| Send | Email, feedback, notifications. |
| Smartphone | One word; or use **mobile device** broadly. |
| Update | Refresh to see others’ changes. |
| Upload | From computer to Procore. |
| View | See general information about an item. |

*To add terms: contact **#ux-content** on Slack (per source glossary).*

---

## Field label glossary (selected)

### Address
| Field | Usage |
|-------|--------|
| Address Line 1 | Street address |
| Address Line 2 | Apartment, unit, suite |
| City | Choose city |
| State | Choose State |
| ZIP Code | Enter ZIP Code |

### Attachments / Comments
| Field | Usage |
|-------|--------|
| Attachments | Upload and attach files |
| Comments | Supplementary comments |
| Responses | Replies when a response is required |

### Company / Cost
| Field | Usage |
|-------|--------|
| Company | Business name |
| Responsible Company | Business responsible for item/step |
| Cost Code | Choose from project/company list |
| Cost Impact | Expected or actual cost impact |

### Date/Time
| Field | Usage |
|-------|--------|
| Date | Related to item/workflow |
| Date Created | When created |
| Due Date | When due |
| Date Updated | Last edited |
| Start Date | Begin date |
| Completion Date | End of work |
| End Date | End of range |
| Date [Past Verb] | E.g. Date Delivered |
| Hours | Related hours |

### Description / Email
| Field | Usage |
|-------|--------|
| Description | More about the item |
| Details | Expanded information |
| Subject | Email topic |
| Email Address | Person’s email |

### Location / Number
| Field | Usage |
|-------|--------|
| Location | From project custom locations (Admin) |
| Number | Item #; may shorten to # |
| Quantity | Count related to item |

### Person
| Field | Usage |
|-------|--------|
| Person | Directory user |
| Contact | Contact in Directory |
| Assignee | Must complete action/task |
| Person Affected | Affected by item/event |
| Creator | Created the item |
| [Noun] | Doer pattern: Receiver, Assignee, Initiator (avoid “Received By” style for translation) |
| [Item] Manager | Oversees item workflow |
| Role | Type of work (e.g. Architect) |

### Phone / Priority / Private / Revision / Schedule / Spec / Status / Trade / Type
| Field | Usage |
|-------|--------|
| Phone Number | Company/place/entity |
| Fax Number | Fax for entity |
| Priority | Urgency |
| Private | Often checkbox—visible to admins/responsible parties only |
| Revision | Version number/name after change |
| Schedule Impact | Schedule impact of item |
| Specification Section | Linked from Specifications tool |
| Name / [Item] Name / First Name / Last Name | Person or item naming patterns |
| Trade | Industry type for item/entity |
| Type / [Item] Type | Classification; prefix with item when needed |

---

## Conversational AI — example prompts (error prevention)

- Select from the options below  
- Tap yes to continue  
- Watch this video for instructions on uploading your photo  
- Here’s the correct format for entering your phone number  

## Conversational AI — patterns

- Confirm before destructive or major steps.  
- Follow up if user idle (~90s or product-defined).  
- Cap “discovery” questions before delivering value (source: max **five** questions before giving requested outcome).  
- When bot cannot answer: hand off to appropriate support channel.  

---

## External links

- [Microsoft Writing Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/) — default for rules not specified here.  
- Alt-text examples (internal): see original *Writing Accessibility* Confluence attachment if available.  
