import { Navbar } from "@/components/home";
import { Toaster } from "@/lib/myToast/toast";
import { ErrorBoundary } from "@/ui";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { type AppType } from "next/app";
import "~/styles/globals.css";
import { NotSignedIn } from "@/components/index";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ErrorBoundary>
      <ClerkProvider {...pageProps}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="bottom-center" />
          <Navbar />
          <AnimatePresence>
            <Component {...pageProps} />
          </AnimatePresence>
          <Analytics />
          <NotSignedIn />
        </ThemeProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
};

export default api.withTRPC(MyApp);
