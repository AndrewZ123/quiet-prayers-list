
import React, { createContext, useContext, useState, useEffect } from 'react';

export type NotificationFrequency = 'daily' | 'twice-daily' | 'weekly' | 'custom';

interface SettingsContextType {
  notificationFrequency: NotificationFrequency;
  customHours: number;
  setNotificationFrequency: (frequency: NotificationFrequency) => void;
  setCustomHours: (hours: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationFrequency, setNotificationFrequency] = useState<NotificationFrequency>('daily');
  const [customHours, setCustomHours] = useState(24);

  // Load settings from localStorage
  useEffect(() => {
    const savedFrequency = localStorage.getItem('notification-frequency') as NotificationFrequency;
    const savedCustomHours = localStorage.getItem('custom-notification-hours');
    
    if (savedFrequency) {
      setNotificationFrequency(savedFrequency);
    }
    if (savedCustomHours) {
      setCustomHours(parseInt(savedCustomHours));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('notification-frequency', notificationFrequency);
  }, [notificationFrequency]);

  useEffect(() => {
    localStorage.setItem('custom-notification-hours', customHours.toString());
  }, [customHours]);

  return (
    <SettingsContext.Provider
      value={{
        notificationFrequency,
        customHours,
        setNotificationFrequency,
        setCustomHours,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
