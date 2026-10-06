import { useEffect } from 'react';

// Enquanto houver algo não salvo, o navegador pergunta antes de fechar ou recarregar a aba.
export function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
}

/** compara o que está na tela com o que foi salvo por último */
export const isDirty = (current: unknown, saved: unknown) => JSON.stringify(current) !== JSON.stringify(saved);
