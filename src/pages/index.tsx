import { useSession } from 'next-auth/react';
import { AuthHeader, Header } from '~/components/Header';
import { trpc } from '~/utils/trpc';

import HomeFeed from '~/components/HomeFeed';
import { useEffect } from 'react';

const Home = () => {
  const { data, status } = useSession();
  const result = trpc.quiz.recent.useQuery(
    {
      limit: 6,
      cursor: null,
      page: 'next',
    },
    { refetchOnWindowFocus: false, enabled: false },
  );

  useEffect(() => {
    if (status === 'authenticated') result.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <>
      <div className="center">
        {status !== 'loading' && (
          <>
            {status === 'authenticated' ? (
              <>
                <AuthHeader username={data.user.name} />
                <HomeFeed
                  result={result.data}
                  status={result.status}
                  loading={result.isFetching}
                  title="Recent"
                />
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
