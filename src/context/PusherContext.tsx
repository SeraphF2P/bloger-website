import { toPusherKey } from "../utils";
import { useUser } from "@clerk/nextjs";
import PusherClient from "pusher-js";
import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useRef } from "react";

type ContextType = PusherClient | null;
const Context = createContext<ContextType>(null);

export const usePusherInstence = () => {
	return useContext(Context);
};
type PucherHookType = {
	key: string;
	cb: (_val?: any) => void;
	event: string;
};
export function usePusher({ key, event, cb }: PucherHookType) {
	const pusherClient = useContext(Context);
	useEffect(() => {
		if (!pusherClient) return;
		pusherClient.subscribe(toPusherKey(key));
		pusherClient.bind(event, cb);
		return () => {
			pusherClient.unsubscribe(toPusherKey(key));
			pusherClient.unbind(event, cb);
		};
	}, [cb, event, key, pusherClient]);
}
const PusherContext: FC<PropsWithChildren> = ({ children }) => {
	const { isSignedIn } = useUser();
	const { current: pusherClient } = useRef(
		new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
			cluster: "eu",
		})
	);

	if (!isSignedIn) return <>{children}</>;
	return <Context.Provider value={pusherClient}>{children}</Context.Provider>;
};

export default PusherContext;
