import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import Loader from '~/components/Loader';
import Pagination from '~/components/Pagination';
import QuizCard from '~/components/QuizCard';
import styles from '~/styles/Search.module.css';
import { Sort, TQuizWithInteractions } from '~/types/quiz';
import { trpc } from '~/utils/trpc';

type TPagination = {
  currPage: number;
  numOfPages: number;
};

const Search = () => {
  const [query, setQuery] = useState('');
  const [ddActive, setDdActive] = useState(false);
  const sortOptions: Sort[] = [
    Sort.best,
    Sort.latest,
    Sort.oldest,
    Sort.mostViewed,
    Sort.leastViewed,
  ];
  const [params, setParams] = useState({
    limit: 10,
    currPage: 0,
    query: '',
    sort: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeOption, setActiveOption] = useState(sortOptions[0] ?? '');
  const [result, setResult] = useState<TQuizWithInteractions[] | undefined>();
  const [pagination, setPagination] = useState<TPagination | undefined>();
  const search = trpc.quiz.search.useQuery(params, { enabled: false });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query || query.length < 3) return;
    setParams({ limit: 10, currPage: 0, query, sort: activeOption });
    setSubmitted(true);
  };

  useEffect(() => {
    if (!submitted) return;
    const fetch = async () => {
      await search.refetch();
    };
    fetch();
    setSubmitted(false);
  }, [search, submitted]);

  useEffect(() => {
    if (search.data) {
      setResult(search.data.result);
      setPagination(search.data.pagination);
    }
  }, [search.data]);

  const handleChangeOpt = (opt: Sort) => {
    setDdActive(false);
    setActiveOption(opt);
  };

  const handlePagination = async (newPage: number) => {
    if (!pagination) return;
    // (newPage is off by one)
    if (newPage < 0 || newPage === pagination.numOfPages) return;
    setParams({
      ...params,
      currPage: newPage,
    });
    setSubmitted(true);
  };

  return (
    <div className={`center ${styles.container}`}>
      <form onSubmit={handleSubmit} className={styles.inputField}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a quiz"
        />
        <button type="submit" className={`${styles.submitBtn}`}>
          <Image src="/icons/search.svg" alt="search" width={24} height={24} />
        </button>
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
            <span>{activeOption}</span>
            <Image
              src="/icons/expand.svg"
              alt="expand"
              width={24}
              height={24}
            />
          </button>
          <div className={styles.dropdownOpts}>
            {sortOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleChangeOpt(opt)}
                className={`${activeOption === opt && styles.active}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </form>
      <div className={styles.result}>
        {search.status === 'success' && (
          <p>Results for &apos;{params.query}&apos;</p>
        )}
        <div className={styles.items}>
          {search.isLoading && submitted ? (
            <Loader />
          ) : (
            result?.map((item) => (
              <QuizCard
                key={item.id}
                id={item.id}
                authorName={item.author.name}
                title={item.title}
                questionCount={item._count.questions}
                favorited={item.interactions && item.interactions[0]?.favorited}
              />
            ))
          )}
          {search.status === 'success' && !result?.length && (
            <p>No results found </p>
          )}
        </div>
      </div>
      {pagination && (
        <Pagination {...pagination} handlePagination={handlePagination} />
      )}
    </div>
  );
};

export default Search;
