import Image from 'next/image';
import { FormEvent, useState } from 'react';
import styles from '~/styles/Search.module.css';

enum Sort {
  best = 'Best match',
  latest = 'Latest',
  oldest = 'Oldest',
  mostViewed = 'Most viewed',
  leastViewed = 'Least viewed',
}

const Search = () => {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<Sort>(Sort.best);
  const [ddActive, setDdActive] = useState(false);
  const sortOptions: Sort[] = [
    Sort.best,
    Sort.latest,
    Sort.oldest,
    Sort.mostViewed,
    Sort.leastViewed,
  ];
  const [activeOption, setActiveOption] = useState(sortOptions[0]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChangeOpt = (opt: Sort) => {
    setDdActive(false);
    setActiveOption(opt);
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
        <div className={styles.dropdown}>
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
          <div
            className={`${styles.dropdownOpts} ${
              ddActive ? styles.open : styles.closed
            }`}
          >
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
    </div>
  );
};

export default Search;
