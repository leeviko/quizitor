import styles from '../styles/QuizCard.module.css';

const QuizCard = ({
  title,
  authorName,
  questionCount,
}: {
  title: string;
  authorName: string;
  questionCount: number;
}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <span className={styles.tag}>{questionCount} Questions</span>
      <p className={styles.authorName}>
        Created by <strong>{authorName}</strong>
      </p>
    </div>
  );
};

export default QuizCard;
