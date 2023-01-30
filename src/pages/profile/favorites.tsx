import { NextPage } from 'next';
import QuizCard, { QuizCardSkeleton } from '~/components/QuizCard';
import ProfileLayout from '~/layouts/ProfileLayout';
import { trpc } from '~/utils/trpc';

import styles from '../../styles/ProfileCards.module.css';

const ProfileRecent: NextPage = () => {
  const result = trpc.quiz.favorites.useQuery({
    limit: 10,
    skip: 0,
    sortBy: '',
  });

  return (
    <ProfileLayout>
      <div className={styles.content}>
        <div className={styles.items}>
          {result.isLoading
            ? [...Array(6)].map((i) => <QuizCardSkeleton key={i} />)
            : result.data?.result.map((item) => (
                <QuizCard
                  key={item.quiz.id}
                  id={item.quiz.id}
                  authorName={item.quiz.author.name}
                  title={item.quiz.title}
                  questionCount={item.quiz._count.questions}
                  favorited={item.favorited}
                />
              ))}
        </div>
      </div>
    </ProfileLayout>
  );
};

export default ProfileRecent;
