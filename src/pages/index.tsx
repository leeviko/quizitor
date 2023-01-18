import { useSession } from 'next-auth/react';
import { AuthHeader, Header } from '~/components/Header';

const Home = () => {
  const { data, status } = useSession();

  return (
    <>
      {status !== 'loading' && (
        <>
          {status === 'authenticated' ? (
            <AuthHeader username={data.user.name} />
          ) : (
            <Header />
          )}
        </>
      )}
    </>
  );
};

export default Home;
