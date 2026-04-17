import type { FC } from "react";
import { StateMatrixRow, StateMatrixShell } from "@/components/base/ngx-refinement/state-matrix-layout";
import { Input } from "@/components/base/input/input";

export default {
    title: "Base components/Inputs/State matrix",
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
        title="Input — state matrix (NGX refinement)"
        description="Verify border, focus ring, invalid, disabled, and readonly against ngx-canonical-tokens and token-contract. Interact for true focus; simulated row is for static screenshots."
    >
        <StateMatrixRow label="Rest" hint="default">
            <div className="max-w-xs">
                <Input label="Label" placeholder="Type here" hint="Helper text" />
            </div>
        </StateMatrixRow>
        <StateMatrixRow label="Simulated focus ring" hint="wrapper ring ≈ focus-within">
            <div className="max-w-xs">
                <Input
                    label="Label"
                    placeholder="Focus ring"
                    className="[&_[data-input-wrapper]]:ring-2 [&_[data-input-wrapper]]:ring-brand"
                />
            </div>
        </StateMatrixRow>
        <StateMatrixRow label="Invalid" hint="isInvalid + hint">
            <div className="max-w-xs">
                <Input label="Email" placeholder="you@example.com" isInvalid hint="Enter a valid email" defaultValue="bad" />
            </div>
        </StateMatrixRow>
        <StateMatrixRow label="Disabled" hint="isDisabled">
            <div className="max-w-xs">
                <Input label="Read-only field" placeholder="N/A" isDisabled defaultValue="Cannot edit" />
            </div>
        </StateMatrixRow>
        <StateMatrixRow label="Read-only" hint="isReadOnly">
            <div className="max-w-xs">
                <Input label="Account" placeholder="" isReadOnly defaultValue="acme@corp.com" hint="Copied from directory" />
            </div>
        </StateMatrixRow>
    </StateMatrixShell>
);

NGXRefinementMatrix.storyName = "NGX refinement matrix";
