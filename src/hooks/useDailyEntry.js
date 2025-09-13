// ANÁLISE E MELHORIA:
// 1. Extração da lógica de carregar e salvar dados de uma página diária para um hook reutilizável.
// 2. Isso remove a duplicação de código entre MorningRitualPage e EveningReflectionPage.
// 3. Centraliza o tratamento de estado (loading, saving) e erros.

import { useState, useEffect, useCallback } from 'react';
import { DailyPage, User } from "@/Entities";
import toast from 'react-hot-toast';

export function useDailyEntry(date) {
  const [entry, setEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadEntry = async () => {
      if (!date) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const user = await User.me();
        if (!user) return;

        const results = await DailyPage.filter({ date, created_by: user.email });
        if (results.length > 0) {
          setEntry(results[0]);
        } else {
          // Cria um objeto base se não existir entrada
          setEntry({ date, created_by: user.email });
        }
      } catch (error) {
        console.error("Erro ao carregar entrada diária:", error);
        toast.error("Não foi possível carregar os dados.");
      } finally {
        setIsLoading(false);
      }
    };
    loadEntry();
  }, [date]);

  const saveEntrySection = useCallback(async (sectionKey, sectionData) => {
    if (!entry) {
        toast.error("Dados não carregados, não é possível salvar.");
        return;
    }
    
    setIsSaving(true);
    const toastId = toast.loading('Salvando...');
    try {
        const payload = { ...entry, [sectionKey]: sectionData };
        
        if (entry.id) {
            await DailyPage.update(entry.id, { [sectionKey]: sectionData });
        } else {
            await DailyPage.create(payload);
        }
        toast.success('Salvo com sucesso!', { id: toastId });
        return true; // Sucesso
    } catch (error) {
        console.error(`Erro ao salvar ${sectionKey}:`, error);
        toast.error('Ocorreu um erro ao salvar.', { id: toastId });
        return false; // Falha
    } finally {
        setIsSaving(false);
    }
  }, [entry]);

  return { entry, setEntry, isLoading, isSaving, saveEntrySection };
}