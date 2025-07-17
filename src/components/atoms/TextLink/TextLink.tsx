import React from 'react';

interface TextLinkProps {
  children: React.ReactNode;
  onClick: () => void;
}

export default function TextLink({ children, onClick }: TextLinkProps) {
  return (
    <button
      onClick={onClick}
      className="ml-2 text-blue-600 font-medium hover:underline"
    >
      {children}
    </button>
  );
}
