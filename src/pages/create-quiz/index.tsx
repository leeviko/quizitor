import { trpc } from '~/utils/trpc';
import ModifyQuiz from '~/components/ModifyQuiz';

const CreateQuiz = () => {
  const { mutateAsync, isLoading } = trpc.quiz.create.useMutation();

  return <ModifyQuiz mutateAsync={mutateAsync} isLoading={isLoading} />;
};

CreateQuiz.auth = { role: 'USER' };

export default CreateQuiz;
