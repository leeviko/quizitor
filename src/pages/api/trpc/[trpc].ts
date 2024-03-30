/**
 * This file contains tRPC's HTTP response handler
 */
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { createContext } from '~/server/context';
import { appRouter } from '~/server/routers/_app';

export default createNextApiHandler({
  router: appRouter,

  createContext,

  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      error.message = 'An unexpected error occurred, please try again later.';
    }
  },
  /**
   * Enable query batching
   */
  batching: {
    enabled: true,
  },
});
