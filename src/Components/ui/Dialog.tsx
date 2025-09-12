import React from 'react';

export const Dialog = ({ children, open }: { children: React.ReactNode, open: boolean }) => open ? <div className="fixed inset-0 bg-black/50 dark:bg-white/50 z-50 flex items-center justify-center">{children}</div> : null;
export const DialogContent = ({ children }: { children: React.ReactNode }) => <div className="bg-white dark:bg-stone-700 p-6 rounded-lg shadow-xl w-full max-w-md">{children}</div>;
export const DialogHeader = ({ children }: { children: React.ReactNode }) => <div className="mb-4">{children}</div>;
export const DialogTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-bold">{children}</h2>;
export const DialogDescription = ({ children }: { children: React.ReactNode }) => <p className="text-stone-600 dark:text-stone-100 mt-2">{children}</p>;
export const DialogFooter = ({ children }: { children: React.ReactNode }) => <div className="mt-6 flex justify-end">{children}</div>;
