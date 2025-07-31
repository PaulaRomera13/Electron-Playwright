# API Endpoints - Generador de Tests Playwright

## 📋 Descripción

Este documento describe todos los endpoints disponibles en el servidor Express.js que acompaña a la aplicación Generador de Tests Playwright. El servidor maneja la gestión de archivos JSON para la configuración de tests y el sistema de tests regresivos.

## 🖥️ Información del Servidor

- **URL Base**: `http://localhost:3001`
- **Puerto**: 3001
- **Tecnología**: Express.js con CORS habilitado
- **Límite de datos**: 10MB para peticiones JSON
- **Protocolo**: HTTP/HTTPS
- **Codificación**: UTF-8

## 🔧 Configuración del Servidor

### Middleware Configurado
```javascript
// CORS habilitado para desarrollo local
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3000'],
  credentials: true
}));

// Límite de datos para peticiones JSON
app.use(express.json({ limit: '10mb' }));
```

### Archivos Gestionados
- **`modelJson.json`**: Configuración principal del modelo de test
- **`regressive.json`**: Almacena pantallas para tests regresivos
- **Backups automáticos**: Se crean antes de cada actualización

## 📡 Endpoints Principales

### 🔍 GET `/model-json`
Obtiene el archivo `modelJson.json` actual que contiene la configuración del modelo de test.

#### Respuesta Exitosa (200)
```json
{
  "component": "ExampleComponent",
  "view_definition": [
    {
      "type": "form",
      "fields": [...]
    }
  ]
}
```

#### Respuesta de Error (404)
```json
{
  "error": "Archivo no encontrado"
}
```

#### Respuesta de Error (500)
```json
{
  "error": "JSON mal formado",
  "details": "Error específico del parsing"
}
```

#### Ejemplo de Uso
```bash
curl -X GET http://localhost:3001/model-json
```

### 📤 POST `/upload-model`
Actualiza el archivo `modelJson.json` con un nuevo modelo de configuración.

#### Cuerpo de la Petición
```json
{
  "component": "ExampleComponent",
  "view_definition": [
    {
      "type": "form",
      "fields": [
        {
          "name": "username",
          "type": "text",
          "label": "Usuario"
        }
      ]
    }
  ]
}
```

#### Respuesta Exitosa (200)
```json
{
  "ok": true,
  "message": "Modelo actualizado exitosamente"
}
```

#### Respuesta de Error (400)
```json
{
  "ok": false,
  "error": "JSON inválido: falta estructura básica (component)"
}
```

#### Respuesta de Error (500)
```json
{
  "ok": false,
  "error": "Error al guardar el modelo",
  "details": "Error específico"
}
```

#### Ejemplo de Uso
```bash
curl -X POST http://localhost:3001/upload-model \
  -H "Content-Type: application/json" \
  -d '{"component":"TestComponent","view_definition":[]}'
```

## 🔄 Endpoints Regresivos (v2.0.0)

### 🗑️ POST `/clear-regressive`
Limpia el archivo `regressive.json` eliminando todas las pantallas guardadas.

#### Respuesta Exitosa (200)
```json
{
  "ok": true,
  "message": "Archivo regresivo limpiado exitosamente"
}
```

#### Respuesta de Error (500)
```json
{
  "ok": false,
  "error": "Error al limpiar archivo",
  "details": "Error específico"
}
```

#### Ejemplo de Uso
```bash
curl -X POST http://localhost:3001/clear-regressive
```

### 📤 POST `/upload-regressive`
Guarda múltiples pantallas de una vez en el archivo `regressive.json`.

#### Cuerpo de la Petición
```json
[
  {
    "component": "Screen1Component",
    "view_definition": [
      {
        "type": "form",
        "fields": [...]
      }
    ]
  },
  {
    "component": "Screen2Component", 
    "view_definition": [
      {
        "type": "table",
        "columns": [...]
      }
    ]
  }
]
```

#### Respuesta Exitosa (200)
```json
{
  "ok": true,
  "message": "2 pantallas guardadas exitosamente"
}
```

#### Respuesta de Error (400) - Array requerido
```json
{
  "ok": false,
  "error": "Se requiere un array de pantallas"
}
```

#### Respuesta de Error (400) - Validación de estructura
```json
{
  "ok": false,
  "error": "Pantalla 1 inválida: falta \"component\""
}
```

#### Ejemplo de Uso
```bash
curl -X POST http://localhost:3001/upload-regressive \
  -H "Content-Type: application/json" \
  -d '[{"component":"Screen1","view_definition":[]},{"component":"Screen2","view_definition":[]}]'
```

### 🔍 GET `/regressive-json`
Obtiene todas las pantallas regresivas guardadas en `regressive.json`.

#### Respuesta Exitosa (200)
```json
[
  {
    "component": "Screen1Component",
    "view_definition": [
      {
        "type": "form",
        "fields": [...]
      }
    ]
  },
  {
    "component": "Screen2Component",
    "view_definition": [
      {
        "type": "table",
        "columns": [...]
      }
    ]
  }
]
```

#### Respuesta cuando el archivo no existe
```json
[]
```

#### Respuesta de Error (500)
```json
{
  "error": "Error al cargar archivo regresivo",
  "details": "Error específico"
}
```

#### Ejemplo de Uso
```bash
curl -X GET http://localhost:3001/regressive-json
```

## 📊 Códigos de Estado HTTP

| Código | Descripción | Uso |
|--------|-------------|-----|
| **200** | Operación exitosa | Respuestas exitosas de todos los endpoints |
| **400** | Error en los datos de entrada | Validación fallida, estructura incorrecta |
| **404** | Recurso no encontrado | Archivo no existe o ruta incorrecta |
| **500** | Error interno del servidor | Errores de procesamiento o sistema |

