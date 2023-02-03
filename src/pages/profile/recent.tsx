import QuizCard, { QuizCardSkeleton } from '~/components/QuizCard';
import ProfileLayout from '~/layouts/ProfileLayout';
import { trpc } from '~/utils/trpc';

import styles from '~/styles/ProfileCards.module.css';

const ProfileRecent = () => {
  const result = trpc.quiz.userRecent.useQuery({
    limit: 10,
    skip: 0,
    sortBy: '',
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
                  authorName={item.quiz.author.name}
                  title={item.quiz.title}
                  questionCount={item.quiz._count.questions}
                />
              ))}
        </div>
      </div>
    </ProfileLayout>
  );
};

ProfileRecent.auth = { role: 'USER' };

export default ProfileRecent;
