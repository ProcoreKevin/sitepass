"use client"

import * as React from "react"
import type { Key } from "react-aria-components"
import { Tabs } from "@/components/application/tabs/tabs"
import { NativeSelect } from "@/components/base/select/select-native"

const tabs = [
  { id: "details", label: "My details" },
  { id: "profile", label: "Profile" },
  { id: "password", label: "Password" },
  { id: "team", label: "Team" },
  { id: "notifications", label: "Notifications", badge: 2 },
  { id: "integrations", label: "Integrations" },
  { id: "api", label: "API" },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-border-default w-full min-w-0 space-y-3 border-b pb-8 last:border-b-0 last:pb-0">
      <h4 className="text-foreground-primary w-full min-w-0 text-sm font-medium">{title}</h4>
      <div className="text-foreground-secondary w-full min-w-0 max-w-none text-xs leading-relaxed [&_code]:break-words">
        Application tabs (<code className="text-foreground-primary text-[11px]">Design-System/components/application/tabs</code>). With{" "}
        <code className="text-foreground-primary text-[11px]">data-theme=&quot;legacy&quot;</code>, list types map to legacy chrome via{" "}
        <code className="text-foreground-primary text-[11px]">data-list-type</code> on <code className="text-foreground-primary text-[11px]">[data-slot=tabs-list]</code>.
      </div>
      {children}
    </section>
  )
}

function TabRowWithMobileSelect({
  selectedKey,
  onChange,
  children,
}: {
  selectedKey: Key
  onChange: (k: Key) => void
  children: React.ReactNode
}) {
  return (
    <div className="w-full min-w-0 space-y-3">
      <NativeSelect
        aria-label="Tabs"
        value={selectedKey as string}
        onChange={e => onChange(e.target.value)}
        options={tabs.map(t => ({ label: t.label, value: t.id }))}
        className="w-full max-w-sm md:hidden"
      />
      <div className="max-md:hidden w-full min-w-0">{children}</div>
    </div>
  )
}

export function TabsFacadeDemos() {
  const [underlineKey, setUnderlineKey] = React.useState<Key>("details")
  const [grayHKey, setGrayHKey] = React.useState<Key>("details")
  const [grayVKey, setGrayVKey] = React.useState<Key>("details")
  const [lineKey, setLineKey] = React.useState<Key>("details")
  const [borderHKey, setBorderHKey] = React.useState<Key>("details")
  const [minimalHKey, setMinimalHKey] = React.useState<Key>("details")

  return (
    <div className="flex w-full min-w-0 max-w-none flex-col gap-10">
      <Section title="Underline (horizontal)">
        <TabRowWithMobileSelect selectedKey={underlineKey} onChange={setUnderlineKey}>
          <Tabs selectedKey={underlineKey} onSelectionChange={setUnderlineKey} className="w-full min-w-0 max-w-full">
            <Tabs.List type="underline" items={tabs}>
              {item => <Tabs.Item {...item} />}
            </Tabs.List>
          </Tabs>
        </TabRowWithMobileSelect>
      </Section>

      <Section title="Button gray (horizontal)">
        <TabRowWithMobileSelect selectedKey={grayHKey} onChange={setGrayHKey}>
          <Tabs selectedKey={grayHKey} onSelectionChange={setGrayHKey} className="w-full min-w-0 max-w-full">
            <Tabs.List type="button-gray" items={tabs}>
              {item => <Tabs.Item {...item} />}
            </Tabs.List>
          </Tabs>
        </TabRowWithMobileSelect>
      </Section>

      <Section title="Button gray (vertical)">
        <TabRowWithMobileSelect selectedKey={grayVKey} onChange={setGrayVKey}>
          <Tabs orientation="vertical" selectedKey={grayVKey} onSelectionChange={setGrayVKey} className="w-full min-w-0 max-w-full">
            <Tabs.List type="button-gray" items={tabs}>
              {item => <Tabs.Item {...item} />}
            </Tabs.List>
          </Tabs>
        </TabRowWithMobileSelect>
      </Section>

      <Section title="Line (vertical)">
        <TabRowWithMobileSelect selectedKey={lineKey} onChange={setLineKey}>
          <Tabs orientation="vertical" selectedKey={lineKey} onSelectionChange={setLineKey} className="w-full min-w-0 max-w-full">
            <Tabs.List type="line" items={tabs}>
              {item => <Tabs.Item {...item} />}
            </Tabs.List>
          </Tabs>
        </TabRowWithMobileSelect>
      </Section>

      <Section title="Button border (horizontal)">
        <TabRowWithMobileSelect selectedKey={borderHKey} onChange={setBorderHKey}>
          <Tabs selectedKey={borderHKey} onSelectionChange={setBorderHKey} className="w-full min-w-0 max-w-full">
            <Tabs.List type="button-border" items={tabs}>
              {item => <Tabs.Item {...item} />}
            </Tabs.List>
          </Tabs>
        </TabRowWithMobileSelect>
      </Section>

      <Section title="Button minimal (horizontal)">
        <TabRowWithMobileSelect selectedKey={minimalHKey} onChange={setMinimalHKey}>
          <Tabs selectedKey={minimalHKey} onSelectionChange={setMinimalHKey} className="w-full min-w-0 max-w-full">
            <Tabs.List type="button-minimal" items={tabs}>
              {item => <Tabs.Item {...item} />}
            </Tabs.List>
          </Tabs>
        </TabRowWithMobileSelect>
      </Section>
    </div>
  )
}
