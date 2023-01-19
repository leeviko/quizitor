import { createContext, useState } from 'react';
import ModalLayout from '~/layouts/ModalLayout';

import QuizOverview from '~/components/QuizOverview';

const QuizContext = createContext({
  title: '',
  isPrivate: true,
  questions: [{}],
});

export type TQuestion = {
  question: string;
  correct: string;
  choices: string[];
};

const Overview = () => {
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [questions, setQuestions] = useState<Array<TQuestion>>([]);

  return (
    <QuizContext.Provider value={{ title, isPrivate, questions }}>
      <ModalLayout pageProps={{ title: 'Create new Quiz' }}>
        <QuizOverview
          setTitle={setTitle}
          setIsPrivate={setIsPrivate}
          isPrivate={isPrivate}
          title={title}
          questions={questions}
        />
      </ModalLayout>
    </QuizContext.Provider>
  );
};

Overview.auth = { role: 'USER' };

export default Overview;
