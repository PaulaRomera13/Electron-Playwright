# GitHub Actions CI/CD

Este directorio contiene la configuración del sistema de integración continua y despliegue continuo (CI/CD) para el Generador de Tests Playwright.

## Workflow: CI/CD Pipeline

### Triggers
- **Push** a la rama `master`
- **Pull Request** a la rama `master`

### Jo

#### 1. Lint y verificar sintaxis
- **Plataforma**: Ubuntu Latest
- **Funciones**:
  - Verificar sintaxis de archivos JavaScript
  - Verificar formato de archivos JSON
  - Verificar estructura del proyecto
  - Ejecutar ESLint para análisis de código

#### 2. Build en Linux
- **Plataforma**: Ubuntu Latest
- **Dependencias**: Lint
- **Funciones**:
  - Instalar dependencias
  - Verificar que la aplicación inicia
  - Ejecutar `npm run dist`
  - Subir artefactos de build

#### 3. Build en Windows
- **Plataforma**: Windows Latest
- **Dependencias**: Lint
- **Funciones**:
  - Instalar dependencias
  - Verificar que la aplicación inicia
  - Ejecutar `npm run dist`
  - Subir artefactos de build

#### 4. Build en macOS
- **Plataforma**: macOS Latest
- **Dependencias**: Lint
- **Funciones**:
  - Instalar dependencias
  - Verificar que la aplicación inicia
  - Ejecutar `npm run dist`
  - Subir artefactos de build

#### 5. Tests
- **Plataforma**: Ubuntu Latest
- **Dependencias**: Lint
- **Funciones**:
  - Verificar scripts disponibles
  - Verificar sintaxis de archivos principales
  - Ejecutar tests de integración

#### 6. Release (solo en push a master)
- **Plataforma**: Ubuntu Latest
- **Dependencias**: Todos los builds
- **Funciones**:
  - Descargar artefactos de todas las plataformas
  - Crear release automático en GitHub
  - Subir archivos de build para cada plataforma

## Configuración

### ESLint
- Archivo de configuración: `.eslintrc.json`
- Reglas configuradas para mantener calidad de código
- Ignora directorios como `node_modules`, `dist`, `icons`

### Scripts de NPM
- `npm run lint`: Ejecutar ESLint
- `npm run lint:fix`: Ejecutar ESLint con corrección automática
- `npm run test`: Ejecutar lint y tests

## Artefactos

Los builds generan artefactos que se almacenan por 7 días:
- `electron-app-linux`: Build para Linux
- `electron-app-windows`: Build para Windows
- `electron-app-macos`: Build para macOS

## Releases

Cuando se hace push a la rama `master`, se crea automáticamente:
- Un tag con el número de build
- Un release en GitHub con los archivos de todas las plataformas
- Documentación del release con información de cambios

## Monitoreo

Puedes ver el estado de los workflows en:
- GitHub Actions tab del repositorio
- Badges de estado (si se configuran)
- Notificaciones por email (si están habilitadas)

## Troubleshooting

### Problemas comunes:
1. **Build falla en una plataforma**: Verificar dependencias específicas de la plataforma
2. **ESLint encuentra errores**: Ejecutar `npm run lint:fix` localmente
3. **Timeout en npm start**: Aumentar el timeout en el workflow
4. **Artefactos no se suben**: Verificar permisos y espacio disponible 