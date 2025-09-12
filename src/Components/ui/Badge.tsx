import React from 'react';

// A mudança está aqui: "export default function"
export default function Badge({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="px-2.5 py-0.5 text-xs font-semibold border rounded-full" {...props}>
      {children}
    </div>
  );
};