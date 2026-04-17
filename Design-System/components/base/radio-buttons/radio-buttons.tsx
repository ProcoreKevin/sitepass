"use client";

import { type ReactNode, type Ref, createContext, useContext } from "react";
import {
    Radio as AriaRadio,
    RadioGroup as AriaRadioGroup,
    type RadioGroupProps as AriaRadioGroupProps,
    type RadioProps as AriaRadioProps,
} from "react-aria-components";
import { cx } from "@/utils/cx";

export interface RadioGroupContextType {
    size?: "sm" | "md";
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

export interface RadioButtonBaseProps {
    size?: "sm" | "md";
    className?: string;
    isFocusVisible?: boolean;
    isSelected?: boolean;
    isDisabled?: boolean;
}

export const RadioButtonBase = ({ className, isFocusVisible, isSelected, isDisabled, size = "sm" }: RadioButtonBaseProps) => {
    return (
        <div
            data-slot="radio-indicator"
            className={cx(
                "flex size-4 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-full bg-primary ring-1 ring-primary ring-inset",
                size === "md" && "size-5",
                isSelected && !isDisabled && "bg-brand-solid ring-bg-brand-solid",
                isDisabled && "cursor-not-allowed border-disabled bg-disabled_subtle",
                isFocusVisible && "outline-2 outline-offset-2 outline-focus-ring",
                className,
            )}
        >
            <div
                className={cx(
                    "size-1.5 rounded-full bg-fg-white opacity-0 transition-inherit-all",
                    size === "md" && "size-2",
                    isDisabled && "bg-fg-disabled_subtle",
                    isSelected && "opacity-100",
                )}
            />
        </div>
    );
};
RadioButtonBase.displayName = "RadioButtonBase";

interface RadioButtonProps extends AriaRadioProps {
    size?: "sm" | "md";
    label?: ReactNode;
    hint?: ReactNode;
    ref?: Ref<HTMLLabelElement>;
}

export const RadioButton = ({ label, hint, className, size = "sm", ...ariaRadioProps }: RadioButtonProps) => {
    const context = useContext(RadioGroupContext);

    size = context?.size ?? size;

    const sizes = {
        sm: {
            gridGap: "gap-x-2 gap-y-0",
            textStack: "gap-y-0",
            label: "text-sm font-medium",
            hint: "text-sm",
        },
        md: {
            gridGap: "gap-x-3 gap-y-0",
            textStack: "gap-y-0.5",
            label: "text-md font-medium",
            hint: "text-md",
        },
    };

    return (
        <AriaRadio
            {...ariaRadioProps}
            className={(renderProps) =>
                cx(
                    /* RAC useRenderProps passes defaultClassName ("react-aria-Radio"); omitting it drops the class so app/globals.css child grid placement never matches. */
                    renderProps.defaultClassName ?? "react-aria-Radio",
                    sizes[size].gridGap,
                    renderProps.isDisabled && "cursor-not-allowed",
                    typeof className === "function" ? className(renderProps) : className,
                    /* Last so tailwind-merge keeps display:grid over consumer flex/when className prop adds layout utilities. */
                    "grid w-full min-w-0 max-w-full grid-cols-[auto_minmax(0,1fr)] items-start outline-none",
                )
            }
        >
            {({ isSelected, isDisabled, isFocusVisible }) => (
                <>
                    <RadioButtonBase
                        size={size}
                        isSelected={isSelected}
                        isDisabled={isDisabled}
                        isFocusVisible={isFocusVisible}
                        className={label || hint ? "mt-0.5" : ""}
                    />
                    {(label || hint) && (
                        <div
                            data-slot="radio-text"
                            className={cx("flex min-h-0 min-w-0 flex-col", sizes[size].textStack)}
                        >
                            {label && (
                                <p className={cx("min-w-0 text-secondary select-none", sizes[size].label)}>{label}</p>
                            )}
                            {hint && (
                                <p
                                    className={cx("min-w-0 text-tertiary", sizes[size].hint)}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    {hint}
                                </p>
                            )}
                        </div>
                    )}
                </>
            )}
        </AriaRadio>
    );
};
RadioButton.displayName = "RadioButton";

interface RadioGroupProps extends RadioGroupContextType, AriaRadioGroupProps {
    children: ReactNode;
    className?: string;
}

export const RadioGroup = ({ children, className, size = "sm", ...props }: RadioGroupProps) => {
    return (
        <RadioGroupContext.Provider value={{ size }}>
            <AriaRadioGroup {...props} className={cx("flex w-full min-w-0 flex-col gap-4", className)}>
                {children}
            </AriaRadioGroup>
        </RadioGroupContext.Provider>
    );
};
