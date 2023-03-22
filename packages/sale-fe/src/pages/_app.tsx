import { AppProps, type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react"
import { ChakraProvider } from '@chakra-ui/react'
import { ClerkProvider } from '@clerk/nextjs'
import { api } from "~/utils/api";
import NextNProgress from 'nextjs-progressbar';

import "~/styles/globals.css";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next/types";

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
      <NextNProgress />
      <ClerkProvider {...pageProps}>
        <SessionProvider session={session}>
          <ChakraProvider>
            {getLayout(<Component {...pageProps} />)}
          </ChakraProvider>
        </SessionProvider>
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
