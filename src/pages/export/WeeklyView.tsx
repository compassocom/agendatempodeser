import React from 'react';

const WeeklyView = () => {
  return (
    <div className="printable-a4 weekly-view">
      <h1 className="main-title">SEMANA A FRENTE</h1>

      <div className="content-grid">
        <div className="main-questions">
          <div className="question-block">
            [cite_start]<p>Qual é a ação mais alinhada com meu propósito hoje, que, se realizada, fará uma diferença significativa? [cite: 22]</p>
            [cite_start]<p>Como posso abordá-la com foco e intenção? [cite: 23]</p>
          </div>
          <div className="question-block">
            <p>Quais interações são cruciais hoje para construir relacionamentos autênticos e colaborativos? [cite_start]Como posso me comunicar com clareza, empatia e coragem? [cite: 24]</p>
          </div>
          <div className="question-block">
            [cite_start]<p>Qual é o ato de autocuidado que nutrirá meu corpo, mente e espírito hoje? [cite: 25]</p>
            [cite_start]<p>Como posso honrar minhas necessidades e recarregar minhas energias? [cite: 26]</p>
          </div>
        </div>

        <div className="side-panel">
          <div className="pillars-block">
            [cite_start]<h3>Quais são os 3 pilares que sustentarão meu mês, me mantendo alinhado com meus valores e propósito? [cite: 29]</h3>
            <div className="placeholder-box tall"></div>
          </div>
          <div className="insights-block">
            <h3>Espaço para insights, intuições e reflexões que emergem ao longo da semana.</h3>
            <div className="placeholder-box tall"></div>
          </div>
        </div>
      </div>

      <div className="weekly-schedule">
        [cite_start]<p className="schedule-prompt">Anote as datas dos principais eventos, atividades e projetos da semana. [cite: 32]</p>
        <div className="days-grid">
          <div className="day-column">
            [cite_start]<h4>SEGUNDA [cite: 33]</h4>
            <div className="placeholder-box"></div>
          </div>
          <div className="day-column">
            [cite_start]<h4>TERÇA-FEIRA [cite: 34]</h4>
            <div className="placeholder-box"></div>
          </div>
          <div className="day-column">
            [cite_start]<h4>QUARTA-FEIRA [cite: 35]</h4>
            <div className="placeholder-box"></div>
          </div>
          <div className="day-column">
            [cite_start]<h4>QUINTA-FEIRA [cite: 36]</h4>
            <div className="placeholder-box"></div>
          </div>
          <div className="day-column">
            [cite_start]<h4>SEXTA-FEIRA [cite: 36]</h4>
            <div className="placeholder-box"></div>
          </div>
          <div className="day-column">
            [cite_start]<h4>SÁBADO [cite: 36]</h4>
            <div className="placeholder-box"></div>
          </div>
          <div className="day-column">
            [cite_start]<h4>DOMINGO [cite: 36]</h4>
            <div className="placeholder-box"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyView;