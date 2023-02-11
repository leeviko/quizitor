import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import styles from '~/styles/Choice.module.css';

type ChoiceProps = {
  index: number;
  choices: string[];
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
  setChoices?: Dispatch<SetStateAction<string[]>>;
};

const Choice = ({
  index,
  choices,
  active,
  setActive,
  setChoices,
}: ChoiceProps) => {
  const char = ['A', 'B', 'C', 'D'];

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
      style={choices[index] ? { cursor: 'pointer' } : undefined}
      onClick={() => handleSetActive(index)}
    >
      <div className={styles.choiceContainer}>
        <div className={styles.choiceCharacter}>
          <span>{char[index]}</span>
        </div>
        {setChoices ? (
          <input
            value={choices[index]}
            onChange={(e) => handleChange(index, e)}
            type="text"
          />
        ) : (
          <p className={styles.choiceText}>{choices[index]}</p>
        )}
      </div>
    </div>
  );
};

export default Choice;
