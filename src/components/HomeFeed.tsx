import Image from 'next/image';
import Link from 'next/link';
import styles from '~/styles/HomeFeed.module.css';
import { TQuizWithInteractions } from '~/types/quiz';
import Loader from './Loader';
import QuizCard from './QuizCard';

type TResult =
  | {
      status: number;
      result: TQuizWithInteractions[];
      cursor: {
        prev: string | null;
        next: string | null;
      };
    }
  | undefined;

type Props = {
  result: TResult;
  loading: boolean;
  title: string;
};

const HomeFeed = ({ result, loading, title }: Props) => {
  const quizzes = result?.result;

  return (
    <section className={styles.container}>
      <h2 className={title === 'Recent' ? styles.recent : ''}>{title}</h2>
      <div
        className={styles.items}
        style={{ height: loading ? '250px' : 'auto' }}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            {quizzes?.map((item: any) => (
              <QuizCard
                key={item.id}
                id={item.id}
                authorName={item.author.name}
                title={item.title}
                questionCount={item._count.questions}
                favorited={item.interactions && item.interactions[0]?.favorited}
              />
            ))}
            {quizzes?.length === 6 && (
              <button className={styles.browseBtn}>
                <Link href="/browse">See more</Link>
              </button>
            )}
          </>
        )}
        {!loading && !quizzes?.length && (
          <div className={styles.noResults}>
            <Image
              src="/images/empty.svg"
              alt="Empty"
              width={144}
              height={144}
            />
            <span>No quizzes found</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeFeed;
