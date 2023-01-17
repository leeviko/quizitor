import * as z from 'zod';

export const userInputSchema = z.object({
  name: z.string().min(3),
  password: z.string().min(6),
});

export type TLogin = z.infer<typeof userInputSchema>;
export type TSignUp = z.infer<typeof userInputSchema>;
