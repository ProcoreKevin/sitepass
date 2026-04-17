"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ToolPageTemplateProps {
  toolName: string
  tabs?: Array<{ label: string; value: string }>
  children?: React.ReactNode
}

/**
 * Default shell for tool routes: Untitled-aligned **Button** + RAC **Tabs**
 * (see `components/ui/tabs.tsx`). Surfaces use NGX semantic tokens.
 */
export function ToolPageTemplate({ toolName, tabs, children }: ToolPageTemplateProps) {
  const defaultTab = tabs?.[0]?.value ?? "all"

  return (
    <div className="bg-background-primary flex h-full min-h-0 flex-col">
      <div className="border-border-default flex flex-shrink-0 items-center justify-between border-b px-6 py-4">
        <h1 className="text-foreground-primary text-2xl font-semibold">{toolName}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Share
          </Button>
          <Button size="sm">Create</Button>
        </div>
      </div>

      {tabs && tabs.length > 0 ? (
        <Tabs defaultValue={defaultTab} className="flex min-h-0 flex-1 flex-col gap-0">
          <div className="border-border-default flex flex-shrink-0 items-center border-b px-6 py-3">
            <TabsList className="w-full min-w-0 justify-start md:w-auto">
              {tabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {tabs.map(tab => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className={cn("min-h-0 flex-1 overflow-auto px-6 py-4 focus:outline-none")}
            >
              {children ?? <ToolComingSoon />}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto px-6 py-4">{children ?? <ToolComingSoon />}</div>
      )}
    </div>
  )
}

function ToolComingSoon() {
  return (
    <div className="flex h-full min-h-[240px] items-center justify-center">
      <div className="text-center">
        <h2 className="text-foreground-secondary mb-2 text-xl font-semibold">Coming Soon</h2>
        <p className="text-foreground-tertiary text-sm">This tool is currently under development.</p>
      </div>
    </div>
  )
}
