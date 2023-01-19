import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TLogin, TSignUp, userInputSchema } from '~/types/auth';
import { useCallback, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

import styles from '~/styles/Auth.module.css';

const Login: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const { register, handleSubmit } = useForm<TSignUp>({
    resolver: zodResolver(userInputSchema),
  });

  const onSubmit = useCallback(async (data: TLogin) => {
    await signIn('credentials', { ...data, callbackUrl: '/' });
  }, []);

  useEffect(() => {
    if (status === 'authenticated') router.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className={`${styles.container} center`}>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Login to your account</h1>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" {...register('name')} />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" {...register('password')} />
            <button className={styles.submitBtn} type="submit">
              Login
            </button>
            <Link href="/auth/sign-up">Create an account</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
