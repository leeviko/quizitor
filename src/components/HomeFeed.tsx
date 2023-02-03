import Image from 'next/image';
import Link from 'next/link';
import styles from '~/styles/HomeFeed.module.css';
import Loader from './Loader';
import QuizCard from './QuizCard';

const HomeFeed = ({ result, title }: { result: any; title: string }) => {
  return (
    <section className={styles.container}>
      <h2 className={title === 'Recent' ? styles.recent : ''}>{title}</h2>
      <div
        className={styles.items}
        style={{ height: result.isFetching ? '250px' : 'auto' }}
      >
        {result.isFetching ? (
          <Loader />
        ) : (
          <>
            {result.data?.result.map((item: any) => (
              <QuizCard
                key={item.id}
                id={item.id}
                authorName={item.author.name}
                title={item.title}
                questionCount={item._count.questions}
                favorited={item.interactions && item.interactions[0]?.favorited}
              />
            ))}
            <button className={styles.browseBtn}>
              <Link href="/browse">See more</Link>
            </button>
          </>
        )}
        {!result.isFetching && !result.data.result.length && (
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
