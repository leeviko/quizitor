import { useSession } from 'next-auth/react';
import Link from 'next/link';

import styles from '../styles/Nav.module.css';

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        Quizitor
      </Link>
      <div className={styles.items}>
        <Link href="/auth/sign-up">Sign Up</Link>
        <Link href="/auth/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
