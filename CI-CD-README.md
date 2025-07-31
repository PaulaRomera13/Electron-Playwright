# CI/CD Pipeline - Generador de Tests Playwright

## 📋 Descripción

Este repositorio incluye un pipeline de Integración y Despliegue Continuo (CI/CD) basado en GitHub Actions, diseñado para automatizar la calidad, construcción, pruebas y publicación de la aplicación Electron-Playwright en múltiples plataformas.

## 🎯 ¿Qué hace este Workflow?

### 🔍 Lint y Verificación de Sintaxis
- **ESLint**: Asegura que el código JavaScript cumple con los estándares de calidad
- **Validación JSON**: Verifica que los archivos JSON estén correctamente formateados
- **Verificación de sintaxis**: Comprueba que todos los archivos JavaScript sean válidos
- **Análisis de estructura**: Valida la estructura básica del proyecto

### 🏗️ Build Multiplataforma
- **Compilación**: Construye la aplicación para Linux, Windows y macOS
- **Empaquetado**: Genera archivos ejecutables para cada plataforma
- **Optimización**: Aplica optimizaciones específicas por plataforma
- **Iconos**: Genera iconos específicos para cada sistema operativo

### 🧪 Ejecución de Tests
- **Verificación de sintaxis**: Valida la sintaxis de los archivos principales
- **Pruebas básicas**: Ejecuta tests básicos de funcionalidad
- **Validación de dependencias**: Verifica que todas las dependencias estén correctamente instaladas

### 📦 Empaquetado y Subida de Artefactos
- **Archivos ZIP**: Genera archivos comprimidos con los builds de cada plataforma
- **Artefactos**: Sube los archivos como artefactos de GitHub
- **Organización**: Nombra los archivos con la versión correspondiente

### 🚀 Release Automático
- **Creación de releases**: Crea releases automáticos en GitHub
- **Changelog**: Extrae las notas de cambios desde `CHANGELOG.md`
- **Artefactos**: Incluye los builds en el release
- **Tags**: Crea tags de versión automáticamente

## ⏰ ¿Cuándo se Ejecuta?

### Triggers Automáticos
- **Push a master**: En cada push directo a la rama `master`
- **Pull Requests**: En cada pull request a la rama `master`
- **Tags**: Al crear tags de versión

### Jobs Condicionales
- **Release**: Solo se ejecuta en pushes directos a `master`
- **Builds**: Se ejecutan en todos los triggers
- **Tests**: Se ejecutan en todos los triggers

## 🏗️ Estructura de los Jobs

### 1. 🔍 **lint** - Validación de Código
**Propósito**: Asegurar la calidad del código y la estructura del proyecto

**Pasos**:
- **Instalación de dependencias**: Instala todas las dependencias del proyecto
- **Conversión de saltos de línea**: Convierte CRLF a LF para consistencia
- **ESLint**: Ejecuta ESLint con y sin corrección automática
- **Verificación de sintaxis**: Valida la sintaxis de archivos JS
- **Formato JSON**: Verifica el formato de archivos JSON
- **Estructura del proyecto**: Comprueba la estructura básica del proyecto

**Artefactos generados**:
- Reportes de linting
- Logs de validación

### 2. 🐧 **build-linux** - Construcción para Linux
**Propósito**: Construir la aplicación para sistemas Linux

**Pasos**:
- **Instalación**: Instala dependencias y herramientas de construcción
- **Construcción**: Compila la aplicación para Linux
- **Prueba de inicio**: Ejecuta la app brevemente para verificar que inicia
- **Empaquetado**: Crea archivo ZIP con la versión
- **Subida**: Sube el artefacto generado

**Artefactos generados**:
- `electron-app-linux-v<versión>.zip`

### 3. 🪟 **build-windows** - Construcción para Windows
**Propósito**: Construir la aplicación para sistemas Windows

**Pasos**:
- **Instalación**: Instala dependencias y herramientas de construcción
- **Construcción**: Compila la aplicación para Windows
- **Prueba de inicio**: Ejecuta la app brevemente para verificar que inicia
- **Empaquetado**: Crea archivo ZIP con la versión
- **Subida**: Sube el artefacto generado

**Artefactos generados**:
- `electron-app-windows-v<versión>.zip`

### 4. 🍎 **build-macos** - Construcción para macOS
**Propósito**: Construir la aplicación para sistemas macOS

**Pasos**:
- **Instalación**: Instala dependencias y herramientas de construcción
- **Construcción**: Compila la aplicación para macOS
- **Prueba de inicio**: Ejecuta la app brevemente para verificar que inicia
- **Empaquetado**: Crea archivo ZIP con la versión
- **Subida**: Sube el artefacto generado

**Artefactos generados**:
- `electron-app-macos-v<versión>.zip`

### 5. 🧪 **test** - Ejecución de Tests
**Propósito**: Verificar la funcionalidad básica del proyecto

**Pasos**:
- **Verificación de sintaxis**: Valida la sintaxis de archivos principales
- **Tests de scripts**: Ejecuta tests básicos de todos los scripts JS
- **Validación de estructura**: Verifica la estructura del proyecto

**Artefactos generados**:
- Reportes de tests
- Logs de ejecución

### 6. 🚀 **release** - Publicación de Release
**Propósito**: Crear releases automáticos en GitHub

**Condiciones**:
- Solo se ejecuta en pushes directos a `master`
- Requiere que el job `lint` haya sido exitoso

