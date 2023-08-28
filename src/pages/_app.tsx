import { Navbar } from "@/components/home";
import { Toaster } from "@/lib/myToast/toast";
import { SuspenseErrorBoundary } from "@/ui";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { type AppType } from "next/app";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SuspenseErrorBoundary>
      <ClerkProvider {...pageProps}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="bottom-center" />
          <Navbar />
          <AnimatePresence mode="popLayout">
            <Component {...pageProps} />
          </AnimatePresence>
          <Analytics />
        </ThemeProvider>
      </ClerkProvider>
    </SuspenseErrorBoundary>
  );
};

export default api.withTRPC(MyApp);
