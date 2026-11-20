import { getOrders, type IOrder } from '../../../utils/ordersStorage';

function renderOrders() {
    const container = document.getElementById('ordersContainer');
    if (!container) return;

    const orders = getOrders();

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <p>Aún no has realizado ninguna compra.</p>
                <a href="../home/home.html" class="btn-primary" style="display: inline-block; margin-top: 1rem; text-decoration: none;">Ir a Comprar</a>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map((order: IOrder) => {
        // Clase CSS dinámica según el estado del pedido
        let statusClass = 'status-pending';
        if (order.estado === 'En preparación') statusClass = 'status-process';
        if (order.estado === 'Entregado') statusClass = 'status-delivered';
        if (order.estado === 'Cancelado') statusClass = 'status-cancelled';

        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <h3>Pedido #${order.id}</h3>
                        <span class="order-date">📅 ${order.fecha}</span>
                    </div>
                    <span class="order-status ${statusClass}">${order.estado}</span>
                </div>

                <div class="order-body">
                    <p><strong>Dirección de entrega:</strong> ${order.cliente.direccion}</p>
                    <p><strong>Método de pago:</strong> ${order.cliente.metodoPago}</p>
                    ${order.cliente.notas ? `<p><strong>Notas:</strong> ${order.cliente.notas}</p>` : ''}
                    
                    <h4 style="margin-top: 1rem; margin-bottom: 0.5rem;">Productos:</h4>
                    <ul class="order-items-list">
                        ${order.items.map(item => `
                            <li>
                                <span>${item.cantidad}x ${item.product.nombre}</span>
                                <span>$${item.product.precio * item.cantidad}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="order-footer">
                    <span>Total abonado(Envio incluido $500):</span>
                    <strong class="order-total">$${order.total}</strong>
                </div>
            </div>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', renderOrders);