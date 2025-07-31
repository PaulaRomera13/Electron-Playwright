# Utilidades de Datos - Data Utils

## 📁 Descripción

Esta carpeta contiene utilidades especializadas para el procesamiento, validación y transformación de datos en la aplicación Generador de Tests Playwright. Estas utilidades son fundamentales para el manejo de JSONs, campos de formularios y estructuras de datos complejas.

## 🔧 Archivos Disponibles

### 📄 `jsonUtils.js` - Utilidades para JSON
**Propósito**: Manejo avanzado de archivos y estructuras JSON

**Funcionalidades principales**:
- **Formateo y validación**: Procesamiento seguro de JSON con validación completa
- **Búsqueda avanzada**: Búsqueda recursiva en estructuras JSON complejas
- **Transformación de datos**: Manipulación y transformación de estructuras JSON
- **Compresión y expansión**: Optimización de tamaño y legibilidad de JSON

**Métodos principales**:
- `formatJson(jsonData)` - Formatea JSON para mejor legibilidad
- `minifyJson(jsonData)` - Comprime JSON eliminando espacios innecesarios
- `searchInJson(jsonData, searchTerm)` - Búsqueda recursiva en estructuras JSON
- `validateJson(jsonString)` - Valida la sintaxis y estructura de JSON
- `transformJson(jsonData, transformationRules)` - Transforma estructuras JSON según reglas

**Casos de uso**:
- Procesamiento del modelo JSON principal
- Búsqueda de configuraciones específicas
- Validación de datos de entrada
- Transformación de estructuras para tests

### 📝 `fieldUtils.js` - Utilidades para Campos
**Propósito**: Procesamiento y validación de campos de formularios

**Funcionalidades principales**:
- **Procesamiento de tipos**: Identificación y manejo de diferentes tipos de campos
- **Validación de valores**: Validación específica según el tipo de campo
- **Transformación de datos**: Conversión entre diferentes formatos de datos
- **Generación de selectores**: Creación de selectores CSS para elementos

**Métodos principales**:
- `getFieldType(fieldConfig)` - Determina el tipo de un campo
- `validateField(fieldValue, fieldType)` - Valida el valor según el tipo
- `transformFieldValue(value, fromType, toType)` - Transforma valores entre tipos
- `generateFieldSelector(fieldName, fieldType)` - Genera selectores CSS
- `processFieldConfig(fieldConfig)` - Procesa configuración completa de campos

**Casos de uso**:
- Procesamiento de formularios dinámicos
- Validación de datos de entrada
- Generación de selectores para tests
- Transformación de tipos de datos

## 🔄 Flujo de Trabajo

### 1. Procesamiento de Datos de Entrada
```javascript
// Ejemplo de uso típico
import { validateJson, searchInJson } from './jsonUtils.js';
import { getFieldType, validateField } from './fieldUtils.js';

// Validar JSON de entrada
const isValid = validateJson(inputJson);
if (isValid) {
    // Buscar campos específicos
    const fields = searchInJson(inputJson, 'field');
    
    // Procesar cada campo
    fields.forEach(field => {
        const fieldType = getFieldType(field);
        const isValidField = validateField(field.value, fieldType);
    });
}
```

### 2. Transformación de Datos
```javascript
// Transformar datos para tests
import { transformJson } from './jsonUtils.js';
import { transformFieldValue } from './fieldUtils.js';

// Aplicar transformaciones
const transformedData = transformJson(originalData, {
    fieldName: 'newName',
    valueType: 'string'
});
```

## 🎯 Casos de Uso Específicos

### Procesamiento de Modelo JSON
- **Validación**: Verificar que el JSON del modelo sea válido
- **Extracción**: Obtener campos y configuraciones específicas
- **Transformación**: Adaptar datos para diferentes tipos de tests

### Validación de Formularios
- **Tipos de campo**: Identificar y validar tipos de entrada
- **Valores**: Verificar que los valores sean correctos
- **Dependencias**: Validar relaciones entre campos

### Generación de Tests
- **Selectores**: Crear selectores CSS para elementos
- **Datos de prueba**: Generar datos de prueba válidos
- **Configuraciones**: Procesar configuraciones específicas

## 🔧 Integración con Otros Módulos

### Con Generadores de Tests
- Los generadores usan `fieldUtils.js` para procesar campos específicos
- `jsonUtils.js` se utiliza para extraer configuraciones del modelo
- Ambos módulos proporcionan datos validados para la generación

### Con Utilidades de Formularios
- `formDataCollector.js` utiliza `fieldUtils.js` para validación
- `dialogDataCollector.js` usa `jsonUtils.js` para procesamiento
- Integración con `htmlFieldGenerator.js` para generación de HTML

### Con Utilidades de Renderizado
- `actionRenderer.js` utiliza datos procesados por estas utilidades
- `configRenderer.js` muestra configuraciones validadas
- Integración con `actionListRenderer.js` para listas de acciones

## 🛠️ Extensibilidad

### Agregar Nuevas Utilidades de Datos
1. **Crear archivo**: Nuevo archivo con patrón `*Utils.js`
2. **Exportar funciones**: Exportar funciones principales
3. **Documentar**: Documentar métodos y casos de uso
4. **Integrar**: Conectar con otros módulos según sea necesario

### Ejemplo de Nueva Utilidad
```javascript
// nuevaUtilidad.js
export function procesarNuevoTipoDeDato(data) {
    // Lógica de procesamiento
    return processedData;
}

export function validarNuevoTipoDeDato(data) {
    // Lógica de validación
    return isValid;
}
```

## 📊 Métricas y Rendimiento

### Optimizaciones Implementadas
- **Caché de validaciones**: Resultados de validación se cachean
- **Procesamiento lazy**: Solo se procesa cuando es necesario
- **Validación temprana**: Se valida antes de procesar completamente

### Monitoreo
- **Tiempo de procesamiento**: Se mide el tiempo de procesamiento de JSON
- **Tasa de error**: Se registran errores de validación
- **Uso de memoria**: Se monitorea el uso de memoria en procesamiento

## 🔍 Troubleshooting

### Errores Comunes

#### Error de JSON Inválido
**Problema**: JSON mal formado
**Solución**:
- Usar `validateJson()` antes de procesar
- Verificar sintaxis con herramientas externas
- Revisar caracteres especiales

#### Error de Tipo de Campo
**Problema**: Tipo de campo no reconocido
**Solución**:
- Verificar configuración del campo
- Usar `getFieldType()` para diagnóstico
- Agregar nuevo tipo si es necesario

#### Error de Transformación
**Problema**: Error al transformar datos
**Solución**:
- Verificar reglas de transformación
- Validar datos de entrada
- Revisar tipos de datos esperados

