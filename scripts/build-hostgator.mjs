// Gera o pacote da HostGator para arkhetypo.com.br/agendatempodeser/:
//   npm run build:hostgator            (ou BASE_PATH=/outra-pasta/ npm run build:hostgator)
// Resultado: dist/ com o .htaccess ajustado para a pasta. Envie o CONTEÚDO de dist/ para
// public_html/agendatempodeser/ (veja DEPLOY_HOSTGATOR.md).
import { build } from 'vite';
import fs from 'fs';
import path from 'path';

const base = process.env.BASE_PATH || '/agendatempodeser/';
if (!base.startsWith('/') || !base.endsWith('/')) {
  console.error(`BASE_PATH deve começar e terminar com "/" (recebido: ${base})`);
  process.exit(1);
}

process.env.BASE_PATH = base;
await build();

// o .htaccess de public/ é para a raiz do domínio; aqui ele aponta para a pasta
const file = path.join('dist', '.htaccess');
const htaccess = fs
  .readFileSync(file, 'utf-8')
  .replace(/^(\s*)RewriteBase \/$/m, `$1RewriteBase ${base}`)
  .replace(/^(\s*)RewriteRule \. \/index\.html \[L\]$/m, `$1RewriteRule . ${base}index.html [L]`);
if (!htaccess.includes(`RewriteBase ${base}`) || !htaccess.includes(`${base}index.html`)) {
  console.error('Não consegui ajustar o .htaccess para a pasta. Confira public/.htaccess.');
  process.exit(1);
}
fs.writeFileSync(file, htaccess);
console.log(`\nPronto: dist/ preparado para ${base} (com .htaccess).`);
