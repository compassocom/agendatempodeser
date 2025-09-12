import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={`flex min-h-[80px] w-full rounded-md border border-stone-300 bg-transparent px-3 py-2 text-sm text-stone-900
                    placeholder:text-stone-500 
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-600 focus-visible:ring-offset-2 
                    disabled:cursor-not-allowed disabled:opacity-50
                    dark:border-gray-600 dark:bg-gray-800 dark:text-stone-200 dark:placeholder:text-gray-400 dark:focus-visible:ring-amber-500
                    ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };