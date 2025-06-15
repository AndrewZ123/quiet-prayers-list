
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { PrayerRequest } from '@/types/PrayerRequest';
import { NotificationFrequency } from '@/contexts/SettingsContext';

export class NotificationService {
  private static isInitialized = false;

  static async initialize() {
    if (this.isInitialized || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      // Request permission for notifications
      const result = await LocalNotifications.requestPermissions();
      console.log('Notification permissions:', result);
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  static async scheduleRandomPrayerReminders(
    prayers: PrayerRequest[],
    frequency: NotificationFrequency,
    customHours?: number
  ) {
    if (!Capacitor.isNativePlatform()) {
      console.log('Notifications only work on native platforms');
      return;
    }

    // Filter out answered prayers
    const activePrayers = prayers.filter(prayer => !prayer.isAnswered);
    
    if (activePrayers.length === 0) {
      console.log('No active prayers to schedule notifications for');
      return;
    }

    try {
      // Cancel all existing prayer reminders first
      await this.cancelAllPrayerReminders();

      // Calculate hours between notifications
      let hoursInterval = 24; // default to daily
      switch (frequency) {
        case 'twice-daily':
          hoursInterval = 12;
          break;
        case 'weekly':
          hoursInterval = 168; // 24 * 7
          break;
        case 'custom':
          hoursInterval = customHours || 24;
          break;
        default:
          hoursInterval = 24;
      }

      // Schedule next 10 notifications (to cover a good period)
      const notifications = [];
      for (let i = 1; i <= 10; i++) {
        // Randomly select a prayer
        const randomPrayer = activePrayers[Math.floor(Math.random() * activePrayers.length)];
        
        const scheduleTime = new Date();
        scheduleTime.setHours(scheduleTime.getHours() + (hoursInterval * i));

        notifications.push({
          title: `Prayer Reminder`,
          body: `Time to pray for: ${randomPrayer.title}`,
          id: 1000 + i, // Use a range starting from 1000 for scheduled reminders
          schedule: { at: scheduleTime },
          sound: 'default',
          attachments: undefined,
          actionTypeId: '',
          extra: {
            prayerId: randomPrayer.id,
            isScheduledReminder: true
          }
        });
      }

      if (notifications.length > 0) {
        const options: ScheduleOptions = { notifications };
        await LocalNotifications.schedule(options);
        console.log(`Scheduled ${notifications.length} random prayer reminders`);
      }
    } catch (error) {
      console.error('Error scheduling random prayer reminders:', error);
    }
  }

  static async scheduleReminder(
    prayerId: string, 
    title: string, 
    body: string, 
    scheduleTime: Date
  ) {
    if (!Capacitor.isNativePlatform()) {
      console.log('Notifications only work on native platforms');
      return;
    }

    try {
      const options: ScheduleOptions = {
        notifications: [
          {
            title: `Prayer Reminder: ${title}`,
            body: body || 'Time to pray for this request',
            id: parseInt(prayerId.replace(/\D/g, '').slice(0, 8)) || Math.floor(Math.random() * 100000),
            schedule: { at: scheduleTime },
            sound: 'default',
            attachments: undefined,
            actionTypeId: '',
            extra: {
              prayerId: prayerId,
              isScheduledReminder: false
            }
          }
        ]
      };

      await LocalNotifications.schedule(options);
      console.log('Individual notification scheduled for:', scheduleTime);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  static async cancelReminder(prayerId: string) {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      const notificationId = parseInt(prayerId.replace(/\D/g, '').slice(0, 8)) || 0;
      await LocalNotifications.cancel({
        notifications: [{ id: notificationId }]
      });
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  static async cancelAllPrayerReminders() {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      // Cancel scheduled reminders (IDs 1001-1010)
      const idsToCancel = Array.from({ length: 10 }, (_, i) => ({ id: 1001 + i }));
      await LocalNotifications.cancel({ notifications: idsToCancel });
      console.log('Canceled all scheduled prayer reminders');
    } catch (error) {
      console.error('Error canceling all prayer reminders:', error);
    }
  }

  static async checkPermissions() {
    if (!Capacitor.isNativePlatform()) {
      return { display: 'granted' };
    }

    try {
      return await LocalNotifications.checkPermissions();
    } catch (error) {
      console.error('Error checking permissions:', error);
      return { display: 'denied' };
    }
  }
}
