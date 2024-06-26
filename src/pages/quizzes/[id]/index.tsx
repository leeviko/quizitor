/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Choice from '~/components/Choice';
import { TQuizWithStats } from '~/types/quiz';
import { trpc } from '~/utils/trpc';

import LoaderInline from '~/components/LoaderInline';
import { Session } from 'next-auth';
import QuizItem from '~/components/QuizItem';
import prettifyDate from '~/utils/prettifyDate';
import Loader from '~/components/Loader';

import styles from '~/styles/QuizPage.module.css';
import common from '~/styles/Common.module.css';
import Head from 'next/head';

type TQuestion = {
  id: string;
  title: string;
  choices: string[];
  selected: number;
};

type TQuestionProps = {
  isLoading: boolean;
  summaryLoading: boolean;
  questionIndex: number;
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
  handleQuestionChange: (way: 'prev' | 'next' | 'finish') => void;
  quiz: TQuizWithStats;
};

type StartQuizProps = {
  title: string;
  questionCount: number;
  setMode: Dispatch<SetStateAction<'finish' | 'start' | 'question'>>;
};

type FinishQuizProps = {
  score: string;
  tries: number;
  bestScore: string;
  setMode: Dispatch<SetStateAction<'finish' | 'start' | 'question'>>;
};

type StatsCardProps = {
  quiz: TQuizWithStats;
  session: Session | null;
  id: string;
};

type QuizAnswersProps = {
  results: {
    correct: boolean;
    selectedIndex: number;
    id: string;
    title: string;
    quizId: string;
    choices: string[];
  }[];
};

const StartQuiz = ({ title, questionCount, setMode }: StartQuizProps) => {
  return (
    <>
      <h1>{title}</h1>
      <p className={styles.questionCount}>
        {questionCount} <span>Question{questionCount > 1 ? 's' : ''}</span>
      </p>
      <button
        className={`${common.defaultBtn} ${common.enabled}`}
        onClick={() => setMode('question')}
      >
        Start
      </button>
    </>
  );
};

