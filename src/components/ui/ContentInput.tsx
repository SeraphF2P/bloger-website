import Btn from "./Btn";
import Icons from "./Icons";
import { useState } from "react";
import type { ChangeEvent, FC, ReactNode } from "react";

type contentInputType = {
	mutate: (content: string) => void;
	isValidating: boolean;
	fallBack?: ReactNode;
};
export const ContentInput: FC<contentInputType> = ({
	mutate,
	isValidating,
	fallBack,
}) => {
	const [content, setContent] = useState("");
	const changeHandler = (fn: (val: string) => void) => {
		return (e: ChangeEvent<HTMLInputElement>) => fn(e.target.value);
	};
	return (
		<div className="    absolute bottom-0 left-0  h-10   w-full bg-gray-100 dark:bg-gray-900">
			<div className=" flex w-full h-full   items-center">
				<input
					placeholder="write a comment..."
					className=" form-input h-10 w-full"
					type="text"
					value={content}
					onChange={changeHandler(setContent)}
					min={1}
				/>
				<Btn
					disabled={isValidating}
					onClick={() => mutate(content)}
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
