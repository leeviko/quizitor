import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { z } from 'zod';
import {
  TQuizResult,
  quizInputSchema,
  cursorSchema,
  offsetSchema,
} from '~/types/quiz';

const defaultQuizSelect = {
  id: true,
  title: true,
  author: {
    select: {
      id: true,
      name: true,
    },
  },
  _count: { select: { questions: true } },
  createdAt: true,
  updatedAt: true,
};

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

      if (!userId || quiz.private) {
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
  recent: publicProcedure.input(cursorSchema).query(async ({ input }) => {
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
        createdAt: 'desc',
      },
      where: {
        private: false,
      },
      select: defaultQuizSelect,
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
  quizList: publicProcedure.input(offsetSchema).query(async ({ input }) => {
    const { skip, limit, sortBy } = input;

    const statsResult = await prisma.interactions.groupBy({
      skip,
      take: limit,
      orderBy: { quizId: 'desc' },
      by: ['quizId'],
      where: sortBy === 'favorites' ? { favorited: true } : undefined,
      _sum: {
        viewed: true,
      },
      _count: {
        favorited: true,
      },
    });

    const result = await prisma.quiz.findMany({
      where: { id: { in: statsResult.map(({ quizId }) => quizId) } },
      select: defaultQuizSelect,
    });

    // Combine stats with quiz
    let quizzes = result.map((quiz) => ({
      ...quiz,
      ...statsResult.find((stats) => stats.quizId === quiz.id),
    }));

    const srtByViews = (a: any, b: any) => {
      return b._sum.viewed - a._sum.viewed;
    };
    const srtByFavs = (a: any, b: any) => {
      return b._count.favorited - a._count.favorited;
    };

    if (sortBy === 'views') {
      quizzes.sort(srtByViews);
    } else if (sortBy === 'favorites') {
      quizzes.sort(srtByFavs);
    }

    if (quizzes.length < limit) {
      const fillQuizzes = await prisma.quiz.findMany({
        take: limit - quizzes.length,
        where: { id: { notIn: statsResult.map(({ quizId }) => quizId) } },
        select: defaultQuizSelect,
        orderBy: { createdAt: 'desc' },
      });

      quizzes = [...quizzes, ...fillQuizzes];
    }

    return { result: quizzes };
  }),
});
