import QuizCard, { QuizCardSkeleton } from '~/components/QuizCard';
import ProfileLayout from '~/layouts/ProfileLayout';
import { trpc } from '~/utils/trpc';

import styles from '~/styles/ProfileCards.module.css';
import { useSession } from 'next-auth/react';

const ProfileMyQuizzes = () => {
  const { data } = useSession();
  const result = trpc.quiz.userQuizzes.useQuery({
    limit: 10,
    cursor: null,
    page: 'next',
    id: data?.user.id ?? '',
  });

  return (
    <ProfileLayout>
      <div className={styles.content}>
        <div className={styles.items}>
          {result.isLoading
            ? [...Array(6)].map((_, i) => <QuizCardSkeleton key={i} />)
            : result.data?.result.map((item) => (
                <QuizCard
                  key={item.id}
                  id={item.id}
                  authorName={item.author.name}
                  title={item.title}
                  questionCount={item._count.questions}
                  favorited={
                    item.interactions && item.interactions[0]?.favorited
                  }
                />
              ))}
        </div>
      </div>
    </ProfileLayout>
  );
};

ProfileMyQuizzes.auth = { role: 'USER' };

export default ProfileMyQuizzes;
