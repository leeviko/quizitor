import Link from 'next/link';
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
  id,
  title,
  authorName,
  questionCount,
}: {
  id: string;
  title: string;
  authorName: string;
  questionCount: number;
}) => {
  const titleLength = 35;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        <Link href={`/quizzes/${id}`}>
          {title.slice(0, titleLength)}
          {title.length > titleLength && '...'}
        </Link>
      </h3>
      <span className={styles.tag}>{questionCount} Questions</span>
      <p className={styles.authorName}>
        Created by <strong>{authorName}</strong>
      </p>
    </div>
  );
};

export default QuizCard;
