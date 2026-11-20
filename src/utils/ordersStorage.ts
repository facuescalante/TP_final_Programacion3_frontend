import type { ICartItem } from './cart';

export interface IOrder {
    id: number;
    fecha: string;
    cliente: {
        nombre: string;
        telefono: string;
        direccion: string;
        metodoPago: string;
        notas?: string;
    };
    items: ICartItem[];
    total: number;
    estado: 'Pendiente' | 'En preparación' | 'Entregado' | 'Cancelado';
}

const ORDERS_KEY = 'foodstore_orders';

// Obtener todos los pedidos guardados
export const getOrders = (): IOrder[] => {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
};

// Crear y guardar un nuevo pedido
export const createOrder = (orderData: Omit<IOrder, 'id' | 'fecha' | 'estado'>): IOrder => {
    const orders = getOrders();

    const newOrder: IOrder = {
        ...orderData,
        id: Date.now(), // ID único basado en timestamp
        fecha: new Date().toLocaleString('es-AR'),
        estado: 'Pendiente'
    };

    orders.unshift(newOrder); // Lo agregamos al principio (más reciente primero)
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    return newOrder;
};