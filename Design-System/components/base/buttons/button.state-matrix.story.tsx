import type { FC } from "react";
import { StateMatrixRow, StateMatrixShell } from "@/components/base/ngx-refinement/state-matrix-layout";
import { Button } from "@/components/base/buttons/button";

export default {
    title: "Base components/Buttons/State matrix",
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
        title="Button — state matrix (NGX refinement)"
        description="Compare rest, disabled, loading, and variants against --ds-* / legacy theme. Use Storybook light/dark. Hover and real focus-visible: interact with controls; “Simulated focus ring” approximates focus styling for screenshots."
    >
        <StateMatrixRow label="Rest (primary)" hint="default">
            <Button color="primary" size="md">
                Primary
            </Button>
        </StateMatrixRow>
        <StateMatrixRow label="Rest (secondary)">
            <Button color="secondary" size="md">
                Secondary
            </Button>
        </StateMatrixRow>
        <StateMatrixRow label="Rest (tertiary)">
            <Button color="tertiary" size="md">
                Tertiary
            </Button>
        </StateMatrixRow>
        <StateMatrixRow label="Disabled" hint="primary">
            <Button color="primary" size="md" isDisabled>
                Disabled
            </Button>
        </StateMatrixRow>
        <StateMatrixRow label="Loading" hint="primary + spinner">
            <Button color="primary" size="md" isLoading>
                Saving
            </Button>
        </StateMatrixRow>
        <StateMatrixRow label="Loading + text visible" hint="showTextWhileLoading">
            <Button color="primary" size="md" isLoading showTextWhileLoading>
                Saving
            </Button>
        </StateMatrixRow>
        <StateMatrixRow label="Simulated focus ring" hint="static ring for token check">
            <Button color="primary" size="md" className="ring-2 ring-brand ring-offset-2 ring-offset-bg-primary">
                Focus-like ring
            </Button>
        </StateMatrixRow>
        <StateMatrixRow label="Destructive (primary)">
            <Button color="primary-destructive" size="md">
                Delete
            </Button>
        </StateMatrixRow>
    </StateMatrixShell>
);

NGXRefinementMatrix.storyName = "NGX refinement matrix";
