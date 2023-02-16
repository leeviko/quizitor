import Link from 'next/link';
import common from '~/styles/Common.module.css';
import styles from '~/styles/Header.module.css';

export const Header = () => {
  return (
    <header className={styles.notLogged}>
      <div className={styles.wrapper}>
        <p className={styles.text}>
          Browse and create <span>quizzes</span> for faster{' '}
          <span>learning</span>
        </p>
        <div className={styles.actions}>
          <button
            className={`${common.defaultBtn} ${common.enabled} ${common.outline}`}
          >
            <Link href="/search">Browse</Link>
          </button>
          <button className={`${common.defaultBtn} ${common.enabled}`}>
            <Link href="/auth/sign-up">Get Started</Link>
          </button>
        </div>
      </div>
    </header>
  );
};

export const AuthHeader = ({ username }: { username: string }) => {
  return (
    <header className={styles.loggedIn}>
      <div className={styles.wrapper}>
        <p className={styles.text}>
          Hello, <span>{username}</span>! What would you like to do?
        </p>
        <div className={styles.actions}>
          <button
            className={`${common.defaultBtn} ${common.enabled} ${common.outline}`}
          >
            <Link href="/search">Browse</Link>
          </button>
          <button className={`${common.defaultBtn} ${common.enabled}`}>
            <Link href="/create-quiz">Create Quizzes</Link>
          </button>
        </div>
      </div>
    </header>
  );
};
