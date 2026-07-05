import express from 'express';
import cors from 'cors';
import { quizRouter } from './routes/quiz.routes.js';

export const app = express();

app.use(cors());

app.use(express.json());

app.use('/quizzes', quizRouter);
