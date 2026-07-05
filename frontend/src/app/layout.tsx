import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { NavLink } from '@/components/NavLink';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Quiz Builder',
  description: 'Create and browse quizzes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="border-b border-black/10">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-700 font-mono text-sm text-white">
                QB
              </span>
              <span className="text-lg">Quiz Builder</span>
            </Link>

            <nav className="flex gap-1 font-mono text-sm">
              <NavLink href="/create">Create</NavLink>
              <NavLink href="/quizzes">Quizzes</NavLink>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
