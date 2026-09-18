/**
 * @file data.ts
 * @description Fuente de datos estática para la aplicación (`src/data/data.ts`).
 * Simula la capa de persistencia/API proporcionando las colecciones de productos y categorías.
 */

import type { IProduct } from '../types/product';
import type { ICategoria } from '../types/categoria';

/**
 * Colección principal de productos disponibles en el catálogo.
 * Incluye emojis integrados en la propiedad `nombre` para simplificar la representación visual en la UI.
 */
export const PRODUCTS: IProduct[] = [
    { id: 1, nombre: 'Hamburguesa Doble 🍔', precio: 18500, categoriaId: 1 , imagen: "https://viejodave.com.ar/wp-content/uploads/2024/02/hamburguesa-queso-jamon-cebolla-caramelizada-y-huevo-carne-doble-01.jpg" },
    { id: 2, nombre: 'Pizza Muzarella 🍕', precio: 19000, categoriaId: 2 , imagen: "https://pizzeriaprocacchia.com.ar/wp-content/uploads/2025/08/2-muzzas.jpg"},
    { id: 3, nombre: 'Papas Fritas 🍟', precio: 4000, categoriaId: 1 , imagen: "https://tofuu.getjusto.com/orioneat-local/resized2/M2JAKBt8YMmgmejNE-1000-x.webp"},
    { id: 4, nombre: 'Gaseosa 500ml 🥤', precio: 2500, categoriaId: 3 , imagen: "https://acdn-us.mitiendanube.com/stores/001/144/141/products/whatsapp-image-2021-06-11-at-19-36-011-ac8b229a9a8bb3a85a16234512540854-1024-1024.webp" },
    { id: 5, nombre: 'Empanada de Carne 🥟', precio: 3500, categoriaId: 2 , imagen: "https://lugaresysabores.com/webfiles/lugaresysabores/novedades/11351/1_1000x1000.jpg"},
    { id: 6, nombre: 'Empanada de Pollo 🥟', precio: 3500, categoriaId: 2 , imagen: "https://www.donitalo.com/wp-content/uploads/2020/06/EMPANADA-DE-POLLO-1-1.jpg"},
];

/**
 * Obtiene el listado de categorías disponibles para el filtrado dinámico del catálogo.
 * @returns {ICategoria[]} Arreglo de objetos fuertemente tipados con las categorías del sistema.
 */
export const getCategories = (): ICategoria[] => [
    { id: 1, nombre: 'Comida Rápida' },
    { id: 2, nombre: 'Pizzería' },
    { id: 3, nombre: 'Bebidas' },
];