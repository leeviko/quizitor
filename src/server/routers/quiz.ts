import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import {
  quizInputSchema,
  cursorSchema,
  offsetSchema,
  favoriteInputSchema,
  quizUpdateSchema,
  finishQuizSchema,
  quizScoresSchema,
  searchSchema,
} from '~/types/quiz';
import {
  createQuiz,
  getQuizById,
  getQuizList,
  getRecentQuizzes,
  favoriteQuiz,
  getFavoriteQuizzes,
  getUserRecent,
  updateQuiz,
  deleteQuiz,
  getUserQuizzes,
  finishQuiz,
  getQuizScores,
  searchQuizzes,
} from '../functions/quiz';

export const quizRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
        withCorrect: z.boolean().default(false),
      }),
    )
    .query(async ({ input, ctx }) => {
      return getQuizById(input, ctx.session);
    }),

  create: protectedProcedure
    .input(quizInputSchema)
    .mutation(async ({ input, ctx }) => {
      return createQuiz(input, ctx.session.user.id);
    }),

  update: protectedProcedure
    .input(quizUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      return updateQuiz(input, ctx.session.user.id);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return deleteQuiz(input.id, ctx.session.user);
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
    .input(offsetSchema.omit({ sortBy: true }))
    .query(async ({ input, ctx }) => {
      return getUserRecent(input, ctx.session.user);
    }),

  userQuizzes: publicProcedure
    .input(cursorSchema.extend({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return getUserQuizzes(input, ctx.session);
    }),

  quizList: publicProcedure
    .input(offsetSchema.extend({ orderBy: z.enum(['desc', 'asc']) }))
    .query(async ({ input, ctx }) => {
      return getQuizList(input, ctx.session);
    }),

  favorites: protectedProcedure
    .input(offsetSchema.omit({ sortBy: true }))
    .query(async ({ input, ctx }) => {
      return getFavoriteQuizzes(input, ctx.session.user.id);
    }),

  finishQuiz: protectedProcedure
    .input(finishQuizSchema)
    .mutation(async ({ input, ctx }) => {
      return finishQuiz(input, ctx.session.user);
    }),

  quizScores: publicProcedure
    .input(quizScoresSchema)
    .query(async ({ input }) => {
      return getQuizScores(input);
    }),

  search: publicProcedure.input(searchSchema).query(async ({ input, ctx }) => {
    return searchQuizzes(input, ctx.session);
  }),
});
