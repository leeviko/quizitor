import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { quizInputSchema, cursorSchema, offsetSchema } from '~/types/quiz';
import {
  createQuiz,
  getQuizById,
  getQuizList,
  getRecentQuizzes,
} from '../functions/quiz';

export const quizRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return getQuizById(ctx.session, input.id);
    }),

  create: protectedProcedure
    .input(quizInputSchema)
    .mutation(async ({ input, ctx }) => {
      return createQuiz(input, ctx.user.id);
    }),

  recent: publicProcedure.input(cursorSchema).query(async ({ input }) => {
    return getRecentQuizzes(input);
  }),

  quizList: publicProcedure.input(offsetSchema).query(async ({ input }) => {
    return getQuizList(input);
  }),
});
