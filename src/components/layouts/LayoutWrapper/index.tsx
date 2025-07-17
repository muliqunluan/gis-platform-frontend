'use client';

import React from 'react';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="flex h-screen">{children}</div>;
};

export default LayoutWrapper;
