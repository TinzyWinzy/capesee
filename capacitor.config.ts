import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.capesee.app',
  appName: 'Capesee',
  webDir: 'dist',
  backgroundColor: '#f3f0e8',
  plugins: {
    SplashScreen: { launchShowDuration: 1200, backgroundColor: '#0b211e', showSpinner: false },
    StatusBar: { style: 'DARK', backgroundColor: '#0b211e', overlaysWebView: false },
    CapacitorHttp: { enabled: true },
  },
  android: { backgroundColor: '#0b211e' },
  ios: { contentInset: 'always', backgroundColor: '#f3f0e8', allowsLinkPreview: false, handleApplicationNotifications: false, scrollEnabled: true },
};

export default config;
