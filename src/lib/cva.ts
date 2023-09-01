"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
export const variants = cva(
  ` flex justify-center items-center tracking-wider cursor-pointer text-revert-theme 
   [--variant:--primary] [--var:rgb(var(--variant))] [--alert:200,50,50] [--success:50,200,50] `,
  {
    variants: {
      variant: {
        fill: " bg-variant transition-[box-shadow,colors] duration-700  hover:shadow-lightness   active:bg-[var(--var)]  active:shadow-inner",
        outline:
          " ring-solid transition-[box-shadow,colors] duration-700  ring-2 ring-[var(--var)] hover:bg-[var(--var)] active:bg-[var(--var)]   shadow-sm  shadow-inherit   active:shadow-inner  ",
        ghost:
          "  hover:bg-[rgb(var(--variant),0.8)]   active:bg-[var(--var)] hover:text-theme    shadow-sm  active:shadow-inner",
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
