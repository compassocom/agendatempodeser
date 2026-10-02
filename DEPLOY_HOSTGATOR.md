# Deploy na HostGator

A agenda é um site estático (React + Vite) que fala direto com o Supabase, então roda em qualquer plano de hospedagem compartilhada.

## 1. Gerar o pacote

```bash
npm install
npm run build
```

Envie o **conteúdo** da pasta `dist/` (não a pasta em si), incluindo o `.htaccess`.

## 2. Enviar pelo cPanel

1. cPanel → **Gerenciador de Arquivos** → `public_html/` (ou a pasta do domínio/subdomínio).
2. Ative "Mostrar arquivos ocultos" (para ver o `.htaccess`).
3. **Carregar** o ZIP → botão direito → **Extrair**.
4. Confira que `index.html`, `.htaccess` e `assets/` ficaram direto em `public_html/`.

## 3. SSL

cPanel → **SSL/TLS Status** → executar AutoSSL para o domínio. O `.htaccess` força HTTPS.

## 4. Supabase (obrigatório para o login funcionar)

Supabase → Authentication → URL Configuration:

- **Site URL**: `https://SEU-DOMINIO`
- **Redirect URLs**: adicionar `https://SEU-DOMINIO` e `https://SEU-DOMINIO/**`

O login com Google volta para o mesmo domínio onde o app estiver aberto.
Lembre de cadastrar os e-mails liberados na tabela `allowed_users`.

## Subpasta (ex.: `dominio.com/agenda`)

Se não for na raiz do domínio, ajuste antes do build:

- `vite.config.ts` → `base: '/agenda/'`
- `src/main.tsx` → `<BrowserRouter basename="/agenda">`
- `public/.htaccess` → `RewriteBase /agenda/` e `RewriteRule . /agenda/index.html [L]`
