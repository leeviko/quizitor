import styles from '../styles/HomeFeed.module.css';
import QuizCard, { QuizCardSkeleton } from './QuizCard';

const HomeFeed = ({ result, title }: { result: any; title: string }) => {
  return (
    <section className={styles.container}>
      <h2>{title}</h2>
      <div className={styles.items}>
        {result.isLoading
          ? [...Array(6)].map((_, i) => <QuizCardSkeleton key={i} />)
          : result.data?.result.map((item: any) => (
              <QuizCard
                key={item.id}
                id={item.id}
                authorName={item.author.name}
                title={item.title}
                questionCount={item._count.questions}
                favorited={item.interactions && item.interactions[0]?.favorited}
              />
            ))}
      </div>
    </section>
  );
};

export default HomeFeed;
