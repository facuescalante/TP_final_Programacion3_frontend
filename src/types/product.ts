export interface IProduct {
    id: number;          // ID único del producto
    nombre: string;      // Nombre comercial (incluye emoji)
    precio: number;      // Precio unitario
    categoriaId: number; // ID de categoría asociada
    imagen?: string;     // URL o ruta local (opcional)
}

export interface ICartItem {
    product: IProduct;   // Datos del producto
    cantidad: number;    // Unidades seleccionadas
}