import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { InteractionService } from 'src/app/shared/interaction.service';
import { IProducto } from 'src/app/core/features/producto/interface/iproducto';
import { IDetallePedido } from '../interface/idetalle-pedido';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  // Inyección de dependencias
  private interaction = inject(InteractionService);

  // Signal que contiene los items del carrito
  private _items = signal<IDetallePedido[]>(this.obtenerCarritoStorage());

  // Lista completa de items
  public itemsLista = computed(() => this._items());

  // Cantidad total de items en el carrito
  public cantidadTotal = computed(() =>
    this._items().reduce((acc, item) => acc + item.cantidad, 0),
  );

  // Monto total
  public montoTotal = computed(() =>
    this._items().reduce(
      (acc, item) => acc + item.precioUnitario * item.cantidad,
      0,
    ),
  );

  constructor() {
    // Guardar automáticamente en localStorage cada vez que cambian los items
    effect(() => {
      const userId = this.getUserId();
      if (!userId) return;
      localStorage.setItem(`carrito_${userId}`, JSON.stringify(this._items()));
    });
  }

  // --- Méotodos públicos ---

  // Inicializa el carrito con los datos del usuario logueado
  inicializarCarrito() {
    const userId = this.getUserId();
    if (userId) {
      const savedCart = localStorage.getItem(`carrito_${userId}`);
      this._items.set(savedCart ? JSON.parse(savedCart) : []);
    } else {
      this._items.set([]); // Carrito vacío si no hay usuario
    }
  }

  // Agrega un producto al carrito o incrementa su cantidad
  agregarProducto(producto: IProducto) {
    this._items.update((listado) => {
      const existe = listado.find((x) => x.idProducto === producto.idProducto);

      if (existe) {
        // Incrementar cantidad y subtotal
        return listado.map((x) =>
          x.idProducto === producto.idProducto
            ? {
                ...x,
                cantidad: x.cantidad + 1,
                subtotal: (x.cantidad + 1) * x.precioUnitario,
              }
            : x,
        );
      }

      // Si es nuevo producto, agregarlo al carrito
      const nuevoItem: IDetallePedido = {
        idProducto: producto.idProducto,
        nombreProducto: producto.nombreProducto,
        cantidad: 1,
        precioUnitario: producto.precio,
        subtotal: producto.precio,
      };

      this.interaction.showToast(
        `Agregado: ${producto.nombreProducto}`,
        'success',
        'cart-outline',
        800,
      );
      return [...listado, nuevoItem];
    });
  }

  // Actualizar cantidad desde la vista del carrito
  actualizarCantidad(idProducto: number, cambio: number) {
    this._items.update((listado) =>
      listado.map((item) => {
        if (item.idProducto === idProducto) {
          const nuevaCantidad = item.cantidad + cambio;
          if (nuevaCantidad < 1) return item;

          return {
            ...item,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * item.precioUnitario,
          };
        }
        return item;
      }),
    );
  }

  // Elimina un producto del carrito
  eliminarItem(idProducto: number) {
    this._items.update((listado) =>
      listado.filter((x) => x.idProducto !== idProducto),
    );
  }

  // Limpia el carrito completamente y remueve del storage
  limpiarCarrito() {
    const userId = this.getUserId();
    this._items.set([]);
    if (userId) localStorage.removeItem(`carrito_${userId}`);
  }

  // Limpia el carrito en memoria (sin tocar storage)


  // Retorna los items actuales como array
  getItems(): IDetallePedido[] {
    return this._items();
  }

  // Obtiene el Id del usuario logueado desde localStorage
  private getUserId(): string | null {
    const userJson = localStorage.getItem('usuario');
    if (!userJson) return null;
    return JSON.parse(userJson).id;
  }

  // Recuperar datos del storage al iniciar
  private obtenerCarritoStorage(): IDetallePedido[] {
    const userId = this.getUserId();
    if (!userId) return [];
    const data = localStorage.getItem(`carrito_${userId}`);
    return data ? JSON.parse(data) : [];
  }
}
