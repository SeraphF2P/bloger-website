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
	wrapper = "div",
	...props
}) => {
	const Component = wrapper;
	return (
		<Component className={cn("relative", className)}>
			<Image fill {...props} alt={props.alt} />
		</Component>
	);
};

export default NextImage;
