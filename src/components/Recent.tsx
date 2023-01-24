import { trpc } from '~/utils/trpc';
import styles from '../styles/Recent.module.css';
import QuizCard, { QuizCardSkeleton } from './QuizCard';

const Recent = () => {
  const result = trpc.quiz.quizzes.useQuery({
    limit: 6,
    cursor: null,
    page: 'next',
  });

  return (
    <section className={styles.container}>
      <h2>Recent</h2>
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
    </section>
  );
};

export default Recent;
