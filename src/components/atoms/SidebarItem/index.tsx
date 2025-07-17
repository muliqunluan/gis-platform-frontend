'use client';

import React from 'react';
import clsx from 'clsx';

interface SidebarItemProps {
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'px-3 py-2 rounded cursor-pointer mb-2',
        active ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      )}
    >
      {label}
    </div>
  );
};

export default SidebarItem;
