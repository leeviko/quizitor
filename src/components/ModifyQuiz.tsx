import { useEffect, useState } from 'react';
import ModalLayout from '~/layouts/ModalLayout';

import QuizOverview from '~/components/QuizOverview';
import NewQuestion from '~/components/NewQuestion';
import { useRouter } from 'next/router';
import Loader from '~/components/Loader';
import { TQuizWithStats } from '~/types/quiz';
import { isTRPCClientError } from '~/utils/trpc';

export type TQuestion = {
  title: string;
  correct: number;
  choices: string[];
};

export enum Mode {
  Overview = 'overview',
  New = 'new',
}

export type TEditQuestion = TQuestion & {
  index: number;
};

type Props = {
  quiz?: TQuizWithStats;
  deleteQuiz?: () => void;
  mutateAsync: any;
  isLoading: boolean;
};

const ModifyQuiz = ({ quiz, deleteQuiz, mutateAsync, isLoading }: Props) => {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>(Mode.Overview);
  const [editQue, setEditQue] = useState<TEditQuestion | null>(null);
  const [edit, setEdit] = useState<boolean>();
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [questions, setQuestions] = useState<Array<TQuestion>>([]);

  useEffect(() => {
    if (!quiz) return setEdit(false);

    setEdit(true);
    setTitle(quiz.title);
    setIsPrivate(quiz.private);
    setQuestions(quiz.questions);
  }, [quiz]);

  const handleSave = async () => {
    let errs: string[] = [];
    if (!title || title.length < 3) {
      errs = [...errs, 'Title must be at least 3 characters long'];
    } else if (title.length > 50) {
      errs = [...errs, 'Title can contain at most 50 characters'];
    }
    if (questions.length === 0) {
      errs = [...errs, 'There must be at least 1 question'];
    }
    if (questions.length > 50) {
      errs = [...errs, 'Too many questions. Max is 50'];
    }

    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    let reqParams = {
      id: quiz?.id,
      private: isPrivate,
      title,
      questions,
    };

    if (quiz) {
      reqParams = {
        ...reqParams,
        questions: questions.map((que) => ({ ...que, quizId: quiz.id })),
      };
    }

    let result;
    try {
      result = await mutateAsync(reqParams);
    } catch (err) {
      if (isTRPCClientError(err)) {
      } else {
      }
      console.log(err);
      setErrors(['Failed to save quiz']);
      return;
    }

    return router.push(`/quizzes/${result.result.id ?? quiz?.id}`);
  };

  return (
    <ModalLayout
      pageProps={{
        title:
          mode === 'overview'
            ? edit
              ? 'Edit quiz'
              : 'Create new Quiz'
            : editQue
            ? 'Edit question'
            : 'Add question',
      }}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <QuizOverview
              deleteQuiz={deleteQuiz}
              edit={edit}
              setMode={setMode}
              setTitle={setTitle}
              setIsPrivate={setIsPrivate}
              isPrivate={isPrivate}
              title={title}
              questions={questions}
              setQuestions={setQuestions}
              mode={mode}
              setEditQue={setEditQue}
              handleSave={handleSave}
              errors={errors}
            />
            <NewQuestion
              setMode={setMode}
              mode={mode}
              questions={questions}
              setQuestions={setQuestions}
              editQue={editQue}
              setEditQue={setEditQue}
            />
          </>
        )}
      </div>
    </ModalLayout>
  );
};

ModifyQuiz.auth = { role: 'USER' };

export default ModifyQuiz;
