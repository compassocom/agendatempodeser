import { User } from '@/Entities/Index';
import { appUrl } from '@/utils/base';
import { Button } from '@/Components/ui/Button';
import { ShieldAlert } from 'lucide-react';

export default function AccessDeniedPage() {
  const handleLogout = async () => {
    await User.logout();
    window.location.href = appUrl('login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50 dark:bg-black text-center p-6">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-black shadow-lg rounded-xl">
        <ShieldAlert className="w-16 h-16 mx-auto text-amber-500" />
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Acesso Restrito</h1>
        <p className="text-stone-600 dark:text-stone-100">
          Seu email ainda não está na lista de pessoas com acesso à agenda. Se acha que isso é um engano, fale com quem
          te convidou ou com a Arkhetypo.
        </p>
        <Button onClick={handleLogout} variant="outline" className="w-full">
          Voltar para o Login
        </Button>
      </div>
    </div>
  );
}

