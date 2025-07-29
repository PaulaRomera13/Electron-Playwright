# API Endpoints - Generador de Tests Playwright

## Descripción

Este documento describe todos los endpoints disponibles en el servidor Express.js que acompaña a la aplicación Generador de Tests Playwright. El servidor maneja la gestión de archivos JSON para la configuración de tests y el sistema de tests regresivos.

## Información del Servidor

- **URL Base**: `http://localhost:3001`
- **Puerto**: 3001
- **Tecnología**: Express.js con CORS habilitado
- **Límite de datos**: 10MB para peticiones JSON

## Endpoints Principales

### GET `/model-json`
Obtiene el archivo `modelJson.json` actual que contiene la configuración del modelo de test.

**Respuesta exitosa (200):**
```json
{
  "component": "ExampleComponent",
  "view_definition": [...]
}
```

**Respuesta de error (404):**
```json
{
  "error": "Archivo no encontrado"
}
```

**Respuesta de error (500):**
```json
{
  "error": "JSON mal formado",
  "details": "Error específico del parsing"
}
```

### POST `/upload-model`
Actualiza el archivo `modelJson.json` con un nuevo modelo de configuración.

**Cuerpo de la petición:**
```json
{
  "component": "ExampleComponent",
  "view_definition": [...]
}
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "message": "Modelo actualizado exitosamente"
}
```

**Respuesta de error (400):**
```json
{
  "ok": false,
  "error": "JSON inválido: falta estructura básica (component)"
}
```

**Respuesta de error (500):**
```json
{
  "ok": false,
  "error": "Error al guardar el modelo",
  "details": "Error específico"
}
```

## Endpoints Regresivos (v2.0.0)

### POST `/clear-regressive`
Limpia el archivo `regressive.json` eliminando todas las pantallas guardadas.

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "message": "Archivo regresivo limpiado exitosamente"
}
```

**Respuesta de error (500):**
```json
{
  "ok": false,
  "error": "Error al limpiar archivo",
  "details": "Error específico"
}
```

### POST `/upload-regressive`
Guarda múltiples pantallas de una vez en el archivo `regressive.json`.

**Cuerpo de la petición:**
```json
[
  {
    "component": "Screen1Component",
    "view_definition": [...]
  },
  {
    "component": "Screen2Component", 
    "view_definition": [...]
  }
]
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "message": "2 pantallas guardadas exitosamente"
}
```

**Respuesta de error (400):**
```json
{
  "ok": false,
  "error": "Se requiere un array de pantallas"
}
```

**Respuesta de error (400):**
```json
{
  "ok": false,
  "error": "Pantalla 1 inválida: falta \"component\""
}
```

### GET `/regressive-json`
Obtiene todas las pantallas regresivas guardadas en `regressive.json`.

**Respuesta exitosa (200):**
```json
[
  {
    "component": "Screen1Component",
    "view_definition": [...]
  },
  {
    "component": "Screen2Component",
    "view_definition": [...]
  }
]
```

**Respuesta cuando el archivo no existe:**
```json
[]
```

**Respuesta de error (500):**
```json
{
  "error": "Error al cargar archivo regresivo",
  "details": "Error específico"
}
```

## Códigos de Estado HTTP

- **200**: Operación exitosa
- **400**: Error en los datos de entrada (validación fallida)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

## Validaciones

### Para `/upload-model`:
- El JSON debe contener la propiedad `component`
- El JSON debe ser válido y parseable

### Para `/upload-regressive`:
- El cuerpo debe ser un array
- Cada elemento del array debe tener la propiedad `component`
- Todos los elementos deben ser objetos JSON válidos

## Archivos Gestionados

### `modelJson.json`
- **Propósito**: Configuración principal del modelo de test
- **Ubicación**: Raíz del proyecto
- **Formato**: JSON con estructura `{ component, view_definition }`
- **Backup**: Se crea automáticamente antes de cada actualización

### `regressive.json`
- **Propósito**: Almacena pantallas para tests regresivos
- **Ubicación**: Raíz del proyecto  
- **Formato**: Array de objetos JSON con estructura de pantallas
- **Backup**: Se crea automáticamente antes de cada actualización


## Logging

El servidor proporciona logs detallados para debugging:

- **🔄**: Peticiones recibidas
- **✅**: Operaciones exitosas
- **❌**: Errores
- **💾**: Operaciones de backup
- **⚠️**: Advertencias

## Ejemplos de Uso

### Obtener el modelo actual
```bash
curl -X GET http://localhost:3001/model-json
```

### Actualizar el modelo
```bash
curl -X POST http://localhost:3001/upload-model \
  -H "Content-Type: application/json" \
  -d '{"component":"TestComponent","view_definition":[]}'
```

### Limpiar tests regresivos
```bash
curl -X POST http://localhost:3001/clear-regressive
```

### Guardar pantallas regresivas
```bash
curl -X POST http://localhost:3001/upload-regressive \
  -H "Content-Type: application/json" \
  -d '[{"component":"Screen1","view_definition":[]},{"component":"Screen2","view_definition":[]}]'
```

### Obtener pantallas regresivas
```bash
curl -X GET http://localhost:3001/regressive-json
```

## Notas de Seguridad

- El servidor está configurado para desarrollo local
- CORS está habilitado para `localhost:3001` y `localhost:3000`
- No hay autenticación implementada
- Los archivos se guardan en el sistema de archivos local
- Se recomienda usar solo en entornos de desarrollo

## Troubleshooting

### Error 404 en endpoints
- Verificar que el servidor esté corriendo en el puerto 3001
- Verificar que los archivos `modelJson.json` y `regressive.json` existan

### Error 500 en operaciones de archivo
- Verificar permisos de escritura en el directorio del proyecto
- Verificar que haya espacio suficiente en disco
- Revisar los logs del servidor para detalles específicos

### Error de CORS
- Verificar que la URL de origen esté en la lista de CORS permitidos
- El servidor acepta: `http://localhost:3001`, `http://127.0.0.1:3001`, `http://localhost:3000` 