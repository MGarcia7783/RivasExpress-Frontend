import { Usuario } from "./usuario";

export interface AuthResponse {
  usuario: Usuario;
  token: string;
}
