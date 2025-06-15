
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

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
              prayerId: prayerId
            }
          }
        ]
      };

      await LocalNotifications.schedule(options);
      console.log('Notification scheduled for:', scheduleTime);
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
