import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const userInputSchema = z.object({
  name: z.string().min(3).max(25).trim(),
  password: z.string().min(4).trim(),
});

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  createdAt: true,
  role: true,
});

export type TLogin = z.infer<typeof userInputSchema>;
export type TSignUp = z.infer<typeof userInputSchema>;
