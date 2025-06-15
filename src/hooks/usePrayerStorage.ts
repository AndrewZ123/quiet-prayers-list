
import { useState, useEffect } from 'react';
import { PrayerRequest } from '@/types/PrayerRequest';

const STORAGE_KEY = 'prompted-prayers';

export const usePrayerStorage = () => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);

  // Load prayers from localStorage on mount
  useEffect(() => {
    try {
      const storedPrayers = localStorage.getItem(STORAGE_KEY);
      if (storedPrayers) {
        const parsedPrayers = JSON.parse(storedPrayers);
        // Convert date strings back to Date objects
        const prayersWithDates = parsedPrayers.map((prayer: any) => ({
          ...prayer,
          createdAt: new Date(prayer.createdAt),
          answeredDate: prayer.answeredDate ? new Date(prayer.answeredDate) : undefined,
          lastNotificationDate: prayer.lastNotificationDate ? new Date(prayer.lastNotificationDate) : undefined,
        }));
        setPrayers(prayersWithDates);
      }
    } catch (error) {
      console.error('Error loading prayers from storage:', error);
    }
  }, []);

  // Save prayers to localStorage whenever prayers change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prayers));
    } catch (error) {
      console.error('Error saving prayers to storage:', error);
    }
  }, [prayers]);

  const addPrayer = (title: string, description: string) => {
    const newPrayer: PrayerRequest = {
      id: crypto.randomUUID(),
      title,
      description,
      isAnswered: false,
      notificationCount: 0,
      createdAt: new Date(),
    };

    setPrayers(prev => [newPrayer, ...prev]);
    return newPrayer;
  };

  const updatePrayer = (updatedPrayer: PrayerRequest) => {
    setPrayers(prev =>
      prev.map(prayer =>
        prayer.id === updatedPrayer.id ? updatedPrayer : prayer
      )
    );
  };

  const incrementPrayerCount = (prayerId: string) => {
    setPrayers(prev =>
      prev.map(prayer =>
        prayer.id === prayerId
          ? {
              ...prayer,
              notificationCount: prayer.notificationCount + 1,
              lastNotificationDate: new Date(),
            }
          : prayer
      )
    );
  };

  const deletePrayer = (prayerId: string) => {
    setPrayers(prev => prev.filter(prayer => prayer.id !== prayerId));
  };

  return {
    prayers,
    addPrayer,
    updatePrayer,
    incrementPrayerCount,
    deletePrayer,
  };
};
