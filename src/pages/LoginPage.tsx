import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { Button } from '@/Components/ui/Button';
import { AlertCircle, Chrome, Loader2 } from 'lucide-react';
import { authConfig } from '@/config';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  // o Google/Supabase devolve erros no endereço (#error_description=... ou ?error_description=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, '') || window.location.search);
    const description = params.get('error_description');
    if (description) setError(`Não foi possível entrar: ${description.replace(/\+/g, ' ')}`);
  }, []);

  const handleGoogleLogin = async () => {
    setError(null);
    setStarting(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: authConfig.getRedirectUrl() },
    });
    if (error) {
      setError('Não foi possível abrir o login do Google. Tente de novo em instantes.');
      setStarting(false);
    }
    // sem erro, o navegador já está indo para o Google
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 dark:bg-gray-900 p-6">
      <div className="text-center mb-8">
        <img src="/image.png" alt="Logo Tempo de Ser" className="max-w-md w-full h-auto mx-auto" />
      </div>

      <div className="w-full max-w-xs space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <Button
          onClick={handleGoogleLogin}
          disabled={starting}
          className="w-full bg-stone-800 hover:bg-stone-900 text-white rounded-lg dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
          size="lg"
        >
          {starting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Chrome className="w-5 h-5 mr-2" />}
          Entrar com o Google
        </Button>
        <p className="text-center text-xs text-stone-500 dark:text-stone-400">
          Ao entrar, você concorda com os <Link to="/termos" className="underline hover:text-stone-800 dark:hover:text-stone-200">Termos de Uso</Link> e
          a <Link to="/privacidade" className="underline hover:text-stone-800 dark:hover:text-stone-200">Política de Privacidade</Link>.
        </p>
      </div>

      <footer className="text-center py-4 mt-8">
        <p className="text-sm text-stone-500 dark:text-stone-400">Desenvolvido pela Arkhetypo</p>
      </footer>
    </div>
  );
}
