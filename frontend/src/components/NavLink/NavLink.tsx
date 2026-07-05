'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-1.5 transition-colors ${
        isActive
          ? 'bg-indigo-700 text-white'
          : 'text-foreground/70 hover:bg-black/5'
      }`}
    >
      {children}
    </Link>
  );
};
