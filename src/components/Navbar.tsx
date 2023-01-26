import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import styles from '../styles/Nav.module.css';

const Navbar = () => {
  const { status } = useSession();
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        Quizitor
      </Link>
      <div className={styles.items}>
        {status === 'unauthenticated' && (
          <>
            <Link href="/auth/sign-up">Sign Up</Link>
            <Link href="/auth/login">Login</Link>
          </>
        )}
        {status === 'authenticated' && (
          <>
            <Link href="/profile">Profile</Link>
            <Link href="#" onClick={() => signOut({ callbackUrl: '/' })}>
              Log out
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