**Pasos**:
- **Lectura de versión**: Lee la versión desde `package.json`
- **Creación de tag**: Crea un tag de versión automáticamente
- **Empaquetado de código**: Comprime el código fuente (excluyendo node_modules, dist, .git, etc.)
- **Descarga de builds**: Descarga los builds de cada plataforma
- **Lectura de changelog**: Lee el changelog desde `CHANGELOG.md`
- **Publicación**: Publica un release en GitHub con los artefactos y el changelog

**Artefactos generados**:
- Release en GitHub
- Tag de versión
- `project-source-v<versión>.zip` (código fuente del proyecto)

## 📋 Requisitos

### Configuración de GitHub
- **GH_TOKEN**: Token de GitHub configurado en el repositorio
  - Permite la subida de releases y artefactos
  - Debe tener permisos de escritura en el repositorio
  - Se configura en Settings > Secrets and variables > Actions

### Archivos Requeridos
- **`CHANGELOG.md`**: Debe estar actualizado para que el release incluya las notas correctas
- **`package.json`**: Debe contener la versión correcta
- **`.github/workflows/ci-cd.yml`**: Archivo de configuración del workflow

### Configuración del Proyecto
- **Dependencias**: Todas las dependencias deben estar en `package.json`
- **Scripts**: Los scripts de build deben estar configurados correctamente
- **Estructura**: La estructura del proyecto debe ser consistente

## 📦 Archivos y Artefactos Generados

### Builds por Plataforma
- **Linux**: `electron-app-linux-v<versión>.zip`
- **Windows**: `electron-app-windows-v<versión>.zip`
- **macOS**: `electron-app-macos-v<versión>.zip`

### Código Fuente
- **Proyecto completo**: `project-source-v<versión>.zip`
- **Exclusiones**: node_modules, dist, .git, etc.

### Release en GitHub
- **Descripción**: Extraída de `CHANGELOG.md`
- **Artefactos**: Incluye todos los builds generados
- **Tag**: Tag de versión automático

## 🛠️ Personalización

### Modificar el Workflow
Puedes modificar el archivo `.github/workflows/ci-cd.yml` para:

#### Agregar Nuevos Pasos de Validación
```yaml
- name: Nuevo paso de validación
  run: |
    # Comandos de validación personalizados
    echo "Validación personalizada"
```

#### Cambiar la Lógica de Empaquetado
```yaml
- name: Empaquetado personalizado
  run: |
    # Lógica de empaquetado personalizada
    zip -r custom-package.zip dist/
```

#### Adaptar el Pipeline a Nuevas Plataformas
```yaml
build-custom:
  runs-on: ubuntu-latest
  steps:
    - name: Build para plataforma personalizada
      run: |
        # Comandos de build personalizados
```

### Configuraciones Avanzadas

#### Variables de Entorno
```yaml
env:
  NODE_VERSION: '18'
  ELECTRON_VERSION: '28.0.0'
```

#### Matrices de Build
```yaml
strategy:
  matrix:
    platform: [linux, windows, macos]
    node-version: [16, 18, 20]
```

#### Condiciones de Ejecución
```yaml
if: github.ref == 'refs/heads/master' && github.event_name == 'push'
```

## 🔍 Monitoreo y Debugging

### Logs del Workflow
- **Acceso**: GitHub Actions > Workflows > CI/CD
- **Detalles**: Cada job muestra logs detallados
- **Errores**: Los errores se muestran claramente con contexto

### Artefactos
- **Descarga**: Los artefactos se pueden descargar desde GitHub
- **Retención**: Los artefactos se retienen por 90 días
- **Organización**: Se organizan por job y versión

### Notificaciones
- **Email**: Notificaciones por email en fallos
- **Slack/Discord**: Configuración opcional para notificaciones
- **GitHub**: Notificaciones en la interfaz de GitHub

## 🚀 Despliegue

### Release Automático
1. **Push a master**: Se ejecuta automáticamente el workflow
2. **Validación**: Se ejecutan todos los jobs de validación
3. **Construcción**: Se construyen las aplicaciones para todas las plataformas
4. **Release**: Se crea automáticamente el release en GitHub

### Descarga de Artefactos
- **Desde GitHub**: Releases > Latest > Assets
- **Desde Actions**: Actions > Workflow > Artifacts
- **Automática**: Los usuarios pueden descargar directamente

### Distribución
- **GitHub Releases**: Distribución principal
- **Artefactos**: Descarga directa desde Actions
- **Tags**: Referencias de versión en Git

## 🔧 Troubleshooting

### Errores Comunes

#### Error de Linting
**Problema**: ESLint falla en el job de lint
**Solución**:
- Revisar los errores de linting en los logs
- Ejecutar `npm run lint:fix` localmente
- Corregir los errores de formato

#### Error de Build
**Problema**: Los builds fallan en alguna plataforma
**Solución**:
- Verificar que todas las dependencias estén instaladas
- Comprobar que los scripts de build estén correctos
- Revisar la configuración de electron-builder

#### Error de Release
**Problema**: El job de release falla
**Solución**:
- Verificar que el GH_TOKEN esté configurado correctamente
- Comprobar que el CHANGELOG.md esté actualizado
- Verificar que la versión en package.json sea correcta

### Debugging Local
```bash
# Ejecutar linting localmente
npm run lint

# Ejecutar tests localmente
npm test

# Construir localmente
npm run pack
```
