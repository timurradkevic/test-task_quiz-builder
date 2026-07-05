export enum QuestionType {
  BOOLEAN = 'BOOLEAN',
  INPUT = 'INPUT',
  CHECKBOX = 'CHECKBOX',
}

export interface Option {
  id?: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id?: number;
  text: string;
  type: QuestionType;
  options: Option[];
}

export interface Quiz {
  id?: number;
  title: string;
  questions: Question[];
  _count: {
    questions: number;
  };
}

export interface QuizListItem {
  id: number;
  title: string;
  questionsCount: number;
}

export interface CreateQuizDto {
  title: string;
  questions: Omit<Question, 'id'>[];
}