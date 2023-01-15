import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';
import { unknown, z } from 'zod';
import { prisma } from '~/server/prisma';

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  createdAt: true,
  role: true,
});

export const userRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const user = await prisma.user.findUnique({
        where: { id },
        select: defaultUserSelect,
      });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }
    }),
});
