'use client';

import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, ...props }) => {
  const base = 'px-4 py-2 rounded text-white font-medium';
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600',
    danger: 'bg-red-600 hover:bg-red-700',
    ghost: 'bg-gray-700 hover:bg-gray-600',
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props} />
  );
};

export default Button;
