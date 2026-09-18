import { getCart, getCartTotal, updateQuantity, removeFromCart } from '../../../utils/cart'; // Importa las utilidades de gestión del carrito

const renderCart = (): void => {                                           // Función principal para renderizar la vista del carrito
    const container = document.getElementById('cartList');                   // Obtiene el elemento contenedor de la lista de productos
    const totalContainer = document.getElementById('cartTotal');             // Obtiene el elemento contenedor del total y botón de pago

    if (!container || !totalContainer) return;                               // Cláusula de guarda: evita errores si los nodos no existen en el DOM

    const cart = getCart();                                                  // Obtiene los datos actualizados del carrito desde localStorage
    const defaultImg = "https://placehold.co/60x60?text=Comida";            // URL de la imagen de respaldo por si falla la carga

    if (cart.length === 0) {                                                 // Comprueba si el carrito está vacío
        container.innerHTML = '<p>El carrito está vacío.</p>';               // Inyecta el mensaje de carrito sin productos
        totalContainer.innerHTML = '';                                       // Limpia el área del total y checkout
        return;                                                              // Detiene la ejecución de la función
    }

    // Inyecta las tarjetas dinámicas de cada producto con su miniatura, datos y controles
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

    // Inyecta el resumen final con el monto total calculado y el botón de pago
    totalContainer.innerHTML = `
    <div class="cart-footer">
      <h3>Total: $${getCartTotal()}</h3>
      <button id="checkoutBtn" class="btn-checkout">Finalizar Compra 💳</button>
    </div>
  `;

    attachEventListeners();                                                  // Vincula los eventos de clic a los botones recién inyectados
};

const attachEventListeners = (): void => {                                  // Asigna los escuchadores de eventos interactivos
    // Escucha el evento de incremento (+1)
    document.querySelectorAll('.btn-increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLElement).getAttribute('data-id')); // Recupera el ID del producto
            updateQuantity(id, 1);                                           // Aumenta la cantidad en 1
            renderCart();                                                    // Actualiza la vista dinámicamente
        });
    });

    // Escucha el evento de decremento (-1)
    document.querySelectorAll('.btn-decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLElement).getAttribute('data-id')); // Recupera el ID del producto
            updateQuantity(id, -1);                                          // Reduce la cantidad en 1 (mínimo 0)
            renderCart();                                                    // Actualiza la vista dinámicamente
        });
    });

    // Escucha el evento de eliminación completa
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLElement).getAttribute('data-id')); // Recupera el ID del producto
            removeFromCart(id);                                              // Elimina el producto del arreglo
            renderCart();                                                    // Actualiza la vista dinámicamente
        });
    });

    // Escucha el evento del botón de redirección hacia el flujo de pago
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        const cart = getCart();                                              // Verifica el contenido del carrito
        if (cart.length === 0) return;                                       // Cancela la acción si no hay elementos

        window.location.href = '';                                               // Redirige a la página de pago
    });
};

document.addEventListener('DOMContentLoaded', renderCart);                   // Inicia el renderizado al cargar completamente el DOM