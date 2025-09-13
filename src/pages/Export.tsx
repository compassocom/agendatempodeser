import React, { useState, useEffect } from 'react';

// A importação do supabaseClient deve funcionar após ajustar o tsconfig.json e reiniciar.
import { supabase } from '@/supabaseClient';

// --- Helper Functions ---
const displayData = (data, placeholder = "—") => {
  // Trata dados de texto simples
  if (typeof data === 'string' && data.trim() !== '') {
    return data.split('\n').map((line, i) => <span key={i} className="block">{line}</span>);
  }

  // Trata dados de array (JSONB ou text[])
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>;
    }
    const firstItem = data[0];

    // Se for um array de strings (ex: Tarefas)
    if (typeof firstItem === 'string') {
        return data.map((item, index) => <span key={index} className="block">{item}</span>);
    }
    // Se for um array de objetos (ex: Maiores Projetos)
    if (typeof firstItem === 'object' && firstItem !== null) {
        return data.map((item, index) => (
          <div key={index} className="mb-2 last:mb-0">
            {item.title && <strong className="block text-sm">{item.title}</strong>}
            {item.description && <p className="text-xs">{item.description}</p>}
          </div>
        ));
    }
  }
  
  return <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>;
};

// Extrai a resposta de um array de rituais (ex: ["daily_energy:*asd"])
const getAnswerFromRitual = (ritualArray, key, placeholder = "—") => {
    if (!Array.isArray(ritualArray) || ritualArray.length === 0) {
        return <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>;
    }
    const entry = ritualArray.find(item => typeof item === 'string' && item.startsWith(key));
    if (!entry) {
        return <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>;
    }
    const parts = entry.split(':*');
    return parts.length > 1 ? parts[1] : <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>;
};


const formatMonthTitle = (monthString) => {
    if (!monthString || typeof monthString !== 'string') return "MÊS";
    const [year, month] = monthString.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase();
};

const formatWeekTitle = (weekDate) => {
    if (!weekDate) return "SEMANA";
    const date = new Date(weekDate);
    date.setDate(date.getDate() + 1); 
    const day = date.toLocaleDateString('pt-BR', { day: '2-digit' });
    const month = date.toLocaleDateString('pt-BR', { month: 'long' });
    return `SEMANA DE ${day} DE ${month.toUpperCase()}`;
};


