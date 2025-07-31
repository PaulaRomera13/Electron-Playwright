# Utilidades Centrales - Core Utils

## 📁 Descripción

Esta carpeta contiene utilidades centrales y fundamentales para el funcionamiento de la aplicación Generador de Tests Playwright. Estas utilidades son el núcleo del sistema y proporcionan funcionalidades esenciales como inicialización, gestión de estado y manejo de eventos.

## 🔧 Archivos Disponibles

### 🚀 `appInitializer.js` - Inicializador de Aplicación
**Propósito**: Maneja la inicialización y configuración inicial de la aplicación

**Funcionalidades principales**:
- **Inicialización del sistema**: Configura y prepara la aplicación para su uso
- **Carga de configuraciones**: Carga configuraciones iniciales del sistema
- **Verificación de dependencias**: Verifica que todas las dependencias estén disponibles
- **Preparación de componentes**: Prepara componentes principales para su uso

**Métodos principales**:
- `initializeApp(config)` - Inicializa la aplicación con configuración
- `loadInitialConfig()` - Carga configuración inicial
- `verifyDependencies()` - Verifica dependencias del sistema
- `prepareComponents()` - Prepara componentes principales
- `setupEventListeners()` - Configura listeners de eventos iniciales

**Casos de uso**:
- Inicialización de la aplicación al arrancar
- Carga de configuraciones del sistema
- Verificación de estado del sistema
- Preparación de componentes principales

### 🎛️ `stateManager.js` - Gestor de Estado
**Propósito**: Gestiona el estado global de la aplicación de manera centralizada

**Funcionalidades principales**:
- **Estado global**: Mantiene estado global de la aplicación
- **Sincronización**: Sincroniza estado entre diferentes componentes
- **Persistencia**: Persiste estado en almacenamiento local
- **Optimización**: Optimiza gestión de estado para mejor rendimiento

**Métodos principales**:
- `getState(key)` - Obtiene valor del estado
- `setState(key, value)` - Establece valor en el estado
- `updateState(updates)` - Actualiza múltiples valores del estado
- `subscribeToState(key, callback)` - Suscribe a cambios de estado
- `persistState()` - Persiste estado en almacenamiento

**Casos de uso**:
- Gestión de estado global de la aplicación
- Sincronización entre componentes
- Persistencia de configuraciones
- Optimización de rendimiento

### 🎧 `eventManager.js` - Gestor de Eventos
**Propósito**: Gestiona eventos del sistema de manera centralizada

**Funcionalidades principales**:
- **Gestión de eventos**: Maneja eventos del sistema de manera centralizada
- **Priorización**: Prioriza eventos según importancia
- **Optimización**: Optimiza el manejo de eventos para mejor rendimiento
- **Debugging**: Proporciona herramientas de debugging para eventos

**Métodos principales**:
- `addEventListener(event, handler)` - Agrega listener de evento
- `removeEventListener(event, handler)` - Remueve listener de evento
- `emitEvent(event, data)` - Emite evento con datos
- `prioritizeEvent(event, priority)` - Prioriza evento
- `debugEvents(enable)` - Activa debugging de eventos

**Casos de uso**:
- Gestión centralizada de eventos
- Comunicación entre componentes
- Optimización de rendimiento
- Debugging de eventos del sistema

## 🔄 Flujo de Trabajo

### 1. Inicialización de la Aplicación
```javascript
// Ejemplo de inicialización de la aplicación
import { initializeApp } from './appInitializer.js';
import { getState, setState } from './stateManager.js';
import { addEventListener } from './eventManager.js';

// Inicializar aplicación
const appConfig = {
    debug: true,
    autoSave: true,
    theme: 'modern'
};

initializeApp(appConfig);

// Configurar estado inicial
setState('app.initialized', true);
setState('app.config', appConfig);
```

### 2. Gestión de Estado
```javascript
// Gestionar estado de la aplicación
import { getState, setState, subscribeToState } from './stateManager.js';

// Suscribirse a cambios de estado
subscribeToState('currentTest', (newTest) => {
    console.log('Test actualizado:', newTest);
});

// Actualizar estado
setState('currentTest', {
    name: 'Test de Login',
    type: 'dialog',
    status: 'configuring'
});

// Obtener estado actual
const currentTest = getState('currentTest');
```

