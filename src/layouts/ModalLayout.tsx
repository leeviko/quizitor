import { ReactElement } from 'react';

import styles from '~/styles/ModalLayout.module.css';

type DefaultLayoutProps = {
  children: ReactElement;
  pageProps: { title: string; wide?: boolean };
};

const ModalLayout = ({
  children,
  pageProps: { title, wide = false },
}: DefaultLayoutProps) => {
  return (
    <>
      <div className={`${wide ? styles.wide : styles.default}`}>
        <div className={`${styles.left} ${styles.block}`}>
          <div className={styles.blockBottom}></div>
        </div>
        <div className={styles.wrapper}>
          <h2 className={styles.pageTitle}>{title}</h2>
          <div className={styles.modal}>{children}</div>
        </div>
        <div className={`${styles.right} ${styles.block}`}>
          <div className={styles.blockBottom}></div>
        </div>
      </div>
    </>
  );
};

export default ModalLayout;
