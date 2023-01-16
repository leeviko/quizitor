import { prisma } from '~/server/prisma';
import { NextAuthOptions, unstable_getServerSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { userInputSchema } from '~/server/routers/user';
import bcrypt from 'bcrypt';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const creds = await userInputSchema.parseAsync(credentials);

        const user = await prisma.user.findFirst({
          where: { name: creds.name },
        });

        if (!user) {
          return null;
        }

        const valid = await bcrypt.compare(creds.password, user.password);

        if (valid) {
          return {
            id: user.id,
            name: user.name,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
  },
  secret: process.env.JWT_SECRET,
  jwt: {
    maxAge: 7 * 24 * 30 * 60, // 7 days
  },
  pages: {
    signIn: '/login',
    newUser: '/sign-up',
  },
};

export const requireAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await unstable_getServerSession(
      ctx.req,
      ctx.res,
      authOptions,
    );
    if (!session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    return await func(ctx);
  };
