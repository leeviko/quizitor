import { prisma } from '~/server/prisma';
import { TRPCError } from '@trpc/server';
import {
  defaultQuizSelect,
  Sort,
  TAnswers,
  TCursorInput,
  TOffsetInput,
  TQuizInput,
  TQuizScoresInput,
  TQuizUpdateInput,
  TQuizWithInteractions,
  TQuizWithStats,
  TSearchInput,
} from '~/types/quiz';
import { Session, User } from 'next-auth';

// ----------------
// Get quiz by id
// ----------------
export async function getQuizById(
  data: { id: string; withCorrect: boolean },
  session: Session | null,
) {
  const userId = session?.user.id;
  const isAdmin = session?.user.role === 'ADMIN';
  if (!userId) {
    data.withCorrect = false;
  }
  const { id: quizId, withCorrect } = data;

  const views = await prisma.interactions.groupBy({
    by: ['quizId'],
    where: { quizId },
    _sum: {
      viewed: true,
    },
  });
  const favorites = await prisma.interactions.groupBy({
    by: ['quizId'],
    where: { quizId, favorited: true },
    _count: {
      favorited: true,
    },
  });

  const stats = {
    views: views[0]?._sum.viewed ?? 0,
    favorites: favorites[0]?._count.favorited ?? 0,
  };

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId, authorId: withCorrect ? userId : undefined },
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
          correct: withCorrect,
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

  const isAuthor = quiz.author.id === userId;

  if (quiz.private && !isAuthor && !isAdmin) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Quiz does not exist',
    });
  }

  const result: TQuizWithStats = { ...quiz, stats, favorited: false };

  if (!userId || quiz.private) {
    return {
      status: 200,
      result: {
        ...result,
        favorited: false,
      },
    };
  }

  // --- Update view count ---
  const interactions = await prisma.interactions.findFirst({
    where: { quizId: quiz.id, userId },
    select: { id: true, viewed: true, viewedAt: true, favorited: true },
  });

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
      result: {
        ...result,
        favorited: false,
      },
    };
  }
  const { id, viewedAt, favorited } = interactions;

  let timeBetweenViewed;
  if (viewedAt) {
    timeBetweenViewed = Date.now() - viewedAt.getTime();
  }

  if (timeBetweenViewed && timeBetweenViewed > 5000) {
    await prisma.interactions.update({
      where: { id },
      data: { viewed: { increment: 1 }, viewedAt: new Date() },
    });
  }

  return {
    status: 200,
    result: {
      ...result,
      favorited,
    },
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
// Update quiz
// ----------------
export async function updateQuiz(data: TQuizUpdateInput, userId: string) {
  const { id, title, private: isPrivate, questions } = data;

  const result = await prisma.$transaction([
    prisma.quiz.update({
      where: { id, authorId: userId },
      data: { title, private: isPrivate },
    }),
    prisma.questions.deleteMany({ where: { quizId: id } }),
    prisma.questions.createMany({ data: questions }),
    prisma.scores.deleteMany({ where: { quizId: id } }),
  ]);

  if (result.length !== 4) {
    throw new TRPCError({
      message: 'Something went wrong while updating',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }

  return { result };
}

// ----------------
// Delete quiz
// ----------------
export async function deleteQuiz(id: string, user: User) {
  const { id: userId, role } = user;
  const isAdmin = role === 'ADMIN';

  const isAuthor = await prisma.quiz.findUnique({
    where: { id, authorId: userId },
  });

  if (!isAuthor && !isAdmin) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const deleteScores = prisma.scores.deleteMany({
    where: { quizId: id },
  });
  const deleteInteractions = prisma.interactions.deleteMany({
    where: { quizId: id },
  });
  const deleteQuestions = prisma.questions.deleteMany({
    where: { quizId: id },
  });
  const deleteQuiz = prisma.quiz.delete({
    where: { id },
  });

  const result = await prisma.$transaction([
    deleteScores,
    deleteInteractions,
    deleteQuestions,
    deleteQuiz,
  ]);

  return { result };
}

// ----------------
// Favorite quiz
// ----------------
export async function favoriteQuiz(quizId: string, userId: string) {
  const exists = await prisma.interactions.findFirst({
    where: {
      quizId,
      userId,
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

  const queryResult: TQuizWithInteractions[] = await prisma.quiz.findMany({
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
// Get specific user's
// quizzes
// ----------------
export async function getUserQuizzes(
  data: TCursorInput & { id: string },
  session: Session | null,
) {
  const { cursor, limit, page, id } = data;
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
  const isAuthor = userId === id || session?.user.role === 'ADMIN';

  let decodedCursor;
  if (cursor) {
    decodedCursor = Buffer.from(cursor, 'base64').toString('binary');
  }

  const queryResult: TQuizWithInteractions[] = await prisma.quiz.findMany({
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
      private: !isAuthor && false,
      authorId: id,
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
  const { currPage, limit, sortBy } = data;
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
    skip: currPage,
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
    where: {
      id: { in: statsResult.map(({ quizId }) => quizId) },
      private: false,
    },
    select: quizSelect,
  });

  // Combine stats with quiz
  let quizzes = result.map((quiz) => ({
    ...quiz,
    stats: {
      ...statsResult.find((stats) => stats.quizId === quiz.id),
    },
  }));

  const srtByViews = (a: any, b: any) => {
    return b.stats._sum.viewed - a.stats._sum.viewed;
  };
  const srtByFavs = (a: any, b: any) => {
    return b.stats._count.favorited - a.stats._count.favorited;
  };

  if (sortBy === 'views') {
    quizzes.sort(srtByViews);
  } else if (sortBy === 'favorites') {
    quizzes.sort(srtByFavs);
  }

  if (quizzes.length < limit) {
    const fillQuizzes: any = await prisma.quiz.findMany({
      take: limit - quizzes.length,
      where: {
        id: { notIn: statsResult.map(({ quizId }) => quizId) },
        private: false,
      },
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
  const { currPage, limit } = data;

  const result = await prisma.interactions.findMany({
    skip: currPage,
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

// ----------------
// Get user recent
// ----------------
export async function getUserRecent(data: TOffsetInput, user: User) {
  const { currPage, limit } = data;
  const { id: userId } = user;

  const result = await prisma.interactions.findMany({
    skip: currPage,
    take: limit,
    where: {
      userId,
      viewedAt: { not: undefined || null },
      quiz: { private: false },
    },
    select: {
      id: true,
      quiz: { select: defaultQuizSelect },
      favorited: true,
      viewedAt: true,
    },
    orderBy: { viewedAt: 'desc' },
  });

  return {
    status: 200,
    result,
  };
}

// ----------------
// Upload score to db
// ----------------
export async function finishQuiz(data: TAnswers, user: User) {
  const { id: userId } = user;
  const { answers, quizId } = data;

  const questions = await prisma.questions.findMany({
    where: { id: { in: answers.map(({ id }) => id) }, quizId },
  });

  if (answers.length !== questions.length) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Something went wrong',
    });
  }

  const maxScore = answers.length;
  let score = maxScore;

  const result = [];
  let question;

  for (let i = 0; i < maxScore; i++) {
    const que = questions[i];
    const answer = answers[i];
    if (answer?.selected !== que?.correct) {
      score--;
    }

    if (que && answer) {
      question = {
        ...que,
        correct: answer.selected === que.correct,
        selectedIndex: answer.selected,
      };
      result.push(question);
    }
  }

  const exists = await prisma.scores.findFirst({
    where: { quizId, userId },
    select: { id: true, best: true },
  });

  const scoreResult = await prisma.scores.upsert({
    where: { id: exists?.id ?? '0' },
    create: {
      quizId,
      userId,
      best: score,
      recent: score,
      tries: 1,
    },
    update: {
      best: score > (exists?.best ?? 0) ? score : undefined,
      recent: score,
      tries: { increment: 1 },
    },
  });

  return { score: scoreResult, result };
}

// ----------------
// Get quiz scores
// ----------------
export async function getQuizScores(data: TQuizScoresInput) {
  const { quizId, cursor, limit, page } = data;

  if (cursor === null) {
    return;
  }

  const result = await prisma.scores.findMany({
    take: page === 'next' ? limit : -limit,
    skip: cursor ? 1 : 0,
    // cursor: undefined,
    orderBy: {
      updatedAt: 'desc',
    },
    where: {
      quizId,
      updatedAt: cursor
        ? page === 'prev'
          ? { gte: cursor }
          : { lte: cursor }
        : undefined,
    },
    select: {
      id: true,
      best: true,
      recent: true,
      user: {
        select: {
          name: true,
        },
      },
      updatedAt: true,
      createdAt: true,
    },
  });

  let nextCursor;
  if (result.length === limit) {
    const lastScore = result[result.length - 1];
    nextCursor = lastScore?.updatedAt;
  } else {
    nextCursor = null;
  }

  return {
    result,
    cursor: { prev: cursor || null, next: nextCursor || null },
  };
}

// ----------------
// Search quizzes
// ----------------
export async function searchQuizzes(
  data: TSearchInput,
  session: Session | null,
) {
  const { limit, currPage, query, sort } = data;
  let userId;
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

  // --- Sorting ---
  let orderBy: any;
  let searchQuery = query.trim();

  if (sort === Sort.latest || sort === Sort.oldest) {
    orderBy = {
      createdAt: Sort.latest ? 'desc' : 'asc',
    };
  } else {
    orderBy = undefined;
  }

  // Get total count of quizzes
  const totalCount = await prisma.quiz.count({
    where: {
      title: {
        contains: query,
        mode: 'insensitive',
      },
      private: false,
    },
  });

  const numOfPages = Math.ceil(totalCount / limit);

  let result: TQuizWithInteractions[];
  if (sort === Sort.mostViewed || sort === Sort.leastViewed) {
    searchQuery = `%${searchQuery}%`;
    const offset = currPage * limit;
    const orderBy = sort === Sort.mostViewed ? 'DESC' : 'ASC';

    // --- Sort by views query ---
    result = await prisma.$queryRawUnsafe(
      `SELECT  SUM("Interactions"."viewed") AS views, "Interactions"."quizId" AS id, 
                "Quiz"."title", "Quiz"."createdAt", "Quiz"."updatedAt",
                json_build_object('id', "User"."id", 'name', "User"."name") AS author,
                json_build_object('questions', "count"."questionCount") as _count
      FROM "Interactions"
        INNER JOIN "Quiz" ON "Interactions"."quizId" = "Quiz"."id"
        LEFT JOIN (SELECT "Questions"."quizId", COUNT(*) 
          AS "questionCount" FROM "Questions" 
            GROUP BY "Questions"."quizId") 
          AS "count" 
          ON ("Quiz"."id" = "count"."quizId")
        INNER JOIN "User" ON "Quiz"."authorId" = "User"."id" 
      WHERE "Quiz"."private" = false AND "Quiz"."title" ILIKE $1
      GROUP BY  "Interactions"."quizId", "Quiz"."title", "Quiz"."createdAt", 
        "Quiz"."updatedAt", "User"."name", "User"."id",
        "count"."questionCount"
      ORDER BY views ${orderBy}
      LIMIT  $2
      OFFSET $3
      `,
      searchQuery,
      limit,
      offset,
    );

    return {
      result,
      pagination: {
        currPage,
        numOfPages,
      },
    };
  }

  result = await prisma.quiz.findMany({
    skip: currPage * limit,
    take: limit,
    where: {
      title: {
        contains: searchQuery,
        mode: 'insensitive',
      },
      private: false,
    },
    select: quizSelectWithInteractions ?? defaultQuizSelect,
    orderBy,
  });

  return {
    result,
    pagination: {
      currPage,
      numOfPages,
    },
  };
}
