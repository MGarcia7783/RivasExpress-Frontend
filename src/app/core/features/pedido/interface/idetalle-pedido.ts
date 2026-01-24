export interface IDetallePedido {
  idDetallePedido?: number;
  idPedido?: number;
  idProducto: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}
