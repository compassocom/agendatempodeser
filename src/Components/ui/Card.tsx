import React, { ReactNode } from "react";

// Adicionadas classes dark:* para fundo, borda e sombra
const Card = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
    <div className={`bg-white border border-stone-200 dark:border-stone-800 shadow-sm rounded-lg 
                     dark:bg-gray-800 ${className}`}>
        {children}
    </div>
);

// Adicionadas classes dark:* para a borda
const CardHeader = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
    <div className={`p-6 border-b border-stone-200 dark:border-stone-800 ${className}`}>
        {children}
    </div>
);

// Adicionadas classes dark:* para a cor do texto
const CardTitle = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
    <h3 className={`text-xl font-semibold text-stone-800 dark:text-stone-100 ${className}`}>
        {children}
    </h3>
);

// Adicionadas classes dark:* para a cor do texto
const CardContent = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

export { Card, CardHeader, CardTitle, CardContent };