/**
 * Representa una categoría de productos en el sistema.
 */
export interface ICategoria {
    /** Identificador único numérico de la categoría */
    id: number;

    /** Nombre de la categoría (ej: "Comida Rápida", "Bebidas") */
    nombre: string;
}