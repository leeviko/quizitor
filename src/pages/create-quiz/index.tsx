import { useState } from 'react';
import ModalLayout from '~/layouts/ModalLayout';

import QuizOverview from '~/components/QuizOverview';
import NewQuestion from '~/components/NewQuestion';

export type TChoice = {
  order: number;
  value: string;
};

export type TQuestion = {
  question: string;
  correct: number;
  choices: Array<TChoice>;
};

export enum Mode {
  Overview = 'overview',
  New = 'new',
}

const Overview = () => {
  const [mode, setMode] = useState<Mode>(Mode.Overview);
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [questions, setQuestions] = useState<Array<TQuestion>>([]);

  return (
    <ModalLayout
      pageProps={{
        title: mode === 'overview' ? 'Create new Quiz' : 'Add a Question',
      }}
    >
      <div style={{ display: 'flex' }}>
        <QuizOverview
          setMode={setMode}
          setTitle={setTitle}
          setIsPrivate={setIsPrivate}
          isPrivate={isPrivate}
          title={title}
          questions={questions}
          mode={mode}
        />
        <NewQuestion
          setMode={setMode}
          mode={mode}
          questions={questions}
          setQuestions={setQuestions}
        />
      </div>
    </ModalLayout>
  );
};

Overview.auth = { role: 'USER' };

export default Overview;
