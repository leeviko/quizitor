import styles from '../styles/Recent.module.css';
import QuizCard from './QuizCard';

const Recent = () => {
  return (
    <section className={styles.container}>
      <h2>Recent</h2>
      <div className={styles.items}>
        <QuizCard
          authorName="Ukko123"
          title="Lorem ipsum dolor sit amet, consectetur"
          questionCount={20}
        />
        <QuizCard
          authorName="Ukko123"
          title="Lorem ipsum dolor sit amet, consectetur"
          questionCount={20}
        />
        <QuizCard
          authorName="Ukko123"
          title="Lorem ipsum dolor sit amet, consectetur"
          questionCount={20}
        />
        <QuizCard
          authorName="Ukko123"
          title="Lorem ipsum dolor sit amet, consectetur"
          questionCount={20}
        />
        <QuizCard
          authorName="Ukko123"
          title="Lorem ipsum dolor sit amet, consectetur"
          questionCount={20}
        />
        <QuizCard
          authorName="Ukko123"
          title="Lorem ipsum dolor sit amet, consectetur"
          questionCount={20}
        />
      </div>
    </section>
  );
};

export default Recent;
