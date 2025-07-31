# Utilidades Regresivas - Regressive Utils

## 📁 Descripción

Esta carpeta contiene utilidades especializadas para el manejo de tests regresivos en la aplicación Generador de Tests Playwright. Estas utilidades son fundamentales para gestionar múltiples pantallas, navegación entre pantallas y la generación de tests regresivos completos.

## 🔧 Archivos Disponibles

### 🎛️ `regressiveModeManager.js` - Gestor de Modo Regresivo
**Propósito**: Gestiona el modo regresivo y la configuración de múltiples pantallas

**Funcionalidades principales**:
- **Activación de modo regresivo**: Activa y desactiva el modo regresivo
- **Configuración de pantallas**: Gestiona el número de pantallas para tests regresivos
- **Estado del modo**: Mantiene el estado del modo regresivo
- **Transiciones**: Maneja transiciones entre modo normal y regresivo

**Métodos principales**:
- `activateRegressiveMode(screenCount)` - Activa modo regresivo
- `deactivateRegressiveMode()` - Desactiva modo regresivo
- `getRegressiveState()` - Obtiene estado actual del modo regresivo
- `updateScreenCount(count)` - Actualiza número de pantallas
- `validateRegressiveConfig(config)` - Valida configuración regresiva

**Casos de uso**:
- Activación/desactivación del modo regresivo
- Configuración del número de pantallas
- Validación de configuraciones regresivas
- Gestión de estado del modo

### 🎯 `regressiveActionManager.js` - Gestor de Acciones Regresivas
**Propósito**: Gestiona acciones específicas para tests regresivos

**Funcionalidades principales**:
- **Gestión de acciones**: Maneja acciones específicas para cada pantalla
- **Selección de acciones**: Permite seleccionar acciones por pantalla
- **Validación de acciones**: Valida que las acciones sean compatibles
- **Optimización**: Optimiza la gestión de acciones regresivas

**Métodos principales**:
- `addRegressiveAction(screenIndex, action)` - Agrega acción a pantalla
- `removeRegressiveAction(screenIndex, actionId)` - Remueve acción de pantalla
- `getScreenActions(screenIndex)` - Obtiene acciones de una pantalla
- `validateActionCompatibility(action, screen)` - Valida compatibilidad
- `optimizeActionOrder(actions)` - Optimiza orden de acciones

**Casos de uso**:
- Agregar/remover acciones por pantalla
- Validar compatibilidad de acciones
- Optimizar flujo de acciones
- Gestionar acciones específicas por pantalla

### 📊 `regressiveDataUtils.js` - Utilidades de Datos Regresivos
**Propósito**: Maneja datos específicos para tests regresivos

**Funcionalidades principales**:
- **Procesamiento de datos**: Procesa datos de múltiples pantallas
- **Validación de datos**: Valida datos regresivos
- **Transformación**: Transforma datos para tests regresivos
- **Optimización**: Optimiza el procesamiento de datos

**Métodos principales**:
- `processRegressiveData(screensData)` - Procesa datos de múltiples pantallas
- `validateRegressiveData(data)` - Valida datos regresivos
- `transformRegressiveData(data, transformations)` - Transforma datos
- `optimizeRegressiveData(data)` - Optimiza datos regresivos
- `mergeScreenData(screensData)` - Combina datos de pantallas

**Casos de uso**:
- Procesamiento de datos de múltiples pantallas
- Validación de datos regresivos
- Transformación de datos para tests
- Optimización de datos para rendimiento

### 📋 `regressivePanelUtils.js` - Utilidades de Panel Regresivo
**Propósito**: Gestiona el panel de acciones guardadas y navegación regresiva

**Funcionalidades principales**:
- **Panel de acciones**: Gestiona el panel de acciones guardadas
- **Navegación visual**: Proporciona navegación visual entre pantallas
- **Gestión de estado**: Mantiene estado del panel regresivo
- **Interactividad**: Agrega interactividad al panel

**Métodos principales**:
- `createRegressivePanel()` - Crea panel regresivo
- `updateActionPanel(actions)` - Actualiza panel de acciones
- `addNavigationControls(panel)` - Agrega controles de navegación
- `handlePanelInteractions(panel, handlers)` - Maneja interacciones
- `updatePanelState(panel, state)` - Actualiza estado del panel

