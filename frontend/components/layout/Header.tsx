// NeonSquare/frontend/components/layout/Header.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NotificationDropdown } from '@/components/ui/notification-dropdown';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn('sticky top-0 z-50 w-full border-b glass-effect hover-glow', className)}>
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block text-forum-primary">
              NeonSquare
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none" />
          <nav className="flex items-center space-x-2">
            <Button asChild variant="ghost" size="sm" className="btn-forum premium-hover">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="btn-forum premium-hover">
              <Link href="/messages">Messages</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="btn-forum premium-hover">
              <Link href="/friends">Friends</Link>
            </Button>

            <NotificationDropdown className="ml-1" />

            <Button asChild variant="outline" size="sm" className="btn-forum premium-hover">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="btn-primary hover-glow shadow-fresh animate-fresh-glow">
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
