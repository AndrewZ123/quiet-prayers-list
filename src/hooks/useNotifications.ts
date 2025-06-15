
import { useState, useEffect } from 'react';
import { NotificationService } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeNotifications = async () => {
      await NotificationService.initialize();
      const permissions = await NotificationService.checkPermissions();
      setHasPermission(permissions.display === 'granted');
    };

    initializeNotifications();
  }, []);

  const scheduleReminder = async (
    prayerId: string,
    title: string,
    description: string,
    reminderTime: Date
  ) => {
    if (!hasPermission) {
      toast({
        title: "Permission Required",
        description: "Please enable notifications in your device settings",
        variant: "destructive",
      });
      return false;
    }

    try {
      await NotificationService.scheduleReminder(
        prayerId,
        title,
        description,
        reminderTime
      );
      
      toast({
        title: "Reminder Set",
        description: `You'll be reminded to pray for "${title}"`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule reminder",
        variant: "destructive",
      });
      return false;
    }
  };

  const scheduleRandomReminders = async (prayers: any[], frequency: any, customHours?: number) => {
    if (!hasPermission) {
      toast({
        title: "Permission Required",
        description: "Please enable notifications in your device settings",
        variant: "destructive",
      });
      return false;
    }

    try {
      await NotificationService.scheduleRandomPrayerReminders(prayers, frequency, customHours);
      
      toast({
        title: "Reminders Scheduled",
        description: "Random prayer reminders have been set up",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule reminders",
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelReminder = async (prayerId: string) => {
    try {
      await NotificationService.cancelReminder(prayerId);
      return true;
    } catch (error) {
      console.error('Failed to cancel reminder:', error);
      return false;
    }
  };

  return {
    hasPermission,
    scheduleReminder,
    scheduleRandomReminders,
    cancelReminder,
  };
};
