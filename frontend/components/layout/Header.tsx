import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn('sticky top-0 z-50 w-full border-b glass-effect hover-glow', className)}>
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block text-forum-primary">
              NeonSquare
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search can be added here */}
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="btn-forum premium-hover">
              Features
            </Button>
            <Button variant="ghost" size="sm" className="btn-forum premium-hover">
              Pricing
            </Button>
            <Button variant="ghost" size="sm" className="btn-forum premium-hover">
              About
            </Button>
            <Button variant="outline" size="sm" className="btn-forum premium-hover">
              Sign In
            </Button>
            <Button size="sm" className="btn-primary hover-glow shadow-fresh animate-fresh-glow">
              Get Started
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
