
import React, { createContext, useContext, useState, useEffect } from 'react';

export type NotificationFrequency = '15-mins' | '30-mins' | '1-hour' | '3-hours' | '6-hours';

interface SettingsContextType {
  notificationFrequency: NotificationFrequency;
  setNotificationFrequency: (frequency: NotificationFrequency) => void;
  getHoursFromFrequency: (frequency: NotificationFrequency) => number;
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
  const [notificationFrequency, setNotificationFrequency] = useState<NotificationFrequency>('1-hour');

  const getHoursFromFrequency = (frequency: NotificationFrequency): number => {
    switch (frequency) {
      case '15-mins':
        return 0.25;
      case '30-mins':
        return 0.5;
      case '1-hour':
        return 1;
      case '3-hours':
        return 3;
      case '6-hours':
        return 6;
      default:
        return 1;
    }
  };

  // Load settings from localStorage
  useEffect(() => {
    const savedFrequency = localStorage.getItem('notification-frequency') as NotificationFrequency;
    
    if (savedFrequency) {
      setNotificationFrequency(savedFrequency);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('notification-frequency', notificationFrequency);
  }, [notificationFrequency]);

  return (
    <SettingsContext.Provider
      value={{
        notificationFrequency,
        setNotificationFrequency,
        getHoursFromFrequency,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
