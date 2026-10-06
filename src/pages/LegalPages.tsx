import { ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LEGAL } from '@/legal';
import { asset } from '@/utils/base';

// Páginas públicas (abrem sem login): Política de Privacidade e Termos de Uso.

const Shell = ({ title, children }: { title: string; children: ReactNode }) => {
  useEffect(() => {
    document.title = `${title} · Agenda Tempo de Ser`;
    return () => { document.title = 'Agenda Tempo de Ser'; };
  }, [title]);
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 dark:bg-gray-900 dark:text-stone-200">
      <header className="border-b border-stone-200 bg-white/80 dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/"><img src={asset("image.png")} alt="Agenda Tempo de Ser" className="h-12 w-auto" /></Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/privacidade" className="hover:underline">Privacidade</Link>
            <Link to="/termos" className="hover:underline">Termos</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">{title}</h1>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Versão em vigor desde {LEGAL.updatedAt}.</p>
        </div>
        {children}
      </main>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="space-y-3">
    <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">{title}</h2>
    <div className="space-y-3 leading-relaxed text-stone-700 dark:text-stone-300">{children}</div>
  </section>
);

const List = ({ children }: { children: ReactNode }) => <ul className="list-disc space-y-1.5 pl-6">{children}</ul>;

const Contact = () => (
  <p>
    {LEGAL.responsible}
    <br />
    <a href={`mailto:${LEGAL.contactEmail}`} className="font-medium underline">{LEGAL.contactEmail}</a>
  </p>
);

export function PrivacyPage() {
  return (
    <Shell title="Política de Privacidade">
      <Section title="1. Quem cuida dos seus dados">
        <p>A Agenda Tempo de Ser é desenvolvida pela {LEGAL.responsible}, controladora dos dados pela Lei Geral de Proteção de Dados (LGPD). Contato do encarregado:</p>
        <Contact />
      </Section>

      <Section title="2. O que guardamos">
        <List>
          <li><strong>Conta:</strong> nome, email e foto que o Google envia quando você entra com ele.</li>
          <li><strong>Suas anotações:</strong> páginas diárias, rituais da manhã e da noite, planejamentos semanais, visões mensais e a visão do futuro.</li>
          <li><strong>Perfil:</strong> biografia, objetivos, valores, inspirações e os horários dos lembretes, se você preencher.</li>
          <li><strong>Preferência de tema</strong> (claro ou escuro), guardada só no seu navegador.</li>
        </List>
        <p>
          O que você escreve na agenda é pessoal e pode revelar aspectos íntimos da sua vida. Por isso, as anotações são
          vistas apenas por você: não são públicas, não são lidas pela equipe no dia a dia e não são usadas para
          publicidade nem vendidas.
        </p>
      </Section>

      <Section title="3. Para que usamos e com qual base legal">
        <List>
          <li>
            <strong>Guardar e mostrar suas anotações, gerar a versão para impressão e os arquivos de calendário:</strong>
            {' '}execução do contrato com você, os <Link to="/termos" className="underline">Termos de Uso</Link> (LGPD, art. 7º, V).
          </li>
          <li>
            <strong>Dados que você decide registrar sobre si</strong> (reflexões, valores, saúde emocional): seu
            consentimento, dado ao escrever, que você pode retirar a qualquer momento apagando os dados (art. 11, I).
          </li>
          <li><strong>Segurança e prevenção de abusos:</strong> legítimo interesse (art. 7º, IX).</li>
        </List>
      </Section>

      <Section title="4. Com quem compartilhamos">
        <p>Para funcionar, a agenda usa estes serviços, que tratam dados apenas em nosso nome:</p>
        <List>
          <li>Supabase (banco de dados e login);</li>
          <li>Vercel (hospedagem do site);</li>
          <li>Google (login com a sua conta Google).</li>
        </List>
        <p>
          Quando você usa “Adicionar ao Google Agenda” ou os lembretes dos rituais, o texto do compromisso vai para a sua
          própria conta do Google Agenda, por escolha sua. Alguns desses serviços ficam fora do Brasil; a transferência
          internacional segue a LGPD (art. 33), com fornecedores que adotam garantias contratuais de proteção de dados.
        </p>
      </Section>

      <Section title="5. Por quanto tempo">
        <p>
          Enquanto você usar a agenda. Ao apagar seus dados no Perfil, as anotações e o perfil são removidos na hora;
          cópias de segurança do banco podem mantê-los por alguns dias antes de serem substituídas.
        </p>
      </Section>

      <Section title="6. Seus direitos">
        <p>A LGPD (art. 18) garante a você, e a agenda oferece direto em <strong>Meu Perfil → Seus dados</strong>:</p>
        <List>
          <li><strong>Acesso e portabilidade:</strong> baixe tudo o que guardamos em um arquivo.</li>
          <li><strong>Correção:</strong> edite qualquer anotação ou o perfil quando quiser.</li>
          <li><strong>Eliminação:</strong> apague todas as suas anotações e o perfil.</li>
          <li>
            <strong>Excluir também o acesso</strong> (o cadastro de login) ou qualquer outro pedido: escreva para o contato
            acima. Respondemos em até 15 dias.
          </li>
        </List>
        <p>
          Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD), em{' '}
          <a href="https://www.gov.br/anpd" target="_blank" rel="noreferrer" className="underline">gov.br/anpd</a>.
        </p>
      </Section>

      <Section title="7. Segurança">
        <p>
          Conexão sempre cifrada (HTTPS), login pelo Google (não guardamos senhas) e regras no banco de dados que permitem
          a cada pessoa ler apenas as próprias anotações. Se acontecer um incidente que traga risco a você, avisamos você e
          a ANPD.
        </p>
      </Section>

      <Section title="8. Mudanças nesta política">
        <p>Mudanças importantes são avisadas na agenda ou por email antes de valerem.</p>
      </Section>

      <Section title="9. Contato">
        <Contact />
      </Section>
    </Shell>
  );
}

