"use client";

import type { FC } from "react";
import { StateMatrixRow, StateMatrixShell } from "@/components/base/ngx-refinement/state-matrix-layout";
import { Select, type SelectItemType } from "@/components/base/select/select";

const items: SelectItemType[] = [
    { id: "phoenix", label: "Phoenix Baker", supportingText: "@phoenix" },
    { id: "olivia", label: "Olivia Rhye", supportingText: "@olivia" },
    { id: "disabled-option", label: "Unavailable", supportingText: "disabled", isDisabled: true },
    { id: "lana", label: "Lana Steiner", supportingText: "@lana" },
];

export default {
    title: "Base components/Select/State matrix",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full">
                <Story />
            </div>
        ),
    ],
};

export const NGXRefinementMatrix = () => (
    <StateMatrixShell
        title="Select — state matrix (NGX refinement)"
        description="Closed states plus listbox opened on first paint (defaultOpen). Compare trigger ring, popover surface, and invalid hint to token-contract. Use light/dark themes."
    >
        <StateMatrixRow label="Closed (rest)" hint="placeholder">
            <div className="max-w-sm">
                <Select label="Assignee" placeholder="Select person" items={items}>
                    {(item) => (
                        <Select.Item id={item.id} supportingText={item.supportingText} isDisabled={item.isDisabled}>
                            {item.label}
                        </Select.Item>
                    )}
                </Select>
            </div>
        </StateMatrixRow>
        <StateMatrixRow label="Closed + value" hint="defaultSelectedKey">
            <div className="max-w-sm">
                <Select label="Assignee" placeholder="Select person" items={items} defaultSelectedKey="phoenix">
                    {(item) => (
                        <Select.Item id={item.id} supportingText={item.supportingText} isDisabled={item.isDisabled}>
                            {item.label}
                        </Select.Item>
                    )}
                </Select>
            </div>
        </StateMatrixRow>
        <StateMatrixRow label="Open (initial)" hint="defaultOpen — scroll if clipped">
            <div className="max-w-sm">
                <Select label="Assignee" placeholder="Select person" items={items} defaultOpen defaultSelectedKey="phoenix">
                    {(item) => (
                        <Select.Item id={item.id} supportingText={item.supportingText} isDisabled={item.isDisabled}>
                            {item.label}
                        </Select.Item>
                    )}
                </Select>
            </div>
        </StateMatrixRow>
        <StateMatrixRow label="Disabled (closed)" hint="isDisabled">
            <div className="max-w-sm">
                <Select label="Assignee" placeholder="Select person" items={items} isDisabled defaultSelectedKey="phoenix">
                    {(item) => (
                        <Select.Item id={item.id} supportingText={item.supportingText} isDisabled={item.isDisabled}>
                            {item.label}
                        </Select.Item>
                    )}
                </Select>
            </div>
        </StateMatrixRow>
        <StateMatrixRow label="Invalid (closed)" hint="isInvalid + hint">
            <div className="max-w-sm">
                <Select label="Assignee" placeholder="Required" items={items} isInvalid hint="Choose an assignee to continue">
                    {(item) => (
                        <Select.Item id={item.id} supportingText={item.supportingText} isDisabled={item.isDisabled}>
                            {item.label}
                        </Select.Item>
                    )}
                </Select>
            </div>
        </StateMatrixRow>
    </StateMatrixShell>
);

NGXRefinementMatrix.storyName = "NGX refinement matrix";
