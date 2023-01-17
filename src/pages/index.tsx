import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Home = () => {
  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <p className={styles.text}>
          Create custom <span>quizzes</span> for faster <span>learning</span>
        </p>
        <div className={styles.actions}>
          <button className={`${styles.defaultBtn} ${styles.outline}`}>
            Browse
          </button>
          <button className={styles.defaultBtn}>
            <Link href="/auth/sign-up">Get Started</Link>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Home;
