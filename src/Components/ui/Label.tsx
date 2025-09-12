import React from 'react';

export const Label = ({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label className="block text-sm font-medium text-stone-700 dark:text-white" {...props}>
      {children}
    </label>
  );
};