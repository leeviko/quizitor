import type { AppType, AppProps } from 'next/app';
import { trpc } from '~/utils/trpc';
import { SessionProvider } from 'next-auth/react';

import '../styles/globals.css';
import { DefaultLayout } from '~/layouts/DefaultLayout';
import { NextComponentType, NextPage, NextPageContext } from 'next';
import Auth, { AuthEnabledComponentConfig } from '~/components/Auth';

export type PageAuthOpts = {
  auth?: { role: 'USER' | 'ADMIN' };
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithAuth<P = {}, IP = P> = NextPage<P, IP> & PageAuthOpts;

type AppAuthProps = AppProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  Component: NextComponentType<NextPageContext, any, {}> &
    Partial<AuthEnabledComponentConfig>;
};

const MyApp = (({
  Component,
  pageProps: { session, ...pageProps },
}: AppAuthProps) => {
  return (
    <SessionProvider session={session}>
      <DefaultLayout>
        {Component.auth ? (
          <Auth opts={Component.auth}>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </DefaultLayout>
    </SessionProvider>
  );
}) as AppType;

export default trpc.withTRPC(MyApp);