// --- Reusable UI Components ---
const Section = ({ title, children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md print:shadow-none print:border print:border-gray-200 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4">{title}</h3>
    <div className="text-gray-600 dark:text-gray-300 space-y-2 prose prose-sm max-w-none">{children}</div>
  </div>
);

const PrintableContainer = ({ id, title, children }) => (
  <div id={id} className="printable-section p-4 sm:p-8 bg-gray-100 print:bg-white dark:bg-gray-900">
    <div className="max-w-4xl mx-auto">
       {title && <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{title}</h1>}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  </div>
);


// --- Printable Components Alinhados com a Base de Dados ---

const PrintableMonthlyVision = ({ data }) => (
  <PrintableContainer id="monthly-vision" title={`VISÃO MACRO MENSAL - ${formatMonthTitle(data.month)}`}>
    <div className="grid md:grid-cols-2 gap-6">
        <Section title="MAIORES PROJETOS">
            <p className="font-semibold text-sm mb-2">Quais são os 3 projetos que, se concluídos este mês, trariam o maior impacto positivo para minha vida e me alinhariam com meu propósito? Quais são os primeiros passos tangíveis e inspiradores para cada um?</p>
            {displayData(data.major_projects)}
        </Section>
        <Section title="MAIORES EVENTOS">
            <p className="font-semibold text-sm mb-2">Quais são os eventos cruciais deste mês que exigem minha presença plena e autêntica? Como posso me preparar emocional, mental e fisicamente para vivenciá-los com total presença e alinhamento com meus valores?</p>
            {displayData(data.major_events)}
        </Section>
    </div>
     <Section title="REFLEXÕES DO MÊS">
        <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div><strong className="block mb-2">COMO ME PREPARO?</strong> {displayData(data.preparation_notes)}</div>
            <div><strong className="block mb-2">COMO SEREI O MEU MELHOR?</strong> {displayData(data.best_version_notes)}</div>
            <div><strong className="block mb-2">COMO SERIA MEU MÊS IDEAL?</strong> {displayData(data.ideal_month_vision)}</div>
        </div>
    </Section>
  </PrintableContainer>
);

const PrintableWeeklyPlanning = ({ data }) => (
  <PrintableContainer id="weekly-planning" title={formatWeekTitle(data.week_start_date)}>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
        <Section title="Ação Alinhada">
            <p className="font-semibold mb-2">Qual é a ação mais alinhada com meu propósito hoje, que, se realizada, fará uma diferença significativa?</p>
            {displayData(data.purpose_aligned_action)}
        </Section>
        <Section title="Interações Cruciais">
            <p className="font-semibold mb-2">Quais interações são cruciais hoje para construir relacionamentos autênticos e colaborativos?</p>
            {displayData(data.crucial_interactions)}
        </Section>
        <Section title="Ato de Autocuidado">
            <p className="font-semibold mb-2">Qual é o ato de autocuidado que nutrirá meu corpo, mente e espírito hoje?</p>
            {displayData(data.self_care_act)}
        </Section>
        <Section title="Nutrir Relacionamentos">
            <p className="font-semibold mb-2">Quem são as pessoas que me inspiram, me apoiam e me desafiam a crescer? Como posso nutrir esses relacionamentos?</p>
            {displayData(data.inspiring_people)}
        </Section>
    </div>
     <Section title="3 PILARES DO MÊS">
        <p className="font-semibold text-sm mb-2">Quais são os 3 pilares que sustentarão meu mês, me mantendo alinhado com meus valores e propósito?</p>
        {displayData(data.three_pillars)}
    </Section>
  </PrintableContainer>
);

const PrintableDailyPage = ({ data }) => {
    const timeSlots = ["6AM", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "1PM", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30"];
    
    const morningQuestions = [
        { key: 'daily_energy', text: "1- Qual é a energia que permeia meu dia hoje? Que mensagem ela traz para minha jornada?"},
        { key: 'thought_patterns', text: "2- Quais padrões de pensamento ou comportamento podem me desviar do meu caminho hoje?"},
        { key: 'conscious_choices', text: "3- Que escolhas conscientes posso fazer hoje para nutrir meu bem-estar e alinhar minhas ações?"},
        { key: 'express_love', text: "4- Como posso expressar amor, gratidão ou apreço a quem é importante para mim hoje?"},
        { key: 'expand_horizons', text: "5- Qual pequeno passo posso dar hoje para expandir meus horizontes e abraçar o desconhecido?"},
        { key: 'planting_seeds', text: "6- Quais sementes estou plantando hoje que florescerão no futuro? Como posso nutri-las com paciência e dedicação?"},
        { key: 'internal_criteria', text: "7- Quais são os critérios internos que guiarão minhas ações hoje? Como posso honrar minha integridade e me orgulhar?"}
    ];

    const eveningQuestions = [
        { key: 'blessings', text: "8- Quais bênçãos, grandes e pequenas, permearam meu dia hoje?"},
        { key: 'biggest_challenge', text: "9- Qual foi a maior provação que enfrentei hoje? Que forças descobri em mim mesmo ao superá-la?"},
        { key: 'emerging_wisdom', text: "10- Qual foi a sabedoria que emergiu das experiências de hoje?"},
        { key: 'misalignment_moments', text: "11- Quais foram os momentos de desalinho ou frustração hoje? Que lições posso extrair deles com compaixão por mim mesmo?"},
        { key: 'better_choices', text: "12- Quais escolhas ou ações poderiam ter nutrido mais meu bem-estar e propósito hoje?"},
        { key: 'sustaining_habits', text: "13- Quais hábitos me sustentaram hoje? Como posso celebrá-los e buscar formas de aprimoramento?"}
    ];

    const agenda = {};
    const convertTo12HourKey = (time24) => {
        if (!time24 || typeof time24 !== 'string') return null;
        const [hourStr, minute] = time24.split(':');
        let hour = parseInt(hourStr, 10);
        
        const ampm = hour >= 12 ? 'PM' : 'AM';
        
        hour = hour % 12;
        hour = hour ? hour : 12;

        if (minute === '00') return `${hour}${ampm}`;
        if (minute === '30') return `${hour}:${minute}`;

        const timeWithoutSuffix = `${hour}${minute === '00' ? '' : `:${minute}`}`;
        const slot = timeSlots.find(s => s.startsWith(timeWithoutSuffix) && s.endsWith(ampm));
        return slot || null;
    };

    const parseSchedule = (scheduleObject) => {
      if (typeof scheduleObject === 'object' && scheduleObject !== null) {
        for (const time24 in scheduleObject) {
          const task = scheduleObject[time24];
          const timeKey = convertTo12HourKey(time24);
          if (timeKey && task) {
              agenda[timeKey] = task;
          }
        }
      }
    };
    parseSchedule(data.morning_schedule);
    parseSchedule(data.afternoon_schedule);

    return (
    <PrintableContainer id="daily-page">
        <div className="text-center mb-4">
            <p>DATA: {displayData(data.date, '___/___/___')}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
                <Section title="3 PRINCIPAIS OBJETIVOS/PRIORIDADES">{displayData(data.main_priorities)}</Section>
                <Section title="MENSAGEM PARA SEU DIA">{displayData(data.day_message)}</Section>
                <Section title="RITUAL MATINAL">
                    {morningQuestions.map((q, index) => (
                        <div key={index}>
                            <p className="font-semibold text-sm my-2">{q.text}</p>
                            {getAnswerFromRitual(data.morning_ritual, q.key)}
                        </div>
                    ))}
                </Section>
            </div>

            <div className="lg:col-span-1">
                 <Section title="AGENDA DO DIA">
                    <div className="space-y-2">
                        {timeSlots.map((time, index) => (
                            <div key={`${time}-${index}`} className="flex items-center border-b dark:border-gray-700 pb-1">
                                <span className="w-16 text-sm font-semibold">{time}</span>
                                <span className="flex-1 text-sm">{displayData(agenda[time])}</span>
                            </div>
                        ))}
                    </div>
                 </Section>
            </div>

             <div className="lg:col-span-1 space-y-4">
                <Section title="TAREFAS QUE PRECISAM SER FEITAS HOJE">{displayData(data.tasks_to_do)}</Section>
                <Section title="3 PESSOAS QUE PRECISO ME CONECTAR HOJE">{displayData(data.people_to_connect)}</Section>
                <Section title="ESCRITA NOTURNA">
                     {eveningQuestions.map((q, index) => (
                        <div key={index}>
                            <p className="font-semibold text-sm my-2">{q.text}</p>
                            {getAnswerFromRitual(data.evening_reflection, q.key)}
                        </div>
                    ))}
                </Section>
            </div>
        </div>
    </PrintableContainer>
    );
};


export default function App() {
  const [plannerData, setPlannerData] = useState(null);
  const [foundDataTypes, setFoundDataTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setPlannerData(null);
    setFoundDataTypes([]);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) { 
        setError("Usuário não autenticado. Por favor, faça o login.");
        setLoading(false);
        return;
      }
      
      // Busca Direta em cada tabela
      const { data: dailyPageData } = await supabase
        .from('daily_pages')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', selectedDate)
        .single();

      const { data: weeklyPlanningData } = await supabase
        .from('weekly_plannings')
        .select('*')
        .eq('user_id', user.id)
        .lte('week_start_date', selectedDate)
        .gte('week_start_date', new Date(new Date(selectedDate).setDate(new Date(selectedDate).getDate() - 6)).toISOString().split('T')[0])
        .single();
        
      const { data: monthlyVisionData } = await supabase
        .from('monthly_visions')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', selectedDate.substring(0, 7))
        .single();

      const combinedData = {
        dailyPage: dailyPageData,
        weeklyPlanning: weeklyPlanningData,
        monthlyVision: monthlyVisionData
      };

      if (dailyPageData || weeklyPlanningData || monthlyVisionData) {
        setPlannerData(combinedData);
        const foundTypes = [];
        if (dailyPageData) foundTypes.push("Diário");
        if (weeklyPlanningData) foundTypes.push("Semanal");
        if (monthlyVisionData) foundTypes.push("Mensal");
        setFoundDataTypes(foundTypes);
      } else {
        setError("Nenhum dado encontrado para a data selecionada.");
      }

    } catch (err) {
      setError('Não foi possível carregar os dados. Verifique a conexão e tente novamente.');
      console.error('Erro ao buscar dados do Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (targetId) => {
    if (!plannerData) return;
    const styleId = 'print-styles';
    
    const oldStyle = document.getElementById(styleId);
    if (oldStyle) {
        oldStyle.remove();
    }

    const printStyles = `
      @media print {
        body * { visibility: hidden; }
        #printable-content-area, #${targetId}, #${targetId} * { visibility: visible; }
        #printable-content-area { display: block !important; }
        #${targetId} { position: absolute; left: 0; top: 0; width: 100%; }
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.id = styleId;
    styleSheet.innerText = printStyles;
    document.head.appendChild(styleSheet);
    
    window.print();
  };

  const PrintButton = ({ targetId, children }) => (
     <button
        onClick={() => handlePrint(targetId)}
        disabled={!plannerData || loading}
        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {children}
      </button>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200">
      <div className="no-print">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-6 relative">
          <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-2xl font-bold">Exportar e Imprimir Agenda</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Selecione uma data para buscar os dados e depois escolha o que deseja imprimir.</p>
              
              <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:bg-gray-400"
                >
                  {loading ? 'Buscando...' : 'Pesquisar'}
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mt-6 border-t dark:border-gray-700 pt-6">
                <PrintButton targetId="daily-page">Diário</PrintButton>
                <PrintButton targetId="weekly-planning">Semanal</PrintButton>
                <PrintButton targetId="monthly-vision">Mensal</PrintButton>
              </div>
          </div>
          <button onClick={toggleTheme} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              {theme === 'light' ? 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> : 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              }
          </button>
        </header>

        <main className="p-4">
          <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-40 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold">Leve sua jornada para o papel</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Aprofunde suas reflexões com a versão física da Agenda Tempo de Ser. Uma ferramenta poderosa para o autoconhecimento, longe das distrações digitais.</p>
                  <button className="mt-4 bg-gray-800 dark:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-900 dark:hover:bg-indigo-700 transition-colors">
                      Quero a minha agenda física
                  </button>
              </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div><p className="ml-4">Carregando seus dados...</p></div>
          )}
          {error && (
            <div className="text-center p-8 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg max-w-2xl mx-auto"><h3 className="font-bold text-lg mb-2">Ocorreu um erro</h3><p>{error}</p></div>
          )}
          {plannerData && (
            <div className="text-center p-4 bg-green-100 dark:bg-green-900/50 border border-green-400 dark:border-green-600 text-green-800 dark:text-green-200 rounded-lg max-w-2xl mx-auto">
              <p className="font-semibold">Dados encontrados: <span className="font-normal">{foundDataTypes.join(', ')}</span></p>
              <p className="text-sm mt-1">Agora você pode imprimir as seções desejadas.</p>
            </div>
          )}
        </main>
      </div>

      <div id="printable-content-area" className="hidden">
         {plannerData && <>
           <PrintableMonthlyVision data={plannerData.monthlyVision || {}} />
           <PrintableWeeklyPlanning data={plannerData.weeklyPlanning || {}} />
           <PrintableDailyPage data={plannerData.dailyPage || {}} />
         </>}
      </div>
    </div>
  );
}

