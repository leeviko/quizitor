import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import ModifyQuiz from '~/components/ModifyQuiz';
import { useState } from 'react';
import Dialog, { TDialogContent } from '~/components/Dialog';
import Head from 'next/head';

const EditQuiz = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = trpc.quiz.byId.useQuery({ id, withCorrect: true });
  const { mutateAsync, isLoading } = trpc.quiz.update.useMutation();
  const { mutateAsync: deleteMutate } = trpc.quiz.delete.useMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<TDialogContent>({
    title: '',
    message: '',
  });

  const deleteQuiz = async () => {
    let result;
    try {
      result = await deleteMutate({
        id,
      });
    } catch (err) {
      console.log('Error while deleting: ', err);
      return;
    }

    if (result) {
      router.push('/');
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    setDialogContent({
      title: 'Delete',
      message: 'Are you sure you want to delete the quiz?',
      no: 'Cancel',
      onConfirm() {
        deleteQuiz();
      },
      onClose() {
        closeDialog();
      },
    });
    setDialogOpen(true);
  };

  return (
    <>
      <Head>
        <title>Quizitor - Edit quiz</title>
      </Head>
      {dialogOpen && <Dialog {...dialogContent} />}
      {data?.result && (
        <ModifyQuiz
          quiz={data.result}
          deleteQuiz={confirmDelete}
          mutateAsync={mutateAsync}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

EditQuiz.auth = { role: 'USER' };

export default EditQuiz;
