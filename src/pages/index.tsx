import { useSession } from 'next-auth/react';
import { AuthHeader, Header } from '~/components/Header';
import Recent from '~/components/Recent';

const Home = () => {
  const { data, status } = useSession();

  return (
    <>
      {status !== 'loading' && (
        <>
          {status === 'authenticated' ? (
            <>
              <AuthHeader username={data.user.name} />
              <Recent />
            </>
          ) : (
            <Header />
          )}
        </>
      )}
    </>
  );
};

export default Home;
