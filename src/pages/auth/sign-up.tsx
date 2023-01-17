import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TSignUp, userInputSchema } from '~/types/auth';
import { trpc } from '~/utils/trpc';
import { useCallback } from 'react';

import styles from '~/styles/Auth.module.css';

const SignUp: NextPage = () => {
  const router = useRouter();
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Create an account</title>
      </Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.title}>Create an account</h1>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" {...register('name')} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" {...register('password')} />
        <button className={styles.submitBtn} type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
