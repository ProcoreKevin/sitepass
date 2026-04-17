import type { FC } from "react";
import { StateMatrixRow, StateMatrixShell } from "@/components/base/ngx-refinement/state-matrix-layout";
import { Checkbox, CheckboxBase } from "@/components/base/checkbox/checkbox";

export default {
    title: "Base components/Checkboxes/State matrix",
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
        title="Checkbox — state matrix (NGX refinement)"
        description="CheckboxBase rows show static surfaces; full Checkbox rows show label + control. Toggle light/dark in Storybook. For pressed/hover, use the interactive checkbox rows."
    >
        <StateMatrixRow label="Unchecked (static)" hint="CheckboxBase">
            <CheckboxBase />
        </StateMatrixRow>
        <StateMatrixRow label="Checked (static)">
            <CheckboxBase isSelected />
        </StateMatrixRow>
        <StateMatrixRow label="Indeterminate (static)">
            <CheckboxBase isIndeterminate />
        </StateMatrixRow>
        <StateMatrixRow label="Disabled + unchecked">
            <CheckboxBase isDisabled />
        </StateMatrixRow>
        <StateMatrixRow label="Disabled + checked">
            <CheckboxBase isDisabled isSelected />
        </StateMatrixRow>
        <StateMatrixRow label="Focus-visible (static)" hint="isFocusVisible on base">
            <CheckboxBase isFocusVisible />
        </StateMatrixRow>
        <StateMatrixRow label="Interactive + label" hint="real focus / keyboard">
            <Checkbox name="demo-matrix" value="a" label="Remember me" hint="Optional hint text" />
        </StateMatrixRow>
        <StateMatrixRow label="Interactive disabled">
            <Checkbox isDisabled label="Notifications" defaultSelected />
        </StateMatrixRow>
    </StateMatrixShell>
);

NGXRefinementMatrix.storyName = "NGX refinement matrix";
