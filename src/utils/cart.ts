import type { IProduct } from '../types/product';
import { decrementProductStock, restoreProductStock } from './productsStorage';

export interface ICartItem {
    product: IProduct;
    cantidad: number;
}

const CART_KEY = 'foodstore_cart';

// Obtener carrito
export const getCart = (): ICartItem[] => {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
};

// Guardar carrito
const saveCart = (cart: ICartItem[]): void => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// Agregar al carrito (descuenta stock)
export const addToCart = (product: IProduct, cantidad: number = 1): { ok: boolean; message: string } => {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.product.id === product.id);

    // Intentamos descontar del stock general
    const updated = decrementProductStock(product.id, cantidad);
    if (!updated) {
        return { ok: false, message: 'No hay suficiente stock disponible.' };
    }

    if (existingIndex !== -1) {
        cart[existingIndex].cantidad += cantidad;
    } else {
        cart.push({ product, cantidad: cantidad });
    }

    saveCart(cart);
    return { ok: true, message: '¡Producto agregado al carrito!' };
};

// Calcular el total del carrito
export const getCartTotal = (): number => {
    const cart = getCart();
    return cart.reduce((acc, item) => acc + (item.product.precio * item.cantidad), 0);
};

// Actualizar cantidad (+1 o -1 desde el carrito)
export const updateQuantity = (productId: number, delta: number): void => {
    const cart = getCart();
    const item = cart.find(i => i.product.id === productId);

    if (!item) return;

    if (delta > 0) {
        // Si aumenta, intentamos descontar 1 del stock
        const updated = decrementProductStock(productId, 1);
        if (!updated) {
            alert("No hay más stock disponible de este producto.");
            return;
        }
        item.cantidad += 1;
    } else {
        // Si disminuye, devolvemos 1 al stock
        restoreProductStock(productId, 1);
        item.cantidad -= 1;

        if (item.cantidad <= 0) {
            removeFromCart(productId);
            return;
        }
    }

    saveCart(cart);
};

// Eliminar producto individual del carrito (devuelve todo su stock)
export const removeFromCart = (productId: number): void => {
    let cart = getCart();
    const itemToRemove = cart.find(i => i.product.id === productId);

    if (itemToRemove) {
        // Devolvemos toda la cantidad que tenía al stock
        restoreProductStock(productId, itemToRemove.cantidad);
    }

    cart = cart.filter(i => i.product.id !== productId);
    saveCart(cart);
};

// Vaciar carrito completo devolviendo todo el stock (útil para el checkout)
export const clearCartAndRestoreStock = (): void => {
    const cart = getCart();
    cart.forEach(item => {
        restoreProductStock(item.product.id, item.cantidad);
    });
    localStorage.removeItem(CART_KEY);
};
// Vaciar carrito al confirmar una compra (NO devuelve stock)
export const clearCart = (): void => {
    localStorage.removeItem(CART_KEY);
};