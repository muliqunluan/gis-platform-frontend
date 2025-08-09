'use client';

import React, { useState } from 'react';

interface ToggleSwitchProps {
  initialValue?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function ToggleSwitch({ 
  initialValue = false,
  onChange 
}: ToggleSwitchProps) {
  const [checked, setChecked] = useState(initialValue);

  const handleChange = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked}
        onChange={handleChange}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
    </label>
  );
}