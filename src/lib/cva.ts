import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
export const btnVariants = cva(
  "duration-400 transition-transform   hover:scale-105  focus:scale-105 active:scale-100 hover:disabled:scale-100",
  {
    variants: {
      variant: {
        fill: " bg-btn hover:bg-btn-hover disabled:bg-btn-muted active:bg-btn shadow-sm shadow-inherit active:shadow-inner",
        outline:
          " ring-solid ring-btn disabled:ring-btn-muted disabled:active:bg-transparent active:bg-btn disabled:text-gray-400  shadow-sm  shadow-inherit  ring-4 active:shadow-inner  disabled:ring-4",
        ghost:
          "  hover:bg-btn/80  active:bg-btn disabled:bg-gray-400 disabled:text-gray-500  shadow-sm shadow-inherit active:shadow-inner",
      },
      shape: {
        pill: "rounded-full",
        circle: "rounded-full aspect-square",
        rect: "rounded-sm",
      },
    },
    defaultVariants: {
      variant: "fill",
      shape: "rect",
    },
  }
);
export type BtnVariants = VariantProps<typeof btnVariants>;
