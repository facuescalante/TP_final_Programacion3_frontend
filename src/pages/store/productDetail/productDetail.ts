import { addToCart } from '../../../utils/cart';
import { getProducts } from '../../../utils/productsStorage';

async function loadProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get('id'));

    const container = document.getElementById('productDetailContainer');
    if (!container) return;

    if (!productId) {
        container.innerHTML = '<p class="error-msg">No se especificó un producto válido.</p>';
        return;
    }

    try {
        // Obtenemos los productos actualizados desde nuestro storage
        const products = await getProducts();
        const product = products.find(p => p.id === productId);

        if (!product || product.eliminado) {
            container.innerHTML = '<p class="error-msg">El producto no existe o ya no está disponible.</p>';
            return;
        }

        container.innerHTML = `
            <div class="detail-image-container">
                <img src="${product.imagen}" alt="${product.nombre}" class="detail-img" />
            </div>
            
            <div class="detail-info-container">
                <span class="badge-category">${product.categoria?.nombre || 'General'}</span>
                <h2>${product.nombre}</h2>
                <p class="detail-desc">${product.descripcion}</p>
                <p class="detail-price">$${product.precio}</p>
                
                <div class="stock-status">
                    <p>Stock disponible: <strong id="stockValue">${product.stock} unidades</strong></p>
                    <p>Estado: <span id="statusValue" class="${product.disponible && product.stock > 0 ? 'text-success' : 'text-danger'}">
                        ${product.disponible && product.stock > 0 ? 'Disponible' : 'Sin stock'}
                    </span></p>
                </div>

                <div id="purchaseContainer">
                    ${product.disponible && product.stock > 0 ? `
                        <div class="purchase-box">
                            <div class="qty-control">
                                <label for="qtyInput">Cantidad:</label>
                                <input type="number" id="qtyInput" value="1" min="1" max="${product.stock}" />
                            </div>
                            <button id="btnAddCart" class="btn-primary">Agregar al Carrito 🛒</button>
                        </div>
                    ` : `
                        <p class="warning-msg">Este producto no se encuentra disponible temporalmente.</p>
                    `}
                </div>

                <div id="feedbackMsg" class="feedback-msg"></div>
            </div>
        `;

        const btnAdd = document.getElementById('btnAddCart');
        btnAdd?.addEventListener('click', () => {
            const qtyInput = document.getElementById('qtyInput') as HTMLInputElement;
            const quantity = qtyInput ? Number(qtyInput.value) : 1;

            if (quantity <= 0) {
                alert('La cantidad debe ser al menos 1.');
                return;
            }

            if (quantity > product.stock) {
                alert(`No puedes agregar más de ${product.stock} unidades (stock excedido).`);
                return;
            }

            // 1. Agregar al carrito (ya descuenta el stock internamente)
            const result = addToCart(product, quantity);

            if (!result.ok) {
                alert(result.message);
                return;
            }

            // 2. Actualizamos la referencia local y la interfaz en tiempo real
            product.stock -= quantity;

            const stockValueEl = document.getElementById('stockValue');
            if (stockValueEl) stockValueEl.textContent = `${product.stock} unidades`;

            if (product.stock === 0) {
                const statusValueEl = document.getElementById('statusValue');
                if (statusValueEl) {
                    statusValueEl.textContent = 'Sin stock';
                    statusValueEl.className = 'text-danger';
                }
                const purchaseContainer = document.getElementById('purchaseContainer');
                if (purchaseContainer) {
                    purchaseContainer.innerHTML = '<p class="warning-msg">¡Te llevaste las últimas unidades disponibles!</p>';
                }
            } else if (qtyInput) {
                qtyInput.max = String(product.stock);
                qtyInput.value = '1';
            }

            const feedback = document.getElementById('feedbackMsg');
            if (feedback) {
                feedback.innerHTML = `<span class="success-alert">¡${quantity} unidad(es) agregada(s) con éxito!</span>`;
                setTimeout(() => {
                    feedback.innerHTML = '';
                }, 3500);
            }
        });

    } catch (error) {
        console.error("Error al cargar el detalle:", error);
        container.innerHTML = '<p class="error-msg">Ocurrió un error al cargar el producto.</p>';
    }
}

loadProductDetail();