# 🍔 Food Store - Evaluación 1 
Evaluación 1 de Programación 3

## 🎥 Video Explicativo

Podés ver la explicación del proyecto y su funcionamiento en el siguiente enlace:

👉 [**Ver Video Explicativo del Proyecto**](https://canva.link/3ba2nsk6othqktw)
Aplicación web modular para una tienda de comida rápida construida como una **MPA (Multi-Page Application)** con **Vite**, **TypeScript** y **CSS puro**.

---

## 🚀 Características

* **Catálogo interactivo**: Búsqueda en tiempo real por texto y filtrado dinámico por categorías.
* **Carrito de compras (CRUD)**:
    * Agregado de productos sin ventanas emergentes (feedback visual directo en botones).
    * Incremento, decremento y eliminación de ítems.
    * Cálculo dinámico de subtotales y total general.
    * Persistencia de datos mediante `localStorage`.
* **Diseño e Interfaz**:
    * Sistema de diseño centralizado con variables CSS.
    * Alineación y dimensiones unificadas para botones y componentes.
    * Soporte de imágenes para productos (URLs locales y externas) con imagen de respaldo (*fallback*).
* **Navegación**: Flujo que redirige desde el carrito hacia la pasarela de pago (`checkout.html`) proximamente...

---


## 🚀 Características

* **Catálogo interactivo**: Búsqueda en tiempo real por texto y filtrado dinámico por categorías.
* **Carrito de compras (CRUD)**:
    * Agregado de productos sin ventanas emergentes (feedback visual directo en botones).
    * Incremento, decremento y eliminación de ítems.
    * Cálculo dinámico de subtotales y total general.
    * Persistencia de datos mediante `localStorage`.
* **Diseño e Interfaz**:
    * Sistema de diseño centralizado con variables CSS.
    * Alineación y dimensiones unificadas para botones y componentes.
    * Soporte de imágenes para productos (URLs locales y externas) con imagen de respaldo (*fallback*).
* **Navegación**: Flujo que redirige desde el carrito hacia la pasarela de pago (`checkout.html`).

---

## 📁 Estructura del Proyecto

```text
Evaluación1-Prog3/
├── src/
│   ├── data/
│   │   └── data.ts
│   ├── pages/
│   │   ├── admin/
│   │   │   └── home/
│   │   │       └── home.html
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
│       ├── cart.ts
│       ├── localStorage.ts
│       └── navigate.ts
├── .gitignore
├── main.ts
├── README.md
├── style.css
└── vite-env.d.ts  
```
📝 Descripción de los Módulos Clave
src/data/: Datos estáticos o de prueba para la aplicación (data.ts).

src/pages/: Vistas HTML organizadas por rol y funcionalidad (admin, auth para inicio de sesión, y client para catálogo/carrito).

src/types/: Definiciones de tipos e interfaces TypeScript (IUser, Rol, categoria, product).

src/utils/: Funciones auxiliares de navegación (navigate.ts), persistencia de datos (localStorage.ts) y lógica del carrito (cart.ts).

main.ts / vite-env.d.ts: Punto de entrada principal de la aplicación y declaración de tipos de entorno para Vite.

---

## 🛠️ Tecnologías Utilizadas

* **TypeScript**: Lenguaje principal para una lógica de negocio robusta y tipada.
* **Vite**: Entorno de desarrollo y empaquetador rápido para arquitectura MPA (*Multi-Page Application*).
* **HTML5 & CSS3**: Estructura semántica y diseño personalizado mediante variables CSS sin librerías externas.
* **LocalStorage API**: Persistencia de datos local en el navegador para el carrito de compras.

---

## ⚙️ Instalación y Ejecución

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1. **Clonar el repositorio**
   ```bash
   git clone [https://github.com/TU_USUARIO/TU_REPOSITORIO.git](https://github.com/TU_USUARIO/TU_REPOSITORIO.git)
