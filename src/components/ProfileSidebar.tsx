import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '~/styles/ProfileSidebar.module.css';

const ProfileSidebar = () => {
  const path = useRouter().pathname;

  return (
    <div className={styles.sidebar}>
      <h4 className={styles.sectionTitle}>Quizzes</h4>
      <div
        className={`${styles.item} ${
          path === '/profile' ? styles.active : styles.unactive
        }`}
      >
        <Link href="/profile">My quizzes</Link>
      </div>
      <div
        className={`${styles.item} ${
          path === '/profile/recent' ? styles.active : styles.unactive
        }`}
      >
        <Link href="/profile/recent">Recently viewed</Link>
      </div>
      <div
        className={`${styles.item} ${
          path === '/profile/favorites' ? styles.active : styles.unactive
        }`}
      >
        <Link href="/profile/favorites">Favorites</Link>
      </div>
    </div>
  );
};

export default ProfileSidebar;
