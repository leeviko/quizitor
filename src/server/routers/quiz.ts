import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { boolean, z } from 'zod';
import { prisma } from '~/server/prisma';

export const quizInputSchema = z.object({
  title: z.string(),
  private: boolean(),
  questions: z
    .array(
      z.object({
        title: z.string(),
        correct: z.string(),
        choices: z.array(z.string()).min(2).max(4),
      }),
    )
    .min(1)
    .max(50),
});

export const quizRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const quiz = await prisma.quiz.findUnique({
        where: { id },
      });
      if (!quiz) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Quiz does not exist',
        });
      }
      return {
        status: 200,
        result: quiz,
      };
    }),
  create: protectedProcedure
    .input(quizInputSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;

      const quiz = prisma.quiz.create({
        data: {
          title: input.title,
          private: input.private,
          questions: { createMany: { data: input.questions } },
          authorId: userId,
        },
      });
      console.log(quiz);

      return { status: 200, result: quiz };
    }),
});
