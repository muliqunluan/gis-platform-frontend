import React from 'react';
import clsx from 'clsx';

interface NavigationItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ label, active, onClick }) => {
  return (
    <div
      className={clsx(
        'cursor-pointer px-4 py-2 rounded-md mb-2 text-sm font-medium',
        active ? 'bg-slate-700 text-white' : 'hover:bg-slate-600 text-slate-300'
      )}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default NavigationItem;
