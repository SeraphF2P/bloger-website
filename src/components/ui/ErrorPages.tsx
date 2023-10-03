import Container from "./Container";
import Icons from "./Icons";
import { FC } from "react";

const pages = {
	401: (
		<>
			<h1 className="capitalize">accecc not allowed</h1>
			<p>error 401</p>
			<div className="flex items-center  justify-center gap-2 capitalize px-2">
				<p>please sign in to access this page</p>
				<Icons.info className=" h-8 w-8" />
			</div>
		</>
	),
	404: (
		<>
			<h1 className="capitalize">page not found</h1>
			<p>error 404</p>
		</>
	),
};
interface ErrorPagesProps {
	status: keyof typeof pages;
}
const ErrorPages: FC<ErrorPagesProps> = ({ status }) => {
	return (
		<Container className=" items-center  justify-center  ">
			{pages[status]}
		</Container>
	);
};

export default ErrorPages;
