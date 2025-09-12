import React from 'react';

export default function PrintableDailyPage({ dailyData }) {
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const morningQuestions = [
    { key: 'daily_energy', text: 'Qual é a energia que permeia meu dia hoje?' },
    { key: 'limiting_patterns', text: 'Quais padrões podem me desviar do meu caminho?' },
    { key: 'conscious_choices', text: 'Que escolhas conscientes posso fazer hoje?' },
    { key: 'express_gratitude', text: 'Como posso expressar amor, gratidão ou apreço?' },
    { key: 'expand_horizons', text: 'Qual pequeno passo posso dar hoje?' },
    { key: 'plant_seeds', text: 'Quais sementes estou plantando hoje?' },
    { key: 'internal_criteria', text: 'Quais são os critérios internos que guiarão minhas ações?' }
  ];

  const eveningQuestions = [
    { key: 'daily_blessings', text: 'Quais bênçãos permearam meu dia?' },
    { key: 'major_challenge', text: 'Qual foi a maior provação que enfrentei?' },
    { key: 'wisdom_gained', text: 'Qual foi a sabedoria que emergiu?' },
    { key: 'moments_of_misalignment', text: 'Quais foram os momentos de desalinho?' },
    { key: 'better_choices', text: 'Quais escolhas poderiam ter nutrido mais?' },
    { key: 'sustaining_habits', text: 'Quais hábitos me sustentaram hoje?' }
  ];
  
  const morningSlots = ["6AM", "6:30", "7", "7:30", "8", "8:30", "9", "9:30", "10", "10:30", "11", "11:30", "12", "12:30"];
  const afternoonSlots = ["1PM", "1:30", "2", "2:30", "3", "3:30", "4", "4:30", "5", "5:30", "6", "6:30", "7", "7:30"];
  
  return (
    <div className="page-break font-serif text-black p-12 bg-white" style={{ fontFamily: 'serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #ccc' }}>
        <div style={{ width: '50%' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                {dailyData.date ? formatDate(dailyData.date) : 'Data não informada'}
            </h2>
        </div>
        <div style={{ width: '50%', textAlign: 'right' }}>
             <h3 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>3 PRINCIPAIS OBJETIVOS/PRIORIDADES</h3>
             <ol style={{ listStyle: 'decimal inside', marginLeft: 'auto', textAlign: 'left', display: 'inline-block' }}>
                {(dailyData.main_priorities && dailyData.main_priorities.length > 0) ? (
                    dailyData.main_priorities.map((p, i) => (
                        <li key={i} style={{ fontWeight: '600' }}>{p || '-'}</li>
                    ))
                ) : (
                    <li>-</li>
                )}
             </ol>
        </div>
      </div>
      
      <div style={{ marginBottom: '1.5rem', padding: '1rem', borderLeft: '4px solid #ddd', backgroundColor: '#f9f9f9' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.25rem' }}>MENSAGEM PARA SEU DIA</h3>
        <p style={{ fontStyle: 'italic' }}>{dailyData.day_message || 'Nenhuma mensagem definida.'}</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
        {/* Coluna da Esquerda */}
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>TAREFAS A FAZER</h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '0.9rem' }}>
              {(dailyData.tasks_to_do || []).map((task, i) => (
                <li key={i}>{task || '-'}</li>
              ))}
            </ul>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>HORÁRIOS (Manhã)</h3>
             <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
                {morningSlots.map(slot => (
                    <li key={slot} style={{ display: 'flex', borderBottom: '1px dotted #ccc', padding: '0.25rem 0' }}>
                        <strong style={{ width: '4rem' }}>{slot}</strong>
                        <span>{dailyData.morning_schedule?.[slot] || ''}</span>
                    </li>
                ))}
             </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>REVISÃO DIÁRIA</h3>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
              {morningQuestions.map(q => (
                <li key={q.key} style={{ marginBottom: '0.75rem' }}>
                  <p style={{ fontWeight: '600' }}>{q.text}</p>
                  <p style={{ paddingLeft: '0.5rem', fontStyle: 'italic', color: '#555' }}>{dailyData.morning_ritual?.[q.key] || '-'}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Coluna da Direita */}
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>PESSOAS PARA CONECTAR</h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '0.9rem' }}>
              {(dailyData.people_to_connect || []).map((person, i) => (
                <li key={i}>{person || '-'}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>HORÁRIOS (Tarde)</h3>
             <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
                {afternoonSlots.map(slot => (
                    <li key={slot} style={{ display: 'flex', borderBottom: '1px dotted #ccc', padding: '0.25rem 0' }}>
                        <strong style={{ width: '4rem' }}>{slot}</strong>
                        <span>{dailyData.afternoon_schedule?.[slot] || ''}</span>
                    </li>
                ))}
             </ul>
          </div>
        
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>REFLEXÃO NOTURNA</h3>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
              {eveningQuestions.map(q => (
                <li key={q.key} style={{ marginBottom: '0.75rem' }}>
                  <p style={{ fontWeight: '600' }}>{q.text}</p>
                  <p style={{ paddingLeft: '0.5rem', fontStyle: 'italic', color: '#555' }}>{dailyData.evening_reflection?.[q.key] || '-'}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}