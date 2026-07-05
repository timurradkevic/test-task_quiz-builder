import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

import { quizService } from '../services/quiz.service.js';
import { createQuizSchema } from '../schemas/quiz.schema.js';

class QuizController {
  async createQuiz(req: Request, res: Response) {
    const parseResult = createQuizSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid quiz data',
        errors: parseResult.error.flatten(),
      });
      return;
    }

    try {
      const quiz = await quizService.createQuiz(parseResult.data);
      res.status(201).json(quiz);
    } catch (error) {
      console.error('Error creating quiz:', error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async getQuizzes(req: Request, res: Response) {
    try {
      const quizzes = await quizService.getQuizzes();
      res.json(quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async getQuizById(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'Invalid quiz id' });
      return;
    }

    try {
      const quiz = await quizService.getQuizById(id);

      if (!quiz) {
        res.status(404).json({ message: 'Quiz not found' });
        return;
      }

      res.json(quiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async deleteQuiz(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'Invalid quiz id' });
      return;
    }

    try {
      await quizService.deleteQuiz(id);
      res.sendStatus(204);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).json({ message: 'Quiz not found' });
        return;
      }

      console.error('Error deleting quiz:', error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
}

export const quizController = new QuizController();