import { getCart, getCartTotal, updateQuantity, removeFromCart } from '../../../utils/cart';

const renderCart = (): void => {
    const container = document.getElementById('cartList');
    const totalContainer = document.getElementById('cartTotal');

    if (!container || !totalContainer) return;

    const cart = getCart();
    const defaultImg = "https://placehold.co/60x60?text=Comida";

    if (cart.length === 0) {
        container.innerHTML = '<p>El carrito está vacío.</p>';
        totalContainer.innerHTML = '';
        return;
    }

    container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img 
        src="${item.product.imagen || defaultImg}" 
        alt="${item.product.nombre}" 
        class="cart-item-img"
        onerror="this.onerror=null; this.src='${defaultImg}';" 
      />

      <div class="cart-details">
        <h3>${item.product.nombre}</h3>
        <p class="cart-price">Precio unitario: $${item.product.precio}</p>
        <p class="cart-subtotal">Subtotal: $${item.product.precio * item.cantidad}</p>
      </div>

      <div class="cart-controls">
        <button class="btn-decrease" data-id="${item.product.id}">-</button>
        <span>Cantidad: <strong>${item.cantidad}</strong></span>
        <button class="btn-increase" data-id="${item.product.id}">+</button>
        <button class="btn-remove" data-id="${item.product.id}">Eliminar 🗑️</button>
      </div>
    </div>
  `).join('');

    totalContainer.innerHTML = `
    <div class="cart-footer">
      <h3>Total: $${getCartTotal()}</h3>
      <button id="checkoutBtn" class="btn-checkout">Finalizar Compra 💳</button>
    </div>
  `;

    attachEventListeners();
};

const attachEventListeners = (): void => {
    document.querySelectorAll('.btn-increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLElement).getAttribute('data-id'));
            updateQuantity(id, 1);
            renderCart();
        });
    });

    document.querySelectorAll('.btn-decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLElement).getAttribute('data-id'));
            updateQuantity(id, -1);
            renderCart();
        });
    });

    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLElement).getAttribute('data-id'));
            removeFromCart(id);
            renderCart();
        });
    });

    // Manejo del botón de pago (FHU-05)
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) return;

        // Redirige a tu vista de pago/checkout
        window.location.href = '../checkout/checkout.html';
    });
};

document.addEventListener('DOMContentLoaded', renderCart);     // Inicia el renderizado al cargar completamente el DOM