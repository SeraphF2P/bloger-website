import { cva, type VariantProps } from "class-variance-authority";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
export const variants = cva(
  "duration-400 transition-colors cursor-pointer text-revert-theme [--variant:--primary]   ",
  {
    variants: {
      variant: {
        fill: " bg-[var(--variant)] hover:bg-[color-mix(in_oklab,var(--variant)_80%,#fff)]   active:bg-[var(--variant)] shadow-sm shadow-inherit active:shadow-inner",
        outline:
          " ring-solid ring-btn  active:bg-btn   shadow-sm  shadow-inherit  ring-4 active:shadow-inner  ",
        ghost:
          "  hover:bg-[color-mix(in_oklab,var(--variant)_80%,transparent)]  active:bg-[var(--variant)] hover:text-theme    shadow-sm shadow-inherit active:shadow-inner",
      },
      shape: {
        pill: "rounded-full",
        circle: "rounded-full aspect-square",
        rect: "rounded-sm",
      },
      disable: {
        default:
          " disabled:text-gray-500   disabled:bg-btn-muted disabled:ring-btn-muted ",
        skelaton:
          "disabled:text-gray-400 disabled:ring-4 disabled:bg-gray-400 disabled:active:bg-transparent",
        link: "text-gray-400 ring-gray-400 active:bg-transparent hover:scale-100 cursor-auto",
      },
    },
    defaultVariants: {
      variant: "fill",
      shape: "rect",
      disable: "default",
    },
  }
);
export type variantsType = VariantProps<typeof variants>;
