import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { getApiUrl } from 'src/app/shared/api-url';
import { IRegistro } from '../interface/iregistro';
import { IUsuario } from '../interface/iusuario';
import { IPagedResponse } from 'src/app/shared/ipagedresponse';
import { IPedidoUsuario } from '../../pedido/interface/ipedidousuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private url = `${getApiUrl()}/usuario`;

  // Signal
  usuarios = signal<IUsuario[]>([]);
  totalPaginas = signal(0);
  paginaActual = signal(1);

  // Cargar usuarios paginados
  cargarUsuarios(
    paginaActual = 1,
    pageSize = 10,
    filtro: string = '',
  ): Observable<IUsuario[]> {
    // Construir los parámetros de query
    const params: any = {
      numeroPagina: paginaActual,
      pageSize: pageSize,
    };

    if (filtro) params.filtro = filtro;

    return this.http.get<IPagedResponse<IUsuario>>(this.url, { params }).pipe(
      tap((res) => {
        this.usuarios.set(res.elementos ?? []);
        this.totalPaginas.set(res.totalPaginas);
        this.paginaActual.set(res.numeroPagina);
      }),
      map((res) => res.elementos ?? []),
      catchError((err) => {
        this.usuarios.set([]);
        return throwError(() => err);
      }),
    );
  }

  // Obtener usuario por id
  obtenerPorId(id: string): Observable<IUsuario | null> {
    return this.http.get<IUsuario>(`${this.url}/${id}`).pipe(
      catchError((err) => {
        if (err.status === 404) {
          return of(null);
        }
        return throwError(() => err);
      }),
    );
  }

  // Crear un nuevo usuario
  registrarUsuario(usuario: IRegistro): Observable<any> {
    return this.http.post<any>(`${this.url}`, usuario);
  }

  // Cambiar de estado
  cambiarEstado(id: string, activo: boolean): Observable<void> {
    return this.http.patch<void>(
      `${this.url}/${id}/estado?activo=${activo}`,
      {},
    );
  }

  // Historia de pedidos
  obtenerPedidosUsuario(id: string) {
    return this.http.get<IPedidoUsuario[]>(`${this.url}/${id}/pedidos`);
  }
}
