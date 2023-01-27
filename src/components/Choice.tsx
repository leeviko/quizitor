import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import styles from '../styles/Choice.module.css';

type ChoiceProps = {
  index: number;
  choices: string[];
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
};

type EditChoiceProps = {
  index: number;
  choices: string[];
  setChoices: Dispatch<SetStateAction<string[]>> | undefined;
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
};

export const EditChoice = ({
  index,
  setChoices,
  choices,
  active,
  setActive,
}: EditChoiceProps) => {
  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const newArr = [...choices];
    newArr[index] = e.target.value;

    if (setChoices) setChoices(newArr);
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
  );
};

const Choice = ({ index, choices, active, setActive }: ChoiceProps) => {
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
        <h3 className={styles.choiceText}>{choices[index]}</h3>
      </div>
    </div>
  );
};

export default Choice;
