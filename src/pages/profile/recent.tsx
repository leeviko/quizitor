import { NextPage } from 'next';
import QuizCard, { QuizCardSkeleton } from '~/components/QuizCard';
import ProfileLayout from '~/layouts/ProfileLayout';
import { trpc } from '~/utils/trpc';

import styles from '../../styles/ProfileRecent.module.css';

const ProfileRecent: NextPage = () => {
  const result = trpc.quiz.quizzes.useQuery({
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
                  questionCount={item.questions.length}
                />
              ))}
        </div>
      </div>
    </ProfileLayout>
  );
};

export default ProfileRecent;