export function TermsPage() {
  return (
    <Shell title="Termos de Uso">
      <Section title="1. O que é a Agenda Tempo de Ser">
        <p>
          Uma agenda digital de planejamento consciente: página diária, rituais da manhã e da noite, planejamento semanal,
          visão mensal, visão do futuro e meditações guiadas. Ao entrar, você aceita estes Termos e a{' '}
          <Link to="/privacidade" className="underline">Política de Privacidade</Link>.
        </p>
      </Section>

      <Section title="2. Acesso">
        <List>
          <li>O acesso é pessoal e feito com a sua conta Google. Só entra quem foi liberado pela {LEGAL.responsible}.</li>
          <li>Você é responsável pela segurança da sua conta Google e pelo que é feito com ela.</li>
          <li>O acesso pode ser suspenso em caso de uso abusivo ou que viole a lei.</li>
        </List>
      </Section>

      <Section title="3. Suas anotações">
        <p>
          O que você escreve é seu. A {LEGAL.responsible} guarda esse conteúdo apenas para mostrá-lo a você, gerar suas
          exportações e arquivos de calendário, conforme a Política de Privacidade. Você pode baixar ou apagar tudo a
          qualquer momento em Meu Perfil.
        </p>
      </Section>

      <Section title="4. Não é tratamento de saúde">
        <p>
          Os rituais, as reflexões e as meditações são ferramentas de autoconhecimento. Não substituem acompanhamento
          médico ou psicológico. Se estiver passando por um momento difícil, procure um profissional ou ligue para o CVV,
          no número 188 (gratuito, 24 horas).
        </p>
      </Section>

      <Section title="5. Disponibilidade">
        <p>
          Cuidamos para que a agenda funcione bem, mas pode haver interrupções, erros ou mudanças nas funções. Recomendamos
          baixar seus dados de tempos em tempos. Na medida permitida pela lei, não respondemos por perdas decorrentes de
          falhas de conexão ou de serviços de terceiros.
        </p>
      </Section>

      <Section title="6. Mudanças nestes Termos">
        <p>
          Estes Termos podem mudar. Mudanças importantes são avisadas na agenda ou por email antes de valerem. Se não
          concordar, você pode apagar seus dados e deixar de usar.
        </p>
      </Section>

      <Section title="7. Lei aplicável e contato">
        <p>
          Valem as leis brasileiras, incluindo o Código de Defesa do Consumidor e a LGPD, no foro do seu domicílio.
          Dúvidas e pedidos:
        </p>
        <Contact />
      </Section>
    </Shell>
  );
}
