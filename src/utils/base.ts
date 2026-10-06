// O app pode rodar na raiz de um domínio (Vercel) ou numa pasta, como
// arkhetypo.com.br/agendatempodeser/. O build define a pasta (vite.config.ts, BASE_PATH).
export const BASE = import.meta.env.BASE_URL; // sempre termina em "/"

/** arquivo da pasta public/ (ex.: asset('image.png')) */
export const asset = (file: string) => `${BASE}${file.replace(/^\//, '')}`;

/** endereço completo de uma página do app (ex.: appUrl('MorningRitual')) */
export const appUrl = (page = '') => `${window.location.origin}${BASE}${page.replace(/^\//, '')}`;
