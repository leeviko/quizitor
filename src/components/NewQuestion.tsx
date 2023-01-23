import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Mode, TEditQuestion, TQuestion } from '~/pages/create-quiz';

import styles from '../styles/NewQuestion.module.css';
import Choice from './Choice';

type Props = {
  setMode: Dispatch<SetStateAction<Mode>>;
  mode: Mode;
  questions: Array<TQuestion>;
  setQuestions: Dispatch<SetStateAction<TQuestion[]>>;
  edit: TEditQuestion | null;
  setEdit: Dispatch<SetStateAction<TEditQuestion | null>>;
};

const NewQuestion = ({
  setMode,
  mode,
  questions,
  setQuestions,
  edit,
  setEdit,
}: Props) => {
  const [errors, setErrors] = useState<Array<string>>([]);
  const [title, setTitle] = useState('');
  const [correct, setCorrect] = useState<number>(-1);
  const [choices, setChoices] = useState<string[]>(['', '', '', '']);

  useEffect(() => {
    if (edit) {
      setTitle(edit.title);
      setCorrect(edit.correct);
      setChoices(edit.choices);
    }
  }, [edit]);

  const clearValues = () => {
    setErrors([]);
    setTitle('');
    setCorrect(-1);
    setChoices(['', '', '', '']);
    setEdit(null);
  };

  const handleAdd = () => {
    let errs: string[] = [];
    if (!title) {
      errs = [...errs, 'Title not set'];
    }
    if (!choices[0] || !choices[1]) {
      errs = [...errs, 'First two choices must be set'];
    }
    if (correct === -1) {
      errs = [...errs, 'You must choose which is the correct answer'];
    } else if (!choices[correct]) {
      errs = [...errs, 'Correct choice cannot be empty'];
    }
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    const newQues = [...questions];
    const newQue: TQuestion = {
      title,
      correct,
      choices,
    };

    if (edit) {
      newQues[edit.index] = newQue;
    } else {
      newQues.push(newQue);
    }

    setQuestions(newQues);

    clearValues();
    setMode(Mode.Overview);
  };

  const handleModeChange = () => {
    clearValues();
    setMode(Mode.Overview);
  };

  return (
    <div
      className={`${styles.content} ${
        mode === 'new' ? styles.show : styles.hidden
      }`}
    >
      <div className={styles.titleInput}>
        <span className={styles.title}>Question title</span>
        <input
          type="text"
          placeholder="How much is 2 + 2?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className={styles.choices}>
        {choices.map((item, i) => (
          <Choice
            key={i}
            edit={true}
            index={i}
            choices={choices}
            setChoices={setChoices}
            active={correct}
            setActive={setCorrect}
          />
        ))}

        <div className={styles.actions}>
          <button className={styles.return} onClick={handleModeChange}>
            <Image src="/icons/back.svg" alt="Return" width={24} height={24} />
            <span>Return</span>
          </button>
          <button onClick={handleAdd} className={styles.defaultBtn}>
            {edit ? 'Update' : 'Add'}
          </button>
        </div>
        {errors.length > 0 && (
          <div className={styles.errors}>
            <ul>
              {errors.map((error, i) => (
                <li key={i}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewQuestion;
