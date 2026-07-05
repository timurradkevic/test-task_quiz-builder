import { quizService } from '@/services/quiz.service';
import { Quiz, QuestionType } from '@/types/quiz';
import { QUESTION_TYPE_META } from '@/lib/question-type';
import { DeleteButton } from './DeleteButton';

export const QuizListItem = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data: quiz }: { data: Quiz | null } = await quizService.getById(id);

  if (!quiz) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-foreground/60">
        Quiz not found.
      </div>
    );
  }

  const { title, questions } = quiz;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <DeleteButton id={String(quiz.id)} />
      </div>

      {questions.length > 0 ? (
        <ol className="flex flex-col gap-3">
          {questions.map((question, index) => {
            const meta = QUESTION_TYPE_META[question.type];
            return (
              <li
                key={question.id ?? index}
                className={`rounded-md border border-black/10 border-l-4 bg-white p-4 shadow-sm ${meta.border}`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-xs text-foreground/40">
                    Q{index + 1}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide ${meta.badge}`}
                  >
                    {meta.label}
                  </span>
                </div>
                <p className="mb-2 font-medium">{question.text}</p>

                {question.type === QuestionType.INPUT ? (
                  <p className="text-sm text-foreground/70">
                    <span className="font-mono text-xs uppercase text-foreground/40">
                      Expected:{' '}
                    </span>
                    {question.options[0]?.text || '—'}
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {question.options.map((option, oIndex) => (
                      <li
                        key={option.id ?? oIndex}
                        className={`text-sm ${
                          option.isCorrect
                            ? 'font-medium text-emerald-700'
                            : 'text-foreground/60'
                        }`}
                      >
                        {option.isCorrect ? '✓ ' : '  '}
                        {option.text}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-foreground/60">
          No questions available for this quiz.
        </p>
      )}
    </div>
  );
};
