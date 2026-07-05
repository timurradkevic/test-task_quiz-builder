import { QuizListItem } from '@/components/QuizListItem/QuizListItem';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizPage({ params }: PageProps) {
  return (
    <div className="flex flex-1 flex-col py-8">
      <QuizListItem params={params} />
    </div>
  );
}
