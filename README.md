# Clon de Tienda HSN - Proyecto de Despliegue de Aplicaciones Web

Este proyecto es una práctica de desarrollo web que recrea la interfaz y funcionalidades de la tienda **HSN**, una plataforma líder en nutrición deportiva y salud. El objetivo principal ha sido aplicar conocimientos de **React** para el frontend y **MongoDB** para la gestión de datos.

---

## Previsualización del Proyecto

A continuación, se muestra una captura de la página principal donde se aprecia el diseño inspirado en la campaña actual de HSN:

![Vista principal de la tienda HSN](hsn.png)
> *Ejemplo de la cabecera y el banner promocional "Autumn Outlet" implementado.*

---

## Tecnologías Utilizadas

* **Frontend:** React.js
* **Backend:** Node.js
* **Base de Datos:** MongoDB (NoSQL)
* **Estilos:** CSS3 / SASS (o la tecnología que hayas usado, ej. Bootstrap/Tailwind)
* **Control de Versiones:** Git & GitHub

---

## Estructura y Componentes

La aplicación se ha desarrollado siguiendo una arquitectura basada en componentes reutilizables para mantener un código limpio y escalable:

* **Navbar / Cabecera:** Incluye el logotipo de HSN, la barra de búsqueda avanzada y el acceso al carrito de compras con contador de artículos.
* **Menú de Navegación:** Categorización completa que incluye secciones como:
    * Nutrición Deportiva.
    * Salud y Bienestar.
    * Alimentación, Accesorios, y más.
* **Banner Principal (Hero Section):** Un componente dinámico que muestra las ofertas destacadas (como el "Autumn Outlet" con descuentos de hasta el 80%).
* **Listado de Productos:** Componente encargado de renderizar las tarjetas de productos obtenidas desde la base de datos.
* **Base de Datos (MongoDB):** Se ha diseñado una estructura en MongoDB para almacenar la información de los productos, categorías y usuarios, permitiendo una gestión de datos eficiente y flexible.

---

## Instalación y Configuración

Para ejecutar este proyecto de forma local, sigue estos pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/Freyja96/despliegueDeAplicacionesWeb.git](https://github.com/Freyja96/despliegueDeAplicacionesWeb.git)

2. **Acceder a la carpeta del proyecto:**
    ```bash
    cd tiendaHSN-A___react-nodejs___25-26

3. **Instalar dependencias:**
    ```bash
    npm install

4. **Configurar variables de entorno:** 
Crea un archivo .env en la raíz y añade tu cadena de conexión a MongoDB.

5. **Iniciar la aplicación:**
    ```bash
    npm start

## Gestión del Proyecto con Git

Durante el desarrollo se ha hecho un uso exhaustivo de comandos Git para el control de versiones. Se inicializó el repositorio localmente y se gestionaron los archivos mediante:

* **`git init`**: Inicialización del repositorio.
* **`git status`**: Seguimiento de archivos *untracked* y cambios en el área de preparación.
* **`git add`** y **`git commit`**: Para la confirmación de hitos en el desarrollo.

## Autor

* **Cris Ouellette Hernández / Freyja96** - [GitHub](https://github.com/Freyja96) - [LinkedIn](www.linkedin.com/in/cris-ouellette)