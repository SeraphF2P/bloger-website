import { Navbar } from "@/components/home";
import { NotSignedIn } from "@/components/index";
import PusherContext from "@/context/PusherContext";
import { Toaster } from "@/lib/myToast/toast";
import { ErrorBoundary } from "@/ui";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { type AppType } from "next/app";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<ErrorBoundary>
			<ClerkProvider {...pageProps}>
				<PusherContext>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<Toaster position="bottom-center" />
						<Navbar />
						<AnimatePresence>
							<Component {...pageProps} />
						</AnimatePresence>
						<Analytics />
						<NotSignedIn />
					</ThemeProvider>
				</PusherContext>
			</ClerkProvider>
		</ErrorBoundary>
	);
};

export default api.withTRPC(MyApp);
