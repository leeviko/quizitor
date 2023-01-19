import { useState } from 'react';
import ModalLayout from '~/layouts/ModalLayout';

import QuizOverview from '~/components/QuizOverview';
import NewQuestion from '~/components/NewQuestion';

// const QuizContext = createContext({
//   title: '',
//   isPrivate: true,
//   questions: [{}],
// });

export type TQuestion = {
  question: string;
  correct: string;
  choices: string[];
};

const Overview = () => {
  const [mode, setMode] = useState<'overview' | 'new'>('overview');
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [questions, setQuestions] = useState<Array<TQuestion>>([]);

  return (
    <ModalLayout
      pageProps={{
        title: mode === 'overview' ? 'Create new Quiz' : 'Add a Question',
      }}
    >
      <>
        {mode === 'overview' && (
          <QuizOverview
            setMode={setMode}
            setTitle={setTitle}
            setIsPrivate={setIsPrivate}
            isPrivate={isPrivate}
            title={title}
            questions={questions}
          />
        )}
        {mode === 'new' && <NewQuestion />}
      </>
    </ModalLayout>
  );
};

Overview.auth = { role: 'USER' };

export default Overview;
