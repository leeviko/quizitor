import Link from 'next/link';
import styles from '../styles/Header.module.css';

export const Header = () => {
  return (
    <header className={`${styles.header} ${styles.notLogged}`}>
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

export const AuthHeader = ({ username }: { username: string }) => {
  return (
    <header className={`${styles.header} ${styles.loggedIn}`}>
      <div className={styles.wrapper}>
        <p className={styles.text}>
          Hello, <span>{username}</span>! What would you like to do?
        </p>
        <div className={styles.actions}>
          <button className={`${styles.defaultBtn} ${styles.outline}`}>
            Browse
          </button>
          <button className={styles.defaultBtn}>
            <Link href="/profile/create">Create Quizzes</Link>
          </button>
        </div>
      </div>
    </header>
  );
};
