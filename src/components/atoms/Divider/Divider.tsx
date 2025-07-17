// components/atoms/Divider.tsx
import React from 'react';

interface DividerProps {
  className?: string;
}

export const Divider = ({ className = '' }: DividerProps) => {
  return <hr className={`border-t border-slate-300 my-2 ${className}`} />;
};
