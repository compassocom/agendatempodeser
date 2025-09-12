import React from 'react';
import { cn } from '@/utils/cn';

// Adicione 'secondary' à lista de variantes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

export const Button = ({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}: ButtonProps) => {

  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400 disabled:opacity-50 disabled:pointer-events-none";

  const variantStyles = {
    default: 'bg-stone-800 dark:bg-stone-100 text-white dark:text-black hover:bg-stone-700 hover:text-stone-100 shadow-sm',
    // Adicione esta nova linha para o botão secundário
    secondary: 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white hover:bg-stone-100 hover:text-stone-900 shadow-sm',
    outline: 'border border-stone-300 bg-transparent hover:bg-stone-100 hover:text-stone-800 dark:border-gray-600 dark:text-stone-300 dark:hover:bg-gray-700 dark:hover:text-stone-200',
    ghost: 'bg-transparent text-stone-700 dark:text-white hover:bg-stone-900 hover:text-stone-900',
  };

  const sizeStyles = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
  };
  
  const combinedClasses = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};