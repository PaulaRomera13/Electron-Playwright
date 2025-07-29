# CHANGELOG

## [2.0.0] - 2025-07-29

### 🆕 Añadido - Tests Regresivos

- **Sistema completo de tests regresivos**
  - Nuevo generador `testGeneratorRegressive.js` para crear tests que cubren múltiples pantallas o múltiples acciones.
  - Configuración de número de pantallas para tests regresivos
  - Editor de JSONs múltiples para pegar la estructura de cada pantalla
  - Selector de acciones avanzado que permite elegir acciones específicas de cada pantalla
  - Sistema de navegación entre pantallas con botones anterior/siguiente
  - Panel de acciones guardadas con gestión visual de todas las acciones
  - Generación de tests completos que cubren flujos de múltiples pantallas

- **Nuevos endpoints del servidor para tests regresivos**
  - `POST /clear-regressive`: Limpia el archivo de tests regresivos antes de empezar un nuevo test
  - `POST /upload-regressive`: Guarda múltiples pantallas de una vez con validación completa
  - `GET /regressive-json`: Obtiene las pantallas regresivas guardadas para debugging
  - Validación robusta de datos con mensajes de error detallados

- **Interfaz de usuario mejorada para tests regresivos**
  - Barra de navegación regresiva con indicadores visuales de pantalla actual
  - Panel de acciones guardadas con opciones de eliminación individual
  - Modo regresivo especializado con interfaz adaptada
  - Generación de tests mejorada con resultados más detallados y organizados
  - Botones de generación contextuales según el número de pantallas

- **Funcionalidades avanzadas de navegación**
  - Navegación fluida entre pantallas con estado persistente
  - Indicadores visuales de progreso (pantalla actual/total)
  - Botones de navegación inteligentes (deshabilitados en extremos)
  - Gestión de estado de pantallas con configuración independiente
  - Sincronización automática entre navegación y configuración

###  Mejorado

- **Arquitectura del servidor**
  - Refactorización de endpoints para mejor manejo de errores
  - Validación mejorada de datos de entrada
  - Sistema de backup automático más robusto
  - Logging mejorado para debugging

- **Gestión de archivos**
  - Manejo optimizado de archivos JSON grandes
  - Validación de estructura de datos mejorada
  - Sistema de backup más eficiente
  - Gestión de errores más detallada

- **Interfaz de usuario**
  - Mejor organización visual de elementos
  - Feedback más claro para el usuario
  - Manejo de errores más intuitivo
  - Navegación más fluida entre componentes

### 🐛 Corregido

- **Sincronización de datos**
  - Solucionado problema de guardado de múltiples pantallas en modo regresivo
  - Mejorado el manejo de estados entre pantallas
  - Corregida la persistencia de configuraciones

- **Validación de datos**
  - Mejorada la validación de JSONs de entrada
  - Corregidos errores de parsing en estructuras complejas
  - Validación más robusta de componentes y acciones

## [1.0.0] - 2025-07-26

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
  