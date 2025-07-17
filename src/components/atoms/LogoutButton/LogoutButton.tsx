import React from 'react';

interface LogoutButtonProps {
  onClick: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => {
  return (
    <button
      className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-md"
      onClick={onClick}
    >
      退出登录
    </button>
  );
};

export default LogoutButton;
