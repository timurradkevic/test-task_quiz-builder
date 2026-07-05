'use client';

import { useState } from 'react';
import { quizService } from "@/services/quiz.service";

export const DeleteButton = ({ id }: { id: string }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this quiz? This cannot be undone.')) return;

    setIsDeleting(true);
    try {
      await quizService.delete(id);
      window.location.href = '/quizzes';
    } catch (error) {
      console.error("Error deleting quiz:", error);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="cursor-pointer rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting ? 'Deleting…' : 'Delete quiz'}
    </button>
  );
}