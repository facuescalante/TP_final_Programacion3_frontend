import type { ICartItem, IProduct } from '../types/product'; // Importa tipos de productos y carrito

const CART_KEY = 'cart';                                     // Clave para almacenamiento en localStorage

export const getCart = (): ICartItem[] => {                  // Obtiene los ítems guardados en localStorage
    const data = localStorage.getItem(CART_KEY);            // Recupera la cadena JSON almacenada
    return data ? JSON.parse(data) : [];                     // Retorna los datos parseados o un arreglo vacío
};

export const updateQuantity = (productId: number, delta: number): void => { // Modifica la cantidad permitiendo llegar a 0
    let cart = getCart();                                    // Lee el estado actual del carrito
    const itemIndex = cart.findIndex(item => item.product.id === productId); // Busca la posición del producto

    if (itemIndex !== -1) {                                  // Si el producto existe en el carrito
        const newQuantity = cart[itemIndex].cantidad + delta; // Calcula la nueva cantidad
        if (newQuantity >= 0) {                              // Evita cantidades negativas
            cart[itemIndex].cantidad = newQuantity;         // Actualiza la cantidad (permite valor 0)
            localStorage.setItem(CART_KEY, JSON.stringify(cart)); // Persiste el cambio
        }
    }
};

export const removeFromCart = (productId: number): void => {  // Elimina explícitamente un ítem del carrito
    let cart = getCart();                                    // Carga el carrito actual
    cart = cart.filter(item => item.product.id !== productId); // Filtra y remueve el producto por ID
    localStorage.setItem(CART_KEY, JSON.stringify(cart));    // Persiste la lista actualizada
};

export const addToCart = (product: IProduct): void => {      // Agrega un producto o incrementa su cantidad
    const cart = getCart();                                  // Recupera el carrito actual
    const existingIndex = cart.findIndex(item => item.product.id === product.id); // Verifica si ya está agregado

    if (existingIndex !== -1) {
        cart[existingIndex].cantidad += 1;                  // Si existe, incrementa la cantidad
    } else {
        cart.push({ product, cantidad: 1 });                 // Si es nuevo, lo agrega con cantidad 1
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));    // Persiste el cambio en localStorage
};

export const getCartTotal = (): number => {                 // Calcula el monto total acumulado
    const cart = getCart();                                  // Carga los ítems del carrito
    return cart.reduce((acc, item) => acc + item.product.precio * item.cantidad, 0); // Acumula el subtotal
};