import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={clsx(
      "bg-white p-6 rounded-2xl shadow-md w-full max-w-md text-center",
      className
    )}>
      {children}
    </div>
  );
}
