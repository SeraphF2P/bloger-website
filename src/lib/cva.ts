import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
export const btnVariants = cva(
  "duration-400 transition-transform cursor-pointer   hover:scale-105 hover:disabled:scale-100 focus:scale-105 active:scale-100",
  {
    variants: {
      variant: {
        fill: " bg-btn hover:bg-btn-hover text-white  active:bg-btn shadow-sm shadow-inherit active:shadow-inner",
        outline:
          " ring-solid ring-btn  active:bg-btn   shadow-sm  shadow-inherit  ring-4 active:shadow-inner  ",
        ghost:
          "  hover:bg-btn/80  active:bg-btn hover:text-white  shadow-sm shadow-inherit active:shadow-inner",
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
export type BtnVariants = VariantProps<typeof btnVariants>;
