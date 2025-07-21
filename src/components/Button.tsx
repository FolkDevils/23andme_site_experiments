'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'outline-dark' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  onClick,
}: ButtonProps) {
  const baseStyles = "font-rialta relative overflow-hidden transition-colors duration-300 rounded-[100px] flex items-center justify-center";
  
  const variantStyles = {
    primary: "bg-white text-[#282828] hover:bg-[#D50F67] hover:text-white",
    outline: "bg-white/[0.01] backdrop-blur-2xl border border-white text-white hover:bg-[#D50F67] hover:border-[#D50F67]",
    'outline-dark': "bg-white text-[#282828] border border-[#282828] hover:bg-[#D50F67] hover:text-white hover:border-[#D50F67]",
    text: "text-[#6b6b6b] hover:text-[#D50F67] bg-transparent"
  };

  const sizeStyles = {
    small: "text-sm px-4 py-1.5",
    medium: "text-sm px-8 py-2 ",
    large: "text-sm px-8 py-3"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyle}
        ${className}
      `.trim()}
    >
      {children}
    </button>
  );
} 