import { initUserSession } from '../../../utils/auth';

interface IAdminProduct {

    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    stock: number;
    imagen: string;
    disponible: boolean;
}

const DEFAULT_PRODUCTS: IAdminProduct[] = [
    { id: 1, nombre: 'Hamburguesa Clásica', descripcion: 'Carne 150g, lechuga, tomate, cebolla morada y mayonesa', precio: 4500, categoria: 'Hamburguesas', stock: 50, imagen: '🍔', disponible: true },
    { id: 2, nombre: 'Hamburguesa Doble', descripcion: 'Doble carne 150g c/u, cheddar, panceta y salsa barbacoa', precio: 6200, categoria: 'Hamburguesas', stock: 40, imagen: '🍔', disponible: true },
    { id: 3, nombre: 'Hamburguesa Completa', descripcion: 'Carne 150g, huevo, jamón, queso, lechuga y tomate', precio: 5500, categoria: 'Hamburguesas', stock: 30, imagen: '🍔', disponible: true },
    { id: 4, nombre: 'Hamburguesa Veggie', descripcion: 'Medallón de lentejas y quinoa, rúcula, tomate confitado', precio: 5000, categoria: 'Hamburguesas', stock: 20, imagen: '🍔', disponible: true }
];

async function getStoredProducts(): Promise<IAdminProduct[]> {
    const data = localStorage.getItem('foodstore_products_admin');
    if (data) {
        return JSON.parse(data);
    }

    try {
        // Hacemos fetch a ambos JSON
        const [prodRes, catRes] = await Promise.all([
            fetch('/data/productos.json'),
            fetch('/data/categorias.json')
        ]);

        if (!prodRes.ok) throw new Error('Error al leer productos.json');

        const rawProducts = await prodRes.json();
        const rawCategories = catRes.ok ? await catRes.json() : [];

        // Mapeamos los productos del JSON al formato de la tabla (resolviendo categoriaId -> nombre)
        const mappedProducts: IAdminProduct[] = rawProducts
            .filter((p: any) => !p.eliminado)
            .map((p: any) => {
                const catObj = rawCategories.find((c: any) => c.id === p.categoriaId);
                return {
                    id: p.id,
                    nombre: p.nombre,
                    descripcion: p.descripcion || '',
                    precio: Number(p.precio),
                    categoria: catObj ? catObj.nombre : (p.categoria || 'Sin categoría'),
                    stock: Number(p.stock),
                    imagen: p.imagen || '🍔',
                    disponible: p.disponible ?? (p.stock > 0)
                };
            });

        localStorage.setItem('foodstore_products_admin', JSON.stringify(mappedProducts));
        return mappedProducts;
    } catch (error) {
        console.warn('No se pudo cargar desde JSON, usando datos por defecto:', error);
        localStorage.setItem('foodstore_products_admin', JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
    }
}

function saveProducts(products: IAdminProduct[]) {
    localStorage.setItem('foodstore_products_admin', JSON.stringify(products));
}

async function initProductsPage() {
    initUserSession();
    await renderTable();
    setupModalEvents();
}

async function loadCategoryOptions(selectedCategoryName: string = '') {
    const selectElement = document.getElementById('prodCategory') as HTMLSelectElement;
    if (!selectElement) return;

    let categories: { nombre: string }[] = [];
    const storedCategoriesRaw = localStorage.getItem('foodstore_categories');

    if (storedCategoriesRaw) {
        categories = JSON.parse(storedCategoriesRaw);
    } else {
        try {
            const res = await fetch('/data/categorias.json');
            if (res.ok) categories = await res.json();
        } catch (e) {
            console.error(e);
        }
    }

    selectElement.innerHTML = '';

    if (categories.length === 0) {
        selectElement.innerHTML = `<option value="">No hay categorías creadas</option>`;
        return;
    }

    categories.forEach((cat) => {
        const option = document.createElement('option');
        option.value = cat.nombre;
        option.textContent = cat.nombre;
        if (cat.nombre === selectedCategoryName) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
}

async function renderTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    const products = await getStoredProducts();

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 2rem; color: #6b7280;">No hay productos registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map(prod => `
        <tr>
            <td>#${prod.id}</td>
            <td>
            <img src="${prod.imagen}" alt="${prod.nombre}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; background: #fff5f2;" onerror="this.onerror=null; this.src='https://via.placeholder.com/45?text=🍔';" />
            </td>
            <td><strong>${prod.nombre}</strong></td>
            <td style="max-width: 200px; font-size: 0.85rem; color: #6b7280;">${prod.descripcion}</td>
            <td><strong>$${prod.precio.toLocaleString()}</strong></td>
            <td>${typeof prod.categoria === 'object' ? (prod.categoria as any)?.nombre : prod.categoria}</td>
            <td>${prod.stock}</td>
            <td>
                <span class="badge ${prod.stock > 0 && prod.disponible ? 'badge-success' : 'badge-danger'}">
                    ${prod.stock > 0 && prod.disponible ? 'Disponible' : 'Agotado'}
                </span>
            </td>
            <td style="text-align: right;">
                <button class="btn-edit" data-id="${prod.id}" style="background: #f3f4f6; border: 1px solid #d1d5db; padding: 0.3rem 0.8rem; border-radius: 6px; cursor: pointer; margin-right: 0.4rem;">Editar</button>
                <button class="btn-delete" data-id="${prod.id}" style="background: #fee2e2; color: #dc2626; border: none; padding: 0.3rem 0.8rem; border-radius: 6px; cursor: pointer;">Eliminar</button>
            </td>
        </tr>
    `).join('');

    tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLElement).getAttribute('data-id'));
            openModalForEdit(id);
        });
    });

    tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLElement).getAttribute('data-id'));
            deleteProduct(id);
        });
    });
}

function setupModalEvents() {
    const modal = document.getElementById('productModal');
    const btnOpen = document.getElementById('btnOpenModal');
    const btnClose = document.getElementById('btnCloseModal');
    const form = document.getElementById('productForm') as HTMLFormElement;

    btnOpen?.addEventListener('click', async () => {
        resetForm();
        await loadCategoryOptions();
        document.getElementById('modalTitle')!.textContent = 'Nuevo Producto';
        if (modal) modal.style.display = 'flex';
    });

    btnClose?.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const idInput = (document.getElementById('productId') as HTMLInputElement).value;
        const nombre = (document.getElementById('prodName') as HTMLInputElement).value.trim();
        const descripcion = (document.getElementById('prodDesc') as HTMLTextAreaElement).value.trim();
        const precio = Number((document.getElementById('prodPrice') as HTMLInputElement).value);
        const stock = Number((document.getElementById('prodStock') as HTMLInputElement).value);
        const categoria = (document.getElementById('prodCategory') as HTMLSelectElement).value;
        const imagen = (document.getElementById('prodImage') as HTMLInputElement).value.trim() || '🍔';

        const products = await getStoredProducts();

        if (idInput) {
            const id = Number(idInput);
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = { id, nombre, descripcion, precio, categoria, stock, imagen, disponible: stock > 0 };
            }
        } else {
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, nombre, descripcion, precio, categoria, stock, imagen, disponible: stock > 0 });
        }

        saveProducts(products);
        if (modal) modal.style.display = 'none';
        await renderTable();
    });
}

async function openModalForEdit(id: number) {
    const products = await getStoredProducts();
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    (document.getElementById('productId') as HTMLInputElement).value = String(prod.id);
    (document.getElementById('prodName') as HTMLInputElement).value = prod.nombre;
    (document.getElementById('prodDesc') as HTMLTextAreaElement).value = prod.descripcion;
    (document.getElementById('prodPrice') as HTMLInputElement).value = String(prod.precio);
    (document.getElementById('prodStock') as HTMLInputElement).value = String(prod.stock);

    await loadCategoryOptions(prod.categoria);

    (document.getElementById('prodImage') as HTMLInputElement).value = prod.imagen;

    document.getElementById('modalTitle')!.textContent = 'Editar Producto';
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'flex';
}

async function deleteProduct(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        let products = await getStoredProducts();
        products = products.filter(p => p.id !== id);
        saveProducts(products);
        await renderTable();
    }
}

function resetForm() {
    (document.getElementById('productId') as HTMLInputElement).value = '';
    (document.getElementById('productForm') as HTMLFormElement).reset();
}

document.addEventListener('DOMContentLoaded', initProductsPage);