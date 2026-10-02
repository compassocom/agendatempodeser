// Catálogo de meditações guiadas exibidas em /Meditations e tocadas em /MeditationPlayer.
// Cada parágrafo do roteiro (separado por linha em branco) vira um passo narrado.
export type MeditationItem = {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  script: string;
};

export const MEDITATIONS: MeditationItem[] = [
  {
    id: '1',
    title: 'Respiração Consciente',
    description: 'Uma pausa de 5 minutos para focar na sua respiração e acalmar a mente.',
    type: 'Respiração',
    duration: 5,
    script: `Encontre uma posição confortável e deixe os ombros relaxarem.

Feche os olhos suavemente, ou baixe o olhar para um ponto à sua frente.

Inspire pelo nariz, devagar, contando até quatro.

Segure o ar por um instante, sem esforço.

Solte o ar pela boca, lentamente, contando até seis.

Continue nesse ritmo. Inspire... e solte, um pouco mais devagar do que entrou.

Se a mente se distrair, apenas perceba, e volte com gentileza para a respiração.

Sinta o ar fresco ao entrar e morno ao sair.

Mais algumas respirações, no seu próprio tempo.

Agora deixe a respiração voltar ao natural. Mexa os dedos, abra os olhos, e leve essa calma com você.`,
  },
  {
    id: '2',
    title: 'Escaneamento Corporal',
    description: 'Relaxe cada parte do seu corpo, da cabeça aos pés, liberando a tensão.',
    type: 'Atenção Plena',
    duration: 10,
    script: `Deite-se ou sente-se de forma confortável, com a coluna apoiada.

Respire fundo três vezes, soltando o ar devagar.

Leve a atenção para o topo da cabeça. Perceba qualquer sensação, sem julgar.

Desça para a testa, os olhos e o maxilar. Deixe que tudo se solte.

Sinta o pescoço e os ombros. A cada expiração, deixe-os um pouco mais pesados.

Percorra os braços, até a ponta dos dedos. Note o calor, o formigamento, o peso.

Leve a atenção ao peito e à barriga, subindo e descendo com a respiração.

Perceba as costas, da nuca até a lombar, apoiadas e seguras.

Sinta o quadril, as coxas e os joelhos relaxando.

Desça pelas pernas até os pés. Sinta o contato deles com o chão.

Agora perceba o corpo inteiro, de uma só vez, respirando em paz.

Quando estiver pronto, movimente-se devagar e abra os olhos.`,
  },
  {
    id: '3',
    title: 'Visualização da Gratidão',
    description: 'Conecte-se com o sentimento de gratidão visualizando as coisas boas da sua vida.',
    type: 'Gratidão',
    duration: 7,
    script: `Sente-se confortavelmente e feche os olhos.

Respire fundo, e ao soltar o ar, deixe o dia de lado por alguns minutos.

Traga à mente uma pessoa que você ama. Veja o rosto dela, o sorriso.

Sinta no peito o carinho que você tem por essa pessoa, e agradeça em silêncio.

Agora lembre de um momento simples de hoje que foi bom: uma refeição, uma conversa, um raio de sol.

Permita que esse momento se expanda. Note como o corpo responde à lembrança.

Pense em algo em você mesmo pelo qual é grato: uma qualidade, um esforço, uma conquista.

Acolha essa parte de você com a mesma gentileza que ofereceria a um amigo.

Respire essa gratidão para dentro, e ao expirar, imagine-a se espalhando ao seu redor.

Quando quiser, abra os olhos, levando esse sentimento para o resto do seu dia.`,
  },
];
