# Utilidades de Renderizado - Render Utils

## 📁 Descripción

Esta carpeta contiene utilidades especializadas para el renderizado de componentes de la interfaz de usuario en la aplicación Generador de Tests Playwright. Estas utilidades son fundamentales para crear componentes dinámicos, listas de acciones y configuraciones visuales.

## 🔧 Archivos Disponibles

### 📋 `actionListRenderer.js` - Renderizador de Listas de Acciones
**Propósito**: Renderiza listas de acciones disponibles en la interfaz

**Funcionalidades principales**:
- **Renderizado dinámico**: Crea listas de acciones basadas en datos dinámicos
- **Filtrado inteligente**: Filtra acciones según criterios específicos
- **Ordenamiento**: Ordena acciones por diferentes criterios
- **Interactividad**: Agrega interactividad a las listas de acciones

**Métodos principales**:
- `renderActionList(actions, options)` - Renderiza lista de acciones
- `filterActions(actions, criteria)` - Filtra acciones según criterios
- `sortActions(actions, sortBy)` - Ordena acciones por criterio
- `addActionInteractivity(listElement)` - Agrega interactividad
- `updateActionList(listElement, newActions)` - Actualiza lista existente

**Casos de uso**:
- Mostrar acciones disponibles en sidebar
- Filtrar acciones por tipo o categoría
- Ordenar acciones por importancia o frecuencia
- Agregar funcionalidad de búsqueda

### 🔘 `rowButtonsRenderer.js` - Renderizador de Botones de Fila
**Propósito**: Renderiza botones de acción para filas de datos

**Funcionalidades principales**:
- **Botones dinámicos**: Crea botones según configuración de fila
- **Estados de botón**: Maneja diferentes estados de botones
- **Acciones contextuales**: Agrega acciones específicas por contexto
- **Optimización visual**: Optimiza la apariencia de botones

**Métodos principales**:
- `renderRowButtons(rowData, buttonConfigs)` - Renderiza botones de fila
- `updateButtonState(button, state)` - Actualiza estado de botón
- `addButtonActions(button, actions)` - Agrega acciones a botón
- `optimizeButtonLayout(buttons)` - Optimiza layout de botones
- `handleButtonEvents(button, handlers)` - Maneja eventos de botón

**Casos de uso**:
- Botones de acción en tablas de datos
- Acciones contextuales por fila
- Estados de botones según permisos
- Interacciones con datos de fila

### ⚙️ `configRenderer.js` - Renderizador de Configuraciones
**Propósito**: Renderiza paneles de configuración y opciones

**Funcionalidades principales**:
- **Configuraciones dinámicas**: Crea paneles de configuración dinámicos
- **Validación visual**: Muestra validaciones de configuración
- **Guardado automático**: Implementa guardado automático de configuraciones
- **Interfaz intuitiva**: Crea interfaz clara para configuraciones

**Métodos principales**:
- `renderConfigPanel(config, options)` - Renderiza panel de configuración
- `validateConfigVisual(config)` - Valida configuración visualmente
- `saveConfigAuto(config)` - Guarda configuración automáticamente
- `updateConfigDisplay(config)` - Actualiza visualización de configuración
- `handleConfigChanges(config, handlers)` - Maneja cambios de configuración

**Casos de uso**:
- Paneles de configuración de tests
- Opciones de personalización
- Configuraciones de generadores
- Preferencias de usuario

### 🎯 `actionRenderer.js` - Renderizador de Acciones
**Propósito**: Renderiza acciones individuales con detalles

**Funcionalidades principales**:
- **Detalles de acción**: Muestra detalles completos de una acción
- **Estados de acción**: Maneja diferentes estados de acciones
- **Interacciones**: Permite interacciones con acciones
- **Información contextual**: Muestra información contextual de acciones

**Métodos principales**:
- `renderAction(action, options)` - Renderiza acción individual
- `updateActionState(action, state)` - Actualiza estado de acción
- `addActionInteractions(action, interactions)` - Agrega interacciones
- `showActionDetails(action)` - Muestra detalles de acción
- `handleActionEvents(action, handlers)` - Maneja eventos de acción

**Casos de uso**:
- Detalles de acciones específicas
- Estados de acciones según contexto
- Interacciones con acciones
- Información contextual de acciones

## 🔄 Flujo de Trabajo

### 1. Renderizado de Lista de Acciones
```javascript
// Ejemplo de renderizado de lista de acciones
import { renderActionList } from './actionListRenderer.js';
import { filterActions } from './actionListRenderer.js';

// Obtener acciones del modelo
const actions = getActionsFromModel(modelJson);

// Filtrar acciones por tipo
const dialogActions = filterActions(actions, { type: 'dialog' });

// Renderizar lista
const actionList = renderActionList(dialogActions, {
    showIcons: true,
    enableSearch: true,
    sortBy: 'name'
});
```

