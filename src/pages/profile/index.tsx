import QuizCard, { QuizCardSkeleton } from '~/components/QuizCard';
import ProfileLayout from '~/layouts/ProfileLayout';
import { trpc } from '~/utils/trpc';

import styles from '../../styles/ProfileCards.module.css';

const ProfileMyQuizzes = () => {
  const result = trpc.quiz.recent.useQuery({
    limit: 10,
    cursor: null,
    page: 'next',
  });

  return (
    <ProfileLayout>
      <div className={styles.content}>
        <div className={styles.items}>
          {result.isLoading
            ? [...Array(6)].map((i) => <QuizCardSkeleton key={i} />)
            : result.data?.result.map((item) => (
                <QuizCard
                  key={item.id}
                  id={item.id}
                  authorName={item.author.name}
                  title={item.title}
                  questionCount={item._count.questions}
                />
              ))}
        </div>
      </div>
    </ProfileLayout>
  );
};

ProfileMyQuizzes.auth = { role: 'USER' };

export default ProfileMyQuizzes;
