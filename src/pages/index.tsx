import { useSession } from 'next-auth/react';
import { AuthHeader, Header } from '~/components/Header';
import { trpc } from '~/utils/trpc';

import HomeFeed from '~/components/HomeFeed';

const Home = () => {
  const { data, status } = useSession();
  const recentResult = trpc.quiz.recent.useQuery({
    limit: 6,
    cursor: null,
    page: 'next',
  });
  const popularResult = trpc.quiz.quizList.useQuery({
    skip: 0,
    limit: 6,
    sortBy: 'views',
  });

  return (
    <>
      <div className="center">
        {status !== 'loading' && (
          <>
            {status === 'authenticated' ? (
              <>
                <AuthHeader username={data.user.name} />
                <HomeFeed result={recentResult} title="Recent" />
                <HomeFeed result={popularResult} title="Popular" />
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
