import React, { useState } from 'react';
import { Button } from './Button';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

type SectionSaveButtonProps = {
  onSave: () => Promise<void>;
};

export default function SectionSaveButton({ onSave }: SectionSaveButtonProps) {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleClick = async () => {
    setSaveState('saving');
    try {
      await onSave();
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000); // Volta ao normal após 2 segundos
    } catch (error) {
      toast.error("Erro ao salvar esta seção.");
      setSaveState('idle');
    }
  };

  return (
    <Button onClick={handleClick} variant="ghost" size="sm" className="ml-auto">
      {saveState === 'saving' && <Loader2 className="w-4 h-4 animate-spin text-stone-500 dark:text-white" />}
      {saveState === 'idle' && <Save className="w-4 h-4 text-stone-500 dark:text-white hover:text-stone-800" />}
      {saveState === 'saved' && <CheckCircle className="w-4 h-4 text-green-600" />}
    </Button>
  );
}