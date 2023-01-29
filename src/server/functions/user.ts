import { prisma } from '~/server/prisma';
import { TRPCError } from '@trpc/server';
import { defaultUserSelect } from '~/types/user';
import bcrypt from 'bcrypt';
import { TSignUp } from '~/types/user';

// ----------------
// Get user by id
// ----------------
export async function getUserById(id: string) {
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
}

// ----------------
// Create user
// ----------------
export async function createUser(data: TSignUp) {
  const { name, password } = data;

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
}
