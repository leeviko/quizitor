import { ReactElement } from 'react';
import ProfileSidebar from '~/components/ProfileSidebar';

import styles from '../styles/ProfileLayout.module.css';

import ModalLayout from './ModalLayout';

type DefaultLayoutProps = {
  children: ReactElement;
};

const ProfileLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <ModalLayout pageProps={{ title: 'Profile', wide: true }}>
      <div className={styles.wrapper}>
        <ProfileSidebar />
        {children}
      </div>
    </ModalLayout>
  );
};

export default ProfileLayout;
