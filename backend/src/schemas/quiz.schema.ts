import { z } from 'zod';
import { QuestionType } from '../types/quiz.js';

const optionSchema = z.object({
  text: z.string().trim().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
});

const questionSchema = z
  .object({
    text: z.string().trim().min(1, 'Question text is required'),
    type: z.nativeEnum(QuestionType),
    options: z.array(optionSchema).min(1, 'At least one option is required'),
  })
  .refine((question) => question.options.some((option) => option.isCorrect), {
    message: 'At least one option must be marked as correct',
    path: ['options'],
  });

export const createQuizSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;