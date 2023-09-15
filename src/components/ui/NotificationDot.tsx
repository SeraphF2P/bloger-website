const NotificationDot = ({ count }: { count: number }) => {
	const counter = count > 99 ? "+99" : count;
	console.log(count);

	return count > 0 ? (
		<div className=" pointer-events-none bg-rose-600 flex justify-center  items-center rounded-full absolute top-2  right-2 aspect-square w-6 h-6">
			{counter}
		</div>
	) : null;
};
export default NotificationDot;
