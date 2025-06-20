
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.af743d99b5e54e49b35b63fb5cabd4e6',
  appName: 'quiet-prayers-list',
  webDir: 'dist',
  server: {
    url: 'https://af743d99-b5e5-4e49-b35b-63fb5cabd4e6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#ffffff'
  }
};

export default config;
