import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start justify-center gap-6 px-4 py-24">
      <span className="font-mono text-sm uppercase tracking-wide text-foreground/40">
        Quiz Builder
      </span>
      <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
        Build quizzes with true/false, text and multiple-choice questions.
      </h1>
      <p className="max-w-xl text-foreground/70">
        Create a quiz, mix question types, mark the correct answers — then
        browse or review the structure any time.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/create"
          className="rounded-md bg-indigo-700 px-5 py-2.5 text-center font-medium text-white transition-colors hover:bg-indigo-800"
        >
          Create a quiz
        </Link>
        <Link
          href="/quizzes"
          className="rounded-md border border-black/10 px-5 py-2.5 text-center font-medium transition-colors hover:bg-black/5"
        >
          View quizzes
        </Link>
      </div>
    </main>
  );
}
