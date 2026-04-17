"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/dev/uui-studio", label: "Overview" },
  { href: "/dev/uui-studio/migration", label: "Migration" },
  { href: "/dev/uui-studio/facades", label: "Facades" },
] as const

export function StudioNav() {
  const pathname = usePathname()

  return (
    <nav
      className="border-border-default bg-background-primary border-b"
      aria-label="UUI studio sections"
    >
      <div className="flex h-10 w-full min-w-0 items-end justify-between gap-4 px-8">
        <div className="flex min-h-0 min-w-0 flex-1 flex-wrap items-end gap-1">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href || (href !== "/dev/uui-studio" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "border-border-default -mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors duration-150",
                  active
                    ? "text-foreground-primary border-foreground-primary"
                    : "text-foreground-secondary hover:text-foreground-primary border-transparent hover:border-border-default",
                )}
              >
                {label}
              </Link>
            )
          })}
        </div>
        <div className="flex shrink-0 items-center pb-2">
          <a
            href="http://localhost:6006"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border-default text-foreground-primary hover:bg-background-secondary inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-150"
          >
            Storybook ↗
          </a>
        </div>
      </div>
    </nav>
  )
}
