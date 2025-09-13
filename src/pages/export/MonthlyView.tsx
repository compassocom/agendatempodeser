import React from 'react';

const MonthlyView = () => {
  return (
    <div className="printable-a4">
      {/* Aqui recriamos a estrutura do seu PDF com HTML/JSX */}
      <h1 style={{ textAlign: 'center', fontSize: '24pt', fontWeight: 'bold', marginBottom: '30px' }}>
        [cite_start]VISÃO MACRO MENSAL [cite: 1]
      </h1>

      <div style={{ display: 'flex', gap: '30px' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '16pt', borderBottom: '2px solid #333', paddingBottom: '5px' }}>
            [cite_start]MAIORES PROJETOS [cite: 2]
          </h2>
          <p style={{ marginTop: '15px', fontStyle: 'italic' }}>
            [cite_start]Quais são os 3 projetos que, se concluídos este mês, trariam o maior impacto positivo para minha vida e me alinhariam com meu propósito? [cite: 3]
          </p>
          <div style={{ border: '1px solid #ccc', height: '100px', marginTop: '10px' }}></div>
          
          <p style={{ marginTop: '15px', fontStyle: 'italic' }}>
            [cite_start]Quais são os primeiros passos tangíveis e inspiradores para cada um? [cite: 4]
          </p>
          <div style={{ border: '1px solid #ccc', height: '100px', marginTop: '10px' }}></div>
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '16pt', borderBottom: '2px solid #333', paddingBottom: '5px' }}>
            [cite_start]MAIORES EVENTOS [cite: 5]
          </h2>
          <p style={{ marginTop: '15px', fontStyle: 'italic' }}>
            [cite_start]Quais são os eventos cruciais deste mês que exigem minha presença plena e autêntica? [cite: 6]
          </p>
          <div style={{ border: '1px solid #ccc', height: '100px', marginTop: '10px' }}></div>
          
          <p style={{ marginTop: '15px', fontStyle: 'italic' }}>
            [cite_start]Como posso me preparar emocional, mental e fisicamente para vivenciá-los com total presença e alinhamento com meus valores? [cite: 7]
          </p>
          <div style={{ border: '1px solid #ccc', height: '100px', marginTop: '10px' }}></div>
        </div>
      </div>
      
      {/* ... Aqui entraria a grade do calendário mensal ... */}
    </div>
  );
};

export default MonthlyView;