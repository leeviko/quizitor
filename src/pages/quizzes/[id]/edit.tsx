import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import ModifyQuiz from '~/components/ModifyQuiz';

const EditQuiz = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = trpc.quiz.byId.useQuery({ id, withCorrect: true });
  const { mutateAsync, isLoading, error } = trpc.quiz.update.useMutation();

  return (
    <>
      {data?.result && (
        <ModifyQuiz
          quiz={data.result}
          mutateAsync={mutateAsync}
          isLoading={isLoading}
          error={error}
        />
      )}
    </>
  );
};

EditQuiz.auth = { role: 'USER' };

export default EditQuiz;
