import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="bg-red-100 text-red-700 p-4 border-l-4 border-red-500">{message}</div>
  );
}
