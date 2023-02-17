import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import Loader from './Loader';

export interface AuthEnabledComponentConfig {
  auth: boolean;
}
export type ComponentWithAuth<PropsType = any> = React.FC<PropsType> &
  AuthEnabledComponentConfig;

type Props = {
  children: ReactNode;
  opts: { role: 'USER' | 'ADMIN'; loader?: boolean };
};

const Auth: any = ({ children, opts: { loader = true, role } }: Props) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (status === 'loading') return;
    if (user) {
      if (role === 'ADMIN' && user.role !== 'ADMIN') {
        router.push('/');
      }
    }
    if (!user) router.push('/auth/login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status]);

  if (user) {
    if (role === 'ADMIN' && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    return children;
  }
  if (loader) return <Loader fullscreen />;
};

export default Auth;
