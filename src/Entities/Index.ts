import { supabase } from '@/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

// --- Gestão de Utilizadores ---
export const User = {
  me: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  logout: async () => {
    await supabase.auth.signOut();
  },
  updateMyUserData: async (data: any) => {
    console.log("A atualizar dados do utilizador (real):", data);
    const { data: updatedUser, error } = await supabase.auth.updateUser({
      data: data
    });
    if (error) {
      console.error("Erro ao atualizar user_metadata:", error);
      throw error;
    }
    return updatedUser;
  },
};

// --- Função Genérica para Criar Entidades ---
const createEntity = (tableName: string) => ({
  filter: async (filters: any = {}) => {
    let query = supabase.from(tableName).select('*');

    for (const key in filters) {
      const filterValue = filters[key];
      if (typeof filterValue === 'object' && filterValue !== null && !Array.isArray(filterValue)) {
        if (filterValue.gte) query = query.gte(key, filterValue.gte);
        if (filterValue.lte) query = query.lte(key, filterValue.lte);
      } else {
        query = query.eq(key, filterValue);
      }
    }

    const { data, error } = await query;
    if (error) {
        console.error(`Erro ao buscar em ${tableName}:`, error);
        throw error;
    }
    return data || [];
  },
  create: async (data: any) => {
    const { data: result, error } = await supabase.from(tableName).insert(data).select();
    if (error) throw error;
    return { data: result, error: null };
  },
  update: async (id: string | number, dataToUpdate: any) => {
    const { data: result, error } = await supabase.from(tableName).update(dataToUpdate).eq('id', id).select();
    if (error) throw error;
    return { data: result, error: null };
  },
});

// --- Exporta as entidades conectadas ao Supabase ---
export const DailyPage = createEntity('daily_pages');
export const WeeklyPlanning = createEntity('weekly_plannings');
export const MonthlyVision = createEntity('monthly_visions');
export const FutureVision = createEntity('future_visions');
export const Meditation = createEntity('meditations');

