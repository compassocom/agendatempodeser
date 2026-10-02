// Datas no formato 'AAAA-MM-DD' usando o fuso local do usuário.
// (toISOString() usa UTC: no Brasil, depois das 21h, já devolveria o dia seguinte.)
export const toLocalDateString = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