**Casos de uso**:
- Creación y gestión del panel regresivo
- Navegación visual entre pantallas
- Gestión de acciones guardadas
- Interactividad del panel

### 💬 `regressiveDialogUtils.js` - Utilidades de Diálogo Regresivo
**Propósito**: Gestiona diálogos específicos para tests regresivos

**Funcionalidades principales**:
- **Diálogos regresivos**: Crea diálogos específicos para modo regresivo
- **Configuración de pantallas**: Permite configurar múltiples pantallas
- **Validación de diálogos**: Valida diálogos regresivos
- **Optimización**: Optimiza diálogos para modo regresivo

**Métodos principales**:
- `createRegressiveDialog(config)` - Crea diálogo regresivo
- `configureScreenDialog(screenIndex, config)` - Configura diálogo de pantalla
- `validateRegressiveDialog(dialog)` - Valida diálogo regresivo
- `optimizeRegressiveDialog(dialog)` - Optimiza diálogo regresivo
- `handleRegressiveDialogEvents(dialog, handlers)` - Maneja eventos

**Casos de uso**:
- Creación de diálogos para modo regresivo
- Configuración de pantallas múltiples
- Validación de diálogos regresivos
- Gestión de eventos de diálogos

### 🧭 `regressiveNavigationUtils.js` - Utilidades de Navegación Regresiva
**Propósito**: Gestiona la navegación entre pantallas en modo regresivo

**Funcionalidades principales**:
- **Navegación entre pantallas**: Permite navegar entre pantallas
- **Indicadores visuales**: Proporciona indicadores de navegación
- **Estado de navegación**: Mantiene estado de navegación
- **Optimización**: Optimiza la navegación entre pantallas

**Métodos principales**:
- `navigateToScreen(screenIndex)` - Navega a pantalla específica
- `getCurrentScreen()` - Obtiene pantalla actual
- `updateNavigationIndicators(current, total)` - Actualiza indicadores
- `validateNavigation(screenIndex)` - Valida navegación
- `optimizeNavigation(navigationConfig)` - Optimiza navegación

**Casos de uso**:
- Navegación entre pantallas regresivas
- Indicadores de progreso
- Validación de navegación
- Optimización de flujo de navegación

## 🔄 Flujo de Trabajo

### 1. Activación del Modo Regresivo
```javascript
// Ejemplo de activación del modo regresivo
import { activateRegressiveMode } from './regressiveModeManager.js';
import { createRegressivePanel } from './regressivePanelUtils.js';

// Activar modo regresivo con 3 pantallas
activateRegressiveMode(3);

// Crear panel regresivo
const panel = createRegressivePanel();
```

### 2. Configuración de Pantallas
```javascript
// Configurar pantallas regresivas
import { configureScreenDialog } from './regressiveDialogUtils.js';
import { addRegressiveAction } from './regressiveActionManager.js';

// Configurar diálogo para cada pantalla
for (let i = 0; i < screenCount; i++) {
    configureScreenDialog(i, {
        title: `Pantalla ${i + 1}`,
        fields: getFieldsForScreen(i)
    });
}
```

### 3. Gestión de Acciones
```javascript
// Agregar acciones por pantalla
import { addRegressiveAction } from './regressiveActionManager.js';
import { processRegressiveData } from './regressiveDataUtils.js';

// Agregar acciones específicas por pantalla
addRegressiveAction(0, { type: 'dialog', name: 'Login' });
addRegressiveAction(1, { type: 'export', name: 'Export Data' });
addRegressiveAction(2, { type: 'audit', name: 'Audit Log' });

// Procesar datos regresivos
const processedData = processRegressiveData(screensData);
```

### 4. Navegación y Panel
```javascript
// Gestionar navegación y panel
import { navigateToScreen } from './regressiveNavigationUtils.js';
import { updateActionPanel } from './regressivePanelUtils.js';

// Navegar a pantalla específica
navigateToScreen(1);

// Actualizar panel de acciones
updateActionPanel(currentActions);
```

## 🎯 Casos de Uso Específicos

