import { initUserSession } from '../../../utils/auth';

interface IOrderItem {
    nombre: string;
    cantidad: number;
    precio: number;
    imagen?: string;
}
// Representa un pedido leído desde localStorage (con soporte para variantes de estructura)
interface IOrder {
    id: number | string;
    cliente: any;
    fecha: string;
    productos: any[];
    items?: any[];
    carrito?: any[];
    cart?: any[];
    subtotal?: number;
    envio?: number;
    total: number;
    estado: 'Pendiente' | 'Confirmado' | 'Terminado' | 'Cancelado';
}
// Obtiene los pedidos guardados en localStorage
function getStoredOrders(): IOrder[] {
    const data = localStorage.getItem('foodstore_orders');
    if (!data) return [];
    return JSON.parse(data);
}
// Representa un pedido leído desde localStorage (con soporte para variantes de estructura)
function saveOrders(orders: IOrder[]) {
    localStorage.setItem('foodstore_orders', JSON.stringify(orders));
}
// Inicializa sesión, filtro por defecto, renderizado y modal de detalle
function initOrdersPage() {
    initUserSession();

    const filterSelect = document.getElementById('filterStatus') as HTMLSelectElement;
    if (filterSelect) {
        filterSelect.value = 'Todos';
    }

    renderOrders('Todos');
    setupFilterEvent();
    ensureModalExistsInDOM();
}

