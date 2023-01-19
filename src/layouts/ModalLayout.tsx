import { ReactElement } from 'react';

import styles from '../styles/ModalLayout.module.css';

type DefaultLayoutProps = {
  children: ReactElement;
  pageProps: { title: string };
};

const ModalLayout = ({ children, pageProps }: DefaultLayoutProps) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h2>{pageProps.title}</h2>
          <div className={styles.modal}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default ModalLayout;
