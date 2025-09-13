import React from 'react';
import { Label } from '@/components/ui/Label';

type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
};

export default function FormField({ label, htmlFor, children, className = '' }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}