// Crea el modal de detalle una sola vez en el DOM si aún no existe
function ensureModalExistsInDOM() {
    if (document.getElementById('orderDetailModal')) return;

    const modalHTML = `
        <div id="orderDetailModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center; padding: 1rem;">
            <div style="background:white; width:100%; max-width:550px; border-radius:12px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); overflow:hidden; display:flex; flex-direction:column; max-height: 90vh;">
                <!-- Header -->
                <div style="padding: 1.2rem 1.5rem; border-bottom: 1px solid #e5e7eb; display:flex; justify-content:space-between; align-items:center;">
                    <h3 id="modalOrderTitle" style="margin:0; font-size: 1.2rem; font-weight:700; color:#111827;">Pedido</h3>
                    <button id="btnCloseDetailModal" style="background:none; border:none; font-size:1.4rem; cursor:pointer; color:#6b7280;">&times;</button>
                </div>
                <!-- Body -->
                <div id="modalOrderBody" style="padding: 1.5rem; overflow-y:auto; flex:1; font-size: 0.9rem; color:#374151;">
                    <!-- Contenido dinámico inyectado aquí -->
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Cierra el modal al pulsar la "X" o al hacer clic fuera de la tarjeta
    document.getElementById('btnCloseDetailModal')?.addEventListener('click', closeOrderModal);
    document.getElementById('orderDetailModal')?.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).id === 'orderDetailModal') closeOrderModal();
    });
}
// Oculta el modal de detalle
function closeOrderModal() {
    const modal = document.getElementById('orderDetailModal');
    if (modal) modal.style.display = 'none';
}
// Renderiza las tarjetas de pedidos filtradas por estado
function renderOrders(filterStatus: string) {
    const container = document.getElementById('ordersContainer');
    if (!container) return;

    const orders = getStoredOrders();

    const filteredOrders = (!filterStatus || filterStatus === 'Todos')
        ? orders
        : orders.filter(o => o.estado && o.estado.toLowerCase() === filterStatus.toLowerCase());

    if (filteredOrders.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; background: white; padding: 3rem 2rem; border-radius: 12px; text-align: center; color: #6b7280; border: 1px solid #e5e7eb;">
                <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; color: #374151;">No hay pedidos registrados aún</p>
                <p style="font-size: 0.9rem; margin: 0;">Los pedidos que realices desde la tienda del cliente aparecerán automáticamente aquí.</p>
            </div>`;
        return;
    }

    container.innerHTML = filteredOrders.map(order => {
        let nombreCliente = 'Cliente';

        if (typeof order.cliente === 'string' && order.cliente !== '[object Object]') {
            nombreCliente = order.cliente;
        } else if (order.cliente && typeof order.cliente === 'object') {
            nombreCliente = order.cliente.nombre || order.cliente.email || 'Cliente';
        }

        const rawItems = order.productos || order.items || order.carrito || order.cart || [];
        const productosLimpios: IOrderItem[] = Array.isArray(rawItems)
            ? rawItems.map((p: any) => ({
                nombre: p.nombre || p.name || p.titulo || p.product?.nombre || 'Producto sin nombre',
                cantidad: Number(p.cantidad || p.quantity || p.qty || 1),
                precio: Number(p.precio || p.price || p.product?.precio || 0),
                imagen: p.imagen || p.image || p.product?.imagen || '🍔'
            }))
            : [];

        const totalItemsCount = productosLimpios.reduce((acc, item) => acc + item.cantidad, 0);

        // Color del badge según estado
        let badgeBg = '#fef3c7'; let badgeColor = '#d97706'; // Pendiente
        if (order.estado === 'Confirmado') { badgeBg = '#dbeafe'; badgeColor = '#1d4ed8'; }
        else if (order.estado === 'Terminado') { badgeBg = '#d1fae5'; badgeColor = '#059669'; }
        else if (order.estado === 'Cancelado') { badgeBg = '#fee2e2'; badgeColor = '#dc2626'; }

        return `
            <div class="admin-card" style="padding: 1.2rem; display: flex; flex-direction: column; justify-content: space-between; background: white; border-radius: 10px; border: 1px solid #e5e7eb;">
                <div>
                    <div class="admin-card-header" style="margin-bottom: 0.6rem; padding-bottom: 0.6rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f3f4f6;">
                        <h3 style="font-size: 1rem; margin: 0;">Pedido #${order.id}</h3>
                        <span style="font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: 20px; background: ${badgeBg}; color: ${badgeColor};">
                            ${order.estado || 'Pendiente'}
                        </span>
                    </div>
                    <div class="admin-card-body">
                        <p style="font-weight: 600; color: #1f2937; margin: 0 0 0.2rem 0;">${nombreCliente}</p>
                        <p style="font-size: 0.8rem; color: #6b7280; margin: 0 0 0.6rem 0;">${order.fecha || 'Fecha no disponible'} · ${totalItemsCount} producto(s)</p>
                        
                        <div class="admin-items-summary" style="max-height: 80px; overflow-y: auto; background: #f9fafb; padding: 0.5rem; border-radius: 6px;">
                            <ul style="margin: 0; padding-left: 1rem; font-size: 0.8rem; color: #4b5563;">
                                ${productosLimpios.map(p => `<li>${p.cantidad}x ${p.nombre}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="admin-card-footer" style="margin-top: 0.8rem; padding-top: 0.6rem; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f3f4f6;">
                    <strong style="color: #1f2937; font-size: 1.05rem;">$${Number(order.total || 0).toLocaleString()}</strong>
                    <button class="btn-detail-order" data-id="${order.id}" style="background: #f3f4f6; border: 1px solid #d1d5db; padding: 0.3rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 500;">Ver Detalle / Editar</button>
                </div>
            </div>
        `;
    }).join('');

    // Evento para abrir el modal detallado
    container.querySelectorAll('.btn-detail-order').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = (e.target as HTMLElement).getAttribute('data-id');
            openDetailModal(id);
        });
    });
}
// Abre el modal con el detalle completo del pedido y permite cambiar su estado
function openDetailModal(id: string | null) {
    if (!id) return;
    const orders = getStoredOrders();
    const order = orders.find(o => String(o.id) === String(id));
    if (!order) return;

    ensureModalExistsInDOM();
    const modal = document.getElementById('orderDetailModal');
    const titleEl = document.getElementById('modalOrderTitle');
    const bodyEl = document.getElementById('modalOrderBody');

    if (!modal || !titleEl || !bodyEl) return;

    titleEl.textContent = `Pedido #${order.id}`;

    let nombreCliente = 'Cliente';
    let telefono = order.cliente?.telefono || order.cliente?.phone || 'No especificado';
    let direccion = order.cliente?.direccion || order.cliente?.address || 'No especificada';
    if (typeof order.cliente === 'string' && order.cliente !== '[object Object]') {
        nombreCliente = order.cliente;
    } else if (order.cliente && typeof order.cliente === 'object') {
        nombreCliente = order.cliente.nombre || order.cliente.email || 'Cliente';
    }

    const rawItems = order.productos || order.items || order.carrito || order.cart || [];
    const productosLimpios: IOrderItem[] = Array.isArray(rawItems)
        ? rawItems.map((p: any) => ({
            nombre: p.nombre || p.name || p.titulo || p.product?.nombre || 'Producto sin nombre',
            cantidad: Number(p.cantidad || p.quantity || p.qty || 1),
            precio: Number(p.precio || p.price || p.product?.precio || 0),
            imagen: p.imagen || p.image || p.product?.imagen || '🍔'
        }))
        : [];

    const subtotalCalc = productosLimpios.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const envioCalc = order.envio ?? (order.total > subtotalCalc ? order.total - subtotalCalc : 0);

    bodyEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 0.85rem; color: #4b5563;">
            <span><strong>Cliente:</strong> ${nombreCliente}</span>
            <span><strong>Fecha:</strong> ${order.fecha || 'N/D'}</span>
        </div>
        <p style="margin: 0 0 1rem 0; font-size: 0.85rem; color: #4b5563;"><strong>Teléfono:</strong> ${telefono} · <strong>Dirección:</strong> ${direccion}</p>
        
        <p style="font-weight: 600; margin-bottom: 0.5rem; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3rem;">Productos</p>
        
        <div style="max-height: 180px; overflow-y: auto; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
            ${productosLimpios.map(p => `
                <div style="display: flex; align-items: center; justify-content: space-between; background: #f9fafb; padding: 0.5rem; border-radius: 8px; border: 1px solid #f3f4f6;">
    <img src="${p.imagen}" alt="${p.nombre}" style="width: 38px; height: 38px; object-fit: cover; border-radius: 6px; margin-right: 0.8rem; background: #fff;" />
    <div style="flex: 1;">
        <span style="font-weight: 600; color: #1f2937; display: block;">${p.cantidad} × ${p.nombre}</span>
    </div>
    <strong style="color: #374151; font-size: 0.9rem;">$${(p.precio * p.cantidad).toLocaleString()}</strong>
</div>
            `).join('')}
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 0.8rem; display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.9rem;">
            <div style="display: flex; justify-content: space-between; color: #6b7280;">
                <span>Subtotal</span>
                <span>$${subtotalCalc.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: #6b7280;">
                <span>Envío</span>
                <span>$${envioCalc.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 700; color: #111827; font-size: 1.1rem; margin-top: 0.3rem; border-top: 1px solid #f3f4f6; padding-top: 0.4rem;">
                <span>Total</span>
                <span>$${Number(order.total || subtotalCalc + envioCalc).toLocaleString()}</span>
            </div>
        </div>

        <div style="margin-top: 1.5rem; border-top: 1px solid #e5e7eb; padding-top: 1rem; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; flex-direction: column; gap: 0.3rem; flex: 1; margin-right: 1rem;">
                <label style="font-size: 0.8rem; font-weight: 600; color: #374151;">Cambiar estado</label>
                <select id="modalOrderStatusSelect" style="padding: 0.5rem; border-radius: 6px; border: 1px solid #d1d5db; font-size: 0.9rem; background: white;">
                    <option value="Pendiente" ${order.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="Confirmado" ${order.estado === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                    <option value="Terminado" ${order.estado === 'Terminado' ? 'selected' : ''}>Terminado</option>
                    <option value="Cancelado" ${order.estado === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </div>
            <button id="btnSaveOrderStatus" data-id="${order.id}" style="background: #f97316; color: white; border: none; padding: 0.6rem 1.4rem; border-radius: 6px; font-weight: 600; cursor: pointer; margin-top: 1.2rem;">Guardar</button>
        </div>
    `;

    modal.style.display = 'flex';

    // Evento del botón Guardar dentro del modal
    document.getElementById('btnSaveOrderStatus')?.addEventListener('click', (e) => {
        const orderId = (e.target as HTMLElement).getAttribute('data-id');
        const selectEl = document.getElementById('modalOrderStatusSelect') as HTMLSelectElement;
        if (orderId && selectEl) {
            updateOrderStatus(orderId, selectEl.value as any);
            closeOrderModal();
        }
    });
}
// Actualiza el estado de un pedido específico y vuelve a renderizar la vista
function updateOrderStatus(id: number | string, newStatus: 'Pendiente' | 'Confirmado' | 'Terminado' | 'Cancelado') {
    const orders = getStoredOrders();
    const index = orders.findIndex(o => String(o.id) === String(id));
    if (index !== -1) {
        orders[index].estado = newStatus;
        saveOrders(orders);
        const currentFilter = (document.getElementById('filterStatus') as HTMLSelectElement).value;
        renderOrders(currentFilter);
    }
}
// Escucha cambios en el selector de filtro por estado
function setupFilterEvent() {
    const filterSelect = document.getElementById('filterStatus') as HTMLSelectElement;
    filterSelect?.addEventListener('change', () => {
        renderOrders(filterSelect.value);
    });
}

document.addEventListener('DOMContentLoaded', initOrdersPage);