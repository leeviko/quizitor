import Image from 'next/image';
import { MouseEvent, useEffect, useState } from 'react';
import Loader from '~/components/Loader';
import Pagination from '~/components/Pagination';
import QuizCard from '~/components/QuizCard';
import { TQuizWithInteractions } from '~/types/quiz';
import { trpc } from '~/utils/trpc';

import styles from '~/styles/Search.module.css';
import common from '~/styles/Common.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

type TPagination = {
  currPage: number;
  numOfPages: number;
};

type TList = 'favorites' | 'views' | 'date';

const Search = () => {
  const router = useRouter();
  const sortBy = router.query.sortBy as TList;
  const [ddActive, setDdActive] = useState(false);
  const [activeOption, setActiveOption] = useState<'desc' | 'asc'>('desc');
  const [params, setParams] = useState({
    limit: 10,
    currPage: 0,
    sortBy,
    orderBy: activeOption,
  });
  const [result, setResult] = useState<TQuizWithInteractions[] | undefined>();
  const [pagination, setPagination] = useState<TPagination | undefined>();
  const search = trpc.quiz.quizList.useQuery(params, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!['favorites', 'views', 'date'].includes(sortBy)) {
      router.replace('/search');
    }
  }, [sortBy, router]);

  useEffect(() => {
    if (activeOption === params.orderBy && sortBy === params.sortBy) return;
    setParams({ ...params, orderBy: activeOption, sortBy });
  }, [activeOption, sortBy, params]);

  useEffect(() => {
    if (search.data && !search.isError) {
      setResult(search.data.result);
      setPagination(search.data.pagination);
    }
  }, [search.data, search.isError]);

  const handleChangeOpt = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    opt: 'desc' | 'asc',
  ) => {
    e.preventDefault();
    setDdActive(false);
    setActiveOption(opt);
  };

  const handlePagination = async (newPage: number) => {
    if (!pagination || pagination.numOfPages === 0) return;
    if (newPage < 0 || newPage === pagination.numOfPages) return;
    setParams({
      ...params,
      currPage: newPage,
    });
  };

  return (
    <>
      <Head>
        <title>Quizitor - Browse quizzes</title>
      </Head>
      <div className={`center ${styles.container}`}>
        <div className={styles.sidebar}>
          <h2>Sort by:</h2>
          <Link href="views">Views</Link>
          <Link href="favorites">Favorites</Link>
          <Link href="date">Date</Link>
        </div>
        <div className={styles.resultContainer}>
          <Link href="/search" className={styles.back}>
            <Image src="/icons/back.svg" alt="back" width={24} height={24} />{' '}
            Back to search
          </Link>
          <form className={styles.inputField}>
            <div
              className={`${styles.dropdown} ${
                ddActive ? styles.open : styles.closed
              }`}
            >
              <button
                type="button"
                onClick={() => setDdActive(!ddActive)}
                className={styles.selectBtn}
              >
                <span>
                  {activeOption.charAt(0).toUpperCase() + activeOption.slice(1)}
                </span>
                <Image
                  src="/icons/expand.svg"
                  alt="expand"
                  width={24}
                  height={24}
                />
              </button>
              <div className={styles.dropdownOpts}>
                {['desc', 'asc'].map((opt) => (
                  <button
                    key={opt}
                    onClick={(e) => handleChangeOpt(e, opt as 'desc' | 'asc')}
                    className={`${activeOption === opt && styles.active}`}
                  >
                    {opt === 'desc' ? 'Descending' : 'Ascending'}
                  </button>
                ))}
              </div>
            </div>
          </form>
          <div className={styles.result}>
            <div className={styles.items}>
              {search.isFetching ? (
                <Loader />
              ) : (
                result?.map((item) => (
                  <QuizCard
                    key={item.id}
                    id={item.id}
                    authorName={item.author.name}
                    title={item.title}
                    questionCount={item._count.questions}
                    favorited={
                      item.interactions && item.interactions[0]?.favorited
                    }
                  />
                ))
              )}
              {(search.status === 'success' || search.status === 'error') &&
                !result?.length && (
                  <div className={common.noResults}>
                    <Image
                      src="/images/empty.svg"
                      alt="Empty"
                      width={144}
                      height={144}
                    />
                    <span>
                      {search.status === 'error'
                        ? search.error.message
                        : 'No quizzes found.'}
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
        {pagination && pagination.numOfPages > 0 && (
          <Pagination {...pagination} handlePagination={handlePagination} />
        )}
      </div>
    </>
  );
};

export default Search;
