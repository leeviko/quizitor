import { useSession } from 'next-auth/react';
import { AuthHeader, Header } from '~/components/Header';
import Recent from '~/components/Recent';

const Home = () => {
  const { data, status } = useSession();

  return (
    <>
      <div className="center">
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
      </div>
    </>
  );
};

export default Home;
