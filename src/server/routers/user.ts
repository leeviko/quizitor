import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { userInputSchema } from '~/types/user';
import { createUser, getUserById } from '../functions/user';

export const userRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return getUserById(input.id);
    }),
  create: publicProcedure.input(userInputSchema).mutation(async ({ input }) => {
    return createUser(input);
  }),
});
