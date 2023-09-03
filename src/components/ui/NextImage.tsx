import { cn } from "@/lib/cva";
import Image, { type ImageProps } from "next/image";
import type { ElementType, FC } from "react";

interface NextImageProps extends ImageProps {
  className?: string;
  resoloution?: { w: number; h: number };
  wrapper?: ElementType;
}

const NextImage: FC<NextImageProps> = ({
  className,
  resoloution = { w: 1600, h: 900 },
  wrapper = "div",
  ...props
}) => {
  const Component = wrapper;
  return (
    <Component className={cn("relative", className)}>
      <Image
        width={resoloution?.w}
        height={resoloution?.h}
        {...props}
        alt={props.alt}
      />
    </Component>
  );
};

export default NextImage;
