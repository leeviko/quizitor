import { prisma } from '~/server/prisma';
import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { userInputSchema } from '~/types/auth';

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
          throw new Error('Wrong username or password');
        }

        const valid = await bcrypt.compare(creds.password, user.password);

        if (valid) {
          return {
            id: user.id,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
          };
        }
        throw new Error('Wrong username or password');
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
  jwt: {
    maxAge: 7 * 24 * 30 * 60, // 7 days
  },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/sign-up',
  },
};

// export const requireAuth =
//   (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
//     const session = await unstable_getServerSession(
//       ctx.req,
//       ctx.res,
//       authOptions,
//     );
//     if (!session) {
//       return {
//         redirect: {
//           destination: '/login',
//           permanent: false,
//         },
//       };
//     }
//     return await func(ctx);
//   };

// export const requireAdmin =
//   (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
//     const session = await unstable_getServerSession(
//       ctx.req,
//       ctx.res,
//       authOptions,
//     );
//     if (!session || session.user.role !== 'ADMIN') {
//       return {
//         redirect: {
//           destination: '/',
//           permanent: true,
//         },
//       };
//     }
//     return await func(ctx);
//   };
