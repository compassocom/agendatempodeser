import React from 'react';

export default function PrintableFutureVision({ visionData }: { visionData: any }) {
  const reflectionQuestions = [
    { key: 'ideal_future_description', title: 'Como eu imagino meu futuro ideal?' },
    { key: 'life_purpose', title: 'Qual o propósito que me motiva?' },
    { key: 'person_i_want_to_be', title: 'Que tipo de pessoa eu sou?' },
    { key: 'most_important_to_achieve', title: 'O que é mais importante para mim?' },
    { key: 'end_of_life_reflection', title: 'No final da minha vida, quero saber que...' }
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="page-break font-serif text-black p-8 bg-white" style={{ fontFamily: 'serif' }}>
      <header className="text-center mb-8 pb-4 border-b-2 border-gray-400">
        <h1 className="text-4xl font-bold" style={{ color: '#333' }}>
            Visão do Futuro
        </h1>
        <p className="text-lg text-gray-600 mt-2">Seus objetivos e reflexões de longo prazo</p>
      </header>
      
      <div className="space-y-8">
        {reflectionQuestions.map(q => (
          <section key={q.key}>
            <h3 className="text-xl font-bold mb-2">{q.title}</h3>
            <p className="italic text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>{visionData[q.key] || '-'}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="text-2xl font-bold border-b pb-2 mb-4">Objetivos de 1 Ano</h2>
          {(visionData.one_year_goals || []).map((goal: any, index: number) => goal.goal && (
            <div key={index} className="mb-6 pb-4 border-b border-gray-200">
              <p className="font-semibold text-lg">{goal.goal}</p>
              {goal.steps && <p className="mt-1 text-gray-700" style={{ whiteSpace: 'pre-wrap' }}><strong>Passos:</strong> {goal.steps}</p>}
              {goal.target_date && <p className="mt-1 text-sm text-gray-600"><strong>Data Alvo:</strong> {formatDate(goal.target_date)}</p>}
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-bold border-b pb-2 mb-4">Objetivos de 3 Anos</h2>
          {(visionData.three_year_goals || []).map((goal: any, index: number) => goal.goal && (
            <div key={index} className="mb-6 pb-4 border-b border-gray-200">
              <p className="font-semibold text-lg">{goal.goal}</p>
              {goal.steps && <p className="mt-1 text-gray-700" style={{ whiteSpace: 'pre-wrap' }}><strong>Passos:</strong> {goal.steps}</p>}
              {goal.target_date && <p className="mt-1 text-sm text-gray-600"><strong>Data Alvo:</strong> {formatDate(goal.target_date)}</p>}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

