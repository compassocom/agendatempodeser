// Esta função simula uma chamada a um Modelo de Linguagem Grande (LLM).
// Ela recebe um prompt e um "esquema" de como a resposta JSON deve ser.

export const InvokeLLM = async (params: {
  prompt: string;
  response_json_schema: any; // Usando 'any' para simplificar o mock
}): Promise<any> => {
  
  console.log("Simulando chamada de IA com o prompt:", params.prompt);
  
  // Simula um atraso de rede para parecer mais realista
  await new Promise(resolve => setTimeout(resolve, 1500)); 

  // Devolve uma resposta de exemplo baseada no que foi pedido no prompt
  if (params.response_json_schema.properties.themes) {
    // Se pediu por temas e resumo (como no Resumo da Semana)
    return {
      themes: ["Foco em Projetos", "Gratidão", "Conexão Familiar"],
      summary: "Sua semana foi produtiva, com um belo equilíbrio entre o trabalho e momentos de gratidão pessoal."
    };
  }

  if (params.response_json_schema.properties.quote) {
    // Se pediu por uma citação (como na Citação do Dia)
    return {
      quote: "A clareza que você busca hoje é a semente para a conquista de amanhã."
    };
  }

  // Resposta padrão para qualquer outro caso
  return {
    mockResponse: "Esta é uma resposta simulada da IA."
  };
};