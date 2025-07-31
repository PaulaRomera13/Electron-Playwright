# Utilidades de Validación - Validation Utils

## 📁 Descripción

Esta carpeta contiene utilidades para la validación de tipos de acciones y reglas de negocio en la aplicación Generador de Tests Playwright. Permite centralizar la lógica de validación y asegurar que solo se generen tests para acciones válidas y soportadas.

## 🔧 Archivos Disponibles

### ✅ `actionTypeValidator.js` - Validador de Tipos de Acción
**Propósito**: Validar y clasificar acciones según su tipo para determinar el generador de test adecuado.

**Funcionalidades principales**:
- **Validación de acciones**: Determina si una acción debe mostrar el generador de test.
- **Clasificación de acciones**: Clasifica acciones en tipos (diálogo, exportación, adjunto, auditoría, etc.).
- **Reglas de negocio**: Implementa reglas para distinguir entre acciones similares.
- **Integración con la fábrica de formularios**: Permite a la fábrica decidir qué generador usar.

**Métodos principales**:
- `shouldShowTestGenerator(action)` - Determina si se debe mostrar el generador de test para una acción.
- `getGeneratorType(action)` - Devuelve el tipo de generador adecuado para la acción.
- Métodos auxiliares: `isAuditAction`, `isAWSAttachmentAction`, `isRemoveAttachmentAction`, `isOpenAttachmentAction`, `isDialogWithColumnSelection`, `isReactivateObjectDialog`, `isExportAction`, etc.

**Casos de uso**:
- Validación previa a la generación de tests
- Clasificación de acciones para la interfaz
- Integración con la fábrica de formularios y generadores

## 🔄 Flujo de Trabajo

### 1. Validación de Acción
```javascript
import { ActionTypeValidator } from './actionTypeValidator.js';

const validator = new ActionTypeValidator();
if (validator.shouldShowTestGenerator(action)) {
    const generatorType = validator.getGeneratorType(action);
    // Usar generatorType para crear el formulario adecuado
}
```

## 🎯 Casos de Uso Específicos
- Validar si una acción soporta generación de test
- Determinar el tipo de generador a usar
- Integración con la lógica de la interfaz y la fábrica de formularios

## 🔧 Integración con Otros Módulos
- Usado por `formFactory.js` en la carpeta `factory`
- Integración con los generadores de la carpeta `families`
- Permite la extensión para nuevas reglas de validación

## 🚀 Extensibilidad
- Para agregar nuevas reglas, implementar nuevos métodos auxiliares
- Documentar las reglas y su integración

