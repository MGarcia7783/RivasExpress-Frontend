import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { getApiUrl } from 'src/app/shared/api-url';
import { IProducto } from '../interface/iproducto';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { IPagedResponse } from 'src/app/shared/ipagedresponse';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private http = inject(HttpClient);
  private readonly url = `${getApiUrl()}/producto`;

  // Cargar productos paginados
  cargarProductos(
      pagina = 1,
      pageSize = 10,
      filtro = '',
      idCategoria: number | null = null,
    ): Observable<IPagedResponse<IProducto>> {
      const params: any = {
        numeroPagina: pagina,
        pageSize,
      };

      if (filtro) params.filtro = filtro;

      if (idCategoria !== null) params.idCategoria = idCategoria;

      return this.http.get<IPagedResponse<IProducto>>(this.url, { params }).pipe(
        catchError((err) => {
          return throwError(() => err);
        }),
      );
    }

  // Obtener producto por id
  obtenerPorId(id: number): Observable<IProducto | null> {
      return this.http
        .get<IProducto>(`${this.url}/${id}`)
        .pipe(
          catchError((err) =>
            err.status === 404 ? of(null) : throwError(() => err),
          ),
        );
    }

  // Crear un nuevo producto
  crearProducto(producto: FormData): Observable<IProducto> {
    return this.http.post<IProducto>(this.url, producto);
  }

  // Actualizar producto existente
  actualizarProducto(id: number, producto: FormData): Observable<IProducto> {
    return this.http.put<IProducto>(`${this.url}/${id}`, producto);
  }

  // Eliminar producto
  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
