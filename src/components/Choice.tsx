import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import styles from '../styles/Choice.module.css';

type Props = {
  index: number;
  edit: boolean;
  choices: string[];
  setChoices: Dispatch<SetStateAction<string[]>>;
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
};

const Choice = ({
  index,
  edit,
  choices,
  setChoices,
  active,
  setActive,
}: Props) => {
  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const newArr = [...choices];
    newArr[index] = e.target.value;

    setChoices(newArr);
  };

  const handleSetActive = (toActiveIndex: number) => {
    if (toActiveIndex === active) {
      setActive(-1);
      return;
    }
    if (choices[toActiveIndex]) {
      setActive(toActiveIndex);
    }
  };

  return (
    <div
      className={`${styles.choice} ${
        active === index ? styles.active : styles.unactive
      } ${choices[index] ? styles.notEmpty : styles.empty}`}
    >
      <div>
        <p className={styles.choiceTitle}>
          {index + 1}. choice
          {index + 1 <= 2 && <span>*</span>}
        </p>
        <div className={styles.choiceInputContainer}>
          <button
            className={styles.correctContainer}
            onClick={() => handleSetActive(index)}
          >
            {active === index && (
              <Image
                src="/icons/check.svg"
                alt="checkmark"
                width={24}
                height={24}
              />
            )}
          </button>
          <input
            value={choices[index]}
            onChange={(e) => handleChange(index, e)}
            type="text"
          />
        </div>
      </div>
    </div>
  );
};

export default Choice;
