# Generadores de Tests - Families

## 📁 Descripción

Esta carpeta contiene los generadores específicos para diferentes tipos de tests de Playwright. Cada generador está diseñado para manejar un tipo particular de acción o funcionalidad, siguiendo el patrón de herencia de la clase base `BaseTestGenerator`.

## 🎯 Generadores Disponibles

### 🔄 `testGeneratorRegressive.js` - Tests Regresivos
- **Propósito**: Genera tests regresivos que cubren múltiples pantallas o múltiples acciones
- **Características**:
  - Configuración de número de pantallas para tests regresivos
  - Editor de JSONs múltiples para pegar la estructura de cada pantalla
  - Selector de acciones avanzado que permite elegir acciones específicas de cada pantalla
  - Sistema de navegación entre pantallas con botones anterior/siguiente
  - Panel de acciones guardadas con gestión visual de todas las acciones
  - Generación de tests completos que cubren flujos de múltiples pantallas
  - Barra de navegación regresiva con indicadores visuales
  - Modo regresivo especializado con interfaz adaptada
- **Casos de uso**: Tests de flujos completos, navegación entre pantallas, validación de procesos complejos
- **Configuraciones específicas**:
  - Número de pantallas a configurar
  - JSONs de cada pantalla
  - Selección de acciones por pantalla
  - Configuración de navegación entre pantallas

### 💬 `testGeneratorDialog.js` - Diálogos Simples
- **Propósito**: Genera tests para diálogos simples con formularios básicos
- **Características**:
  - Maneja formularios básicos con campos de entrada
  - Procesa campos de texto, números, fechas y selectores
  - Gestiona botones de confirmación/cancelación
  - Soporte para validaciones de campos
  - Configuración de idioma para labels
- **Casos de uso**: Formularios de creación, edición, confirmación
- **Configuraciones específicas**:
  - Campos del formulario a incluir/excluir
  - Configuración de idioma (ES/EN)
  - Personalización de notificaciones
  - Validaciones de campos

### 📊 `testGeneratorDialogWithColumnSelection.js` - Diálogos con Selección de Columnas
- **Propósito**: Genera tests para diálogos que incluyen selección de columnas
- **Características**:
  - Maneja tablas con columnas seleccionables
  - Procesa filtros de columnas avanzados
  - Gestiona la configuración de vistas de tabla
  - Soporte para selección múltiple de columnas
  - Configuración de ordenamiento
- **Casos de uso**: Configuración de vistas de tabla, filtros avanzados
- **Configuraciones específicas**:
  - Columnas disponibles para selección
  - Configuración de filtros
  - Ordenamiento de columnas
  - Configuración de vista

### 📤 `testGeneratorExport.js` - Exportación de Datos
- **Propósito**: Genera tests para funcionalidades de exportación
- **Características**:
  - Maneja diferentes formatos de exportación (CSV, Excel, PDF)
  - Procesa filtros de exportación avanzados
  - Gestiona opciones de formato y configuración
  - Validación de descarga de archivos
  - Configuración de rutas de descarga
- **Casos de uso**: Exportación de reportes, listados, datos
- **Configuraciones específicas**:
  - Formato de exportación (CSV, Excel, PDF)
  - Filtros de datos a exportar
  - Configuración de columnas
  - Ruta de descarga
  - Validación de descarga

### 🔍 `testGeneratorAudit.js` - Auditoría y Logs
- **Propósito**: Genera tests para funcionalidades de auditoría
- **Características**:
  - Maneja logs de auditoría detallados
  - Procesa historiales de cambios
  - Gestiona permisos de auditoría
  - Validación de registros de auditoría
  - Configuración de filtros de auditoría
- **Casos de uso**: Seguimiento de cambios, logs de actividad
- **Configuraciones específicas**:
  - Tipos de auditoría a verificar
  - Filtros de fecha y usuario
  - Configuración de logs
  - Validación de registros

### 📎 `testGeneratorOpenAttachment.js` - Apertura de Adjuntos
- **Propósito**: Genera tests para abrir archivos adjuntos
- **Características**:
  - Maneja diferentes tipos de archivos (PDF, imágenes, documentos)
  - Procesa permisos de acceso a archivos
  - Gestiona la visualización de archivos
  - Configuración de navegación de URLs
  - Validación de apertura de archivos
- **Casos de uso**: Visualización de documentos, imágenes, archivos
- **Configuraciones específicas**:
  - Tipo de archivo a abrir
  - Posición de la URL
  - Configuración de navegación
  - Validación de apertura

### 🗑️ `testGeneratorRemoveAttachment.js` - Eliminación de Adjuntos
- **Propósito**: Genera tests para eliminar archivos adjuntos
- **Características**:
  - Maneja confirmaciones de eliminación
  - Procesa permisos de eliminación
  - Gestiona la limpieza de referencias
  - Validación de eliminación exitosa
  - Configuración de confirmaciones
- **Casos de uso**: Eliminación de archivos, limpieza de datos
- **Configuraciones específicas**:
  - Archivo a eliminar
  - Posición del archivo
  - Configuración de confirmación
  - Validación de eliminación

