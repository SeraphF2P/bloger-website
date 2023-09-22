import { Icons } from "./ui";

const NoContent = () => {
	return (
		<div className=" min-h-40 flex  w-full flex-col items-center justify-center rounded bg-slate-300 p-8 dark:bg-slate-500">
			<Icons.error className=" w-40  " />
			<h3 className=" capitalize">no content</h3>
		</div>
	);
};

export default NoContent;
