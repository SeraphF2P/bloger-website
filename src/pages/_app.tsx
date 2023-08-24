import { fontOutfit } from "@/config/fonts";
import { cn } from "@/lib/cva";
import { Toaster } from "@/lib/myToast/toast";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { type AppType } from "next/app";
import "~/styles/globals.css";
import { Navbar } from "@/components/home";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster position="bottom-center" />
        <main
          className={cn(
            fontOutfit.variable,
            " font-outfit remove-scroll-bar relative mx-auto h-screen w-full max-w-[420px] overflow-y-scroll  shadow px-2 pt-24"
          )}
        >
          <Navbar />
          <Component {...pageProps} />
        </main>
        <Analytics />
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
