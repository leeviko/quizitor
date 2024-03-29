import { useEffect, useState } from 'react';
import ModalLayout from '~/layouts/ModalLayout';

import QuizOverview from '~/components/QuizOverview';
import NewQuestion from '~/components/NewQuestion';
import { useRouter } from 'next/router';
import Loader from '~/components/Loader';
import { TQuizWithStats } from '~/types/quiz';
import { isTRPCClientError } from '~/utils/trpc';
import Dialog, { TDialogContent } from './Dialog';

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
  edit: boolean;
  deleteQuiz?: () => void;
  mutateAsync: any;
  isLoading: boolean;
};

const ModifyQuiz = ({
  quiz,
  edit,
  deleteQuiz,
  mutateAsync,
  isLoading,
}: Props) => {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>(Mode.Overview);
  const [editQue, setEditQue] = useState<TEditQuestion | null>(null);
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [questions, setQuestions] = useState<Array<TQuestion>>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<TDialogContent>({
    title: '',
    message: '',
  });

  useEffect(() => {
    if (!edit) return;
    if (!quiz) return;

    setTitle(quiz.title);
    setIsPrivate(quiz.private);
    setQuestions(quiz.questions);
  }, [edit, quiz]);

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

    if (edit && quiz) {
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

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const confirmSaveEdit = () => {
    setDialogContent({
      title: 'Save Edit',
      message:
        'Are you sure you want to edit the quiz? All scores will be reset!',
      no: 'Cancel',
      onConfirm() {
        handleSave();
      },
      onClose() {
        closeDialog();
      },
    });
    setDialogOpen(true);
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
        {dialogOpen && <Dialog {...dialogContent} />}
        {isLoading || (edit && !quiz) ? (
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
              questions={quiz?.questions ?? questions}
              setQuestions={setQuestions}
              mode={mode}
              setEditQue={setEditQue}
              handleSave={edit ? confirmSaveEdit : handleSave}
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