const Question = ({
  isLoading,
  summaryLoading,
  questionIndex,
  selected,
  setSelected,
  handleQuestionChange,
  quiz,
}: TQuestionProps) => {
  const last = questionIndex + 1 === quiz.questions.length;

  return (
    <>
      <h2 className={styles.cardTitle}>
        {quiz.questions[questionIndex]?.title}
      </h2>
      <span className={styles.currentQuestion}>
        {questionIndex + 1} / {quiz.questions.length}
      </span>
      <div className={`${styles.choices} ${styles.answer}`}>
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
          <button
            className={`${styles.return} ${
              questionIndex === 0 ? styles.disabled : styles.enabled
            }`}
            onClick={() => handleQuestionChange('prev')}
          >
            <Image src="/icons/back.svg" alt="back" width={24} height={24} />
            Previous
          </button>
          <button
            className={`${common.defaultBtn} ${common.enabled}`}
            onClick={() => handleQuestionChange(last ? 'finish' : 'next')}
          >
            {summaryLoading ? (
              <LoaderInline />
            ) : (
              <>{last ? 'Finish' : 'Next'}</>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

const FinishQuiz = ({ score, tries, bestScore, setMode }: FinishQuizProps) => {
  return (
    <>
      <h2 className={styles.cardTitle}>Score</h2>
      <div className={styles.stats}>
        <div>
          <span>Score</span>
          <p>{score}</p>
        </div>
        <div>
          <span>Tries</span>
          <p>{tries}</p>
        </div>
        <div>
          <span>Best score</span>
          <p>{bestScore}</p>
        </div>
      </div>
      <div className={styles.summaryActions}>
        <button className={`${common.defaultBtn} ${common.enabled}`}>
          <Link href="/">Home</Link>
        </button>
        <button
          onClick={() => setMode('start')}
          className={`${common.defaultBtn} ${common.enabled}`}
        >
          Play again
        </button>
      </div>
    </>
  );
};

const StatsCard = ({ quiz, session, id }: StatsCardProps) => {
  return (
    <>
      <div className={styles.stat}>
        <p>{quiz.stats.views}</p>
        <span>Views</span>
      </div>
      <div className={styles.stat}>
        <p>{quiz.stats.favorites}</p>
        <span>Favorites</span>
      </div>
      {session?.user.id === quiz.author.id && (
        <button className={styles.editBtn}>
          <Image src="/icons/edit.svg" alt="edit" width={24} height={24} />
          <Link href={`${id}/edit`}>Edit</Link>
        </button>
      )}
    </>
  );
};

const RecentScores = ({ quiz }: { quiz: TQuizWithStats }) => {
  const usernameLength = 20;
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.quiz.quizScores.useInfiniteQuery(
      {
        quizId: quiz.id,
        limit: 10,
        page: 'next',
      },
      { getNextPageParam: (lastPage) => lastPage?.cursor.next },
    );

  const handleFetch = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };
  return (
    <div className={styles.scoreTableContainer}>
      {!isLoading ? (
        !data?.pages[0] || !data?.pages[0]?.result.length ? (
          <div className={common.noResults}>
            <Image
              src="/images/empty.svg"
              alt="Empty"
              width={144}
              height={144}
            />
            <span>Nobody has completed the quiz.</span>
          </div>
        ) : (
          <table className={styles.scoreTable}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Username</th>
                <th>Score</th>
                <th>Played</th>
              </tr>
            </thead>
            <tbody>
              {data?.pages.map((group) =>
                group?.result.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.user.name.slice(0, usernameLength)}
                      {item.user.name.length > usernameLength && '...'}
                    </td>
                    <td>
                      {item.recent}/{quiz.questions.length}
                    </td>
                    <td>{prettifyDate(item.updatedAt.getTime())}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        )
      ) : (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      )}
      <div className={styles.bottomBtn}>
        {hasNextPage && (
          <button
            onClick={handleFetch}
            className={`${common.defaultBtn} ${
              hasNextPage ? common.enabled : common.disabled
            }`}
          >
            {isFetchingNextPage ? <LoaderInline /> : 'Load more'}
          </button>
        )}
      </div>
    </div>
  );
};

const QuizAnswers = ({ results }: QuizAnswersProps) => {
  return (
    <div>
      <div className={styles.grid}>
        <div className={styles.titles}>
          <h3>Question</h3>
          <h3>Your answer</h3>
        </div>
        <div className={styles.gridItems}>
          {results.map((item, i) => (
            <QuizItem
              key={item.title + i}
              index={i}
              title={item.title}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              answer={item.choices[item.selectedIndex]!}
              correct={item.correct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Quiz = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { isLoading, data } = trpc.quiz.byId.useQuery(
    {
      id,
    },
    { refetchOnWindowFocus: false },
  );
  const [quiz, setQuiz] = useState<TQuizWithStats>();
  const { data: session } = useSession();
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<TQuestion[]>([
    { id: '', title: '', choices: [], selected: -1 },
  ]);
  const [selected, setSelected] = useState(-1);
  const [mode, setMode] = useState<'start' | 'question' | 'finish'>('start');
  const {
    mutateAsync: finishQuiz,
    data: summary,
    isLoading: summaryLoading,
  } = trpc.quiz.finishQuiz.useMutation();

  useEffect(() => {
    if (data?.result) {
      setQuiz(data.result);

      setQuestions(
        data.result.questions.map((obj) => ({ ...obj, selected: -1 })),
      );
    }
  }, [data]);

  const handleQuestionChange = async (way: 'prev' | 'next' | 'finish') => {
    if (selected === -1 && way !== 'prev') {
      return;
    }

    const newQues = [...questions];
    newQues[currQuestionIndex]!.selected = selected;
    setQuestions(newQues);

    if (way === 'finish') {
      if (quiz) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const answers = newQues.map(({ title, choices, ...rest }) => rest);

        await finishQuiz({ answers, quizId: quiz.id });
        setMode('finish');
      }
      return;
    }

    let currIndex = currQuestionIndex;

    if (way === 'prev' && currIndex > 0) {
      setCurrQuestionIndex((currIndex -= 1));
    } else if (way === 'next' && currIndex + 1 < questions.length) {
      setCurrQuestionIndex((currIndex += 1));
    }

    setSelected(newQues[currIndex]!.selected);
  };

  return (
    <>
      <Head>
        <title>Quizitor - {quiz ? quiz.title : 'Loading...'}</title>
      </Head>
      <div className={`${styles.container} ${styles[mode]}`}>
        <h1 className={styles.mainTitle}>
          {mode === 'start' ? 'Start' : quiz?.title}
        </h1>
        <div className={styles.wrapper}>
          <div className={`${styles.mainCard} ${styles.card}`}>
            <div className={styles.cardWrapper}>
              {isLoading || !quiz ? (
                <div className={styles.loaderContainer}>
                  <Loader />
                </div>
              ) : (
                <>
                  {mode === 'start' && (
                    <StartQuiz
                      title={quiz.title}
                      questionCount={quiz.questions.length}
                      setMode={setMode}
                    />
                  )}
                  {mode === 'question' && (
                    <Question
                      isLoading={isLoading}
                      summaryLoading={summaryLoading}
                      questionIndex={currQuestionIndex}
                      handleQuestionChange={handleQuestionChange}
                      quiz={quiz}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  )}
                  {mode === 'finish' && summary && (
                    <FinishQuiz
                      score={`${summary.score.recent}/${summary.result.length}`}
                      bestScore={`${summary.score.best}/${summary.result.length}`}
                      tries={summary.score.tries}
                      setMode={setMode}
                    />
                  )}
                </>
              )}
            </div>
          </div>
          <div className={`${styles.rightCard} ${styles.card}`}>
            <div className={styles.cardWrapper}>
              {isLoading || !quiz ? (
                <div className={styles.loaderContainer}>
                  <Loader />
                </div>
              ) : (
                <StatsCard quiz={quiz} session={session} id={id} />
              )}
            </div>
          </div>
        </div>
        <h1 className={styles.bottomTitle}>
          {mode === 'finish' && 'Your Result'}
          {mode === 'start' && 'Recent scores'}
        </h1>
        <div className={`${styles.wrapper} ${styles.bottom}`}>
          <div className={`${styles.bottomCard} ${styles.card}`}>
            {mode === 'start' &&
              (isLoading || !quiz ? (
                <div className={styles.loaderContainer}>
                  <Loader />
                </div>
              ) : (
                <RecentScores quiz={quiz} />
              ))}
            {mode === 'finish' && summary && (
              <QuizAnswers results={summary.result} />
            )}
          </div>
          <div className={`${styles.rightCard} ${styles.card}`}></div>
        </div>
      </div>
    </>
  );
};

Quiz.auth = { role: 'USER', loader: false };

export default Quiz;
