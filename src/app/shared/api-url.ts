import { environment } from "src/environments/environment";
import { Capacitor } from '@capacitor/core';

export function getApiUrl(): string {

  if (Capacitor.isNativePlatform()) {
    return 'http://10.0.2.2:5279/api';      // URL para dispositivos móviles/emuladores
  }

  return environment.API_URL; // URL para web (navegadores)
}
