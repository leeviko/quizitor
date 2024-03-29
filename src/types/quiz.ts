import { z } from 'zod';

export const quizInputSchema = z.object({
  title: z.string().min(3).max(40),
  private: z.boolean(),
  questions: z
    .array(
      z.object({
        title: z.string().min(3).max(40),
        correct: z.number(),
        choices: z.array(z.string()).min(2).max(4),
      }),
    )
    .min(1)
    .max(50),
});
export type TQuizInput = z.infer<typeof quizInputSchema>;

export const quizUpdateSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(40),
  private: z.boolean(),
  questions: z
    .array(
      z.object({
        quizId: z.string(),
        title: z.string().min(3).max(40),
        correct: z.number(),
        choices: z.array(z.string()).min(2).max(4),
      }),
    )
    .min(1)
    .max(50),
});
export type TQuizUpdateInput = z.infer<typeof quizUpdateSchema>;

export const favoriteInputSchema = z.object({
  id: z.string(),
});

export const offsetSchema = z.object({
  currPage: z.number().default(0),
  limit: z.number().max(20).default(10),
  sortBy: z.enum(['favorites', 'views', 'date']),
});
export type TOffsetInput = z.infer<typeof offsetSchema>;

export const cursorSchema = z.object({
  limit: z.number().max(20),
  cursor: z.string().nullable(),
  page: z.string(),
});
export type TCursorInput = z.infer<typeof cursorSchema>;

export const defaultQuizSelect = {
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

export type TQuizWithInteractions = {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  _count: {
    questions: number;
  };
  createdAt: Date;
  updatedAt: Date;
  interactions?: { favorited: boolean }[];
};

export type TQuizSelect = {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  _count: {
    questions: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type TQuizWithStats = {
  title: string;
  id: string;
  private: boolean;
  questions: {
    title: string;
    choices: string[];
    id: string;
    correct: number;
  }[];
  author: {
    id: string;
    name: string;
    createdAt: Date;
  };
  favorited: boolean;
  stats: {
    views: number;
    favorites: number;
  };
};

export const finishQuizSchema = z.object({
  quizId: z.string(),
  answers: z.array(
    z.object({
      id: z.string(),
      selected: z.number(),
    }),
  ),
});
export type TAnswers = z.infer<typeof finishQuizSchema>;

export const quizScoresSchema = z.object({
  quizId: z.string(),
  limit: z.number().max(20).default(10),
  cursor: z.date().nullish(),
  page: z.string(),
});
export type TQuizScoresInput = z.infer<typeof quizScoresSchema>;

export const searchSchema = offsetSchema
  .extend({
    query: z.string().min(3),
    sort: z.string(),
  })
  .omit({ sortBy: true });
export type TSearchInput = z.infer<typeof searchSchema>;

export enum Sort {
  best = 'Relevance',
  latest = 'Latest',
  oldest = 'Oldest',
  mostViewed = 'Most viewed',
  leastViewed = 'Least viewed',
}
