import React from 'react';

export default function PrintableWeeklyPlanning({ weeklyData }) {
  const getWeekRange = (startDateString) => {
    if (!startDateString) return "Semana não definida";
    const start = new Date(startDateString + 'T00:00:00');
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const endOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const startFormatted = start.toLocaleDateString('pt-BR', options);
    const endFormatted = end.toLocaleDateString('pt-BR', endOptions);
    return `Semana de ${startFormatted} a ${endFormatted}`;
  };

  const reflectionQuestions = [
    { key: 'purpose_aligned_action', title: 'Ação Alinhada com Propósito' },
    { key: 'crucial_interactions', title: 'Interações Cruciais' },
    { key: 'self_care_act', title: 'Ato de Autocuidado' },
    { key: 'inspiring_people', title: 'Pessoas Inspiradoras' },
    { key: 'three_pillars', title: 'Três Pilares do Mês' },
    { key: 'insights_reflections', title: 'Insights e Reflexões' }
  ];

  const calendarText = weeklyData?.week_calendar?.text || '';

  return (
    <div className="p-12 font-serif bg-white text-black page-break" style={{'--tw-text-opacity': 1, color: 'rgba(0, 0, 0, var(--tw-text-opacity))'}}>
        <header className="text-center mb-8 pb-4 border-b-2 border-gray-400">
            <h1 className="text-4xl font-bold" style={{ color: '#333' }}>
                {getWeekRange(weeklyData.week_start_date)}
            </h1>
            <p className="text-lg text-gray-600 mt-2">Planejamento Semanal</p>
        </header>

        <div className="mb-6 p-4 border-l-4 border-gray-300 bg-gray-50">
            <h3 className="font-bold text-lg mb-2">EVENTOS, ATIVIDADES E PROJETOS DA SEMANA</h3>
            {calendarText.trim() !== '' ? (
              <p style={{ whiteSpace: 'pre-wrap', fontFamily: 'sans-serif' }}>{calendarText}</p>
            ) : (
              <p className="italic text-gray-600">Nenhum evento registrado para esta semana.</p>
            )}
        </div>

        <div className="space-y-6">
            {reflectionQuestions.map(q => (
                <div key={q.key}>
                    <h3 className="font-bold text-lg border-b pb-1 mb-2">{q.title}</h3>
                    <p className="italic text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>{weeklyData[q.key] || '-'}</p>
                </div>
            ))}
        </div>
    </div>
  );
}