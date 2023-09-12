import { toPusherKey } from "../../utils";
import { useUser } from "@clerk/nextjs";
import PusherClient from "pusher-js";
import {
	Dispatch,
	SetStateAction,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { FC, PropsWithChildren } from "react";

type ContextType = {
	notificationsCount: number;
	setNotificationsCount: Dispatch<SetStateAction<number>>;
};
const Context = createContext<ContextType>({
	notificationsCount: 0,
	setNotificationsCount: () => {
		console.error("out of RealTime Context");
	},
});

export const useRealTimeData = () => {
	return useContext(Context);
};

const RealTimeNotificationContext: FC<PropsWithChildren> = ({ children }) => {
	const { user } = useUser();
	const [notificationsCount, setNotificationsCount] = useState(0);
	const note = () => {
		setNotificationsCount((prev) => prev + 1);
	};
	useEffect(() => {
		const pusherClient = new PusherClient(
			process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
			{
				cluster: "eu",
			}
		);
		try {
			if (!user) return;
			console.log("pusherClient");
			pusherClient.subscribe(toPusherKey(`note:${user.id}`));
			pusherClient.bind("note", note);
			return () => {
				pusherClient.unsubscribe(toPusherKey(`note:${user.id}`));
				pusherClient.unbind("note", note);
			};
		} catch (error) {
			console.log(error);
		}
	}, [user]);
	return (
		<Context.Provider value={{ notificationsCount, setNotificationsCount }}>
			{children}
		</Context.Provider>
	);
};

export default RealTimeNotificationContext;
