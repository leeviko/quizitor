import { useSession } from 'next-auth/react';
import { AuthHeader, Header } from '~/components/Header';
import { trpc } from '~/utils/trpc';

import HomeFeed from '~/components/HomeFeed';

const Home = () => {
  const { data, status } = useSession();
  const result = trpc.quiz.recent.useQuery({
    limit: 6,
    cursor: null,
    page: 'next',
  });

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
