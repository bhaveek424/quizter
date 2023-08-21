import QuizCreation from '@/components/QuizCreation';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  searchParams: {
    topic?: string;
  };
}

export const metadata = {
  title: 'Quiz | Quizter',
};

const QuizPage = async ({ searchParams }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect('/');
  }
  return <QuizCreation topic={searchParams.topic ?? ''} />;
};

export default QuizPage;
