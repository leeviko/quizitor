import { ReactElement } from 'react';

import styles from '../styles/ModalLayout.module.css';

type DefaultLayoutProps = {
  children: ReactElement;
  pageProps: { title: string };
};

const ModalLayout = ({ children, pageProps }: DefaultLayoutProps) => {
  return (
    <>
      <div className={styles.top}></div>
      <div className={styles.container}>
        <div className={`${styles.left} ${styles.block}`}>
          <div className={styles.blockTop}></div>
          <div className={styles.blockBottom}></div>
        </div>
        <div className={styles.wrapper}>
          <h2>{pageProps.title}</h2>
          <div className={styles.modal}>{children}</div>
        </div>
        <div className={`${styles.right} ${styles.block}`}>
          <div className={styles.blockTop}></div>
          <div className={styles.blockBottom}></div>
        </div>
      </div>
    </>
  );
};

export default ModalLayout;
