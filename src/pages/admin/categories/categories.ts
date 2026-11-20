import { initUserSession } from '../../../utils/auth';

interface ICategory {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
}

// Categorías iniciales por defecto si el localStorage está vacío
const DEFAULT_CATEGORIES: ICategory[] = [
    { id: 1, nombre: 'Hamburguesas', descripcion: 'Hamburguesas artesanales con carne premium', imagen: '🍔' },
    { id: 2, nombre: 'Pizzas', descripcion: 'Pizzas al horno de barro', imagen: '🍕' },
    { id: 3, nombre: 'Empanadas', descripcion: 'Empanadas caseras horneadas', imagen: '🥟' },
    { id: 4, nombre: 'Bebidas', descripcion: 'Bebidas frías y calientes', imagen: '🥤' },
    { id: 5, nombre: 'Papas Fritas', descripcion: 'Acompañamientos crujientes', imagen: '🍟' }
];

function getStoredCategories(): ICategory[] {
    const data = localStorage.getItem('foodstore_categories');
    if (!data) {
        localStorage.setItem('foodstore_categories', JSON.stringify(DEFAULT_CATEGORIES));
        return DEFAULT_CATEGORIES;
    }
    return JSON.parse(data);
}

function saveCategories(categories: ICategory[]) {
    localStorage.setItem('foodstore_categories', JSON.stringify(categories));
}

function initCategoriesPage() {
    initUserSession();
    renderTable();
    setupModalEvents();
}

// Renderizar la tabla de categorías
function renderTable() {
    const tbody = document.getElementById('categoriesTableBody');
    if (!tbody) return;

    const categories = getStoredCategories();

    if (categories.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #6b7280;">No hay categorías registradas.</td></tr>`;
        return;
    }

    tbody.innerHTML = categories.map(cat => `
        <tr>
            <td>#${cat.id}</td>
            <td><span style="font-size: 1.5rem; background: #fff5f2; padding: 0.3rem; border-radius: 6px;">${cat.imagen || '📦'}</span></td>
            <td><strong>${cat.nombre}</strong></td>
            <td>${cat.descripcion}</td>
            <td style="text-align: right;">
                <button class="btn-edit" data-id="${cat.id}" style="background: #f3f4f6; border: 1px solid #d1d5db; padding: 0.3rem 0.8rem; border-radius: 6px; cursor: pointer; margin-right: 0.4rem;">Editar</button>
                <button class="btn-delete" data-id="${cat.id}" style="background: #fee2e2; color: #dc2626; border: none; padding: 0.3rem 0.8rem; border-radius: 6px; cursor: pointer;">Eliminar</button>
            </td>
        </tr>
    `).join('');

    // Eventos para Editar y Eliminar
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLElement).getAttribute('data-id'));
            openModalForEdit(id);
        });
    });

    tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLElement).getAttribute('data-id'));
            deleteCategory(id);
        });
    });
}

// Configuración del Modal (Abrir, Cerrar, Guardar)
function setupModalEvents() {
    const modal = document.getElementById('categoryModal');
    const btnOpen = document.getElementById('btnOpenModal');
    const btnClose = document.getElementById('btnCloseModal');
    const form = document.getElementById('categoryForm') as HTMLFormElement;

    btnOpen?.addEventListener('click', () => {
        resetForm();
        document.getElementById('modalTitle')!.textContent = 'Nueva Categoría';
        if (modal) modal.style.display = 'flex';
    });

    btnClose?.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
    });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const idInput = (document.getElementById('categoryId') as HTMLInputElement).value;
        const nombre = (document.getElementById('catName') as HTMLInputElement).value.trim();
        const descripcion = (document.getElementById('catDesc') as HTMLTextAreaElement).value.trim();
        const imagen = (document.getElementById('catImage') as HTMLInputElement).value.trim() || '📂';

        const categories = getStoredCategories();

        if (idInput) {
            // Editar existente
            const id = Number(idInput);
            const index = categories.findIndex(c => c.id === id);
            if (index !== -1) {
                categories[index] = { id, nombre, descripcion, imagen };
            }
        } else {
            // Crear nueva
            const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
            categories.push({ id: newId, nombre, descripcion, imagen });
        }

        saveCategories(categories);
        if (modal) modal.style.display = 'none';
        renderTable();
    });
}

function openModalForEdit(id: number) {
    const categories = getStoredCategories();
    const cat = categories.find(c => c.id === id);
    if (!cat) return;

    (document.getElementById('categoryId') as HTMLInputElement).value = String(cat.id);
    (document.getElementById('catName') as HTMLInputElement).value = cat.nombre;
    (document.getElementById('catDesc') as HTMLTextAreaElement).value = cat.descripcion;
    (document.getElementById('catImage') as HTMLInputElement).value = cat.imagen;

    document.getElementById('modalTitle')!.textContent = 'Editar Categoría';
    const modal = document.getElementById('categoryModal');
    if (modal) modal.style.display = 'flex';
}

function deleteCategory(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        let categories = getStoredCategories();
        categories = categories.filter(c => c.id !== id);
        saveCategories(categories);
        renderTable();
    }
}

function resetForm() {
    (document.getElementById('categoryId') as HTMLInputElement).value = '';
    (document.getElementById('categoryForm') as HTMLFormElement).reset();
}

document.addEventListener('DOMContentLoaded', initCategoriesPage);