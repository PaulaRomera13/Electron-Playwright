# Utilidades de Fábrica - Factory Utils

## 📁 Descripción

Esta carpeta contiene utilidades para la creación dinámica de formularios y componentes según el tipo de acción en la aplicación Generador de Tests Playwright. Permite centralizar la lógica de instanciación de formularios y su integración con los generadores y validadores del sistema.

## 🔧 Archivos Disponibles

### 🏭 `formFactory.js` - Fábrica de Formularios
**Propósito**: Crear formularios de test según el tipo de acción y conectar con los generadores específicos.

**Funcionalidades principales**:
- **Creación dinámica**: Instancia formularios según el tipo de acción detectado.
- **Integración con validadores**: Usa `ActionTypeValidator` para determinar el generador adecuado.
- **Mapeo de generadores**: Asocia cada tipo de acción con su generador de formulario correspondiente.
- **Configuración de listeners**: Configura los listeners y controles de vista previa según el tipo de formulario.

**Métodos principales**:
- `createTestForm(action, idSuffix)` - Crea el formulario y determina el generador adecuado.
- `createFormByType(generatorType, idSuffix)` - Instancia el formulario según el tipo de generador.
- `setupTestListeners(generatorType, idSuffix, targetContainer, action)` - Configura listeners y controles de vista previa.

**Casos de uso**:
- Creación de formularios para diferentes tipos de tests (diálogo, exportación, adjuntos, etc.)
- Integración con la lógica de generación de tests
- Configuración dinámica de la interfaz según la acción seleccionada

## 🔄 Flujo de Trabajo

### 1. Creación de Formulario de Test
```javascript
import { FormFactory } from './formFactory.js';

const factory = new FormFactory(app);
const { testForm, generatorType } = factory.createTestForm(action, 'id123');
```

### 2. Configuración de Listeners
```javascript
factory.setupTestListeners(generatorType, 'id123', container, action);
```

## 🎯 Casos de Uso Específicos
- Generación de formularios para cada tipo de acción soportada
- Integración con validadores de tipo de acción
- Configuración de listeners y controles de vista previa

## 🔧 Integración con Otros Módulos
- Usa `ActionTypeValidator` de la carpeta `validation` para decidir el generador
- Se conecta con los generadores de la carpeta `families`
- Permite la extensión para nuevos tipos de formularios y generadores

## 🚀 Extensibilidad
- Para agregar un nuevo tipo de formulario, añadirlo al `generatorMap` y `listenerMap`
- Documentar el nuevo tipo y su integración

