
export interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  isAnswered: boolean;
  answeredDate?: Date;
  reflection?: string;
  notificationCount: number;
  lastNotificationDate?: Date;
  createdAt: Date;
}

export const createEmptyPrayerRequest = (): Omit<PrayerRequest, 'id' | 'createdAt'> => ({
  title: '',
  description: '',
  isAnswered: false,
  notificationCount: 0,
});
