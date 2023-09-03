"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
export const variants = cva(
  ` flex transition-[box-shadow,colors] justify-center items-center tracking-wider cursor-pointer text-revert-theme 
   [--variant:--primary] `,
  {
    variants: {
      variant: {
        fill: " bg-variant hover:!shadow-dynamic/40 shadow-overlay  transition-[box-shadow,colors] duration-700  ",
        outline:
          " ring-solid transition-[box-shadow,colors] duration-700  ring-2 ring-variant hover:bg-variant active:bg-variant     ",
        ghost:
          "  hover:bg-[rgb(var(--variant),0.8)]   active:bg-variant hover:text-theme  ",
        none: "",
      },
      shape: {
        pill: "rounded-[50%]",
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
