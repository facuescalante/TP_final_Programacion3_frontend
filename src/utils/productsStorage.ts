const PRODUCTS_STORAGE_KEY = 'foodstore_products';

export interface IProduct {
    id: number;
    nombre: string;
    precio: number;
    descripcion: string;
    stock: number;
    imagen: string;
    disponible: boolean;
    eliminado?: boolean;
    categoria: {
        id: number;
        nombre: string;
        descripcion: string;
    };
}

// 1. Obtener productos (desde localStorage si ya existen, o cargando el JSON inicial)
export async function getProducts(): Promise<IProduct[]> {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }

    const res = await fetch('/data/productos.json');
    const data: IProduct[] = await res.json();
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(data));
    return data;
}

// 2. Descontar stock de un producto y guardar en localStorage
export function decrementProductStock(productId: number, quantity: number): IProduct | null {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!stored) return null;

    const products: IProduct[] = JSON.parse(stored);
    const index = products.findIndex(p => p.id === productId);

    if (index !== -1 && products[index].stock >= quantity) {
        products[index].stock -= quantity;

        // Si el stock llega a 0, opcionalmente podemos marcarlo como no disponible
        if (products[index].stock === 0) {
            products[index].disponible = false;
        }

        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
        return products[index];
    }

    return null;
}

// 3. (Extra útil) Restaurar stock si el usuario vacía el carrito o elimina un ítem
export function restoreProductStock(productId: number, quantity: number): void {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!stored) return;

    const products: IProduct[] = JSON.parse(stored);
    const index = products.findIndex(p => p.id === productId);

    if (index !== -1) {
        products[index].stock += quantity;
        if (products[index].stock > 0) {
            products[index].disponible = true;
        }
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    }
}