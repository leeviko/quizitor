/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Choice from '~/components/Choice';
import ModalLayout from '~/layouts/ModalLayout';
import { trpc } from '~/utils/trpc';

import styles from '../../styles/QuizPage.module.css';

type TQuestion = {
  id: string;
  title: string;
  choices: string[];
  selected: number;
};

const Quiz = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { isLoading, data, error } = trpc.quiz.byId.useQuery({ id });
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<TQuestion[]>([
    { id: '', title: '', choices: [], selected: -1 },
  ]);
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    if (data?.result.questions) {
      setQuestions(
        data.result.questions.map((obj) => ({ ...obj, selected: -1 })),
      );
    }
  }, [data]);

  const handleQuestionChange = (way: 'prev' | 'next') => {
    const oldQues = [...questions];
    oldQues[currQuestionIndex]!.selected = selected;
    setQuestions(oldQues);

    let currIndex = currQuestionIndex;

    if (way === 'prev' && currIndex > 0) {
      setCurrQuestionIndex((currIndex -= 1));
    } else if (way === 'next' && currIndex + 1 < questions.length) {
      setCurrQuestionIndex((currIndex += 1));
    }

    setSelected(oldQues[currIndex]!.selected);
  };

  return (
    <ModalLayout pageProps={{ title: data?.result.title || 'Loading...' }}>
      <div className={`${styles.content}`}>
        <h2 className={styles.questionTitle}>
          {isLoading ? null : questions[currQuestionIndex]?.title}
        </h2>
        <div className={styles.choices}>
          {!isLoading && questions[currQuestionIndex]
            ? questions[currQuestionIndex]!.choices.map(
                (item: any, i: number) => (
                  <Choice
                    key={item + i}
                    index={i}
                    choices={questions[currQuestionIndex]!.choices}
                    active={selected}
                    setActive={setSelected}
                  />
                ),
              )
            : null}

          <div className={styles.actions}>
            <div className={styles.navigation}>
              <button
                className={`${styles.prev} ${
                  currQuestionIndex === 0 ? styles.disabled : styles.enabled
                }`}
                onClick={() => handleQuestionChange('prev')}
              >
                <Image
                  src="/icons/arrow.svg"
                  alt="prev"
                  width={36}
                  height={36}
                />
              </button>
              <span className={styles.currentQuestion}>
                {currQuestionIndex + 1} / {questions.length}
              </span>
              <button
                className={`${styles.next} ${
                  currQuestionIndex + 1 === questions.length
                    ? styles.disabled
                    : styles.enabled
                }`}
                onClick={() => handleQuestionChange('next')}
              >
                <Image
                  src="/icons/arrow.svg"
                  alt="next"
                  width={36}
                  height={36}
                />
              </button>
            </div>
          </div>
          {/* {errors.length > 0 && (
            <div className={styles.errors}>
              <ul>
                {errors.map((error, i) => (
                  <li key={i}>- {error}</li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
      </div>
    </ModalLayout>
  );
};

export default Quiz;
