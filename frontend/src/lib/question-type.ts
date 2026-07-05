import { QuestionType } from '@/types/quiz';

interface QuestionTypeMeta {
  label: string;
  short: string;
  border: string;
  badge: string;
  active: string;
}

export const QUESTION_TYPE_META: Record<QuestionType, QuestionTypeMeta> = {
  [QuestionType.INPUT]: {
    label: 'Text answer',
    short: 'Text',
    border: 'border-l-teal-500',
    badge: 'border-teal-200 bg-teal-50 text-teal-700',
    active: 'bg-teal-600 text-white',
  },
  [QuestionType.BOOLEAN]: {
    label: 'True / False',
    short: 'True/False',
    border: 'border-l-amber-500',
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
    active: 'bg-amber-600 text-white',
  },
  [QuestionType.CHECKBOX]: {
    label: 'Multiple choice',
    short: 'Choice',
    border: 'border-l-violet-500',
    badge: 'border-violet-200 bg-violet-50 text-violet-700',
    active: 'bg-violet-600 text-white',
  },
};
