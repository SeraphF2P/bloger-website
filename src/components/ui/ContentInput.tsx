import Btn from "./Btn";
import Icons from "./Icons";
import { cn } from "@/lib/cva";
import type { ChangeEvent, FC, ReactNode } from "react";
import { useRef, type ComponentProps } from "react";

interface contentInputType extends ComponentProps<"input"> {
	mutate: (content: string) => void;
	onHasValue?: (_val: boolean) => void;
	isValidating: boolean;
	fallBack?: ReactNode;
	resetOnSubmit?: ReactNode;
}
export const ContentInput: FC<contentInputType> = ({
	mutate,
	isValidating,
	fallBack,
	onHasValue,
	resetOnSubmit = true,
	...props
}) => {
	const ref = useRef<HTMLInputElement>(null);
	let content = "";
	const changeHandler = (fn: (val: string) => void) => {
		return (e: ChangeEvent<HTMLInputElement>) => fn(e.target.value);
	};
	const submitHandeler = () => {
		mutate(content);
		if (ref.current && resetOnSubmit) {
			ref.current.value = "";
			content = "";
		}
	};
	const { className, ...rest } = props;
	return (
		<div className={cn("absolute bottom-0 left-0  h-10  w-full ", className)}>
			<div className=" flex w-full h-full items-center">
				<input
					ref={ref}
					className=" form-input h-10 w-full"
					type="text"
					onChange={changeHandler((val: string) => {
						content = val;
						if (onHasValue == undefined) return;

						if (content.length == 1) {
							onHasValue(true);
						}
						if (content == "") {
							onHasValue(false);
						}
					})}
					min={1}
					onKeyDown={(e) => {
						if (e.key == "Enter") {
							submitHandeler();
						}
					}}
					{...rest}
				/>
				<Btn
					disabled={isValidating}
					onClick={submitHandeler}
					shape="circle"
					className=" m-2  h-8 w-8 "
				>
					<Icons.send className=" w-4 h-4 " />
				</Btn>
			</div>
			{fallBack}
		</div>
	);
};
