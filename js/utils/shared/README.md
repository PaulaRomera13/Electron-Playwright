# Utilidades - Utils

Esta carpeta contiene utilidades y helpers que facilitan el procesamiento de datos y la generación de tests en la aplicación.

## Utilidades disponibles

### `jsonUtils.js`
**Utilidades para el manejo de JSON**

- **Funcionalidades principales**:
  - Formateo y validación de JSON
  - Búsqueda avanzada en estructuras JSON
  - Transformación y manipulación de datos JSON
  - Compresión y expansión de JSON

- **Métodos principales**:
  - `formatJson()` - Formatea JSON para mejor legibilidad
  - `minifyJson()` - Comprime JSON eliminando espacios innecesarios
  - `searchInJson()` - Busca texto en estructuras JSON
  - `validateJson()` - Valida la sintaxis de JSON
  - `transformJson()` - Transforma estructuras JSON

- **Casos de uso**: Procesamiento del modelo JSON, búsqueda de configuraciones, validación de datos

### `fieldUtils.js`
**Utilidades para el manejo de campos**

- **Funcionalidades principales**:
  - Procesamiento de tipos de campos
  - Validación de valores de campos
  - Transformación de tipos de datos
  - Generación de selectores para campos

- **Métodos principales**:
  - `getFieldType()` - Determina el tipo de un campo
  - `validateField()` - Valida el valor de un campo
  - `transformFieldValue()` - Transforma valores según el tipo
  - `generateFieldSelector()` - Genera selectores CSS para campos
  - `processFieldConfig()` - Procesa la configuración de campos

- **Casos de uso**: Procesamiento de formularios, validación de datos, generación de selectores

### `tabUtils.js`
**Utilidades para el manejo de pestañas**

- **Funcionalidades principales**:
  - Gestión de pestañas en la interfaz
  - Navegación entre secciones
  - Control de estado de pestañas
  - Organización de contenido por pestañas

- **Métodos principales**:
  - `createTab()` - Crea una nueva pestaña
  - `switchTab()` - Cambia entre pestañas
  - `closeTab()` - Cierra una pestaña
  - `getActiveTab()` - Obtiene la pestaña activa
  - `updateTabContent()` - Actualiza el contenido de una pestaña

- **Casos de uso**: Organización de la interfaz, navegación entre secciones, gestión de múltiples vistas

### `objectByTabsUtils.js`
**Utilidades para objetos organizados por pestañas**

- **Funcionalidades principales**:
  - Procesamiento de objetos complejos
  - Organización de datos por categorías
  - Gestión de dependencias entre pestañas
  - Validación de objetos multi-pestaña

- **Métodos principales**:
  - `organizeByTabs()` - Organiza un objeto por pestañas
  - `validateTabObject()` - Valida objetos con estructura de pestañas
  - `processTabDependencies()` - Procesa dependencias entre pestañas
  - `mergeTabData()` - Combina datos de múltiples pestañas
  - `extractTabConfig()` - Extrae configuración específica de pestañas

- **Casos de uso**: Formularios complejos, configuraciones multi-sección, objetos con estructura jerárquica

## Patrones de uso

### Flujo típico de procesamiento

1. **Entrada de datos**: JSON se procesa con `jsonUtils.js`
2. **Extracción de campos**: Se identifican campos con `fieldUtils.js`
3. **Organización**: Se organizan por pestañas con `objectByTabsUtils.js`
4. **Navegación**: Se gestiona la interfaz con `tabUtils.js`
5. **Generación**: Se generan los tests usando las utilidades procesadas

### Integración con generadores

Las utilidades están diseñadas para ser utilizadas por los generadores de tests:

- Los generadores usan `fieldUtils.js` para procesar campos específicos
- `jsonUtils.js` se usa para extraer configuraciones del modelo JSON
- `objectByTabsUtils.js` ayuda con formularios complejos
- `tabUtils.js` gestiona la presentación de resultados

## Extensibilidad

Para agregar nuevas utilidades:

1. Crear un nuevo archivo en esta carpeta
2. Seguir el patrón de nomenclatura `*Utils.js`
3. Exportar las funciones principales
4. Documentar los métodos y casos de uso
5. Integrar con los generadores existentes si es necesario 