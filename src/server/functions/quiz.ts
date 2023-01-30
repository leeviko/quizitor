import { prisma } from '~/server/prisma';
import { TRPCError } from '@trpc/server';
import {
  defaultQuizSelect,
  TCursorInput,
  TOffsetInput,
  TQuizInput,
  TQuizResult,
} from '~/types/quiz';
import { Session } from 'next-auth';

// ----------------
// Get quiz by id
// ----------------
export async function getQuizById(session: Session | null, id: string) {
  let userId = null;
  if (session) {
    userId = session.user.id;
  }

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
}

// ----------------
// Create quiz
// ----------------
export async function createQuiz(data: TQuizInput, userId: string) {
  const quiz = await prisma.quiz.create({
    data: {
      title: data.title,
      private: data.private,
      questions: { createMany: { data: data.questions } },
      authorId: userId,
    },
  });

  return { status: 200, result: quiz };
}

// ----------------
// Create quiz
// ----------------
export async function favoriteQuiz(quizId: string, userId: string) {
  const exists = await prisma.interactions.findFirst({
    where: {
      AND: [
        {
          quizId,
        },
        {
          userId,
        },
      ],
    },
    select: {
      id: true,
      favorited: true,
    },
  });

  const updateInteractions = await prisma.interactions.upsert({
    where: { id: exists?.id ?? '0' },
    create: {
      quizId,
      userId,
      favorited: true,
    },
    update: {
      favorited: !exists?.favorited ?? true,
    },
  });

  return { favorited: updateInteractions.favorited };
}

// ----------------
// Get recent quizzes
// ----------------
export async function getRecentQuizzes(
  data: TCursorInput,
  session: Session | null,
) {
  const { cursor, limit, page } = data;
  let userId = null;
  let quizSelectWithInteractions;
  if (session) {
    userId = session.user.id;
    quizSelectWithInteractions = {
      ...defaultQuizSelect,
      interactions: {
        where: { userId },
        select: {
          favorited: true,
        },
      },
    };
  }

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
    select: quizSelectWithInteractions ?? defaultQuizSelect,
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
}

// ----------------
// Get quiz list
// sorted by views or num of favorites
// ----------------
export async function getQuizList(data: TOffsetInput, session: Session | null) {
  const { skip, limit, sortBy } = data;
  let userId = null;
  let quizSelect: any = defaultQuizSelect;
  if (session) {
    userId = session.user.id;
    quizSelect = {
      ...defaultQuizSelect,
      interactions: userId
        ? {
            where: { userId },
            select: {
              favorited: true,
            },
          }
        : undefined,
    };
  }

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
    select: quizSelect,
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
      select: quizSelect,
      orderBy: { createdAt: 'desc' },
    });

    quizzes = [...quizzes, ...fillQuizzes];
  }

  return { status: 200, result: quizzes };
}

// ----------------
// Get favorited quizzes
// ----------------
export async function getFavoriteQuizzes(data: TOffsetInput, userId: string) {
  const { skip, limit } = data;

  const result = await prisma.interactions.findMany({
    skip,
    take: limit,
    where: {
      AND: [{ userId }, { favorited: true }, { quiz: { private: false } }],
    },
    select: {
      id: true,
      quiz: { select: defaultQuizSelect },
      favorited: true,
    },
    orderBy: { quiz: { createdAt: 'desc' } },
  });

  return {
    status: 200,
    result,
  };
}
