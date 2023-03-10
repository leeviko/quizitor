import Image from 'next/image';
import QuizItem from '~/components/QuizItem';
import { Dispatch, SetStateAction } from 'react';
import { Mode, TEditQuestion, TQuestion } from '~/components/ModifyQuiz';

import styles from '~/styles/QuizOverview.module.css';
import common from '~/styles/Common.module.css';

type Props = {
  deleteQuiz?: () => void;
  edit: boolean | undefined;
  setMode: Dispatch<SetStateAction<Mode>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
  title: string;
  isPrivate: boolean;
  questions: TQuestion[];
  setQuestions: Dispatch<SetStateAction<TQuestion[]>>;
  mode: Mode;
  setEditQue: Dispatch<SetStateAction<TEditQuestion | null>>;
  handleSave: () => void;
  errors: string[];
};

const QuizOverview = ({
  deleteQuiz,
  edit,
  setMode,
  setTitle,
  setIsPrivate,
  title,
  isPrivate,
  questions,
  setQuestions,
  mode,
  setEditQue,
  handleSave,
  errors,
}: Props) => {
  const handleDelete = (index: number) => {
    setQuestions(questions.filter((_item, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setEditQue({ ...questions[index]!, index });
    setMode(Mode.New);
  };

  return (
    <div
      className={`${styles.content} ${
        mode === 'overview' ? styles.show : styles.hidden
      }`}
    >
      <div className={styles.titleInput}>
        <span className={styles.title}>Title</span>
        <input
          type="text"
          placeholder="Add a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {questions.length !== 0 ? (
        <div className={styles.grid}>
          <div className={styles.titles}>
            <h3>Question</h3>
            <h3>Answer</h3>
          </div>
          <div className={styles.gridItems}>
            {questions.map((item, i) => (
              <QuizItem
                key={item.title + i}
                index={i}
                title={item.title}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                answer={item.choices[item.correct]!}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            ))}
          </div>
          <button
            className={`${common.defaultBtn} ${common.enabled} ${styles.newBtn}`}
            onClick={() => setMode(Mode.New)}
          >
            New
          </button>
        </div>
      ) : (
        <div className={styles.empty}>
          <div>
            <Image
              src="/images/add_content.svg"
              alt="Add content"
              width={192}
              height={192}
            />
          </div>
          <button
            className={`${common.defaultBtn} ${common.enabled} ${styles.newBtn}`}
            onClick={() => setMode(Mode.New)}
          >
            Add a Question!
          </button>
          {errors.length > 0 && (
            <ul className={styles.errorList}>
              {errors.map((val) => (
                <li key={val}>- {val}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className={styles.botActions}>
        {deleteQuiz && (
          <div className={styles.leftActions}>
            <button className={styles.deleteBtn} onClick={deleteQuiz}>
              Delete
            </button>
          </div>
        )}
        <div className={styles.rightActions}>
          {questions.length > 0 && errors.length > 0 && (
            <ul className={`${styles.errorList} ${styles.bottom}`}>
              {errors.map((val) => (
                <li key={val}>- {val}</li>
              ))}
            </ul>
          )}
          <button
            className={styles.privateBtn}
            onClick={() => setIsPrivate(!isPrivate)}
          >
            {isPrivate ? (
              <>
                <Image
                  src="/icons/lock.svg"
                  alt="Private"
                  width={24}
                  height={24}
                />
                <span>Private</span>
              </>
            ) : (
              <>
                <Image
                  src="/icons/lock_open.svg"
                  alt="Public"
                  width={24}
                  height={24}
                />
                <span>Public</span>
              </>
            )}
          </button>
          <button
            className={`${common.defaultBtn} ${common.enabled}`}
            onClick={handleSave}
          >
            {edit ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizOverview;
