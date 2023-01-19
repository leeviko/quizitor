import Image from 'next/image';

import styles from '../styles/QuizOverview.module.css';

type Props = {
  order: number;
  question: string;
  answer: string;
};

const QuizItem = ({ order, question, answer }: Props) => {
  return (
    <div className={styles.item}>
      <div className={`${styles.left} ${styles.column}`}>
        <span className={styles.number}>{order}.</span>
        <div className={`${styles.question} ${styles.text}`}>{question}</div>
      </div>
      <div className={`${styles.right} ${styles.column}`}>
        <div className={`${styles.answer} ${styles.text}`}>{answer}</div>
        <div className={styles.actions}>
          <button>
            <Image src="/icons/edit.svg" alt="Edit" width={24} height={24} />
          </button>
          <button>
            <Image
              src="/icons/delete.svg"
              alt="Delete"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizItem;
