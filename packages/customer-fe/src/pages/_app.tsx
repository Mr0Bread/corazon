import { AppProps, type AppType } from "next/app";
import { type Session } from "next-auth";
import { ClerkProvider } from '@clerk/nextjs';
import { api } from "~/utils/api";
import { Inter as FontSans } from "next/font/google"
import { ThemeProvider } from "next-themes"
import "~/styles/globals.css";
import NextNProgress from 'nextjs-progressbar';
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next/types";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <style jsx global>{`
				:root {
					--font-sans: ${fontSans.style.fontFamily};
				}
			}`}
      </style>
      <ClerkProvider {...pageProps}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextNProgress />
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
