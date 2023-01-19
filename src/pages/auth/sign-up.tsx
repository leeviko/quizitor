import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TSignUp, userInputSchema } from '~/types/auth';
import { trpc } from '~/utils/trpc';
import { useCallback, useEffect } from 'react';

import styles from '~/styles/Auth.module.css';
import { useSession } from 'next-auth/react';

const SignUp: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const { register, handleSubmit } = useForm<TSignUp>({
    resolver: zodResolver(userInputSchema),
  });
  const { mutateAsync } = trpc.user.create.useMutation();

  const onSubmit = useCallback(
    async (data: TSignUp) => {
      const result: any = await mutateAsync(data);

      if (result.status === 201) {
        router.push('/');
      }
    },
    [mutateAsync, router],
  );

  useEffect(() => {
    if (status === 'authenticated') router.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className={`${styles.container} center`}>
      <Head>
        <title>Create an account</title>
      </Head>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Create an account</h1>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" {...register('name')} />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" {...register('password')} />
            <button className={styles.submitBtn} type="submit">
              Sign Up
            </button>
            <Link href="/auth/login">Sign in to an existing account</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
