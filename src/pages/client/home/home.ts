import { PRODUCTS, getCategories } from '../../../data/data'; // Carga datos de productos y categorías
import { addToCart } from '../../../utils/cart';              // Carga función para agregar al carrito

let selectedCategoryId: number | null = null;                  // Estado de la categoría seleccionada
let searchTerm = '';                                           // Estado del texto de búsqueda

const renderCategories = () => {                               // Renderiza botones de categorías
  const container = document.getElementById('categoryFilters'); // Contenedor HTML de categorías
  if (!container) return;                                      // Guarda si no existe el elemento

  const categories = getCategories();                          // Obtiene listado de categorías
  container.innerHTML = `
    <button class="cat-btn active" data-id="all">Todas</button> 
    ${categories.map(c => `<button class="cat-btn" data-id="${c.id}">${c.nombre}</button>`).join('')}
  `;                                                           // "Todas" inicia activo por defecto

  container.addEventListener('click', (e) => {                 // Escucha clics en los botones
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
      const id = target.getAttribute('data-id');
      selectedCategoryId = id === 'all' || !id ? null : Number(id); // Actualiza ID de categoría

      container.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active')); // Quita selección previa
      target.classList.add('active');                          // Marca el botón cliqueado como activo

      renderProducts();                                        // Re-renderiza el catálogo
    }
  });
};

const renderProducts = () => {                                // Renderiza catálogo según filtros
  const container = document.getElementById('productsContainer'); // Contenedor de productos
  if (!container) return;                                      // Guarda si no existe el elemento

  const filtered = PRODUCTS.filter(p => {                      // Aplica filtros de categoría y nombre
    const matchesCategory = selectedCategoryId === null || p.categoriaId === selectedCategoryId;
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {                                 // Manejo de búsqueda sin resultados
    container.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="product-card">
      <img src="${p.imagen}" alt="${p.nombre}" class="product-img" />
      <h3>${p.nombre}</h3>
      <p>Precio: $${p.precio}</p>
      <button class="add-btn" data-id="${p.id}">Agregar al carrito</button>
    </div>
  `).join('');                                                 // Inyecta tarjetas dinámicamente

  container.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const button = e.currentTarget as HTMLButtonElement;
      const id = Number(button.getAttribute('data-id'));
      const product = PRODUCTS.find(p => p.id === id);

      if (product) {
        addToCart(product);                                      // Persiste en localStorage

        // Feedback visual inmediato en el botón
        const originalText = button.textContent;
        button.textContent = '¡Agregado! ✓';
        button.classList.add('added');
        button.disabled = true;                                  // Evita dobles clics accidentales

        // Restaura el estado original después de 1.2 segundos
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('added');
          button.disabled = false;
        }, 1200);
      }
    });
  });
}
document.getElementById('searchInput')?.addEventListener('input', (e) => { // Escucha la búsqueda en vivo
  searchTerm = (e.target as HTMLInputElement).value;           // Actualiza texto buscado
  renderProducts();                                            // Filtra productos en tiempo real
});

renderCategories();                                            // Carga inicial de categorías
renderProducts();                                           // Carga inicial de productos