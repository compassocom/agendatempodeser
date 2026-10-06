import { supabase } from '@/supabaseClient';

// --- Usuário logado ---
export const User = {
  me: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  logout: async () => {
    await supabase.auth.signOut();
  },
  updateMyUserData: async (data: any) => {
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
  get: async (id: string | number) => {
    const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
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


// --- Seus dados (LGPD) ---
const MY_TABLES = ['daily_pages', 'weekly_plannings', 'monthly_visions', 'future_visions'] as const;

/** tudo o que a agenda guarda da pessoa, para baixar */
export const exportMyData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Sessão expirada');
  const tables = await Promise.all(
    MY_TABLES.map(async (table) => {
      const { data, error } = await supabase.from(table).select('*').eq('user_id', user.id);
      if (error) throw error;
      return [table, data ?? []] as const;
    })
  );
  return {
    exported_at: new Date().toISOString(),
    account: { id: user.id, email: user.email, created_at: user.created_at, profile: user.user_metadata },
    ...Object.fromEntries(tables),
  };
};

/** apaga todas as anotações da pessoa e o que ela escreveu no perfil */
export const deleteMyData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Sessão expirada');
  for (const table of MY_TABLES) {
    const { error } = await supabase.from(table).delete().eq('user_id', user.id);
    if (error) throw error;
    // sem permissão de apagar (RLS), o banco não dá erro: só não apaga. Confere.
    const { count, error: countError } = await supabase.from(table).select('id', { count: 'exact', head: true }).eq('user_id', user.id);
    if (countError) throw countError;
    if (count) throw new Error(`Não foi possível apagar tudo de ${table}`);
  }
  // o nome e o email vêm do Google e ficam; o resto do perfil é limpo
  await supabase.auth.updateUser({
    data: { bio: null, goals: null, values: null, inspiration: null, notifications: null, hasCompletedOnboarding: null },
  });
};
