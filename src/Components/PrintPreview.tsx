import React, { ReactNode } from 'react';
import { X, Printer } from 'lucide-react'; // Usando ícones que você já tem no projeto

interface PrintPreviewProps {
  children: ReactNode; // O conteúdo a ser impresso (nossas páginas A4)
  onClose: () => void; // Função para fechar o preview
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ children, onClose }) => {
  const handlePrint = () => {
    window.print(); // Aciona a impressão do navegador
  };

  return (
    <div className="print-preview-overlay">
      <div className="print-preview-toolbar">
        <button onClick={onClose} title="Fechar Pré-visualização">
          <X size={24} />
          <span>Fechar</span>
        </button>
        <button onClick={handlePrint} title="Imprimir">
          <Printer size={24} />
          <span>Imprimir</span>
        </button>
      </div>
      <div className="print-preview-content">
        {children}
      </div>
    </div>
  );
};

export default PrintPreview;