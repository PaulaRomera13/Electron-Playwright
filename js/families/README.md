# Generadores de Tests - Families

Esta carpeta contiene los generadores específicos para diferentes tipos de tests de Playwright. Cada generador está diseñado para manejar un tipo particular de acción o funcionalidad.

## Generadores disponibles

### `testGeneratorRegressive.js` 
- **Propósito**: Genera tests regresivos que cubren múltiples pantallas o múltiples acciones.
- **Características**:
  - Configuración de número de pantallas para tests regresivos
  - Editor de JSONs múltiples para pegar la estructura de cada pantalla
  - Selector de acciones avanzado que permite elegir acciones específicas de cada pantalla.
  - Sistema de navegación entre pantallas con botones anterior/siguiente
  - Panel de acciones guardadas con gestión visual de todas las acciones
  - Generación de tests completos que cubren flujos de múltiples pantallas
  - Barra de navegación regresiva con indicadores visuales
  - Modo regresivo especializado con interfaz adaptada
- **Casos de uso**: Tests de flujos completos, navegación entre pantallas, validación de procesos complejos

### `testGeneratorDialog.js`
- **Propósito**: Genera tests para diálogos simples
- **Características**:
  - Maneja formularios básicos
  - Procesa campos de entrada
  - Gestiona botones de confirmación/cancelación
- **Casos de uso**: Formularios de creación, edición, confirmación

### `testGeneratorDialogWithColumnSelection.js`
- **Propósito**: Genera tests para diálogos que incluyen selección de columnas
- **Características**:
  - Maneja tablas con columnas seleccionables
  - Procesa filtros de columnas
  - Gestiona la configuración de vistas
- **Casos de uso**: Configuración de vistas de tabla, filtros avanzados

### `testGeneratorExport.js`
- **Propósito**: Genera tests para funcionalidades de exportación
- **Características**:
  - Maneja diferentes formatos de exportación (CSV, Excel, PDF)
  - Procesa filtros de exportación
  - Gestiona opciones de formato
- **Casos de uso**: Exportación de reportes, listados, datos

### `testGeneratorAudit.js`
- **Propósito**: Genera tests para funcionalidades de auditoría
- **Características**:
  - Maneja logs de auditoría
  - Procesa historiales de cambios
  - Gestiona permisos de auditoría
- **Casos de uso**: Seguimiento de cambios, logs de actividad

### `testGeneratorOpenAttachment.js`
- **Propósito**: Genera tests para abrir archivos adjuntos
- **Características**:
  - Maneja diferentes tipos de archivos
  - Procesa permisos de acceso
  - Gestiona la visualización de archivos
- **Casos de uso**: Visualización de documentos, imágenes, archivos

### `testGeneratorRemoveAttachment.js`
- **Propósito**: Genera tests para eliminar archivos adjuntos
- **Características**:
  - Maneja confirmaciones de eliminación
  - Procesa permisos de eliminación
  - Gestiona la limpieza de referencias
- **Casos de uso**: Eliminación de archivos, limpieza de datos

### `testGeneratorNoDialog.js`
- **Propósito**: Genera tests para acciones que no requieren diálogo
- **Características**:
  - Maneja acciones directas
  - Procesa confirmaciones automáticas
  - Gestiona notificaciones
- **Casos de uso**: Acciones rápidas, toggles, cambios de estado

### `testGeneratorAWS.js`
- **Propósito**: Genera tests para funcionalidades relacionadas con AWS
- **Características**:
  - Maneja integraciones con servicios AWS
  - Procesa configuraciones de AWS
  - Gestiona autenticación y permisos
- **Casos de uso**: Integración con S3, Lambda, otros servicios AWS

### `testGeneratorReactiveObjectDialog.js`
- **Propósito**: Genera tests para diálogos con objetos reactivos
- **Características**:
  - Maneja objetos que cambian dinámicamente
  - Procesa actualizaciones en tiempo real
  - Gestiona dependencias entre campos
- **Casos de uso**: Formularios complejos, objetos con validaciones dinámicas

## Estructura común

Todos los generadores siguen una estructura común:

1. **Herencia**: Extienden de `baseTestGenerator.js`
2. **Método principal**: `generateTest()` - Genera el código del test
3. **Validación**: Verifican que los datos de entrada sean válidos
4. **Configuración**: Procesan las configuraciones específicas del tipo
5. **Generación**: Crean el código Playwright correspondiente

## Nuevas funcionalidades

### Tests Regresivos
El nuevo generador `testGeneratorRegressive.js` introduce funcionalidades avanzadas:

- **Configuración de pantallas múltiples**: Permite definir el número de pantallas para tests regresivos
- **Editor de JSONs múltiples**: Interfaz para pegar los JSONs de cada pantalla
- **Selector de acciones avanzado**: Permite elegir acciones específicas de cada pantalla
- **Sistema de navegación**: Navegación fluida entre pantallas con indicadores visuales
- **Panel de acciones guardadas**: Gestión visual de todas las acciones con opciones de eliminación
- **Generación de tests completos**: Crea tests que cubren flujos de múltiples pantallas

### Integración con el servidor
Los tests regresivos utilizan nuevos endpoints del servidor:
- `POST /clear-regressive`: Limpia el archivo de tests regresivos
- `POST /upload-regressive`: Guarda múltiples pantallas de una vez
- `GET /regressive-json`: Obtiene las pantallas regresivas guardadas

## Cómo agregar un nuevo generador

1. Crear un nuevo archivo en esta carpeta
2. Extender de `baseTestGenerator.js`
3. Implementar el método `generateTest()`
4. Agregar la lógica específica para el tipo de acción
5. Registrar el nuevo generador en `app.js` 