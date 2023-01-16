/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '~/utils/auth';

/**
 * Creates context for an incoming request
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const session = await unstable_getServerSession(
    opts.req,
    opts.res,
    authOptions,
  );

  return { session };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
