import Image from 'next/image';
import styles from '../styles/QuizOverview.module.css';
import QuizItem from '~/components/QuizItem';
import { Dispatch, SetStateAction } from 'react';
import { Mode, TEditQuestion, TQuestion } from '~/pages/create-quiz';

type Props = {
  setMode: Dispatch<SetStateAction<Mode>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
  title: string;
  isPrivate: boolean;
  questions: TQuestion[];
  setQuestions: Dispatch<SetStateAction<TQuestion[]>>;
  mode: Mode;
  setEdit: Dispatch<SetStateAction<TEditQuestion | null>>;
  handleSave: () => void;
};

const QuizOverview = ({
  setMode,
  setTitle,
  setIsPrivate,
  title,
  isPrivate,
  questions,
  setQuestions,
  mode,
  setEdit,
  handleSave,
}: Props) => {
  const handleDelete = (index: number) => {
    setQuestions(questions.filter((_item, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setEdit({ ...questions[index]!, index });
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
            <h3>Questions</h3>
            <h3>Answers</h3>
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
            className={`${styles.defaultBtn} ${styles.newBtn}`}
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
            className={`${styles.defaultBtn} ${styles.newBtn}`}
            onClick={() => setMode(Mode.New)}
          >
            Add a Question!
          </button>
        </div>
      )}
      <div className={styles.botActions}>
        <div className={styles.leftActions}>
          <button className={styles.discardBtn}>
            <Image
              src="/icons/delete.svg"
              alt="Delete"
              width={24}
              height={24}
            />
            <span>Discard</span>
          </button>
        </div>
        <div className={styles.rightActions}>
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
          <button className={styles.defaultBtn} onClick={handleSave}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizOverview;
