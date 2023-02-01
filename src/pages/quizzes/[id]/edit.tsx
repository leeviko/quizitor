import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import ModifyQuiz from '~/components/ModifyQuiz';

const EditQuiz = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = trpc.quiz.byId.useQuery({ id, withCorrect: true });
  const { mutateAsync, isLoading, error } = trpc.quiz.update.useMutation();
  const { mutateAsync: deleteMutate } = trpc.quiz.delete.useMutation();

  const deleteQuiz = async () => {
    let result;
    try {
      result = await deleteMutate({
        id,
      });
    } catch (err) {
      console.log('Error while deleting: ', err);
    }

    if (result) {
      router.push('/');
    }
  };

  return (
    <>
      {data?.result && (
        <ModifyQuiz
          quiz={data.result}
          deleteQuiz={deleteQuiz}
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
