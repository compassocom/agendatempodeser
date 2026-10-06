# Deploy na HostGator — arkhetypo.com.br/agendatempodeser

A agenda é um site estático (React + Vite) que fala direto com o Supabase. Ela mora numa pasta
do site da Arkhetypo (WordPress), sem interferir nele: o Apache serve a pasta real antes do WordPress.

Endereço final: **https://arkhetypo.com.br/agendatempodeser/** (o `www.` redireciona para cá).

## 1. Gerar o pacote

```bash
npm install
npm run build:hostgator
```

O script gera `dist/` já apontando para `/agendatempodeser/` e ajusta o `.htaccess` para a pasta.
Para outra pasta: `BASE_PATH=/outra/ npm run build:hostgator` (no Git Bash do Windows, use o
PowerShell para definir a variável: `$env:BASE_PATH='/outra/'; npm run build:hostgator`).

Compacte o **conteúdo** de `dist/` (incluindo `.htaccess`) com caminhos usando `/`.

## 2. Enviar pelo cPanel

1. cPanel → **Gerenciador de Arquivos** → `public_html/`.
2. Crie a pasta `agendatempodeser` (se não existir) e entre nela.
3. Ative "Mostrar arquivos ocultos" (para ver o `.htaccess`).
4. **Carregar** o ZIP → botão direito → **Extrair** dentro de `agendatempodeser/`.
5. Confira que `index.html`, `.htaccess` e `assets/` ficaram direto em `public_html/agendatempodeser/`.
6. Numa atualização, apague o `assets/` antigo antes de extrair (os nomes dos arquivos mudam a cada build).

## 3. Supabase (obrigatório para o login funcionar)

Supabase → Authentication → URL Configuration:

- **Site URL**: `https://arkhetypo.com.br/agendatempodeser/`
- **Redirect URLs**:
  - `https://arkhetypo.com.br/agendatempodeser/`
  - `https://arkhetypo.com.br/agendatempodeser/**`
  - `https://agendatempodeser.vercel.app/**` (versão de testes na Vercel)
  - `http://localhost:5173/**` (desenvolvimento)

O login volta para a pasta onde o app estiver aberto. Quem entra precisa estar na tabela `allowed_users`.

## 4. Google (tela de consentimento OAuth)

- Página inicial: `https://arkhetypo.com.br/agendatempodeser/`
- Política de privacidade: `https://arkhetypo.com.br/agendatempodeser/privacidade`
- Termos de uso: `https://arkhetypo.com.br/agendatempodeser/termos`
- Domínio autorizado: `arkhetypo.com.br`

## Vercel

Na Vercel o app continua na raiz (`npm run build`, sem `BASE_PATH`), útil para testar antes de
enviar à HostGator.
