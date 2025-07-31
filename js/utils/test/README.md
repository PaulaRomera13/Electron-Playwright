# Utilidades de Tests - Test Utils

## 📁 Descripción

Esta carpeta contiene utilidades especializadas para la generación y aplicación de datos de prueba en la aplicación Generador de Tests Playwright. Estas utilidades son fundamentales para crear datos de prueba realistas y aplicar configuraciones específicas a los tests generados.

## 🔧 Archivos Disponibles

### 🎭 `dialogTestDataGenerator.js` - Generador de Datos para Diálogos
**Propósito**: Genera datos de prueba específicos para tests de diálogos

**Funcionalidades principales**:
- **Generación de datos realistas**: Crea datos de prueba que simulan entrada real del usuario
- **Configuración de campos**: Genera valores apropiados para diferentes tipos de campos
- **Validación de datos**: Asegura que los datos generados sean válidos
- **Personalización**: Permite configurar datos según necesidades específicas

**Métodos principales**:
- `generateDialogTestData(fieldConfigs)` - Genera datos completos para un diálogo
- `generateFieldValue(fieldType, constraints)` - Genera valor para un campo específico
- `validateGeneratedData(data, schema)` - Valida los datos generados
- `customizeTestData(baseData, customizations)` - Personaliza datos base
- `generateMockResponses(actions)` - Genera respuestas simuladas para acciones

**Casos de uso**:
- Generación de datos para tests de formularios
- Creación de datos de prueba para diálogos complejos
- Simulación de respuestas de usuario
- Validación de configuraciones de campos

### 🔧 `testDataApplier.js` - Aplicador de Datos de Prueba
**Propósito**: Aplica datos de prueba a las configuraciones de tests

**Funcionalidades principales**:
- **Aplicación de datos**: Integra datos de prueba en configuraciones de tests
- **Transformación de configuraciones**: Adapta configuraciones según datos de prueba
- **Validación de aplicación**: Verifica que los datos se apliquen correctamente
- **Optimización**: Optimiza la aplicación de datos para mejor rendimiento

**Métodos principales**:
- `applyTestData(config, testData)` - Aplica datos de prueba a una configuración
- `transformConfigForTest(config, data)` - Transforma configuración para test
- `validateAppliedData(config, appliedData)` - Valida datos aplicados
- `optimizeTestConfig(config)` - Optimiza configuración para mejor rendimiento
- `mergeTestData(existingData, newData)` - Combina datos de prueba existentes

**Casos de uso**:
- Aplicación de datos a configuraciones de tests
- Transformación de configuraciones para diferentes escenarios
- Validación de integridad de datos aplicados
- Optimización de configuraciones de tests

## 🔄 Flujo de Trabajo

### 1. Generación de Datos de Prueba
```javascript
// Ejemplo de generación de datos
import { generateDialogTestData } from './dialogTestDataGenerator.js';
import { applyTestData } from './testDataApplier.js';

// Generar datos para un diálogo
const fieldConfigs = [
    { name: 'username', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'age', type: 'number', min: 18, max: 100 }
];

const testData = generateDialogTestData(fieldConfigs);
```

### 2. Aplicación de Datos
```javascript
// Aplicar datos a configuración de test
const testConfig = {
    action: 'dialog',
    fields: fieldConfigs,
    validation: true
};

const appliedConfig = applyTestData(testConfig, testData);
```

### 3. Validación y Optimización
```javascript
// Validar y optimizar configuración final
const validatedConfig = validateAppliedData(appliedConfig, testData);
const optimizedConfig = optimizeTestConfig(validatedConfig);
```

## 🎯 Casos de Uso Específicos

### Tests de Formularios
- **Datos de entrada**: Generar datos realistas para campos de formulario
- **Validación**: Crear datos que prueben casos límite
- **Configuración**: Aplicar datos a configuraciones específicas

### Tests de Diálogos
- **Interacciones**: Simular interacciones de usuario en diálogos
- **Respuestas**: Generar respuestas para diferentes escenarios
- **Flujos**: Crear flujos completos de diálogo

### Tests de Validación
- **Casos positivos**: Datos que deberían pasar validación
- **Casos negativos**: Datos que deberían fallar validación
- **Casos límite**: Datos en los límites de validación

## 🔧 Integración con Otros Módulos

### Con Generadores de Tests
- Los generadores usan `dialogTestDataGenerator.js` para obtener datos de prueba
- `testDataApplier.js` se integra con `baseTestGenerator.js`
- Ambos módulos proporcionan datos para la generación final de tests

### Con Utilidades de Formularios
- `dialogDataCollector.js` utiliza datos generados por estas utilidades
- `formDataCollector.js` aplica datos a formularios dinámicos
- Integración con `htmlFieldGenerator.js` para campos HTML

### Con Utilidades de Validación
- `actionTypeValidator.js` valida tipos de datos generados
- `functionalityChecker.js` verifica funcionalidad con datos de prueba
- Integración con validaciones específicas de campos

## 🛠️ Configuración y Personalización

### Configuración de Datos de Prueba
```javascript
// Configuración personalizada para datos de prueba
const testDataConfig = {
    locale: 'es', // Idioma para datos generados
    realisticMode: true, // Datos más realistas
    validationMode: 'strict', // Modo de validación
    customConstraints: {
        username: { minLength: 3, maxLength: 20 },
        email: { domain: 'example.com' }
    }
};
```

### Personalización de Generadores
```javascript
// Personalizar generador de datos
const customGenerator = {
    generateUsername: () => `user_${Date.now()}`,
    generateEmail: (username) => `${username}@example.com`,
    generateAge: () => Math.floor(Math.random() * 50) + 18
};
```

## 📊 Métricas y Rendimiento

### Optimizaciones Implementadas
- **Generación lazy**: Los datos se generan solo cuando se necesitan
- **Caché de datos**: Datos generados se cachean para reutilización
- **Validación temprana**: Se valida antes de aplicar completamente

### Monitoreo
- **Tiempo de generación**: Se mide el tiempo de generación de datos
- **Calidad de datos**: Se evalúa la calidad de los datos generados
- **Tasa de éxito**: Se registra la tasa de éxito en aplicación de datos

## 🔍 Troubleshooting

### Errores Comunes

#### Error de Generación de Datos
**Problema**: No se pueden generar datos para un tipo de campo
**Solución**:
- Verificar configuración del campo
- Agregar generador para nuevo tipo de campo
- Revisar restricciones de validación

#### Error de Aplicación de Datos
**Problema**: Los datos no se aplican correctamente a la configuración
**Solución**:
- Verificar estructura de configuración
- Validar compatibilidad de datos
- Revisar transformaciones necesarias

#### Error de Validación
**Problema**: Los datos generados no pasan validación
**Solución**:
- Revisar reglas de validación
- Ajustar generador de datos
- Verificar restricciones de campos

## 🚀 Extensibilidad

### Agregar Nuevos Tipos de Datos
1. **Crear generador**: Nuevo método en `dialogTestDataGenerator.js`
2. **Agregar validador**: Validación específica para el nuevo tipo
3. **Integrar**: Conectar con `testDataApplier.js`
4. **Documentar**: Documentar el nuevo tipo de datos

### Ejemplo de Nuevo Generador
```javascript
// En dialogTestDataGenerator.js
export function generateCustomFieldValue(fieldConfig) {
    // Lógica específica para el nuevo tipo
    return generatedValue;
}

// En testDataApplier.js
export function applyCustomFieldData(config, customData) {
    // Lógica de aplicación específica
    return appliedConfig;
}
```
 