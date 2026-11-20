import { initUserSession } from '../../../utils/auth';

function initDashboard() {
    initUserSession();
    loadDashboardStats();
}

function loadDashboardStats() {
    // 1. Obtener datos desde localStorage (los mismos nombres de keys que usan categorías, productos y pedidos)
    const categoriesData = localStorage.getItem('foodstore_categories');
    const productsData = localStorage.getItem('foodstore_products_admin');
    const ordersData = localStorage.getItem('foodstore_orders'); // O el key que uses para pedidos

    const categories = categoriesData ? JSON.parse(categoriesData) : [];
    const products = productsData ? JSON.parse(productsData) : [];
    const orders = ordersData ? JSON.parse(ordersData) : [];

    // 2. Calcular métricas
    const totalCategories = categories.length;
    const totalProducts = products.length;
    const totalOrders = orders.length;

    // Productos con stock mayor a 0 (disponibles)
    const availableProducts = products.filter((p: any) => p.stock > 0).length;
    const inactiveProducts = totalProducts - availableProducts;

    // Conteo de pedidos por estado (ejemplo: Pendiente, Confirmado, Terminado, Cancelado)
    const pendings = orders.filter((o: any) => o.estado === 'Pendiente' || !o.estado).length;
    const confirmed = orders.filter((o: any) => o.estado === 'Confirmado').length;
    const finished = orders.filter((o: any) => o.estado === 'Terminado').length;
    const cancelled = orders.filter((o: any) => o.estado === 'Cancelado').length;

    // Simulación de usuarios registrados (o puedes leerlos de localStorage si tienes una key de usuarios)
    const usersData = localStorage.getItem('users');
    const totalUsers = usersData ? JSON.parse(usersData).length : 2;

    // 3. Inyectar los valores calculados en los elementos del HTML del Dashboard
    updateText('statCategories', totalCategories);
    updateText('statProducts', totalProducts);
    updateText('statOrders', totalOrders);
    updateText('statAvailable', availableProducts);

    // Resumen del sistema - Catálogo
    updateText('sumCatActivas', totalCategories);
    updateText('sumProdActivos', availableProducts);
    updateText('sumProdInactivos', inactiveProducts);
    updateText('sumUsers', totalUsers);

    // Resumen del sistema - Pedidos
    updateText('sumPendiente', pendings);
    updateText('sumConfirmado', confirmed);
    updateText('sumTerminado', finished);
    updateText('sumCancelado', cancelled);
}

function updateText(elementId: string, value: number | string) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = String(value);
    }
}

document.addEventListener('DOMContentLoaded', initDashboard);