### Tests de Flujos Completos
- **Múltiples pantallas**: Tests que cubren múltiples pantallas
- **Navegación**: Tests de navegación entre secciones
- **Validación de flujo**: Validación de flujos completos
- **Optimización**: Optimización de flujos de tests

### Tests de Procesos Complejos
- **Procesos multi-paso**: Tests de procesos que involucran múltiples pasos
- **Validación de integridad**: Tests que verifican consistencia de datos
- **Validación de estado**: Tests que validan estados entre pantallas
- **Optimización de procesos**: Optimización de procesos complejos

### Tests de Navegación
- **Navegación entre pantallas**: Tests de navegación entre diferentes pantallas
- **Indicadores de progreso**: Tests de indicadores visuales
- **Validación de rutas**: Validación de rutas de navegación
- **Optimización de navegación**: Optimización de flujos de navegación

## 🔧 Integración con Otros Módulos

### Con Generadores de Tests
- Los generadores regresivos usan estas utilidades para gestión
- `regressiveActionManager.js` se integra con `baseTestGenerator.js`
- `regressiveDataUtils.js` procesa datos para generación

### Con Utilidades de Formularios
- `regressiveDialogUtils.js` se integra con `dialogFormRenderer.js`
- `regressivePanelUtils.js` conecta con `formDataCollector.js`
- Integración con `htmlFieldGenerator.js` para campos dinámicos

### Con Utilidades de Renderizado
- `regressivePanelUtils.js` se integra con `actionListRenderer.js`
- `regressiveNavigationUtils.js` conecta con `configRenderer.js`
- Integración con `actionRenderer.js` para acciones específicas

## 🛠️ Configuración y Personalización

### Configuración del Modo Regresivo
```javascript
// Configuración personalizada para modo regresivo
const regressiveConfig = {
    maxScreens: 10,
    autoSave: true,
    navigationMode: 'visual',
    validationMode: 'strict',
    optimizationLevel: 'high'
};
```

### Personalización de Navegación
```javascript
// Personalizar navegación regresiva
const navigationConfig = {
    indicators: 'progress-bar',
    transitions: 'smooth',
    autoAdvance: false,
    validation: 'real-time'
};
```

## 📊 Métricas y Rendimiento

### Optimizaciones Implementadas
- **Caché de pantallas**: Pantallas se cachean para mejor rendimiento
- **Lazy loading**: Datos se cargan solo cuando se necesitan
- **Optimización de navegación**: Navegación optimizada para mejor UX

### Monitoreo
- **Tiempo de navegación**: Se mide el tiempo de navegación entre pantallas
- **Uso de memoria**: Se monitorea el uso de memoria en modo regresivo
- **Tasa de éxito**: Se registra la tasa de éxito en tests regresivos

## 🔍 Troubleshooting

### Errores Comunes

#### Error de Activación
**Problema**: No se puede activar el modo regresivo
**Solución**:
- Verificar configuración de pantallas
- Revisar permisos de modo regresivo
- Comprobar datos de entrada

#### Error de Navegación
**Problema**: No se puede navegar entre pantallas
**Solución**:
- Verificar índices de pantalla
- Revisar estado de navegación
- Comprobar configuraciones de pantalla

#### Error de Acciones
**Problema**: No se pueden agregar acciones regresivas
**Solución**:
- Verificar compatibilidad de acciones
- Revisar configuración de pantalla
- Comprobar validaciones de acción

## 🚀 Extensibilidad

### Agregar Nuevas Funcionalidades Regresivas
1. **Crear utilidad**: Nuevo archivo con patrón `regressive*Utils.js`
2. **Implementar métodos**: Métodos específicos para funcionalidad regresiva
3. **Integrar**: Conectar con otros módulos regresivos
4. **Documentar**: Documentar la nueva funcionalidad

### Ejemplo de Nueva Utilidad
```javascript
// regressiveValidationUtils.js
export function validateRegressiveFlow(screens, actions) {
    // Lógica de validación específica para flujos regresivos
    return validationResult;
}

export function optimizeRegressiveFlow(screens, actions) {
    // Lógica de optimización específica para flujos regresivos
    return optimizedFlow;
}
```
