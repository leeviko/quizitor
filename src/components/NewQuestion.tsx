import Image from 'next/image';
import { useState } from 'react';

import styles from '../styles/NewQuestion.module.css';

const NewQuestion = () => {
  const [queTitle, setQueTitle] = useState('');

  return (
    <div className={styles.content}>
      <div className={styles.titleInput}>
        <span className={styles.title}>Question title</span>
        <input
          type="text"
          placeholder="How much is 2 + 2?"
          value={queTitle}
          onChange={(e) => setQueTitle(e.target.value)}
        />
      </div>
      <div className={styles.choices}>
        <div className={styles.choice}>
          <div>
            <p className={styles.choiceTitle}>
              1. choice <span>*</span>
            </p>
            <div className={styles.choiceInputContainer}>
              <input type="text" />
            </div>
          </div>
        </div>

        <div className={styles.choice}>
          <div>
            <p className={styles.choiceTitle}>
              2. choice <span>*</span>
            </p>
            <div className={styles.choiceInputContainer}>
              <input type="text" />
            </div>
          </div>
        </div>

        <div className={styles.choice}>
          <div>
            <p className={styles.choiceTitle}>3. choice</p>
            <div className={styles.choiceInputContainer}>
              <input type="text" />
            </div>
          </div>
        </div>

        <div className={styles.choice}>
          <div>
            <p className={styles.choiceTitle}>4. choice</p>
            <div className={styles.choiceInputContainer}>
              <input type="text" />
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.return}>
            <Image src="/icons/back.svg" alt="Return" width={24} height={24} />
            <span>Return</span>
          </button>
          <button className={styles.defaultBtn}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default NewQuestion;
