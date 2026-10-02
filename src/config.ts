// Define se a aplicação deve usar o backend simulado (localStorage) ou o Supabase real.
// Para fazer o login real funcionar, definimos como 'false'.
export const MODO_DESENVOLVIMENTO = true;

// 🚨 DESABILITAR AUTENTICAÇÃO TEMPORARIAMENTE
// Mude para 'true' para desabilitar autenticação e acessar todas as páginas sem login
export const AUTH_DISABLED = false; // ⚠️ IMPORTANTE: Defina como 'false' em produção!

// Configurações de ambiente para autenticação
export const authConfig = {
  // Detecta se estamos em desenvolvimento ou produção
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  // URLs de redirecionamento baseadas no ambiente
  // Volta para o mesmo domínio onde o app está aberto (localhost, HostGator, Vercel...).
  // Cada domínio precisa estar em Supabase > Authentication > URL Configuration > Redirect URLs.
  getRedirectUrl: () => {
    return window.location.origin;
  },

  // Lista de URLs permitidas para redirecionamento (para Supabase)
  getAllowedRedirectUrls: () => {
    return [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      'https://agendatempodeser.vercel.app',
      'https://agendatempodeser.com',
    ];
  },

  // URL atual da aplicação
  getCurrentUrl: () => {
    return window.location.origin;
  },

  // Supabase URLs (já configuradas via variáveis de ambiente)
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  }
};
