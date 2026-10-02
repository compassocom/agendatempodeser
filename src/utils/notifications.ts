// Utilitário para gerenciar notificações de calendário

export interface NotificationSettings {
  enabled: boolean;
  morningTime: string;
  eveningTime: string;
  dismissed: boolean;
  dismissedAt?: string;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  morningTime: '07:00',
  eveningTime: '20:00',
  dismissed: false,
};

export const getNotificationSettings = (userMetadata: any): NotificationSettings => {
  if (!userMetadata?.notifications) {
    return DEFAULT_SETTINGS;
  }
  return {
    ...DEFAULT_SETTINGS,
    ...userMetadata.notifications,
  };
};

export const shouldShowNotificationPrompt = (userMetadata: any): boolean => {
  const settings = getNotificationSettings(userMetadata);
  
  // Se já ativou notificações, não mostrar
  if (settings.enabled) return false;
  
  // Se foi descartado, não mostrar mais
  if (settings.dismissed) return false;
  
  return true;
};

export const dismissNotificationPrompt = () => {
  return {
    notifications: {
      dismissed: true,
      dismissedAt: new Date().toISOString(),
    },
  };
};

export const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
  return {
    notifications: {
      ...settings,
      dismissed: false, // Reset dismissal quando ativa
      dismissedAt: undefined,
    },
  };
};

export const isTimeToNotify = (settings: NotificationSettings): { type?: 'morning' | 'evening' } => {
  const now = new Date();
  const currentHour = String(now.getHours()).padStart(2, '0');
  const currentMinute = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHour}:${currentMinute}`;

  // Verificar se é hora da manhã (considerar uma janela de 1 hora)
  const [morningHour, morningMin] = settings.morningTime.split(':').map(Number);
  const morningStart = `${String(morningHour).padStart(2, '0')}:${String(morningMin).padStart(2, '0')}`;
  const morningEnd = `${String((morningHour + 1) % 24).padStart(2, '0')}:${String(morningMin).padStart(2, '0')}`;

  if (currentTime >= morningStart && currentTime < morningEnd) {
    return { type: 'morning' };
  }

  // Verificar se é hora da noite (considerar uma janela de 1 hora)
  const [eveningHour, eveningMin] = settings.eveningTime.split(':').map(Number);
  const eveningStart = `${String(eveningHour).padStart(2, '0')}:${String(eveningMin).padStart(2, '0')}`;
  const eveningEnd = `${String((eveningHour + 1) % 24).padStart(2, '0')}:${String(eveningMin).padStart(2, '0')}`;

  if (currentTime >= eveningStart && currentTime < eveningEnd) {
    return { type: 'evening' };
  }

  return {};
};
