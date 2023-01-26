import Head from 'next/head';
import { ReactNode } from 'react';
import { Poppins, Overpass } from '@next/font/google';
import Navbar from '~/components/Navbar';

type DefaultLayoutProps = { children: ReactNode };

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--poppins',
});

const overpass = Overpass({
  subsets: ['latin'],
  variable: '--overpass',
});

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Head>
        <title>Quizitor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${poppins.variable} ${overpass.variable} default`}>
        <Navbar />
        <main>{children}</main>
      </div>
    </>
  );
};

export default DefaultLayout;
