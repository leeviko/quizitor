import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Mode, TEditQuestion, TQuestion } from '~/components/ModifyQuiz';

import styles from '~/styles/QuizPage.module.css';
import { EditChoice } from './Choice';

type Props = {
  setMode: Dispatch<SetStateAction<Mode>>;
  mode: Mode;
  questions: Array<TQuestion>;
  setQuestions: Dispatch<SetStateAction<TQuestion[]>>;
  editQue: TEditQuestion | null;
  setEditQue: Dispatch<SetStateAction<TEditQuestion | null>>;
};

const NewQuestion = ({
  setMode,
  mode,
  questions,
  setQuestions,
  editQue,
  setEditQue,
}: Props) => {
  const [errors, setErrors] = useState<Array<string>>([]);
  const [title, setTitle] = useState('');
  const [correct, setCorrect] = useState<number>(-1);
  const [choices, setChoices] = useState<string[]>(['', '', '', '']);

  useEffect(() => {
    if (editQue) {
      setTitle(editQue.title);
      setCorrect(editQue.correct);
      setChoices(editQue.choices);
    }
  }, [editQue]);

  const clearValues = () => {
    setErrors([]);
    setTitle('');
    setCorrect(-1);
    setChoices(['', '', '', '']);
    setEditQue(null);
  };

  const handleAdd = () => {
    let errs: string[] = [];
    if (!title || title.length < 3) {
      errs = [...errs, 'Title must be at least 3 characters long'];
    } else if (title.length > 50) {
      errs = [...errs, 'Title can contain at most 50 characters'];
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

    if (editQue) {
      newQues[editQue.index] = newQue;
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
          <EditChoice
            key={i}
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
            {editQue ? 'Update' : 'Add'}
          </button>
        </div>
        {
          <div
            className={styles.errors}
            style={{
              visibility: errors.length > 0 ? 'visible' : 'hidden',
              opacity: errors.length > 0 ? 1 : 0,
              transition: 'opacity 0.15s ease-in-out',
            }}
          >
            <ul>
              {errors.length > 0 &&
                errors.map((error, i) => <li key={i}>- {error}</li>)}
            </ul>
          </div>
        }
      </div>
    </div>
  );
};

export default NewQuestion;
