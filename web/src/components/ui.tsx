import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Owned, customised primitives (shadcn-style, cva). Never a default state.

const button = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-semibold transition-[transform,background-color,border-color,box-shadow] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-white shadow-[0_1px_0_rgba(255,255,255,0.14)_inset,0_12px_26px_-14px_rgba(22,24,29,0.85)] hover:bg-ink2 hover:-translate-y-px",
        outline:
          "border border-line bg-panel text-ink hover:border-ink/35 hover:text-ink",
        ghost: "text-ink2 hover:text-ink",
      },
      size: {
        md: "h-11 px-5 text-[15px]",
        lg: "h-13 px-7 text-base min-h-[48px]",
        sm: "h-9 px-4 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />;
}

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "block font-display text-[13px] font-semibold tracking-[0.01em] text-ink2",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <input
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      "h-12 w-full rounded-[12px] border bg-panel px-3.5 text-[16px] text-ink outline-none transition-colors placeholder:text-muted/70",
      "border-line focus:border-accent focus:ring-2 focus:ring-accent/25",
      invalid && "border-blocked focus:border-blocked focus:ring-blocked/20",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
