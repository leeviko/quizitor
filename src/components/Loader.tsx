import styles from '~/styles/Loader.module.css';

const Loader = ({ fullscreen = false }: { fullscreen?: boolean }) => {
  return (
    <div
      className={`${styles.loader} ${fullscreen && styles.fullscreen}`}
    ></div>
  );
};

export default Loader;
