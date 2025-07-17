import React from 'react';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function Title({ children, className = "" }: TitleProps) {
  return (
    <h2 className={`text-2xl font-bold mb-6 ${className}`}>
      {children}
    </h2>
  );
}
