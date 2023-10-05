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
let content = "";
export const ContentInput: FC<contentInputType> = ({
	mutate,
	isValidating,
	fallBack,
	onHasValue,
	resetOnSubmit = true,
	...props
}) => {
	const ref = useRef<HTMLInputElement>(null);
	const changeHandler = (fn: (val: string) => void) => {
		return (e: ChangeEvent<HTMLInputElement>) => fn(e.target.value);
	};
	const submitHandeler = () => {
		mutate(content);
		if (ref.current && resetOnSubmit) {
			ref.current.value = "";
			content = "";
			if (onHasValue) {
				onHasValue(false);
			}
		}
	};
	const { className, ...rest } = props;
	return (
		<div className={cn(" relative h-12  w-full ", className)}>
			{fallBack ? (
				fallBack
			) : (
				<div className="form-input  p-0 flex w-full h-full items-center">
					<input
						ref={ref}
						className=" py-2 bg-transparent px-3 h-full w-full"
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
						className=" m-2  h-10 w-10 "
					>
						<Icons.send className=" w-6 h-6 " />
					</Btn>
				</div>
			)}
		</div>
	);
};
