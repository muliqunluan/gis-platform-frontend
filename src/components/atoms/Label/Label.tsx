// components/atoms/Label.tsx
import React from 'react';

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export const Label = ({ children, htmlFor, className = '' }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-slate-100 dark:text-slate-200 ${className}`}
    >
      {children}
    </label>
  );
};
