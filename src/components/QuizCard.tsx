import Skeleton from 'react-loading-skeleton';
import styles from '../styles/QuizCard.module.css';

export const QuizCardSkeleton = () => {
  return (
    <div className={`${styles.card} ${styles.skeleton}`}>
      <Skeleton
        baseColor="var(--skeleton-bg)"
        highlightColor="var(--skeleton-hg)"
        height={75}
      />
      <Skeleton
        baseColor="var(--skeleton-bg)"
        highlightColor="var(--skeleton-hg)"
        height={25}
      />
    </div>
  );
};

const QuizCard = ({
  title,
  authorName,
  questionCount,
}: {
  title: string;
  authorName: string;
  questionCount: number;
}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <span className={styles.tag}>{questionCount} Questions</span>
      <p className={styles.authorName}>
        Created by <strong>{authorName}</strong>
      </p>
    </div>
  );
};

export default QuizCard;
