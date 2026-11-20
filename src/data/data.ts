export const getProductos = async () => {
    const response = await fetch('/data/productos.json');
    return response.json();
};

export const getCategorias = async () => {
    const response = await fetch('/data/categorias.json');
    return response.json();
};