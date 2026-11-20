import { addToCart } from '../../../utils/cart';
import { getProducts, decrementProductStock, type IProduct } from '../../../utils/productsStorage';
import { initUserSession } from '../../../utils/auth'; // <-- 1. IMPORTAR LA FUNCIÓN DE SESIÓN

interface ICategoria {
  id: number;
  nombre: string;
}

let allProducts: IProduct[] = [];
let allCategories: ICategoria[] = [];
let currentCategory: number | 'all' = 'all';
let currentSearch: string = '';
let currentSort: string = '';

async function initHome() {
  try {
    // 2. INICIALIZAR LA SESIÓN (NOMBRE Y BOTÓN CERRAR SESIÓN EN EL HEADER)
    initUserSession();

    // Cargamos los productos desde localStorage (o JSON inicial) y las categorías
    const [productsData, resCat] = await Promise.all([
      getProducts(),
      fetch('/data/categorias.json')
    ]);

    const categoriesData: ICategoria[] = await resCat.json();

    // Filtro FHU-03: Solo disponibles, no eliminados y con stock > 0
    allProducts = productsData.filter(p => p.disponible && !p.eliminado && p.stock > 0);
    allCategories = categoriesData;

    renderCategories();
    filterAndRenderProducts();
    setupEventListeners();

  } catch (error) {
    console.error("Error al cargar los datos del catálogo:", error);
  }
}

// Renderizar botones de categorías en #categoryFilters
function renderCategories() {
  const container = document.getElementById('categoryFilters');
  if (!container) return;

  let html = `<button class="category-btn ${currentCategory === 'all' ? 'active' : ''}" data-id="all">Todas</button>`;

  allCategories.forEach(cat => {
    html += `<button class="category-btn ${currentCategory === cat.id ? 'active' : ''}" data-id="${cat.id}">${cat.nombre}</button>`;
  });

  container.innerHTML = html;
}

// Filtrar y ordenar en tiempo real
function filterAndRenderProducts() {
  let result = [...allProducts];

  // 1. Filtrar por categoría
  if (currentCategory !== 'all') {
    result = result.filter(p => p.categoria && p.categoria.id == currentCategory);
  }

  // 2. Filtrar por texto de búsqueda en tiempo real
  if (currentSearch.trim() !== '') {
    const query = currentSearch.toLowerCase();
    result = result.filter(p => p.nombre.toLowerCase().includes(query));
  }

  // 3. Ordenamiento (Corregidos los operadores con guion)
  if (currentSort === 'az') {
    result.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (currentSort === 'za') {
    result.sort((a, b) => b.nombre.localeCompare(a.nombre));
  } else if (currentSort === 'asc') {
    result.sort((a, b) => a.precio - b.precio);
  } else if (currentSort === 'desc') {
    result.sort((a, b) => b.precio - a.precio);
  }

  renderProducts(result);
}

// Dibujar productos
function renderProducts(productsToRender: IProduct[]) {
  const container = document.getElementById("productsContainer");
  if (!container) return;

  if (productsToRender.length === 0) {
    container.innerHTML = "<p class='no-results'>No se encontraron productos.</p>";
    return;
  }

  container.innerHTML = productsToRender.map(producto => `
        <div class="card" style="cursor: pointer;">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="card-content">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p class="price">$${producto.precio}</p>
                <p class="stock">Stock: ${producto.stock}</p>
                <button class="btn btn-agregar" data-id="${producto.id}" ${producto.stock === 0 ? 'disabled' : ''}>
                    ${producto.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                </button>
            </div>
        </div>
    `).join('');
}

// Eventos
function setupEventListeners() {
  // Búsqueda en tiempo real
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  searchInput?.addEventListener('input', (e) => {
    currentSearch = (e.target as HTMLInputElement).value;
    filterAndRenderProducts();
  });

  // Ordenamiento
  const sortSelect = document.getElementById('sortSelect') as HTMLSelectElement;
  sortSelect?.addEventListener('change', (e) => {
    currentSort = (e.target as HTMLSelectElement).value;
    filterAndRenderProducts();
  });

  // Filtro por categoría (delegación de eventos)
  const categoryFilters = document.getElementById('categoryFilters');
  categoryFilters?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('category-btn')) {
      const catId = target.getAttribute('data-id');
      currentCategory = catId === 'all' ? 'all' : Number(catId);

      renderCategories();
      filterAndRenderProducts();
    }
  });

  // Conexión al detalle y agregar al carrito con descuento de stock
  const container = document.getElementById("productsContainer");
  container?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    // 1. Si hizo clic en el botón "Agregar al carrito"
    if (target.classList.contains("btn-agregar")) {
      const idProducto = Number(target.getAttribute("data-id"));
      const productoEncontrado = allProducts.find(p => p.id === idProducto);

      if (productoEncontrado && productoEncontrado.stock > 0) {
        // addToCart ya descuenta 1 del stock en localStorage
        const resultado = addToCart(productoEncontrado, 1);

        if (resultado.ok) {
          productoEncontrado.stock -= 1; // Actualizamos el objeto en memoria para la vista
          allProducts = allProducts.filter(p => p.stock > 0);
          filterAndRenderProducts();
        }

        alert(resultado.message);
      }
      return;
    }

    // 2. Si hizo clic en cualquier otra parte de la tarjeta, va al detalle
    const card = target.closest(".card");
    if (card) {
      const btn = card.querySelector(".btn-agregar");
      const idProducto = btn?.getAttribute("data-id");
      if (idProducto) {
        window.location.href = `../../store/productDetail/productDetail.html?id=${idProducto}`;
      }
    }
  });
}

initHome();