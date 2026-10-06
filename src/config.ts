// Configuração do login.
export const authConfig = {
  // Volta para o mesmo domínio onde o app está aberto (localhost, Vercel, domínio próprio...).
  // Cada domínio precisa estar em Supabase > Authentication > URL Configuration > Redirect URLs.
  getRedirectUrl: () => window.location.origin,
};
