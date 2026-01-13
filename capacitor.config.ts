import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'desing',
  webDir: 'www',
  server: {
    androidScheme: 'http', // O 'capacitor' dependiendo de tu versión
    cleartext: true
  }
};

export default config;