### 2. Renderizado de Botones de Fila
```javascript
// Renderizar botones para filas de datos
import { renderRowButtons } from './rowButtonsRenderer.js';

// Configuración de botones por fila
const buttonConfigs = [
    { type: 'edit', label: 'Editar', icon: 'edit' },
    { type: 'delete', label: 'Eliminar', icon: 'delete' }
];

// Renderizar botones
const rowButtons = renderRowButtons(rowData, buttonConfigs);
```

### 3. Renderizado de Configuración
```javascript
// Renderizar panel de configuración
import { renderConfigPanel } from './configRenderer.js';

// Configuración del panel
const config = {
    title: 'Configuración de Test',
    fields: [
        { name: 'timeout', type: 'number', label: 'Timeout (ms)' },
        { name: 'retries', type: 'number', label: 'Reintentos' }
    ]
};

// Renderizar panel
const configPanel = renderConfigPanel(config, {
    autoSave: true,
    validation: true
});
```

## 🎯 Casos de Uso Específicos

### Sidebar de Acciones
- **Lista dinámica**: Mostrar acciones disponibles según modelo
- **Filtrado**: Filtrar acciones por tipo o categoría
- **Búsqueda**: Permitir búsqueda en acciones
- **Ordenamiento**: Ordenar acciones por criterios

### Tablas de Datos
- **Botones de acción**: Botones para cada fila de datos
- **Estados contextuales**: Estados según datos de fila
- **Acciones específicas**: Acciones según tipo de dato
- **Interacciones**: Interacciones con datos de fila

### Paneles de Configuración
- **Configuraciones de test**: Opciones para configurar tests
- **Preferencias de usuario**: Configuraciones personales
- **Opciones avanzadas**: Configuraciones complejas
- **Validación visual**: Mostrar errores de configuración

## 🔧 Integración con Otros Módulos

### Con Generadores de Tests
- Los generadores usan `actionRenderer.js` para mostrar acciones
- `configRenderer.js` se integra con configuraciones de generadores
- `actionListRenderer.js` muestra acciones disponibles para generación

### Con Utilidades de Formularios
- `configRenderer.js` se integra con `dialogFormRenderer.js`
- `actionRenderer.js` conecta con `formDataCollector.js`
- Integración con `htmlFieldGenerator.js` para campos de configuración

### Con Utilidades de Datos
- `actionListRenderer.js` utiliza datos procesados por `jsonUtils.js`
- `configRenderer.js` usa `fieldUtils.js` para validación
- Integración con `testDataApplier.js` para datos de prueba

## 🛠️ Configuración y Personalización

### Configuración de Renderizado
```javascript
// Configuración personalizada para renderizado
const renderConfig = {
    theme: 'modern',
    animations: true,
    responsive: true,
    accessibility: true,
    performance: 'optimized'
};
```

### Personalización de Componentes
```javascript
// Personalizar renderizado de componentes
const customRenderers = {
    actionList: {
        template: 'custom-action-template',
        styling: 'custom-action-styles',
        behavior: 'custom-action-behavior'
    },
    rowButtons: {
        layout: 'horizontal',
        spacing: 'compact',
        icons: 'material'
    }
};
```

## 📊 Métricas y Rendimiento

### Optimizaciones Implementadas
- **Renderizado virtual**: Uso de renderizado virtual para listas grandes
- **Lazy loading**: Carga de componentes solo cuando se necesitan
- **Caché de componentes**: Componentes renderizados se cachean

### Monitoreo
- **Tiempo de renderizado**: Se mide el tiempo de renderizado de componentes
- **Uso de memoria**: Se monitorea el uso de memoria en renderizado
- **Interactividad**: Se mide la responsividad de componentes

## 🔍 Troubleshooting

### Errores Comunes

#### Error de Renderizado
**Problema**: Componente no se renderiza correctamente
**Solución**:
- Verificar datos de entrada
- Revisar configuración del componente
- Comprobar dependencias

#### Error de Interactividad
**Problema**: Los componentes no responden a interacciones
**Solución**:
- Verificar eventos adjuntos
- Revisar handlers de eventos
- Comprobar estado de componentes

#### Error de Rendimiento
**Problema**: Renderizado lento de componentes
**Solución**:
- Optimizar datos de entrada
- Implementar renderizado virtual
- Reducir complejidad de componentes

## 🚀 Extensibilidad

### Agregar Nuevos Tipos de Componente
1. **Crear renderer**: Nuevo archivo con patrón `*Renderer.js`
2. **Implementar métodos**: Métodos principales de renderizado
3. **Integrar**: Conectar con otros módulos
4. **Documentar**: Documentar el nuevo componente

### Ejemplo de Nuevo Renderer
```javascript
// customRenderer.js
export function renderCustomComponent(data, options) {
    // Lógica de renderizado específica
    return renderedComponent;
}

export function updateCustomComponent(component, newData) {
    // Lógica de actualización específica
    return updatedComponent;
}
```
