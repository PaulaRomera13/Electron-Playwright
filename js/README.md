# Carpeta JavaScript - Generador de Tests Playwright

## 📁 Descripción

Esta carpeta contiene todo el código JavaScript de la aplicación Electron para generar tests de Playwright. Es el núcleo de la aplicación donde se encuentra toda la lógica de procesamiento, generación de tests y gestión de la interfaz de usuario.

## 🏗️ Estructura del Proyecto

### 📄 Archivos Principales

#### `app.js` - Lógica Principal de la Aplicación
- **Propósito**: Coordina toda la funcionalidad de la aplicación
- **Responsabilidades**:
  - Inicialización de la aplicación y carga del modelo JSON
  - Gestión del estado global de la aplicación
  - Coordinación entre diferentes componentes
  - Integración del sistema de tests regresivos
  - Manejo de eventos y comunicación con el servidor
- **Características**:
  - Carga dinámica del modelo JSON desde el servidor
  - Análisis automático de la estructura de datos
  - Gestión de la lista de acciones disponibles
  - Coordinación con los generadores de tests

#### `sidebar.js` - Gestión de la Barra Lateral
- **Propósito**: Renderiza y gestiona la interfaz de navegación
- **Responsabilidades**:
  - Renderización de la configuración principal
  - Visualización de las acciones disponibles
  - Gestión de la interacción con el usuario
  - Soporte para navegación de tests regresivos
- **Características**:
  - Interfaz dinámica que se adapta al contenido
  - Navegación fluida entre diferentes secciones
  - Integración con el sistema de tests regresivos
  - Gestión de estados y configuraciones

#### `baseTestGenerator.js` - Generador Base de Tests
- **Propósito**: Clase base que define la estructura común para todos los generadores
- **Responsabilidades**:
  - Definir la estructura común para todos los tipos de tests
  - Proporcionar métodos utilitarios compartidos
  - Manejar la lógica común de generación de tests
  - Establecer el patrón de herencia para todos los generadores específicos
- **Características**:
  - Métodos abstractos que deben ser implementados por cada generador
  - Utilidades compartidas para procesamiento de datos
  - Validación común de datos de entrada
  - Formateo consistente del código generado
  - Soporte mejorado para tests regresivos

### 📁 Subcarpetas

#### `families/` - Generadores Específicos
Contiene generadores específicos para diferentes tipos de tests. Cada archivo maneja un tipo particular de acción:

- **`testGeneratorRegressive.js`** - Tests regresivos con múltiples pantallas
- **`testGeneratorDialog.js`** - Tests para diálogos simples
- **`testGeneratorDialogWithColumnSelection.js`** - Tests para diálogos con selección de columnas
- **`testGeneratorExport.js`** - Tests para funcionalidades de exportación
- **`testGeneratorAudit.js`** - Tests para funcionalidades de auditoría
- **`testGeneratorOpenAttachment.js`** - Tests para abrir archivos adjuntos
- **`testGeneratorRemoveAttachment.js`** - Tests para eliminar archivos adjuntos
- **`testGeneratorNoDialog.js`** - Tests para acciones sin diálogo
- **`testGeneratorAWS.js`** - Tests para funcionalidades relacionadas con AWS
- **`testGeneratorReactiveObjectDialog.js`** - Tests para diálogos con objetos reactivos

#### `utils/` - Utilidades y Helpers
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

## 🔧 Clase Base - `baseTestGenerator.js`

### 🎯 Propósito
`baseTestGenerator.js` es la clase base que define la estructura común para todos los generadores de tests de Playwright. Establece el patrón de herencia y proporciona funcionalidades compartidas.

### ✨ Características Principales

#### Estructura de la Clase
- **Constructor**: Inicializa el generador con la configuración básica
- **Método `generateTest()`**: Método abstracto que debe ser implementado por cada generador específico
- **Métodos utilitarios**: Proporciona funciones comunes para todos los generadores

#### Funcionalidades Compartidas
- **Validación de datos**: Verifica que los datos de entrada sean válidos
- **Generación de selectores**: Crea selectores CSS para elementos de la interfaz
- **Manejo de configuraciones**: Procesa configuraciones comunes de tests
- **Formateo de código**: Aplica formato consistente al código generado
- **Gestión de errores**: Maneja errores comunes en la generación de tests
- **Soporte para tests regresivos**: Funcionalidades específicas para tests de múltiples pantallas