### 3. Gestión de Eventos
```javascript
// Gestionar eventos del sistema
import { addEventListener, emitEvent } from './eventManager.js';

// Agregar listener para evento de test generado
addEventListener('testGenerated', (testData) => {
    console.log('Test generado:', testData);
    // Actualizar UI o realizar otras acciones
});

// Emitir evento cuando se genera un test
emitEvent('testGenerated', {
    testCode: '// Código del test...',
    metadata: { type: 'dialog', timestamp: Date.now() }
});
```

## 🎯 Casos de Uso Específicos

### Inicialización del Sistema
- **Carga de configuraciones**: Cargar configuraciones iniciales del sistema
- **Verificación de dependencias**: Verificar que todas las dependencias estén disponibles
- **Preparación de componentes**: Preparar componentes principales para su uso
- **Configuración de eventos**: Configurar eventos iniciales del sistema

### Gestión de Estado Global
- **Estado de la aplicación**: Mantener estado global de la aplicación
- **Sincronización entre componentes**: Sincronizar estado entre diferentes componentes
- **Persistencia de datos**: Persistir datos importantes en almacenamiento local
- **Optimización de rendimiento**: Optimizar gestión de estado para mejor rendimiento

### Comunicación entre Componentes
- **Eventos del sistema**: Gestionar eventos del sistema de manera centralizada
- **Comunicación asíncrona**: Permitir comunicación asíncrona entre componentes
- **Priorización de eventos**: Priorizar eventos según importancia
- **Debugging de eventos**: Proporcionar herramientas de debugging para eventos

## 🔧 Integración con Otros Módulos

### Con Generadores de Tests
- Los generadores usan `stateManager.js` para mantener estado
- `eventManager.js` se integra con `baseTestGenerator.js`
- `appInitializer.js` prepara generadores para su uso

### Con Utilidades de Formularios
- `stateManager.js` sincroniza estado de formularios
- `eventManager.js` maneja eventos de formularios
- `appInitializer.js` prepara utilidades de formularios

### Con Utilidades de Renderizado
- `stateManager.js` mantiene estado de componentes renderizados
- `eventManager.js` maneja eventos de renderizado
- `appInitializer.js` prepara componentes de renderizado

## 🛠️ Configuración y Personalización

### Configuración de Inicialización
```javascript
// Configuración personalizada para inicialización
const initConfig = {
    debug: true,
    autoSave: true,
    theme: 'modern',
    performance: 'optimized',
    storage: 'local'
};
```

### Configuración de Estado
```javascript
// Configuración personalizada para gestión de estado
const stateConfig = {
    persistence: true,
    syncInterval: 1000,
    maxHistory: 50,
    compression: true
};
```

### Configuración de Eventos
```javascript
// Configuración personalizada para gestión de eventos
const eventConfig = {
    maxListeners: 10,
    priorityLevels: 5,
    debugMode: true,
    performance: 'optimized'
};
```

## 📊 Métricas y Rendimiento

### Optimizaciones Implementadas
- **Lazy initialization**: Componentes se inicializan solo cuando se necesitan
- **State caching**: Estado se cachea para mejor rendimiento
- **Event optimization**: Eventos se optimizan para mejor rendimiento

### Monitoreo
- **Tiempo de inicialización**: Se mide el tiempo de inicialización
- **Uso de memoria**: Se monitorea el uso de memoria en gestión de estado
- **Event throughput**: Se mide el throughput de eventos

## 🔍 Troubleshooting

### Errores Comunes

#### Error de Inicialización
**Problema**: La aplicación no se inicializa correctamente
**Solución**:
- Verificar configuraciones de inicialización
- Revisar dependencias del sistema
- Comprobar permisos de acceso

#### Error de Estado
**Problema**: El estado no se sincroniza correctamente
**Solución**:
- Verificar configuración de estado
- Revisar suscripciones a cambios
- Comprobar persistencia de datos

#### Error de Eventos
**Problema**: Los eventos no se manejan correctamente
**Solución**:
- Verificar configuración de eventos
- Revisar listeners de eventos
- Comprobar priorización de eventos

## 🚀 Extensibilidad

### Agregar Nuevas Funcionalidades Centrales
1. **Crear utilidad**: Nuevo archivo con patrón `*Manager.js`
2. **Implementar métodos**: Métodos específicos para la nueva funcionalidad
3. **Integrar**: Conectar con otros módulos centrales
4. **Documentar**: Documentar la nueva funcionalidad

### Ejemplo de Nueva Utilidad Central
```javascript
// configManager.js
export function loadConfig(configPath) {
    // Lógica de carga de configuración
    return loadedConfig;
}

export function saveConfig(config, configPath) {
    // Lógica de guardado de configuración
    return saveResult;
}
```
