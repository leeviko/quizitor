import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import bcrypt from 'bcrypt';
import { userInputSchema } from '~/types/auth';

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
      return {
        status: 200,
        result: user,
      };
    }),
  create: publicProcedure.input(userInputSchema).mutation(async ({ input }) => {
    const { name, password } = input;

    const exists = await prisma.user.findFirst({ where: { name } });
    if (exists) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Username is already taken',
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await prisma.user.create({
      data: { name, password: hash },
      select: defaultUserSelect,
    });

    return {
      status: 201,
      result,
      message: 'User created successfully',
    };
  }),
});
