import { supabase } from '@/supabaseClient';
import { Button } from '@/Components/ui/Button';
import { Chrome } from 'lucide-react';
import { authConfig } from '@/config';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const redirectUrl = authConfig.getRedirectUrl();

    console.log('🔐 Iniciando login...');
    console.log('🌍 Ambiente:', authConfig.isDevelopment ? 'Desenvolvimento' : 'Produção');
    console.log('🔗 URL atual:', authConfig.getCurrentUrl());
    console.log('🎯 URL de redirecionamento:', redirectUrl);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('❌ Erro no login:', error);
      } else {
        console.log('✅ Login iniciado com sucesso');
      }
    } catch (err) {
      console.error('💥 Erro inesperado no login:', err);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6">
        {/* Container da Logo */}
        <div className="text-center mb-8">
          <img 
            src="/image.png" 
            alt="Logo Tempo de Ser" 
          className="max-w-md w-full h-auto mx-auto"
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
      {/* Rodapé */}
      <footer className="text-center py-4">
        <p className="text-sm text-stone-500">Desenvolvido pela Arkhetypo</p>
      </footer>
    </div>
  );
}



