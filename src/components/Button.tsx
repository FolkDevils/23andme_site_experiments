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
  const baseStyles = "font-rialta relative overflow-hidden transition-colors duration-300 rounded-full flex items-center justify-center";
  
  const variantStyles = {
    primary: "bg-white text-text-primary hover:bg-primary hover:text-white",
    outline: "bg-white/[0.01] backdrop-blur-2xl border border-white text-white hover:bg-primary hover:border-primary",
    'outline-dark': "bg-white text-text-primary border border-text-primary hover:bg-primary hover:text-white hover:border-primary",
    text: "text-text-secondary hover:text-primary bg-transparent"
  };

  const sizeStyles = {
    small: "text-button-text px-4 py-2",
    medium: "text-button-text px-8 py-2.5",
    large: "text-button-text px-8 py-3"
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