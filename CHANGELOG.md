# CHANGELOG

## [1.0.0] - 2025-07-23

### Añadido

- **Soporte para entornos de desarrollo y producción**  
  La aplicación funciona correctamente tanto en desarrollo como en producción. Se solucionó el problema de rutas y dependencias con Express.js y Electron.

- **Backend Express.js**  
  - Servidor Express para gestionar la carga y descarga dinámica del archivo `modelJson` (usado como fuente de datos para la generación de tests).
  - Endpoints:
    - `POST /upload-model`: Permite subir y reemplazar el archivo `modelJson.json` con un nuevo modelo JSON.
    - `GET /model-json`: Devuelve el modelo JSON actual para su uso en la aplicación.

- **Frontend Electron**  
  - Interfaz moderna y responsiva para la generación de tests Playwright.
  - Sidebar con configuración principal y lista dinámica de acciones disponibles.
  - Panel de detalles para cada acción, con pestañas para ver el modelo JSON y el generador de test correspondiente.

- **Generadores de tests por familias de acción**  
  Implementados como módulos independientes, cada uno con su propio formulario y lógica de generación:
  - **Dialog**: Para acciones que requieren un diálogo con campos configurables. Permite incluir/excluir campos, elegir idioma y personalizar notificaciones.
  - **DialogWithColumnSelection**: Para diálogos que incluyen selección de columnas, maneja tablas con columnas seleccionables y filtros avanzados.
  - **NoDialog**: Para acciones directas que no requieren diálogo. Permite configurar el proceso, pestaña, botón, elemento a seleccionar, posiciones y opciones avanzadas como flechas y botones ocultos.
  - **Audit**: Para acciones de auditoría, con campos y lógica específica para este tipo de test.
  - **Export**: Para acciones de exportación de datos, con configuración de ruta de descarga, selección de columnas y validación de la descarga.
  - **OpenAttachment**: Para acciones que abren adjuntos, con campos específicos para URL, posición y botones de confirmación.
  - **RemoveAttachment**: Para acciones que eliminan adjuntos, permitiendo seleccionar el adjunto y su posición, así como opciones avanzadas.
  - **AWS**: Para acciones de subida de archivos a AWS, con campos específicos para ruta de archivo, input de subida y configuraciones avanzadas.
  - **ReactiveObjectDialog**: Para diálogos con objetos reactivos que cambian dinámicamente, maneja formularios complejos con validaciones dinámicas.

- **Soporte para componente Tabs y utilidades asociadas**  
  - Añadido soporte completo para componentes de tipo Tabs en todos los generadores de tests.
  - Nuevo archivo de utilidades `tabUtils.js` para detección y gestión de Tabs.
  - Selector de idioma (ES/EN) para el label de la tab activa, con visualización profesional y consistente.
  - Generación automática de las propiedades `phraseTab`, `tab` y `screenShotTab` en el JSON de test, según el idioma seleccionado por el usuario.
  - Refactorización para evitar duplicación de código: lógica de Tabs centralizada en la clase base `BaseTestGenerator`.

- **Utilidades y helpers**  
  - Utilidades para manejo de campos (`fieldUtils.js`) y JSON (`jsonUtils.js`).
  - Utilidades para manejo de pestañas (`tabUtils.js`) y objetos por pestañas (`objectByTabsUtils.js`).
  - Plantillas base para los datos de test generados, adaptadas a distintos modos (desktop, móvil, tablet).

- **Interfaz de usuario**  
  - Estilos modernos y claros (`index.css`).
  - Iconografía y botones contextuales.
  - Modal para cargar/actualizar el modelo JSON desde la interfaz.

- **Soporte para componentes de vista**  
  Actualmente, todas las funcionalidades están disponibles para los componentes:
  - **Single View**: Vista simple con formularios básicos
  - **Tabs**: Vista con pestañas para organizar contenido
  - **ObjectByTabs**: Vista con objetos complejos organizados por pestañas, con utilidades específicas en `objectByTabsUtils.js`

- **Actions y Row Buttons**
  Lista de las acciones de actions y de row_buttons.

- **Arquitectura de generadores**
  - Clase base `BaseTestGenerator` que proporciona funcionalidades comunes
  - 9 generadores específicos que extienden de la clase base
  - Patrón de herencia para mantener consistencia en todos los tests
  - Utilidades compartidas para procesamiento de datos y validaciones
  