#### Métodos Principales
- `validateInput()` - Valida los datos de entrada del generador
- `generateSelector()` - Genera selectores CSS para elementos
- `formatCode()` - Aplica formato al código Playwright generado
- `handleError()` - Maneja errores durante la generación
- `getCommonImports()` - Obtiene imports comunes para todos los tests
- `generateRegressiveTest()` - Genera tests regresivos completos

### 🔗 Integración con Generadores Específicos

Cada generador en la carpeta `families/` extiende de `baseTestGenerator.js`:

1. **Herencia**: Todos los generadores heredan de la clase base
2. **Implementación**: Cada generador implementa su propio método `generateTest()`
3. **Reutilización**: Utilizan los métodos utilitarios de la clase base
4. **Consistencia**: Mantienen un formato y estructura consistente
5. **Tests Regresivos**: El nuevo generador regresivo extiende las funcionalidades base

### ⚙️ Configuración Común

El generador base maneja configuraciones que se aplican a todos los tests:

- **Configuración de Playwright**: Imports y setup común
- **Configuración de navegación**: Manejo de URLs y páginas
- **Configuración de esperas**: Timeouts y condiciones de espera
- **Configuración de aserciones**: Validaciones comunes
- **Configuración de tests regresivos**: Gestión de múltiples pantallas y navegación

## 🆕 Nuevas Funcionalidades

### 🔄 Tests Regresivos
El nuevo sistema de tests regresivos introduce:

- **Configuración de pantallas múltiples**: Permite definir el número de pantallas para tests regresivos
- **Editor de JSONs múltiples**: Interfaz para pegar los JSONs de cada pantalla
- **Selector de acciones avanzado**: Permite elegir acciones específicas de cada pantalla
- **Sistema de navegación**: Navegación fluida entre pantallas con indicadores visuales
- **Panel de acciones guardadas**: Gestión visual de todas las acciones con opciones de eliminación
- **Generación de tests completos**: Crea tests que cubren flujos de múltiples pantallas

### 🔌 Integración con el Servidor
Los tests regresivos utilizan nuevos endpoints del servidor:
- `POST /clear-regressive`: Limpia el archivo de tests regresivos
- `POST /upload-regressive`: Guarda múltiples pantallas de una vez
- `GET /regressive-json`: Obtiene las pantallas regresivas guardadas

## 🔄 Flujo de Trabajo

### 1. Carga de Datos
- El usuario carga un JSON en la aplicación
- `app.js` procesa el JSON y extrae las acciones disponibles
- Se valida la estructura del JSON y se preparan los datos

### 2. Renderización de la Interfaz
- `sidebar.js` muestra las acciones en la interfaz
- Se crean los elementos de navegación y configuración
- La interfaz se adapta según el tipo de contenido

### 3. Selección de Acción
- Cuando el usuario selecciona una acción, se identifica el tipo
- Se determina qué generador específico debe ser utilizado
- Se preparan los datos necesarios para la generación

### 4. Generación del Test
- Se instancia el generador correspondiente de `families/` (que extiende de `baseTestGenerator.js`)
- El generador crea el test específico usando las utilidades de `utils/` y métodos de la clase base
- Se aplican las configuraciones específicas del tipo de acción

### 5. Presentación del Resultado
- El test generado se muestra al usuario para su revisión
- Se proporcionan opciones para copiar y personalizar el código
- Para tests regresivos: Se gestionan múltiples pantallas o múltiples acciones con navegación y persistencia de estado

## 🛠️ Desarrollo y Mantenimiento

### Agregar Nuevos Generadores
1. Crear un nuevo archivo en la carpeta `families/`
2. Extender de `baseTestGenerator.js`
3. Implementar el método `generateTest()`
4. Agregar la lógica específica para el tipo de acción
5. Registrar el nuevo generador en `app.js`

### Modificar Generadores Existentes
1. Identificar el generador en la carpeta `families/`
2. Modificar la lógica específica manteniendo la estructura base
3. Actualizar la documentación correspondiente
4. Probar la funcionalidad con diferentes tipos de datos

### Agregar Nuevas Utilidades
1. Crear el archivo de utilidades en la carpeta `utils/`
2. Implementar las funciones necesarias
3. Exportar las funciones para su uso en otros módulos
4. Actualizar la documentación

## 📚 Documentación Relacionada

- **README Principal**: Información general del proyecto [`README.md`](../README.md).
- **README de Families**: Documentación específica de los generadores [`README.md`](../js/families/README.md).
- **API Endpoints**: Documentación de los endpoints del servidor [`README.md`](../API-ENDPOINTS-README.md).
- **CI/CD**: Información sobre el pipeline de integración continua. [`README.md`](../CI-CD-README.md)

