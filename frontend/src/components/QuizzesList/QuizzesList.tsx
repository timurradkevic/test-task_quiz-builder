'use client';

import { quizService } from "@/services/quiz.service";
import { Quiz } from "@/types/quiz";
import Link from "next/link";
import { useEffect, useState } from "react";

export const QuizzesList = () => {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    quizService.getAll().then(({ data }) => {
      setQuizzes(data);
    });
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this quiz? This cannot be undone.')) return;

    setDeletingId(id);
    try {
      await quizService.delete(String(id));
      setQuizzes((prev) => prev?.filter((q) => q.id !== id) ?? null);
    } catch (error) {
      console.error("Error deleting quiz:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quizzes</h1>
        <Link
          href="/create"
          className="rounded-md bg-indigo-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-800"
        >
          + Create quiz
        </Link>
      </div>

      {quizzes === null ? (
        <p className="font-mono text-sm text-foreground/50">Loading quizzes…</p>
      ) : quizzes.length === 0 ? (
        <div className="rounded-md border border-dashed border-black/15 px-6 py-16 text-center">
          <p className="mb-3 text-foreground/60">No quizzes yet.</p>
          <Link href="/create" className="font-medium text-indigo-700 hover:underline">
            Create your first one
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="group relative rounded-md border border-black/10 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <Link href={`/quizzes/${quiz.id}`} className="flex flex-col gap-1 pr-8">
                <h3 className="font-semibold">{quiz.title}</h3>
                <p className="font-mono text-xs uppercase tracking-wide text-foreground/50">
                  {quiz._count.questions} question{quiz._count.questions === 1 ? '' : 's'}
                </p>
              </Link>
              <button
                onClick={() => quiz.id && handleDelete(quiz.id)}
                disabled={deletingId === quiz.id}
                aria-label="Delete quiz"
                className="absolute right-3 top-3 cursor-pointer rounded p-1 text-foreground/30 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 disabled:opacity-50"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}