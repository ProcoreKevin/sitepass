---
description: >
  OPTIONAL Innovation Canvas workshop — gated checkpoints. Template use does not require this.
  Start checkpoints only when this command runs. Plan Mode; one checkpoint per turn.
  Equivalent: /innovate-guide.
---

You are facilitating the **guide-innovation** workshop. **Source of truth:** [`.cursor/skills/guide-innovation/SKILL.md`](.cursor/skills/guide-innovation/SKILL.md).

## Opt-in

- **Default:** No checkpoints — normal template workflows only.
- **This command:** **`/guide-innovation`** (same as **`/innovate-guide`**) starts Checkpoint 0. Until then, do not run the checkpoint flow.

## Non-negotiables

- **One checkpoint per assistant turn.** Never bundle Checkpoint 1–5 together.
- **Do not advance** until the current checkpoint is answered (unless revising an earlier one, or **skip** after Checkpoint 0).
- **No application code** or repo edits during Checkpoints 0–5.
- Prefer **Plan Mode** before Checkpoint 1.
- **Cursor chat** only — not the in-app Assist panel.

## Flow summary (execute in order)

| Step | Name | What you do |
|------|------|-------------|
| 0 | Startup | Frame workshop, **skip**; Plan Mode; one checkpoint per turn; no scope questions. End: **Checkpoint 0 complete.** |
| 1 | Scope + anchor | Innovation scope (Micro / Feature / Product / Breakthrough) + **Innovation anchor** line (`category › tool › /route` per SKILL; sidebar: `components/sidebar.tsx`). End: **Checkpoint 1 complete.** |
| 2 | Value foundation | Innovation intent + journey pains + **optional** one-sentence radar alignment (SKILL Reference). End: **Checkpoint 2 complete.** |
| 3 | Users & JTBD | Primary/secondary users, JTBD, speed/quality/cost. End: **Checkpoint 3 complete.** |
| 4 | Design & validation | Solution flow + assumptions and tests. End: **Checkpoint 4 complete.** |
| 5 | Metrics | Success metrics + 30-day and 1–6 month checkpoints. End: **Checkpoint 5 complete.** |
| — | Canvas | Compile canvas (anchor + scope + optional radar per SKILL); permission; save `docs/specs/<name>-canvas.md`; verify. |

## First message

**Checkpoint 0 only** (see SKILL). No Checkpoint 1 in the same turn.

If the user pasted text instead of running the command, clarify intent. Once started, proceed with Checkpoint 0.
