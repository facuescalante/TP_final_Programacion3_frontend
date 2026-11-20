# 🍔 Food Store — Frontend

Aplicación web modular para una tienda de comida rápida construida como una **MPA (Multi-Page Application)** con **Vite**, **TypeScript** y **CSS puro**, con persistencia en `localStorage` y arquitectura desacoplada del backend.

---

## 🎥 Video Explicativo

Podés ver la explicación del proyecto y su funcionamiento en el siguiente enlace:

👉 [**Ver Video Explicativo del Proyecto**](https://canva.link/o82z8oc7xp1nt4w)

---

## 🚀 Características

- **Catálogo interactivo**: Búsqueda en tiempo real por texto y filtrado dinámico por categorías.
- **Carrito de compras (CRUD) y Checkout**:
  - Agregado de productos con feedback visual directo sin ventanas emergentes bloqueantes.
  - Incremento, decremento y eliminación de ítems.
  - Cálculo dinámico de subtotales, envío y total general.
  - Persistencia de datos en `localStorage` y redirección al flujo de compra (`checkout.html`).
- **Panel de Administración**:
  - Gestión de productos (alta, edición, eliminación, control de stock y normalización de categorías/imágenes con respaldo *fallback*).
  - Gestión de categorías y renderizado seguro evitando errores de formato (`[object Object]`).
  - Gestión de pedidos (`orders.ts`): filtrado por estado, apertura de **modal de detalle completo** (cliente, contacto/dirección, productos, cantidades, subtotal, envío y total) y **cambio de estado** (*Pendiente*, *Confirmado*, *Terminado*, *Cancelado*) con guardado persistente en `localStorage` (`foodstore_orders`) y parseo defensivo de ítems (`productos`, `items`, `carrito`, `cart`).
- **Diseño e Interfaz**:
  - Sistema de diseño centralizado con variables CSS y componentes consistentes.
  - Soporte de imágenes para productos (URLs locales y externas) con respaldo (*fallback*).

---

## 📁 Estructura del Proyecto

```text
tp_final_front/
├── public/
│   └── data/
│       ├── productos.json
│       └── categorias.json
├── src/
│   ├── data/
│   │   └── data.ts
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── home/
│   │   │   │   └── home.html
│   │   │   ├── products.ts
│   │   │   └── orders.ts
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── login.html
│   │   └── client/
│   │       ├── cart/
│   │       └── home/
│   ├── types/
│   │   ├── categoria.ts
│   │   ├── IUser.ts
│   │   ├── product.ts
│   │   └── Rol.ts
│   └── utils/
│       ├── auth.ts
│       ├── cart.ts
│       ├── localStorage.ts
│       └── navigate.ts
├── .gitignore
├── index.html
├── main.ts
├── package.json
├── README.md
├── style.css
├── tsconfig.json
└── vite-env.d.ts
```

### 📝 Descripción de los Módulos Clave

- `src/data/`: Datos estáticos o de prueba para la aplicación (`data.ts`) y archivos JSON iniciales en `public/data/`.
- `src/pages/`: Vistas HTML y scripts organizadas por rol y funcionalidad (`admin` para gestión de productos, categorías y pedidos; `auth` para inicio de sesión; y `client` para catálogo, carrito y checkout).
- `src/types/`: Definiciones de tipos e interfaces TypeScript (`IUser`, `Rol`, `categoria`, `product`).
- `src/utils/`: Funciones auxiliares de sesión/autenticación (`auth.ts`), navegación (`navigate.ts`), persistencia (`localStorage.ts`) y lógica del carrito (`cart.ts`).
- `main.ts / vite-env.d.ts`: Punto de entrada principal de la aplicación y declaración de tipos de entorno para Vite.

---

## 🛠️ Tecnologías Utilizadas

- **TypeScript**: Lenguaje principal para una lógica de negocio robusta y tipada.
- **Vite**: Entorno de desarrollo y empaquetador rápido para arquitectura MPA (*Multi-Page Application*).
- **HTML5 & CSS3**: Estructura semántica y diseño personalizado mediante variables CSS sin librerías externas.
- **LocalStorage API**: Persistencia local en el navegador para sesión, carrito, productos, categorías y pedidos.

---

## ⚙️ Instrucciones de Instalación y Ejecución

1. **Ubicarse en la carpeta del frontend**:
   ```bash
   cd tp_final_front
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Compilar para producción** *(opcional)*:
   ```bash
   npm run build
   ```

---

## 🔐 Credenciales de Prueba por Rol

> *Ajustá o verificá los datos exactos configurados en `src/utils/auth.ts` o en la vista de inicio de sesión (`login.html`).*

| Rol | Usuario / Correo | Contraseña | Permisos / Alcance |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@foodstore.com` *(según `auth.ts`)* | `admin123` *(según `auth.ts`)* | Acceso al panel admin: gestión de productos, categorías y revisión/actualización de estados de pedidos. |
| **Cliente** | `cliente@foodstore.com` *(según `auth.ts`)* | `cliente123` *(según `auth.ts`)* | Acceso a catálogo, carrito de compras, checkout y generación de pedidos. |