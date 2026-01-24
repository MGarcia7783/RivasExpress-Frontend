import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'desing',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '722324541772-a1uju3rioqjpfbumcsk6nfi3hfol4hp3.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
  server: {
    androidScheme: 'http', // O 'capacitor' dependiendo de tu versión
    cleartext: true
  }
};

export default config;
