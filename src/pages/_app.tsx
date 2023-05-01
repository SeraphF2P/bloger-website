import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { Container, Navbar } from "@/components";
import { Toaster } from "../lib/myToast/toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster position="bottom-center"  />
        <Container>
          <Navbar />
          <Component {...pageProps} />
        </Container>
        <Analytics />
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
