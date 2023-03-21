import { trpc } from '~/utils/trpc';
import ModifyQuiz from '~/components/ModifyQuiz';
import Head from 'next/head';

const CreateQuiz = () => {
  const { mutateAsync, isLoading } = trpc.quiz.create.useMutation();

  return (
    <>
      <Head>
        <title>Quizitor - Create a quiz</title>
      </Head>
      <ModifyQuiz
        edit={false}
        mutateAsync={mutateAsync}
        isLoading={isLoading}
      />
      ;
    </>
  );
};

CreateQuiz.auth = { role: 'USER' };

export default CreateQuiz;
