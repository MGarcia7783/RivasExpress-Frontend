export interface IPagedResponse<T> {
  elementos: T[];
  totalPaginas: number;
  numeroPagina: number;
  totalElementos: number;
  tamanoPagina: number;
}
