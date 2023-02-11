import Image from 'next/image';

import styles from '~/styles/QuizItem.module.css';

type Props = {
  index: number;
  title: string;
  answer: string;
  handleDelete?: (index: number) => void;
  handleEdit?: (index: number) => void;
  correct?: boolean;
};

const QuizItem = ({
  index,
  title,
  answer,
  handleDelete,
  handleEdit,
  correct,
}: Props) => {
  return (
    <div
      className={`${styles.item} ${
        correct !== undefined && (correct ? styles.green : styles.red)
      }`}
    >
      <div className={`${styles.left} ${styles.column}`}>
        <span className={styles.number}>{index + 1}.</span>
        <div className={`${styles.question} ${styles.text}`}>{title}</div>
      </div>
      <div className={`${styles.right} ${styles.column}`}>
        <div className={`${styles.answer} ${styles.text}`}>{answer}</div>
        <div className={styles.actions}>
          {handleEdit && handleDelete && (
            <>
              <button onClick={() => handleEdit(index)}>
                <Image
                  src="/icons/edit.svg"
                  alt="Edit"
                  width={24}
                  height={24}
                />
              </button>
              <button onClick={() => handleDelete(index)}>
                <Image
                  src="/icons/delete.svg"
                  alt="Delete"
                  width={24}
                  height={24}
                />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizItem;