## ✅ Validaciones

### Para `/upload-model`
- ✅ El JSON debe contener la propiedad `component`
- ✅ El JSON debe ser válido y parseable
- ✅ La estructura debe ser un objeto válido
- ✅ Se valida la integridad de los datos antes de guardar

### Para `/upload-regressive`
- ✅ El cuerpo debe ser un array
- ✅ Cada elemento del array debe tener la propiedad `component`
- ✅ Todos los elementos deben ser objetos JSON válidos
- ✅ Se valida cada pantalla individualmente
- ✅ Se proporcionan mensajes de error específicos por pantalla

## 📁 Archivos Gestionados

### `modelJson.json`
- **Propósito**: Configuración principal del modelo de test
- **Ubicación**: Raíz del proyecto
- **Formato**: JSON con estructura `{ component, view_definition }`
- **Backup**: Se crea automáticamente antes de cada actualización
- **Ejemplo**:
```json
{
  "component": "UserForm",
  "view_definition": [
    {
      "type": "form",
      "fields": [
        {
          "name": "username",
          "type": "text",
          "label": "Usuario"
        }
      ]
    }
  ]
}
```

### `regressive.json`
- **Propósito**: Almacena pantallas para tests regresivos
- **Ubicación**: Raíz del proyecto  
- **Formato**: Array de objetos JSON con estructura de pantallas
- **Backup**: Se crea automáticamente antes de cada actualización
- **Ejemplo**:
```json
[
  {
    "component": "LoginScreen",
    "view_definition": [...]
  },
  {
    "component": "DashboardScreen",
    "view_definition": [...]
  }
]
```

## 📝 Logging

El servidor proporciona logs detallados para debugging:

### Símbolos de Log
- **🔄**: Peticiones recibidas
- **✅**: Operaciones exitosas
- **❌**: Errores
- **💾**: Operaciones de backup
- **⚠️**: Advertencias

### Ejemplos de Logs
```
🔄 Petición GET /model-json
✅ JSON parseado correctamente
💾 Backup creado o sobrescrito: modelJson_backup.json
✅ Modelo actualizado correctamente
❌ Error al parsear el JSON: Unexpected token
```

## 🔒 Seguridad

### Configuración Actual
- **Entorno**: Desarrollo local
- **CORS**: Habilitado para `localhost:3001` y `localhost:3000`
- **Autenticación**: No implementada
- **Archivos**: Guardados en sistema de archivos local

### Recomendaciones
- ⚠️ Usar solo en entornos de desarrollo
- ⚠️ No exponer en producción sin autenticación
- ⚠️ Validar todos los datos de entrada
- ⚠️ Implementar rate limiting para producción

## 🛠️ Troubleshooting

### Error 404 en Endpoints
**Problema**: Los endpoints devuelven 404
**Solución**:
- Verificar que el servidor esté corriendo en el puerto 3001
- Verificar que los archivos `modelJson.json` y `regressive.json` existan
- Comprobar que la URL base sea correcta

### Error 500 en Operaciones de Archivo
**Problema**: Errores 500 al guardar o cargar archivos
**Solución**:
- Verificar permisos de escritura en el directorio del proyecto
- Verificar que haya espacio suficiente en disco
- Revisar los logs del servidor para detalles específicos

### Error de CORS
**Problema**: Errores de CORS en el navegador
**Solución**:
- Verificar que la URL de origen esté en la lista de CORS permitidos
- El servidor acepta: `http://localhost:3001`, `http://127.0.0.1:3001`, `http://localhost:3000`

### Error de JSON Mal Formado
**Problema**: Errores al parsear JSON
**Solución**:
- Verificar que el JSON sea válido usando un validador
- Comprobar que no haya caracteres especiales mal codificados
- Verificar que la estructura sea la esperada

## 📚 Ejemplos de Uso Completos

### Obtener el Modelo Actual
```bash
curl -X GET http://localhost:3001/model-json \
  -H "Content-Type: application/json"
```

### Actualizar el Modelo
```bash
curl -X POST http://localhost:3001/upload-model \
  -H "Content-Type: application/json" \
  -d '{
    "component": "TestComponent",
    "view_definition": [
      {
        "type": "form",
        "fields": [
          {
            "name": "test",
            "type": "text",
            "label": "Test Field"
          }
        ]
      }
    ]
  }'
```

### Limpiar Tests Regresivos
```bash
curl -X POST http://localhost:3001/clear-regressive \
  -H "Content-Type: application/json"
```

### Guardar Pantallas Regresivas
```bash
curl -X POST http://localhost:3001/upload-regressive \
  -H "Content-Type: application/json" \
  -d '[
    {
      "component": "Screen1",
      "view_definition": [
        {
          "type": "form",
          "fields": []
        }
      ]
    },
    {
      "component": "Screen2",
      "view_definition": [
        {
          "type": "table",
          "columns": []
        }
      ]
    }
  ]'
```

### Obtener Pantallas Regresivas
```bash
curl -X GET http://localhost:3001/regressive-json \
  -H "Content-Type: application/json"
```

## 🔄 Integración con la Aplicación

### Flujo de Trabajo
1. **Inicio**: La aplicación Electron inicia el servidor Express
2. **Carga**: La aplicación carga el modelo JSON desde el servidor
3. **Actualización**: Los cambios se guardan a través de los endpoints
4. **Tests Regresivos**: Se gestionan múltiples pantallas a través de endpoints específicos
5. **Cierre**: El servidor se cierra cuando se cierra la aplicación

### Comunicación
- **Frontend**: Aplicación Electron (puerto 3000)
- **Backend**: Servidor Express (puerto 3001)
- **Protocolo**: HTTP con JSON
- **CORS**: Habilitado para comunicación entre puertos

