import { Icons } from ".";

const NoContent = ({ caption = "no content" }: { caption?: string }) => {
	return (
		<div className=" min-h-40 flex  w-full flex-col items-center justify-center rounded bg-card">
			<Icons.error className=" w-40  " />
			<h3 className=" capitalize">{caption}</h3>
		</div>
	);
};

export default NoContent;