### ⚡ `testGeneratorNoDialog.js` - Acciones Sin Diálogo
- **Propósito**: Genera tests para acciones que no requieren diálogo
- **Características**:
  - Maneja acciones directas sin formularios
  - Procesa confirmaciones automáticas
  - Gestiona notificaciones y alertas
  - Configuración de elementos a seleccionar
  - Validación de acciones directas
- **Casos de uso**: Acciones rápidas, toggles, cambios de estado
- **Configuraciones específicas**:
  - Elemento a seleccionar
  - Posición del elemento
  - Configuración de acción
  - Validación de resultado

### ☁️ `testGeneratorAWS.js` - Integración AWS
- **Propósito**: Genera tests para funcionalidades relacionadas con AWS
- **Características**:
  - Maneja integraciones con servicios AWS (S3, Lambda, etc.)
  - Procesa configuraciones de AWS
  - Gestiona autenticación y permisos
  - Validación de operaciones AWS
  - Configuración de credenciales
- **Casos de uso**: Integración con S3, Lambda, otros servicios AWS
- **Configuraciones específicas**:
  - Servicio AWS a utilizar
  - Configuración de credenciales
  - Parámetros de operación
  - Validación de resultado

### 🔄 `testGeneratorReactiveObjectDialog.js` - Objetos Reactivos
- **Propósito**: Genera tests para diálogos con objetos reactivos
- **Características**:
  - Maneja objetos que cambian dinámicamente
  - Procesa actualizaciones en tiempo real
  - Gestiona dependencias entre campos
  - Validación de objetos reactivos
  - Configuración de validaciones dinámicas
- **Casos de uso**: Formularios complejos, objetos con validaciones dinámicas
- **Configuraciones específicas**:
  - Objeto reactivo a configurar
  - Dependencias entre campos
  - Validaciones dinámicas
  - Configuración de actualizaciones

## 🏗️ Estructura Común

Todos los generadores siguen una estructura común:

### 1. Herencia de la Clase Base
- Extienden de `baseTestGenerator.js`
- Heredan funcionalidades comunes
- Mantienen consistencia en el formato

### 2. Método Principal
- `generateTest()` - Genera el código del test específico
- Implementación única para cada tipo de acción
- Utilización de métodos de la clase base

### 3. Validación de Datos
- Verifican que los datos de entrada sean válidos
- Validación específica según el tipo de acción
- Manejo de errores consistente

### 4. Configuración Específica
- Procesan las configuraciones específicas del tipo
- Campos de formulario adaptados a cada acción
- Opciones avanzadas según la funcionalidad

### 5. Generación de Código
- Crean el código Playwright correspondiente
- Aplican formato consistente
- Incluyen comentarios explicativos

## 🆕 Nuevas Funcionalidades

### 🔄 Tests Regresivos
El nuevo generador `testGeneratorRegressive.js` introduce funcionalidades avanzadas:

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

## 🛠️ Cómo Agregar un Nuevo Generador

### 1. Crear el Archivo
Crear un nuevo archivo en esta carpeta con el nombre `testGenerator[Nombre].js`

### 2. Extender la Clase Base
```javascript
import { BaseTestGenerator } from "../baseTestGenerator.js"

export class TestGenerator[Nombre] extends BaseTestGenerator {
    constructor(app) {
        super(app)
    }
    
    createForm() {
        // Implementar el formulario específico
    }
    
    generateTest(formData) {
        // Implementar la generación del test
    }
}
```

### 3. Implementar el Método `createForm()`
- Crear el formulario HTML específico para el tipo de acción
- Incluir campos de configuración necesarios
- Agregar validaciones específicas

### 4. Implementar el Método `generateTest()`
- Generar el código Playwright específico
- Utilizar los métodos de la clase base
- Aplicar formato consistente

### 5. Registrar el Generador
Agregar el nuevo generador en `app.js` para que esté disponible en la aplicación:

```javascript
import { TestGenerator[Nombre] } from './families/testGenerator[Nombre].js'

// En el método de inicialización
this.generators['[tipo]'] = TestGenerator[Nombre]
```

### 6. Documentar el Generador
- Actualizar este README con la información del nuevo generador
- Documentar las configuraciones específicas
- Proporcionar ejemplos de uso

## 📋 Configuraciones Comunes

### Configuraciones de Idioma
- **ES/EN**: Selección de idioma para labels y textos
- **Labels dinámicos**: Adaptación automática según el idioma seleccionado

### Configuraciones de Navegación
- **URLs**: Configuración de navegación entre páginas
- **Posiciones**: Configuración de elementos en la interfaz
- **Botones**: Configuración de botones de confirmación/cancelación

### Configuraciones de Validación
- **Campos requeridos**: Validación de campos obligatorios
- **Formatos**: Validación de formatos específicos
- **Dependencias**: Validación de dependencias entre campos

## 🔍 Casos de Uso Específicos

### Tests de Formularios
- **Creación de registros**: Tests para formularios de creación
- **Edición de datos**: Tests para formularios de edición
- **Validación de campos**: Tests para validaciones específicas

### Tests de Exportación
- **Reportes**: Tests para exportación de reportes
- **Listados**: Tests para exportación de listados
- **Datos específicos**: Tests para exportación de datos filtrados

### Tests de Archivos y AWS
- **Visualización**: Tests para apertura de archivos
- **Gestión**: Tests para eliminación de archivos
- **Subida**: Tests para subida de archivos
