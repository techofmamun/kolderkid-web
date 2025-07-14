import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-b from-sky-300 via-sky-500 to-sky-800 rounded-full h-12 w-full flex items-center justify-center text-white text-lg font-semibold transition hover:opacity-90 ${className || ''}`}
    >
      {text}
    </button>
  );
};

export default Button;
