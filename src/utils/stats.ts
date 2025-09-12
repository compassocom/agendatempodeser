// A correção está na palavra "export" no início da linha
export function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  // Converte as strings de data para números e ordena da mais recente para a mais antiga
  const sortedTimestamps = dates
    .map(d => new Date(d + 'T00:00:00').getTime())
    .sort((a, b) => b - a);

  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const mostRecentTimestamp = sortedTimestamps[0];
  const oneDay = 24 * 60 * 60 * 1000;

  // Verifica se a última entrada foi hoje ou ontem. Se não, a sequência está quebrada.
  if ((todayTimestamp - mostRecentTimestamp) / oneDay > 1) {
    return 0;
  }

  currentStreak = 1;
  // Percorre as datas para encontrar a sequência
  for (let i = 0; i < sortedTimestamps.length - 1; i++) {
    const diff = (sortedTimestamps[i] - sortedTimestamps[i + 1]) / oneDay;
    if (diff === 1) {
      currentStreak++;
    } else if (diff > 1) {
      // Encontrou um buraco, a sequência para aqui.
      break;
    }
  }
  
  return currentStreak;
}