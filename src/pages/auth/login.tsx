import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TLogin, TSignUp, userInputSchema } from '~/types/auth';
import { trpc } from '~/utils/trpc';
import { useCallback } from 'react';
import { signIn } from 'next-auth/react';

import styles from '~/styles/Auth.module.css';

const Login: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<TSignUp>({
    resolver: zodResolver(userInputSchema),
  });

  const onSubmit = useCallback(async (data: TLogin) => {
    await signIn('credentials', { ...data, callbackUrl: '/' });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
      </Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.title}>Login to your account</h1>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" {...register('name')} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" {...register('password')} />
        <button className={styles.submitBtn} type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
