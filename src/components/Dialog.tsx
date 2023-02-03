import styles from '~/styles/Dialog.module.css';
export type TDialogContent = {
  message: string;
  title?: string;
  yes?: string;
  no?: string;
  onConfirm?: () => void;
  onClose?: () => void;
};

const Dialog = ({
  title,
  message,
  yes = 'Yes',
  no,
  onConfirm,
  onClose,
}: TDialogContent) => {
  return (
    <div className={styles.dialog}>
      <div className={styles.dialogContainer}>
        {title && <h3 className={styles.dialogTitle}>{title}</h3>}
        <p className={styles.dialogMsg}>{message}</p>
        <div className={styles.dialogActions}>
          <button className={styles.yesBtn} onClick={onConfirm}>
            {yes}
          </button>
          {no && (
            <button className={styles.noBtn} onClick={onClose}>
              {no}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
