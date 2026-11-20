import { getCart, getCartTotal, clearCart } from '../../../utils/cart';
import { createOrder } from '../../../utils/ordersStorage';

// Definimos una constante fija para el costo de envío (puedes ajustarla o dejarla en 0)
const COSTO_ENVIO = 500;

function initCheckout() {
    const cart = getCart();
    const itemsContainer = document.getElementById('checkoutItems');
    const totalContainer = document.getElementById('checkoutTotal');

    // Si el carrito está vacío, redirigimos al home
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
        window.location.href = '../home/home.html';
        return;
    }

    // 1. Renderizar el resumen de productos
    if (itemsContainer) {
        itemsContainer.innerHTML = cart.map(item => `
            <div class="summary-item">
                <span><strong>${item.cantidad}x</strong> ${item.product.nombre}</span>
                <span>$${item.product.precio * item.cantidad}</span>
            </div>
        `).join('');
    }

    // Calculamos los valores monetarios
    const subtotal = getCartTotal();
    const totalPagar = subtotal + COSTO_ENVIO;

    // Renderizamos el desglose (Subtotal, Envío y Total)
    if (totalContainer) {
        totalContainer.innerHTML = `
            <hr />
            <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Subtotal:</span>
                <span>$${subtotal}</span>
            </div>
            <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Envío:</span>
                <span>$${COSTO_ENVIO}</span>
            </div>
            <div class="summary-total-row" style="display: flex; justify-content: space-between; font-size: 1.1em; font-weight: bold;">
                <span>Total a pagar:</span>
                <strong>$${totalPagar}</strong>
            </div>
        `;
    }

    // 2. Manejar el envío del formulario
    const form = document.getElementById('checkoutForm') as HTMLFormElement;
    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = (document.getElementById('customerName') as HTMLInputElement).value.trim();
        const telefono = (document.getElementById('customerPhone') as HTMLInputElement).value.trim();
        const direccion = (document.getElementById('customerAddress') as HTMLInputElement).value.trim();
        const metodoPago = (document.getElementById('paymentMethod') as HTMLSelectElement).value;
        const notas = (document.getElementById('orderNotes') as HTMLTextAreaElement).value.trim();

        if (!nombre || !telefono || !direccion) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }

        // Creamos el pedido en localStorage incluyendo subtotal, envío y el total final
        const newOrder = createOrder({
            cliente: { nombre, telefono, direccion, metodoPago, notas },
            items: cart,
            subtotal: subtotal,
            envio: COSTO_ENVIO,
            total: totalPagar
        });

        // Vaciamos el carrito (el stock ya quedó descontado)
        clearCart();

        alert(`¡Pedido #${newOrder.id} confirmado con éxito! Gracias por tu compra, ${nombre}.`);

        // Redirigimos al catálogo
        window.location.href = '../home/home.html';
    });
}

document.addEventListener('DOMContentLoaded', initCheckout);