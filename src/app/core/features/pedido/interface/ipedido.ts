import { IDetallePedido } from "./idetalle-pedido";

export interface IPedido {
  idPedido?: number;
  idUsuario: string;
  nombreCliente: string;
  telefono: string;
  direccionEnvio: string;
  latitud?: number;
  longitud?:number;
  total: number;
  estado?: string;
  fechaRegistro?: string;
  detalles: IDetallePedido[];
}
