/**
 * This file contains the root router of your tRPC-backend
 */
import { router } from '../trpc';
import { quizRouter } from './quiz';
import { userRouter } from './user';

export const appRouter = router({
  user: userRouter,
  quiz: quizRouter,
});

export type AppRouter = typeof appRouter;
