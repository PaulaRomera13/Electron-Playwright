# Carpeta JavaScript

Esta carpeta contiene todo el código JavaScript de la aplicación Electron para generar tests de Playwright.

## Estructura

### Archivos principales

- **`app.js`** - Lógica principal de la aplicación
  - Maneja la inicialización de la aplicación
  - Gestiona la carga del modelo JSON
  - Coordina la generación de tests

- **`sidebar.js`** - Gestión de la barra lateral
  - Renderiza la configuración principal
  - Muestra las acciones disponibles
  - Gestiona la interacción con el usuario

- **`baseTestGenerator.js`** - Generador base de tests
  - Clase base para todos los generadores de tests
  - Define la estructura común para todos los tipos de tests
  - Proporciona métodos utilitarios compartidos
  - Maneja la lógica común de generación de tests
  - Establece el patrón de herencia para todos los generadores específicos

### Subcarpetas

#### `families/`
Contiene generadores específicos para diferentes tipos de tests. Cada archivo maneja un tipo particular de acción:

- **`testGeneratorDialog.js`** - Tests para diálogos simples
- **`testGeneratorDialogWithColumnSelection.js`** - Tests para diálogos con selección de columnas
- **`testGeneratorExport.js`** - Tests para funcionalidades de exportación
- **`testGeneratorAudit.js`** - Tests para funcionalidades de auditoría
- **`testGeneratorOpenAttachment.js`** - Tests para abrir archivos adjuntos
- **`testGeneratorRemoveAttachment.js`** - Tests para eliminar archivos adjuntos
- **`testGeneratorNoDialog.js`** - Tests para acciones sin diálogo
- **`testGeneratorAWS.js`** - Tests para funcionalidades relacionadas con AWS
- **`testGeneratorReactiveObjectDialog.js`** - Tests para diálogos con objetos reactivos

#### `utils/`
Contiene utilidades y helpers para el procesamiento de datos:

- **`jsonUtils.js`** - Utilidades para el manejo de JSON
  - Formateo y validación de JSON
  - Búsqueda en estructuras JSON
  - Transformación de datos

- **`fieldUtils.js`** - Utilidades para el manejo de campos
  - Procesamiento de tipos de campos
  - Validación de campos
  - Transformación de valores

- **`tabUtils.js`** - Utilidades para el manejo de pestañas
  - Gestión de pestañas en la interfaz
  - Navegación entre secciones

- **`objectByTabsUtils.js`** - Utilidades para objetos organizados por pestañas
  - Procesamiento de objetos complejos
  - Organización de datos por categorías

## baseTestGenerator.js - Clase Base

### Propósito
`baseTestGenerator.js` es la clase base que define la estructura común para todos los generadores de tests de Playwright. Establece el patrón de herencia y proporciona funcionalidades compartidas.

### Características principales

#### Estructura de la clase
- **Constructor**: Inicializa el generador con la configuración básica
- **Método `generateTest()`**: Método abstracto que debe ser implementado por cada generador específico
- **Métodos utilitarios**: Proporciona funciones comunes para todos los generadores

#### Funcionalidades compartidas
- **Validación de datos**: Verifica que los datos de entrada sean válidos
- **Generación de selectores**: Crea selectores CSS para elementos de la interfaz
- **Manejo de configuraciones**: Procesa configuraciones comunes de tests
- **Formateo de código**: Aplica formato consistente al código generado
- **Gestión de errores**: Maneja errores comunes en la generación de tests

#### Métodos principales
- `validateInput()` - Valida los datos de entrada del generador
- `generateSelector()` - Genera selectores CSS para elementos
- `formatCode()` - Aplica formato al código Playwright generado
- `handleError()` - Maneja errores durante la generación
- `getCommonImports()` - Obtiene imports comunes para todos los tests


### Integración con generadores específicos

Cada generador en la carpeta `families/` extiende de `baseTestGenerator.js`:

1. **Herencia**: Todos los generadores heredan de la clase base
2. **Implementación**: Cada generador implementa su propio método `generateTest()`
3. **Reutilización**: Utilizan los métodos utilitarios de la clase base
4. **Consistencia**: Mantienen un formato y estructura consistente

### Configuración común

El generador base maneja configuraciones que se aplican a todos los tests:

- **Configuración de Playwright**: Imports y setup común
- **Configuración de navegación**: Manejo de URLs y páginas
- **Configuración de esperas**: Timeouts y condiciones de espera
- **Configuración de aserciones**: Validaciones comunes

## Flujo de trabajo

1. El usuario carga un JSON en la aplicación
2. `app.js` procesa el JSON y extrae las acciones disponibles
3. `sidebar.js` muestra las acciones en la interfaz
4. Cuando el usuario selecciona una acción, se identifica el tipo
5. Se instancia el generador correspondiente de `families/` (que extiende de `baseTestGenerator.js`)
6. El generador crea el test específico usando las utilidades de `utils/` y métodos de la clase base
7. El test generado se muestra al usuario para su revisión 