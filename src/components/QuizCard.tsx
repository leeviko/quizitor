import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { trpc } from '~/utils/trpc';
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
  favorited,
}: {
  id: string;
  title: string;
  authorName: string;
  questionCount: number;
  favorited?: boolean;
}) => {
  const titleLength = 35;
  const [favorite, setFavorite] = useState<boolean | undefined>(favorited);
  const { status } = useSession();
  const { mutateAsync } = trpc.quiz.favorite.useMutation();

  const favoriteQuiz = async () => {
    const result = await mutateAsync({
      id,
    });
    if (typeof result.favorited === 'boolean') {
      setFavorite(result.favorited);
    }
  };

  useEffect(() => {
    if (favorite === undefined) setFavorite(favorited);
  }, [favorite, favorited]);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        <Link href={`/quizzes/${id}`}>
          {title.slice(0, titleLength)}
          {title.length > titleLength && '...'}
        </Link>
      </h3>
      <span className={styles.tag}>{questionCount} Questions</span>
      {status === 'authenticated' && (
        <span className={styles.favorite} onClick={favoriteQuiz}>
          {favorite ? (
            <Image
              src="/icons/star_filled.svg"
              alt="favorite"
              width={24}
              height={24}
            />
          ) : (
            <Image
              src="/icons/star.svg"
              alt="favorite"
              width={24}
              height={24}
            />
          )}
        </span>
      )}
      <p className={styles.authorName}>
        Created by <strong>{authorName}</strong>
      </p>
    </div>
  );
};

export default QuizCard;
