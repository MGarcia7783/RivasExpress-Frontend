import { IPedidoUsuario } from "../../pedido/interface/ipedidousuario";

export interface IUsuario {
  id: string;
  nombreCompleto: string;
  phoneNumber: string;
  userName: string;
  rol: string;
  esActivo: boolean;
  totalPedidos: number;
  frecuenciaCompra: number;
  pedidosRecientes: IPedidoUsuario[];
}
