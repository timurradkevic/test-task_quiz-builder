# Quiz Builder

Create quizzes with **True/False**, **text**, and **multiple-choice** questions, browse all quizzes on a dashboard, and view any quiz in a read-only detail page.

## Stack

- **Backend**: Express + TypeScript, Prisma ORM, PostgreSQL/SQLite, `zod` for request validation
- **Frontend**: Next.js App Router + TypeScript, Tailwind CSS, `axios`

## Project structure

```
quiz-builder/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── app.ts                     # express app, cors + json + /quizzes router
│       ├── server.ts                  # entrypoint, loads .env, starts the server
│       ├── routes/
│       │   └── quiz.routes.ts         # POST /, GET /, GET /:id, DELETE /:id
│       ├── controllers/
│       │   └── quiz.controller.ts     # request/response handling, 400/404/500
│       ├── services/
│       │   └── quiz.service.ts        # prisma queries (create/find/delete)
│       ├── schemas/
│       │   └── quiz.schema.ts         # zod schema for POST /quizzes body
│       ├── lib/
│       │   └── prisma.ts              # PrismaClient instance
│       └── types/
│           └── quiz.ts                # QuestionType, Quiz, Question, Option, CreateQuizDto
└── frontend/
    └── src/
        ├── app/
        │   ├── layout.tsx             # header + nav (Create / Quizzes)
        │   ├── page.tsx               # landing page
        │   ├── create/page.tsx        # quiz creation form
        │   └── quizzes/
        │       ├── page.tsx           # quizzes dashboard
        │       └── [id]/page.tsx      # single quiz, read-only
        ├── components/
        │   ├── NavLink
        |   |   └── NavLink.tsx
        │   ├── QuizzesList/
        │   │   └── QuizzesList.tsx    # fetches GET /quizzes, delete with confirm
        │   └── QuizListItem/
        │       ├── QuizListItem.tsx   # fetches GET /quizzes/:id, renders questions
        │       └── DeleteButton.tsx   # DELETE /quizzes/:id with confirm
        ├── services/
        │   ├── api.ts                 # axios instance, baseURL from NEXT_PUBLIC_API
        │   └── quiz.service.ts        # getAll / getById / create / delete
        ├── lib/
        │   └── question-type.ts       # per-type labels + colors (Text/True-False/Choice)
        └── types/
            └── quiz.ts
```

## How question types work

- **`BOOLEAN`** — rendered as a True/False radio pair; exactly one option can be marked correct.
- **`INPUT`** — a single free-text field; stored as one option with `isCorrect: true` holding the expected answer.
- **`CHECKBOX`** — a dynamic list of options, each independently markable as correct; at least one must be marked correct (enforced both client-side and via the `zod` schema on the backend).

Each question type has its own accent color across the UI (teal / amber / violet) so the type is visually obvious in both the create form and the quiz detail view.

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL running locally, or SQLite if you'd rather skip installing Postgres

## Backend setup

```bash
cd backend
npm install
```

Create `backend/.env` (not committed):

```
DATABASE_URL="postgresql://user:password@localhost:5432/quiz_builder"
PORT=3001
```

Using SQLite instead: set `DATABASE_URL="file:./dev.db"` and change `provider` in `prisma/schema.prisma` to `sqlite`.

Apply the schema and generate the Prisma client:

```bash
npx prisma migrate dev --name init
```

Start the API:

```bash
npm run dev
```

Runs on `http://localhost:3001`, with all routes mounted under `/quizzes`.

## Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local` (not committed):

```
NEXT_PUBLIC_API=http://localhost:3001
```

Start the app:

```bash
npm run dev
```

Runs on `http://localhost:3000`.

## Creating a sample quiz

1. Start the backend, then the frontend.
2. Go to `http://localhost:3000/create`.
3. Title: `JavaScript Basics`.
4. Question 1 — `Is JavaScript single-threaded?` → type **True/False** → mark `True` as correct.
5. Question 2 — `What keyword declares a constant?` → type **Text** → correct answer `const`.
6. Question 3 — `Which are primitive types?` → type **Choice** → options `string`, `number`, `object`, `boolean` → mark `string` and `number` as correct.
7. Submit — you land on `/quizzes` and see the new card with its question count.
8. Open it to view the read-only breakdown at `/quizzes/:id`, or delete it (with a confirm prompt) from either the dashboard or the detail page.

## API endpoints

| Method | Path           | Handler                              | Notes |
|--------|----------------|---------------------------------------|-------|
| POST   | `/quizzes`     | `quizController.createQuiz`          | Validated with `createQuizSchema` (zod); `400` on invalid body |
| GET    | `/quizzes`     | `quizController.getQuizzes`          | Includes `_count.questions` for the dashboard |
| GET    | `/quizzes/:id` | `quizController.getQuizById`         | `404` if the quiz doesn't exist |
| DELETE | `/quizzes/:id` | `quizController.deleteQuiz`          | `404` if the quiz doesn't exist (Prisma `P2025`) |

## Linting & formatting

```bash
npm run lint
npm run format
```

Run in both `backend/` and `frontend/` before committing.