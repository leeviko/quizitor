/**
 * This file contains the root router of your tRPC-backend
 */
import { router } from '../trpc';
import { userRouter } from './user';

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
