import React from 'react';
import { supabase } from '../supabaseClient.ts';
import { Button } from '../components/ui/button';
import { Chrome } from 'lucide-react';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6">
      <div className="flex-grow flex flex-col items-center justify-center w-full">
        {/* Container da Logo */}
        <div className="text-center mb-8">
          <img 
            src="/image.png" 
            alt="Logo Tempo de Ser" 
            className="max-w-md w-full h-auto mx-auto" // Classe chave para o tamanho da logo
          />
        </div>

        {/* Container do Botão */}
        <div className="w-full max-w-xs">
          <Button 
            onClick={handleGoogleLogin} 
            className="w-full bg-stone-800 hover:bg-stone-900 text-white rounded-lg"
            size="lg"
          >
            <Chrome className="w-5 h-5 mr-2" />
            Entrar com o Google
          </Button>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="text-center py-4">
        <p className="text-sm text-stone-500">Desenvolvido pela Arkhetypo</p>
      </footer>
    </div>
  );
}

