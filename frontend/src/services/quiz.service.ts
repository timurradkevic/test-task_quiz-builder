import { CreateQuizDto } from '@/types/quiz';
import { api } from './api';

export const quizService = {
  getAll() {
    return api.get('/quizzes');
  },

  getById(id: string) {
    return api.get(`/quizzes/${id}`);
  },

  create(data: CreateQuizDto) {
    return api.post('/quizzes', data);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/quizzes/${id}`);
  },
};