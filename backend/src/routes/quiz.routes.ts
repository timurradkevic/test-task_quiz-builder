import { Router } from 'express';

import { quizController } from '../controllers/quiz.controller.js';

export const quizRouter = Router();

quizRouter.post('/', quizController.createQuiz);

quizRouter.get('/', quizController.getQuizzes);

quizRouter.get('/:id', quizController.getQuizById);

quizRouter.delete('/:id', quizController.deleteQuiz);
