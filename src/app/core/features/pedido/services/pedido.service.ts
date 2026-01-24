import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { getApiUrl } from 'src/app/shared/api-url';
import { IPedido } from '../interface/ipedido';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { IPagedResponse } from 'src/app/shared/ipagedresponse';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private http = inject(HttpClient);
  private url = `${getApiUrl()}/pedido`;

  // Badge global de pedidos pendientes
  public pendientesCount = signal<number>(0);

  // Paginación
  private pagina: number = 1;
  private pageSize: number = 10;
  private filtro = '';

  // Crear pedido
  crearPedido(pedido: IPedido): Observable<IPedido> {
    return this.http.post<IPedido>(this.url, pedido);
  }

  // Pedidos por usuario
  misPedidos(
    pagina: number = this.pagina,
    pageSize: number = this.pageSize,
  ): Observable<IPagedResponse<IPedido>> {
    const params = new HttpParams()
      .set('numeroPagina', pagina.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<IPagedResponse<IPedido>>(`${this.url}/mis-pedidos`, {
      params,
    });
  }

  // Cargar pedidos paginados
  cargarPedidos(
    pagina: number = this.pagina,
    pageSize: number = this.pageSize,
    filtro: string = this.filtro,
  ): Observable<IPagedResponse<IPedido>> {
    let params = new HttpParams()
      .set('numeroPagina', pagina.toString())
      .set('pageSize', pageSize.toString());

    if (filtro && filtro.trim().length > 0)
      params = params.set('flitro', filtro.trim());

    return this.http.get<IPagedResponse<IPedido>>(this.url, { params }).pipe(
      tap((res) => {
        const pendientes = res.elementos.filter(
          p => p.estado === 'Pendiente',
        ).length;
        this.pendientesCount.set(pendientes);
      }),
      catchError((err) => throwError(() => err)),
    );
  }

  // Cambiar de estado
  cambiarEstado(idPedido: number, nuevoEstado: string): Observable<void> {
    return this.http
      .patch<void>(`${this.url}/${idPedido}/estado`, {
        nuevoEstado,
      })
      .pipe(catchError((err) => throwError(() => err)));
  }

  // Obtener detalle del pedido (incluyendo mapa y productos)
  obtenerPorId(id: number): Observable<IPedido | null> {
    return this.http
      .get<IPedido>(`${this.url}/${id}`)
      .pipe(
        catchError((err) =>
          err.status === 404 ? of(null) : throwError(() => err),
        ),
      );
  }
}
