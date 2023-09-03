import type { SVGProps, SVGSVGElement } from "react";

declare module "@/components/Icons" {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  interface icon extends JSX.IntrinsicElements.svg {
    [key: SVGProps<SVGSVGElement>];
  }
}
