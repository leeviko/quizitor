/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Choice from '~/components/Choice';
import Loader from '~/components/Loader';
import ModalLayout from '~/layouts/ModalLayout';
import { TQuizWithStats } from '~/types/quiz';
import { trpc } from '~/utils/trpc';

import styles from '~/styles/QuizPage.module.css';

type TQuestion = {
  id: string;
  title: string;
  choices: string[];
  selected: number;
};

type TQuestionProps = {
  isLoading: boolean;
  questionIndex: number;
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
  handleQuestionChange: (way: 'prev' | 'next') => void;
  session: Session | null;
  quiz: TQuizWithStats;
};

const QuizInfo = ({
  stats,
  id,
}: {
  stats: { views: number; favorites: number };
  id: string;
}) => {
  return (
    <div className={styles.bottomActions}>
      <div>
        <div>
          {stats.views} <span>Views</span>
        </div>
        <div>
          {stats.favorites} <span>Favorites</span>
        </div>
        <button className={styles.editBtn}>
          <Link href={`${id}/edit`}>Edit</Link>
        </button>
      </div>
    </div>
  );
};

const Question = ({
  isLoading,
  questionIndex,
  selected,
  setSelected,
  handleQuestionChange,
  session,
  quiz,
}: TQuestionProps) => {
  return (
    <div className={`${styles.content} `}>
      <h2 className={styles.questionTitle}>
        {quiz.questions[questionIndex]?.title}
      </h2>
      <span className={styles.currentQuestion}>
        {questionIndex + 1} / {quiz.questions.length}
      </span>
      <div className={styles.choices}>
        {!isLoading && quiz.questions[questionIndex]
          ? quiz.questions[questionIndex]!.choices.map(
              (item: any, i: number) => (
                <Choice
                  key={item + i}
                  index={i}
                  choices={quiz.questions[questionIndex]!.choices}
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
                questionIndex === 0 ? styles.disabled : styles.enabled
              }`}
              onClick={() => handleQuestionChange('prev')}
            >
              <Image src="/icons/back.svg" alt="back" width={24} height={24} />
              Previous
            </button>
            <button
              className={`${styles.next} ${
                questionIndex + 1 === quiz.questions.length
                  ? styles.disabled
                  : styles.enabled
              }`}
              onClick={() => handleQuestionChange('next')}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {session?.user.id === quiz.author.id && (
        <QuizInfo stats={quiz.stats} id={quiz.id} />
      )}
    </div>
  );
};

const Quiz = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { isLoading, data } = trpc.quiz.byId.useQuery({
    id,
  });
  const [quiz, setQuiz] = useState<TQuizWithStats>();
  const { data: session } = useSession();
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<TQuestion[]>([
    { id: '', title: '', choices: [], selected: -1 },
  ]);
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    if (data?.result) {
      setQuiz(data.result);

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
    <ModalLayout pageProps={{ title: quiz?.title || 'Loading...' }}>
      {quiz ? (
        <Question
          isLoading={isLoading}
          questionIndex={currQuestionIndex}
          handleQuestionChange={handleQuestionChange}
          quiz={quiz}
          selected={selected}
          session={session}
          setSelected={setSelected}
        />
      ) : (
        <Loader fullscreen />
      )}
    </ModalLayout>
  );
};

Quiz.auth = { role: 'USER' };

export default Quiz;
