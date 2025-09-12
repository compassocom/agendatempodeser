import React from 'react';

export default function PrintableMonthlyVision({ visionData }: { visionData: any }) {
  const monthName = visionData.month 
    ? new Date(visionData.month + '-02').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : "Mês não definido";

  return (
    <div className="page-break font-serif text-black p-8 bg-white" style={{ fontFamily: 'serif' }}>
      <header className="text-center mb-8 pb-4 border-b-2 border-gray-400">
        <h1 className="text-4xl font-bold capitalize" style={{ color: '#333' }}>
            {monthName}
        </h1>
        <p className="text-lg text-gray-600 mt-2">Visão Macro Mensal</p>
      </header>

      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-10">
          <section>
            <h3 className="text-lg font-bold mb-2">MAIORES PROJETOS</h3>
            {(visionData.major_projects || []).map((project: any, index: number) => project.title && (
              <div key={index} className="mb-4 pb-2 border-b">
                <p className="font-semibold">{project.title}</p>
                <p className="text-sm text-gray-700 mt-1" style={{ whiteSpace: 'pre-wrap' }}>{project.description}</p>
                {project.first_steps && (
                    <div style={{ marginTop: '0.5rem' }}>
                        <p className="text-sm font-semibold text-gray-800">Primeiros Passos:</p>
                        <p className="text-sm italic text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>{project.first_steps}</p>
                    </div>
                )}
              </div>
            ))}
          </section>
          <section>
            <h3 className="text-lg font-bold mb-2">MAIORES EVENTOS</h3>
            {(visionData.major_events || []).map((event: any, index: number) => event.title && (
              <div key={index} className="mb-4 pb-2 border-b">
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm italic text-gray-700 mt-1" style={{ whiteSpace: 'pre-wrap' }}>{event.preparation}</p>
              </div>
            ))}
          </section>
        </div>
        <div className="space-y-10">
            <section>
                <h3 className="text-lg font-bold mb-2">COMO ME PREPARO?</h3>
                <p className="p-2 min-h-[120px] text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>{visionData.preparation_notes || ''}</p>
            </section>
            <section>
                <h3 className="text-lg font-bold mb-2">COMO SEREI A MINHA MELHOR VERSÃO?</h3>
                <p className="p-2 min-h-[120px] text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>{visionData.best_version_notes || ''}</p>
            </section>
            <section>
                <h3 className="text-lg font-bold mb-2">COMO SERIA MEU MÊS IDEAL?</h3>
                <p className="p-2 min-h-[120px] text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>{visionData.ideal_month_vision || ''}</p>
            </section>
        </div>
      </div>
    </div>
  );
}