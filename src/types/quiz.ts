import { z } from 'zod';

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
  private: z.boolean(),
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
export type TQuizInput = z.infer<typeof quizInputSchema>;

export const favoriteInputSchema = z.object({
  id: z.string(),
});

export const offsetSchema = z.object({
  skip: z.number().default(0),
  limit: z.number().max(20).default(10),
  sortBy: z.string(),
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
