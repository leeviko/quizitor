import { useState } from 'react';
import ModalLayout from '~/layouts/ModalLayout';

import QuizOverview from '~/components/QuizOverview';
import NewQuestion from '~/components/NewQuestion';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import Loader from '~/components/Loader';

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

const Overview = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>(Mode.Overview);
  const [edit, setEdit] = useState<TEditQuestion | null>(null);
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [questions, setQuestions] = useState<Array<TQuestion>>([]);
  const { mutateAsync, isLoading } = trpc.quiz.create.useMutation();

  const handleSave = async () => {
    let errs: string[] = [];
    if (!title) {
      errs = [...errs, 'Title must be set'];
    }
    if (questions.length === 0) {
      errs = [...errs, 'There isnt any questions'];
    }
    if (questions.length > 50) {
      errs = [...errs, 'Too many questions. Max is 50'];
    }

    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    const result: any = await mutateAsync({
      private: isPrivate,
      title,
      questions,
    });

    if (result.status === 200) {
      return router.push('/');
    } else {
      setErrors(['Failed to save quiz']);
    }
  };

  return (
    <ModalLayout
      pageProps={{
        title:
          mode === 'overview'
            ? 'Create new Quiz'
            : edit
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
              setMode={setMode}
              setTitle={setTitle}
              setIsPrivate={setIsPrivate}
              isPrivate={isPrivate}
              title={title}
              questions={questions}
              setQuestions={setQuestions}
              mode={mode}
              setEdit={setEdit}
              handleSave={handleSave}
            />
            <NewQuestion
              setMode={setMode}
              mode={mode}
              questions={questions}
              setQuestions={setQuestions}
              edit={edit}
              setEdit={setEdit}
            />
          </>
        )}
      </div>
    </ModalLayout>
  );
};

Overview.auth = { role: 'USER' };

export default Overview;
