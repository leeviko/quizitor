import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { boolean, z } from 'zod';
import { prisma } from '~/server/prisma';

export type TQuizResult = {
  title: string;
  id: string;
  private: boolean;
  questions: {
    title: string;
    choices: string[];
    id: string;
  }[];
  author: {
    id: string;
    name: string;
    createdAt: Date;
  };
  favorited?: boolean | null;
} | null;

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
    .query(async ({ input, ctx }) => {
      let userId = null;
      if (ctx.session) {
        userId = ctx.session.user.id;
      }

      const { id } = input;
      const quiz: TQuizResult = await prisma.quiz.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          private: true,
          author: {
            select: {
              id: true,
              name: true,
              createdAt: true,
            },
          },
          questions: {
            select: {
              id: true,
              title: true,
              choices: true,
            },
          },
        },
      });
      if (!quiz) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Quiz does not exist',
        });
      }

      if (!userId) {
        return {
          status: 200,
          result: { ...quiz, favorited: false },
        };
      }

      // -----------------
      // UPDATE VIEW COUNT
      // -----------------

      const interactions = await prisma.interactions.findFirst({
        where: { quizId: quiz.id, userId },
        select: { id: true, viewed: true, viewedAt: true, favorited: true },
      });

      let timeBetweenViewed;
      if (interactions?.viewedAt) {
        timeBetweenViewed = Date.now() - interactions.viewedAt.getTime();
      }

      if (!interactions) {
        await prisma.interactions.create({
          data: {
            userId,
            quizId: quiz.id,
            viewed: 1,
            viewedAt: new Date(),
          },
        });

        return {
          status: 200,
          result: { ...quiz, favorited: false },
        };
      }

      if (timeBetweenViewed && timeBetweenViewed > 5000) {
        let viewCount = interactions.viewed;
        viewCount++;

        await prisma.interactions.update({
          where: { id: interactions.id },
          data: { viewed: viewCount++, viewedAt: new Date() },
        });
      }

      return {
        status: 200,
        result: { ...quiz, favorited: interactions.favorited },
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
  recent: publicProcedure.input(quizListSchema).query(async ({ input }) => {
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
