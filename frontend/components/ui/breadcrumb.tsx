'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-forum-secondary" aria-label="Breadcrumb">
      <Link 
        href="/dashboard" 
        className="flex items-center hover:text-forum-primary transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="w-4 h-4 text-forum-secondary" />
          {item.current ? (
            <span className="text-forum-primary font-medium" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link 
              href={item.href || '#'} 
              className="hover:text-forum-primary transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
