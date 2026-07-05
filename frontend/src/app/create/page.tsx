'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { quizService } from '@/services/quiz.service';
import { QuestionType, CreateQuizDto } from '@/types/quiz';
import { QUESTION_TYPE_META } from '@/lib/question-type';

interface OptionForm {
  text: string;
  isCorrect: boolean;
}

interface QuestionForm {
  text: string;
  type: QuestionType;
  options: OptionForm[];
}

const emptyOption = (): OptionForm => ({ text: '', isCorrect: false });

const optionsForType = (type: QuestionType): OptionForm[] => {
  switch (type) {
    case QuestionType.INPUT:
      return [{ text: '', isCorrect: true }];
    case QuestionType.BOOLEAN:
      return [
        { text: 'True', isCorrect: true },
        { text: 'False', isCorrect: false },
      ];
    case QuestionType.CHECKBOX:
      return [emptyOption(), emptyOption()];
    default:
      return [];
  }
};

const emptyQuestion = (): QuestionForm => ({
  text: '',
  type: QuestionType.INPUT,
  options: optionsForType(QuestionType.INPUT),
});

const QUESTION_TYPES = [
  QuestionType.INPUT,
  QuestionType.BOOLEAN,
  QuestionType.CHECKBOX,
];

const CreateQuizPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateQuestion = (index: number, patch: Partial<QuestionForm>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...patch } : q)),
    );
  };

  const changeQuestionType = (index: number, type: QuestionType) => {
    updateQuestion(index, { type, options: optionsForType(type) });
  };

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const addOption = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: [...q.options, emptyOption()] } : q,
      ),
    );
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((o, j) =>
                j === oIndex ? { ...o, text } : o,
              ),
            }
          : q,
      ),
    );
  };

  const toggleCheckboxOption = (
    qIndex: number,
    oIndex: number,
    isCorrect: boolean,
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((o, j) =>
                j === oIndex ? { ...o, isCorrect } : o,
              ),
            }
          : q,
      ),
    );
  };

  const selectBooleanOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((o, j) => ({
                ...o,
                isCorrect: j === oIndex,
              })),
            }
          : q,
      ),
    );
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, options: q.options.filter((_, j) => j !== oIndex) }
          : q,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please enter a quiz title');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.text.trim()) {
        setError(`Question ${i + 1}: question text cannot be empty`);
        return;
      }

      if (q.options.some((o) => !o.text.trim())) {
        setError(`Question ${i + 1}: option text cannot be empty`);
        return;
      }

      if (
        q.type === QuestionType.CHECKBOX &&
        !q.options.some((o) => o.isCorrect)
      ) {
        setError(
          'Each multiple-choice question needs at least one correct option',
        );
        return;
      }
    }

    const dto: CreateQuizDto = {
      title: title.trim(),
      questions: questions.map((q) => ({
        text: q.text.trim(),
        type: q.type,
        options: q.options.map((o) => ({ ...o, text: o.text.trim() })),
      })),
    };

    setIsSubmitting(true);
    try {
      await quizService.create(dto);
      router.push('/quizzes');
    } catch (err) {
      console.error('Error creating quiz:', err);
      setError('Failed to create quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div>
        <span className="font-mono text-xs uppercase tracking-wide text-foreground/40">
          New quiz
        </span>
        <h1 className="text-2xl font-semibold">Create Quiz</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="title">
            Quiz title
          </label>
          <input
            id="title"
            className="rounded-md border border-black/15 px-3 py-2 outline-none transition-colors focus:border-indigo-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. JavaScript Basics"
          />
        </div>

        <div className="flex flex-col gap-4">
          {questions.map((question, qIndex) => {
            const meta = QUESTION_TYPE_META[question.type];

            return (
              <div
                key={qIndex}
                className={`flex flex-col gap-3 rounded-md border border-black/10 border-l-4 bg-white p-4 shadow-sm ${meta.border}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-foreground/40">
                    Q{qIndex + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="cursor-pointer text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  className="rounded-md border border-black/15 px-3 py-2 outline-none transition-colors focus:border-indigo-600"
                  placeholder="Question text"
                  value={question.text}
                  onChange={(e) =>
                    updateQuestion(qIndex, { text: e.target.value })
                  }
                />

                <div className="flex gap-1.5 rounded-md bg-black/5 p-1">
                  {QUESTION_TYPES.map((type) => {
                    const typeMeta = QUESTION_TYPE_META[type];
                    const isActive = question.type === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => changeQuestionType(qIndex, type)}
                        className={`flex-1 cursor-pointer rounded px-2 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                          isActive
                            ? typeMeta.active
                            : 'text-foreground/50 hover:bg-black/5'
                        }`}
                      >
                        {typeMeta.short}
                      </button>
                    );
                  })}
                </div>

                {question.type === QuestionType.INPUT && (
                  <input
                    className="rounded-md border border-black/15 px-3 py-2 outline-none transition-colors focus:border-indigo-600"
                    placeholder="Correct answer"
                    value={question.options[0]?.text ?? ''}
                    onChange={(e) =>
                      updateOptionText(qIndex, 0, e.target.value)
                    }
                  />
                )}

                {question.type === QuestionType.BOOLEAN && (
                  <div className="flex gap-4">
                    {question.options.map((option, oIndex) => (
                      <label
                        key={oIndex}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name={`boolean-${qIndex}`}
                          checked={option.isCorrect}
                          onChange={() => selectBooleanOption(qIndex, oIndex)}
                          className="cursor-pointer accent-amber-600"
                        />
                        {option.text}
                      </label>
                    ))}
                  </div>
                )}

                {question.type === QuestionType.CHECKBOX && (
                  <div className="flex flex-col gap-2">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) =>
                            toggleCheckboxOption(
                              qIndex,
                              oIndex,
                              e.target.checked,
                            )
                          }
                          className="cursor-pointer accent-violet-600"
                        />
                        <input
                          className="flex-1 rounded-md border border-black/15 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-600"
                          placeholder={`Option ${oIndex + 1}`}
                          value={option.text}
                          onChange={(e) =>
                            updateOptionText(qIndex, oIndex, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="cursor-pointer text-sm text-red-600 hover:underline"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="cursor-pointer self-start text-sm text-indigo-700 hover:underline"
                    >
                      + Add option
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addQuestion}
          className="cursor-pointer self-start rounded-md border border-dashed border-black/20 px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:border-indigo-600 hover:text-indigo-700"
        >
          + Add question
        </button>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-md bg-indigo-700 px-4 py-2.5 font-medium text-white transition-colors hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
};

export default CreateQuizPage;
