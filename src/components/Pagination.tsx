import styles from '~/styles/Pagination.module.css';

type Props = {
  currPage: number;
  numOfPages: number;
  handlePagination: (newPage: number) => void;
};

const Pagination = ({ currPage, numOfPages, handlePagination }: Props) => {
  return (
    <div className={styles.pagination}>
      <div className={styles.wrapper}>
        <button
          className={styles.prevBtn}
          onClick={() => handlePagination(currPage - 1)}
        >
          {'<'}
        </button>
        <ul className={styles.pages}>
          {[...Array(numOfPages)].map((page, i) => (
            <li
              key={i}
              className={`${currPage === i && styles.current}`}
              onClick={() => handlePagination(i)}
            >
              {i + 1}
            </li>
          ))}
        </ul>
        <button
          className={styles.nextBtn}
          onClick={() => handlePagination(currPage + 1)}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
