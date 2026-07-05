import { prisma } from '../lib/prisma.js';
import type { CreateQuizDto, Option, Question } from '../types/quiz.js';

class QuizService {
  async createQuiz(data: CreateQuizDto) {
    return prisma.quiz.create({
      data: {
        title: data.title,
        questions: {
          create: data.questions.map((question: Question) => ({
            text: question.text,
            type: question.type,

            options: {
              create: question.options.map((option: Option) => ({
                text: option.text,
                isCorrect: option.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async getQuizzes() {
    return prisma.quiz.findMany({
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });
  }

  async getQuizById(id: number) {
    return prisma.quiz.findUnique({
      where: {
        id,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async deleteQuiz(id: number) {
    return prisma.quiz.delete({
      where: {
        id,
      },
    });
  }
}

export const quizService = new QuizService();
