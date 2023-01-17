import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    role: 'USER' | 'ADMIN';
    createdAt: Date;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      role: 'USER' | 'ADMIN';
      createdAt: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    role: 'USER' | 'ADMIN';
    sub: string;
  }
}
