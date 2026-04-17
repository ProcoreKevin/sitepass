---
name: content-system
description: >-
  Applies Procore-style product content standards—voice and tone, grammar,
  accessibility, inclusive language, globalization, conversational AI copy,
  and glossary-approved terms. Use when writing or reviewing UX copy,
  microcopy, empty states, errors, modals, banners, labels, alt text, ARIA
  labels, AI assistant scripts, help text, or when the user mentions content
  design, product personality, inclusive language, or Procore terminology.
---

# Content system (Procore-aligned)

Use this skill whenever drafting or editing **in-product** strings: UI labels, errors, empty states, onboarding, banners, tooltips, accessibility text, or **conversational / AI** experiences. Default grammar gaps to **[Microsoft’s Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/)**.

## Workflow

1. **Match voice** — Human, helpful, clear. Never robotic, patronizing, overly casual, or “funny.”
2. **Match tone to context** — See [Tone by scenario](#tone-by-scenario).
3. **Check accessibility** — Alt text, ARIA, visible labels, no directional-only cues; align with design-system component guidance when present.
4. **Check inclusion & global fit** — Simple sentences; explain acronyms; avoid slang, idioms, US-centric jargon; prefer active voice; mind translation expansion.
5. **Apply grammar rules** — Title case vs sentence case, Procore capitalization, punctuation (Oxford comma, colon rules, no exclamation except approved cases).
6. **Use approved terms** — Prefer glossary verbs/nouns and field-label patterns in [REFERENCE.md](REFERENCE.md).

## Voice (always)

| Principle | Do |
|-----------|-----|
| **Human** | Empathetic, inclusive, relevant; never mechanical. |
| **Helpful** | Guide completion; ask “Would this make sense to a brand-new user?” |
| **Clear** | Minimum words, right amount of detail; avoid unnecessary jargon. |

## Tone by scenario

| Writing | Tone |
|---------|------|
| Empty states | Active, benefits-focused |
| Confirmation modals | Affirmative, focused on next steps |
| Error messages | Apologetic, solutions-oriented |
| Info banners | Informative, actionable |

**Negative messages:** Emphasize what Procore is doing or will do to fix the issue. **Positive messages:** Encourage and give the user credit.

## What we avoid (product copy)

- Overly intimate / overly friendly, unprofessional, verbose, patronizing, dry, or comedic tone.

## Accessibility (writing)

- **Alt text:** Meaningful images/icons only; short and descriptive; no images of text; critical info also in plain text on screen.
- **ARIA labels:** Add only extra context; **never** duplicate the element role (e.g. don’t label a button “button”); keep to **one or two words** when possible.
- **Visible text:** Descriptive labels, buttons, links (not raw URLs as link text).
- **Directions:** Avoid “above,” “below,” “to the left” as sole wayfinding.
- **IA:** Logical structure, sensible tab order, sensible headings (H1–H3), shallow menus (≤3 levels where applicable).

## Inclusive language

- Short sentences, simple vocabulary.
- **They/them** as singular user pronoun where appropriate; avoid unnecessary gendered terms (“Humanity” not “Mankind”; “Primary” not “Master”).
- Prefer **View** over **See**, **Select** over **Click**, **Enter** over **Type** when ability-inclusive wording matters.
- Spell out acronyms on first use (full term then abbreviation in parentheses); consider screen readers for symbols ($, #).

## Global / translation

- Clear, simple English first.
- **Character expansion:** Short English strings grow more in translation—leave UI room (see expansion tables in [REFERENCE.md](REFERENCE.md)).
- **Avoid:** Buzzwords, slang, US-only references, heavy **-ing** gerunds, stacked negatives, long complex sentences.
- **Prefer:** Active voice; spelled-out acronyms with abbreviation on first mention.

## Grammar (high level)

- **Title case:** Headers on pages, banners, empty states (short words lowercase except first/last; capitalize verbs/adverbs/pronouns even if short).
- **Sentence case:** Body, tooltips, sub-copy, banners, empty state body, subheadings; end punctuation in body; **bold** referenced control names in instructions.
- **Acronyms in body:** First use: spell out + (ACRONYM); dictionary words like HTML, FAQ need no spell-out. Headers/buttons may use acronyms for space.
- **Ampersands:** In buttons listing multiple actions (e.g. Create & Distribute); elsewhere prefer “and” unless space is extremely tight in headers.
- **Oxford comma** in lists of three or more.
- **Colons:** Only after a **complete** sentence introducing a list; not after headers/field names/incomplete sentences.
- **Contractions:** Allowed; remember they may lengthen translations.
- **Ellipses:** Only for truncated text, not placeholders.
- **Exclamation points:** Avoid except pre-approved cases.
- **Quotation marks:** Avoid in product copy; no quotes around page/button/field names.
- **Dates/times:** Use approved presets (short/medium/long/full) with GTK/localization when applicable; see [REFERENCE.md](REFERENCE.md) for formats and ranges.

## Writing for AI / conversational UX

- Mirror **product personality**: helpful, relatable, clear; **always disclose** that the user is talking to an AI assistant.
- **Goal-first:** State how you help; shortest path to the user’s outcome; no fluff.
- **One thing per message:** One question or request per turn; say what happens next; state what users can and can’t do.
- **Brevity:** ~tweet length (~140 characters); ≤3 wrapped lines per message; 1–3 bot messages before asking for user input.
- **Scannable:** Value first; numbers first; bullets; ≤3 primary actions; prefer buttons/quick replies over in-message hyperlinks.
- **Open-ended:** Avoid unless trivial (e.g. name, age)—not vague prompts.
- **Conversational ordering:** For voice/chat, put the **most important information last** so it’s what users remember (differs from typical UX front-loading).
- **Errors:** Plan copy for no input, no match, misrecognition, task failure.
- **Closure:** Assistant gets the **last word**—confirm conversation end and that nothing more is expected.
- **Handoff:** Explain how escalation to a human works when the bot can’t resolve.

## Glossaries & field labels

Full **action word** glossary, **field label** patterns, measurement table, and date/time presets live in **[REFERENCE.md](REFERENCE.md)**. Consult it when choosing between near-synonyms (e.g. Copy vs Duplicate, Send vs Distribute, Filter vs Search).

## Source note

Consolidated from internal Procore content-design source docs (product personality, accessibility, AI writing, inclusive language, grammar, globalization, glossaries). Update this skill when organizational guidelines change.
