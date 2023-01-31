import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import {
  quizInputSchema,
  cursorSchema,
  offsetSchema,
  favoriteInputSchema,
} from '~/types/quiz';
import {
  createQuiz,
  getQuizById,
  getQuizList,
  getRecentQuizzes,
  favoriteQuiz,
  getFavoriteQuizzes,
  getUserRecent,
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
      return createQuiz(input, ctx.session.user.id);
    }),

  favorite: protectedProcedure
    .input(favoriteInputSchema)
    .mutation(async ({ input, ctx }) => {
      return favoriteQuiz(input.id, ctx.session.user.id);
    }),

  recent: publicProcedure.input(cursorSchema).query(async ({ input, ctx }) => {
    return getRecentQuizzes(input, ctx.session);
  }),

  userRecent: protectedProcedure
    .input(offsetSchema)
    .query(async ({ input, ctx }) => {
      return getUserRecent(input, ctx.session.user.id);
    }),

  quizList: publicProcedure
    .input(offsetSchema)
    .query(async ({ input, ctx }) => {
      return getQuizList(input, ctx.session);
    }),

  favorites: protectedProcedure
    .input(offsetSchema)
    .query(async ({ input, ctx }) => {
      return getFavoriteQuizzes(input, ctx.session.user.id);
    }),
});
