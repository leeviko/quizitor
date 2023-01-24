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
        correct: z.number(),
        choices: z.array(z.string()).min(2).max(4),
      }),
    )
    .min(1)
    .max(50),
});

export const quizListSchema = z.object({
  limit: z.number().max(20),
  cursor: z.string().nullable(),
  page: z.string(),
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

      const quiz = await prisma.quiz.create({
        data: {
          title: input.title,
          private: input.private,
          questions: { createMany: { data: input.questions } },
          authorId: userId,
        },
      });

      return { status: 200, result: quiz };
    }),
  quizzes: publicProcedure.input(quizListSchema).query(async ({ input }) => {
    const { cursor, limit, page } = input;

    let decodedCursor;
    if (cursor) {
      decodedCursor = Buffer.from(cursor, 'base64').toString('binary');
    }

    const queryResult = await prisma.quiz.findMany({
      take: page === 'next' ? limit : -limit,
      skip: 0,
      cursor: decodedCursor
        ? {
            createdAt: decodedCursor,
          }
        : undefined,
      orderBy: {
        createdAt: 'asc',
      },
      where: {
        private: false,
      },
      select: {
        id: true,
        title: true,
        author: true,
        questions: {
          select: {
            id: true,
            title: true,
            choices: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    let nextCursor;
    if (queryResult.length > 1) {
      const lastQuiz = queryResult[queryResult.length - 1];
      console.log(queryResult);
      nextCursor = Buffer.from(JSON.stringify(lastQuiz?.createdAt)).toString(
        'base64',
      );
    }

    return {
      status: 200,
      result: queryResult,
      cursor: { prev: cursor || null, next: nextCursor || null },
    };
  }),
});
