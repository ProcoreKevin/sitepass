export const maxDuration = 30

type Body = {
  category: string
  scores: number[]
  projects: string[]
}

function pickHotspots(scores: number[], projects: string[], take = 2): { name: string; score: number }[] {
  const pairs = scores.map((score, i) => ({ name: projects[i] ?? `Project ${i + 1}`, score }))
  return [...pairs].sort((a, b) => a.score - b.score).slice(0, take)
}

/** Deterministic, context-aware copy — swap for `streamText` + model when API keys are available. */
function composeSummary(category: string, scores: number[], projects: string[]): string {
  const hotspots = pickHotspots(scores, projects)
  const low = hotspots[0]?.score ?? 0
  const names = hotspots.map((h) => h.name).join(" and ")
  const spread = Math.max(...scores) - Math.min(...scores)

  const library: Record<
    string,
    { conditions: string[]; behaviors: string[] }
  > = {
    Ladders: {
      conditions: [
        "unlevel or soft footing at ladder bases",
        "congested staging near leading edges",
        "short tie-off distances in shaft work",
      ],
      behaviors: [
        "climbing with tools or materials in hand",
        "missing three-point contact during transitions",
        "using portable ladders not extended at least 3 ft above the landing",
      ],
    },
    Chemical: {
      conditions: [
        "inadequate ventilation in enclosed pours",
        "secondary containment not fully sealed",
        "SDS binders missing at field cut stations",
      ],
      behaviors: [
        "spotty PPE compliance during solvent cleanup",
        "improper mixing ratios when batches are rushed",
        "containers left open between trades",
      ],
    },
    "Silica Dust": {
      conditions: [
        "dry cutting without local exhaust",
        "high cross-drafts that defeat water misting",
        "housekeeping lag on horizontal surfaces",
      ],
      behaviors: [
        "respirator fit checks skipped on shift changes",
        "compressed-air blow-off used instead of HEPA vacuums",
        "work continuing outside established dust-control zones",
      ],
    },
    Electrical: {
      conditions: [
        "temporary power not GFCI-protected end-to-end",
        "panel schedules not updated after reroutes",
        "wet conditions near open knockouts",
      ],
      behaviors: [
        "qualified-person verification missing for energized work",
        "extension cords run through door pinch points",
        "LOTO not verified before restoring equipment",
      ],
    },
    "Struck By": {
      conditions: [
        "unclear swing zones for lifting operations",
        "poor lighting at night picks",
        "material stacks placed too close to travel paths",
      ],
      behaviors: [
        "spotters not used during blind backs",
        "workers under suspended loads during minor adjustments",
        "PPE hard-hat zones not enforced at transitions",
      ],
    },
    Scaffolding: {
      conditions: [
        "incomplete guardrails during progressive builds",
        "base plates not bearing on mudsills on fill",
        "access ladders not plumb to platforms",
      ],
      behaviors: [
        "components reused without full inspection tags",
        "climbing outside the system frame",
        "overloading bays with palletized material",
      ],
    },
    Falls: {
      conditions: [
        "unprotected slab edges during curtain-wall prep",
        "hole covers displaced during MEP pulls",
        "weathered anchor straps at lifeline turns",
      ],
      behaviors: [
        "harnesses donned but not tied off",
        "self-retracting lifelines anchored below the dorsal D-ring",
        "workers stepping across guardrails for shortcuts",
      ],
    },
    "Confined Space": {
      conditions: [
        "atmospheric monitoring intervals stretched on long entries",
        "ventilation ducts temporarily blocked by backfill",
        "rescue gear staged farther than the preplan allows",
      ],
      behaviors: [
        "attendant distracted with phone or other tasks",
        "permits signed without verifying isolation points",
        "entrant teams swapping without fresh briefings",
      ],
    },
    "Heat Stress": {
      conditions: [
        "limited shaded recovery areas on upper decks",
        "high radiant load from decking in direct sun",
        "cool water resupply runs infrequent after noon",
      ],
      behaviors: [
        "new-hire acclimatization plans not followed on overtime",
        "workers skipping scheduled hydration breaks",
        "PPE layers not adjusted as heat index climbs",
      ],
    },
    Trenching: {
      conditions: [
        "spoil piles closer than tabulated setbacks",
        "surcharge loads from equipment tracked too near edges",
        "saturated soils after recent rain events",
      ],
      behaviors: [
        "benching/sloping not reassessed after depth changes",
        "workers entering unprotected trenches during quick fixes",
        "competent-person inspections not logged daily",
      ],
    },
  }

  const entry = library[category] ?? {
    conditions: [
      "variable site conditions across zones",
      "documentation gaps between shifts",
      "constrained access during peak trade stacking",
    ],
    behaviors: [
      "inconsistent adherence to the agreed field checklist",
      "shortcuts during schedule pressure",
      "communication gaps between GC and subs",
    ],
  }

  const c1 = entry.conditions[scores[0] % entry.conditions.length]
  const c2 = entry.conditions[(scores[1] ?? scores[0]) % entry.conditions.length]
  const b1 = entry.behaviors[scores[2] % entry.behaviors.length]
  const b2 = entry.behaviors[(scores[3] ?? scores[2]) % entry.behaviors.length]

  const riskPhrase =
    low < 50
      ? `Scores are critically low for ${names}, signaling incidents outpacing observations.`
      : low < 70
        ? `${names} are lagging peers and merit targeted field verification.`
        : spread > 25
          ? `Performance varies widely across projects (${spread} point spread), suggesting inconsistent controls.`
          : `Scores are relatively clustered; focus on sustaining good practices across all sites.`

  return [
    `${riskPhrase} For ${category.toLowerCase()}, contributing conditions often include ${c1} and ${c2}. `,
    `Behaviors seen most often in recent observations include ${b1} and ${b2}. `,
    `Use toolbox talks and focused walks to close gaps where scores trail the company baseline.`,
  ].join("")
}

export async function POST(req: Request) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 })
  }

  const { category, scores, projects } = body
  if (
    typeof category !== "string" ||
    !category.trim() ||
    !Array.isArray(scores) ||
    !Array.isArray(projects) ||
    scores.length !== projects.length ||
    scores.length === 0
  ) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 })
  }

  const text = composeSummary(category.trim(), scores, projects)

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const words = text.split(" ")
      for (let i = 0; i < words.length; i++) {
        controller.enqueue(encoder.encode((i === 0 ? "" : " ") + words[i]))
        await new Promise((r) => setTimeout(r, 28))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
