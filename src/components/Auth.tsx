import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

export interface AuthEnabledComponentConfig {
  auth: boolean;
}
export type ComponentWithAuth<PropsType = any> = React.FC<PropsType> &
  AuthEnabledComponentConfig;

const Auth: any = ({
  children,
  opts,
}: {
  children: ReactNode;
  opts: { role: 'USER' | 'ADMIN' };
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (status === 'loading') return;
    if (user) {
      if (opts.role === 'ADMIN' && user.role != 'ADMIN') {
        router.push('/');
      }
    }
    if (!user) router.push('/auth/login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status]);

  if (user) {
    if (opts.role === 'ADMIN' && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    return children;
  }

  return <div>loading...</div>;
};

export default Auth;
