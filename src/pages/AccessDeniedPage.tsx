import React from 'react';
import { User } from '../entities';
import { Button } from '../components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function AccessDeniedPage() {
  const handleLogout = async () => {
    await User.logout();
    window.location.href = '/login'; // Redireciona para a página de login
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50 dark:bg-black text-center p-6">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-black shadow-lg rounded-xl">
        <ShieldAlert className="w-16 h-16 mx-auto text-amber-500" />
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Acesso Restrito</h1>
        <p className="text-stone-600 dark:text-stone-100">
          O seu email não está na lista de utilizadores autorizados. Se acredita que isto é um erro, por favor, contacte o administrador.
        </p>
        <Button onClick={handleLogout} variant="outline" className="w-full">
          Voltar para o Login
        </Button>
      </div>
    </div>
  );
}

