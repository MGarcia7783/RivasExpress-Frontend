import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { getApiUrl } from 'src/app/shared/api-url';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { ICategoria } from '../interface/icategoria';
import { IPagedResponse } from '../../../../shared/ipagedresponse';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private http = inject(HttpClient);
  private url = `${getApiUrl()}/categoria`;

  // Cargar categorías paginadas
  cargarCategorias(
    pagina = 1,
    pageSize = 10,
    filtro = '',
  ): Observable<IPagedResponse<ICategoria>> {
    const params: any = {
      numeroPagina: pagina,
      pageSize,
    };

    if (filtro) params.filtro = filtro;

    return this.http.get<IPagedResponse<ICategoria>>(this.url, { params }).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  // Obtener categoria por id
  obtenerPorId(id: number): Observable<ICategoria | null> {
    return this.http
      .get<ICategoria>(`${this.url}/${id}`)
      .pipe(
        catchError((err) =>
          err.status === 404 ? of(null) : throwError(() => err),
        ),
      );
  }

  // Crear un nueva categoría
  crearCategoria(categoria: ICategoria): Observable<ICategoria> {
    return this.http.post<ICategoria>(this.url, categoria);
  }

  // Actualizar categoría existente
  actualizarCategoria(
    id: number,
    categoria: ICategoria,
  ): Observable<ICategoria> {
    return this.http.put<ICategoria>(`${this.url}/${id}`, categoria);
  }

  // Eliminar categoría
  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
