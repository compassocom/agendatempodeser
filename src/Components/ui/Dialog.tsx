import React from 'react';

type DialogProps = { children: React.ReactNode; open: boolean; onOpenChange?: (open: boolean) => void };
type SlotProps = { children: React.ReactNode; className?: string };

export const Dialog = ({ children, open, onOpenChange }: DialogProps) => open ? (
  <div
    className="fixed inset-0 bg-black/50 dark:bg-white/50 z-50 flex items-center justify-center"
    onClick={(e) => { if (e.target === e.currentTarget) onOpenChange?.(false); }}
  >
    {children}
  </div>
) : null;
export const DialogContent = ({ children, className = '' }: SlotProps) => <div className={`bg-white dark:bg-stone-700 p-6 rounded-lg shadow-xl w-full max-w-md ${className}`}>{children}</div>;
export const DialogHeader = ({ children, className = '' }: SlotProps) => <div className={`mb-4 ${className}`}>{children}</div>;
export const DialogTitle = ({ children, className = '' }: SlotProps) => <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
export const DialogDescription = ({ children, className = '' }: SlotProps) => <p className={`text-stone-600 dark:text-stone-100 mt-2 ${className}`}>{children}</p>;
export const DialogFooter = ({ children, className = '' }: SlotProps) => <div className={`mt-6 flex justify-end ${className}`}>{children}</div>;
