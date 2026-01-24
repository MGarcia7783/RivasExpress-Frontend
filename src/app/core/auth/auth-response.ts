import { ILogin } from './ilogin';

export interface AuthResponse {
  usuario: ILogin;
  token: string;
}
