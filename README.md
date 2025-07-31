# Generador de Tests Playwright - Aplicación Electron

## 📋 Descripción

Esta aplicación Electron es una herramienta avanzada para generar tests de Playwright de manera rápida y eficiente. La aplicación analiza estructuras JSON que representan pantallas de aplicaciones web y genera automáticamente tests de Playwright para todas las acciones y botones disponibles.

## 🚀 Características Principales

### ✨ Generación de Tests Individuales
- **Análisis inteligente de JSON**: Copia y pega el JSON de cualquier pantalla para analizar su estructura automáticamente
- **Generación automática de tests**: Crea tests de Playwright basados en las acciones disponibles en la pantalla
- **Soporte para múltiples tipos de acciones**:
  - Diálogos simples y complejos
  - Exportación de datos (CSV, Excel, PDF)
  - Apertura de archivos adjuntos
  - Eliminación de archivos adjuntos
  - Auditoría y logs
  - Objetos reactivos con validaciones dinámicas
  - Integración con servicios AWS
  - Y mucho más...

### 🔄 Generación de Tests Regresivos (Nueva Funcionalidad v2.0.0)
- **Configuración de múltiples pantallas**: Define el número de pantallas para crear tests regresivos completos
- **Editor de JSONs múltiples**: Pega los JSONs de cada pantalla en editores separados
- **Selector de acciones avanzado**: Selecciona acciones específicas de cada pantalla
- **Navegación entre pantallas**: Sistema de navegación con botones anterior/siguiente
- **Panel de acciones guardadas**: Visualiza y gestiona todas las acciones guardadas
- **Generación de tests completos**: Crea tests que cubren flujos completos de múltiples pantallas

### 🎨 Interfaz de Usuario Moderna
- **Aplicación de escritorio nativa**: Interfaz gráfica intuitiva y fácil de usar
- **Configuración flexible**: Permite personalizar la configuración de cada componente
- **Soporte para múltiples idiomas**: Configuración de idioma para labels y textos
- **Navegación fluida**: Sistema de pestañas y navegación intuitiva

## 🛠️ Instalación

### Requisitos Previos
- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### Pasos de Instalación

1. **Clonar el repositorio**:
```bash
git clone <url-del-repositorio>
cd Electron-Playwright
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Ejecutar la aplicación**:
```bash
npm start
```

## 📖 Guía de Uso

### Generación de Tests Individuales

1. **Cargar el JSON de la pantalla**:
   - Copia el JSON que representa la estructura de tu pantalla
   - Pégalo en el editor de la aplicación
   - La aplicación analizará automáticamente las acciones disponibles

2. **Seleccionar una acción**:
   - En la barra lateral, verás todas las acciones disponibles
   - Haz clic en la acción que quieres testear
   - Se abrirá el formulario de configuración específico

3. **Configurar el test**:
   - Completa los campos requeridos según el tipo de acción
   - Personaliza las opciones avanzadas si es necesario
   - Revisa la vista previa del test generado

4. **Generar el test**:
   - Haz clic en "Generar Test"
   - El código Playwright se generará automáticamente
   - Copia el código y úsalo en tu proyecto

### Generación de Tests Regresivos

1. **Configurar el número de pantallas**:
   - Selecciona el número de pantallas para tu test regresivo
   - La interfaz se adaptará automáticamente

2. **Cargar los JSONs de cada pantalla**:
   - Pega el JSON de cada pantalla en su editor correspondiente
   - Navega entre pantallas usando los botones anterior/siguiente

3. **Seleccionar acciones por pantalla**:
   - Para cada pantalla, selecciona las acciones que quieres incluir
   - Las acciones se guardarán automáticamente

4. **Generar el test regresivo**:
   - Revisa todas las acciones guardadas en el panel
   - Haz clic en "Generar Test Regresivo"
   - Se generará un test completo que cubre todas las pantallas

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
Electron-Playwright/
├── js/                          # Código JavaScript principal
│   ├── families/                # Generadores específicos de tests
│   ├── utils/                   # Utilidades y helpers
│   ├── app.js                   # Lógica principal de la aplicación
│   ├── sidebar.js               # Gestión de la barra lateral
│   └── baseTestGenerator.js     # Clase base para generadores
├── server.js                    # Servidor Express para gestión de archivos
├── main.js                      # Punto de entrada de Electron
├── index.html                   # Interfaz principal
├── index.css                    # Estilos de la aplicación
└── package.json                 # Configuración del proyecto
```

### Componentes Principales

#### Frontend (Electron)
- **`main.js`**: Configuración de la ventana principal de Electron
- **`index.html`**: Interfaz de usuario principal
- **`index.css`**: Estilos y diseño de la aplicación
- **`js/app.js`**: Lógica principal de la aplicación
- **`js/sidebar.js`**: Gestión de la barra lateral y navegación

#### Backend (Express.js)
- **`server.js`**: Servidor para gestión de archivos JSON
- **Endpoints principales**: `/model-json`, `/upload-model`
- **Endpoints regresivos**: `/clear-regressive`, `/upload-regressive`, `/regressive-json`

#### Generadores de Tests
- **`js/baseTestGenerator.js`**: Clase base para todos los generadores
- **`js/families/`**: Generadores específicos para cada tipo de acción
  - `testGeneratorDialog.js`: Diálogos simples
  - `testGeneratorExport.js`: Exportación de datos
  - `testGeneratorOpenAttachment.js`: Apertura de adjuntos
  - `testGeneratorRemoveAttachment.js`: Eliminación de adjuntos
  - `testGeneratorAudit.js`: Auditoría
  - `testGeneratorAWS.js`: Integración AWS
  - `testGeneratorRegressive.js`: Tests regresivos
  - Y más...

## 🔧 Tecnologías Utilizadas

### Frontend
- **Electron**: Framework para aplicaciones de escritorio multiplataforma
- **HTML5/CSS3**: Interfaz de usuario moderna y responsiva
- **JavaScript ES6+**: Lógica de la aplicación
- **Font Awesome**: Iconografía de la interfaz

### Backend
- **Express.js**: Servidor web para gestión de archivos
- **CORS**: Configuración para comunicación entre frontend y backend
- **Node.js**: Runtime de JavaScript

### Herramientas de Desarrollo
- **ESLint**: Linting y validación de código
- **Electron Builder**: Empaquetado de la aplicación
- **GitHub Actions**: CI/CD pipeline

## 📚 Documentación Adicional

### API Endpoints
Para información detallada sobre los endpoints del servidor y su uso, consulta el archivo [`API-ENDPOINTS-README.md`](./API-ENDPOINTS-README.md).

### CI/CD Pipeline
Para más detalles sobre el pipeline de integración y despliegue continuo, consulta el archivo [`CI-CD-README.md`](./CI-CD-README.md).

### Changelog
Para ver el historial de cambios y nuevas funcionalidades, consulta el archivo [`CHANGELOG.md`](./CHANGELOG.md).

## 🎯 Casos de Uso

### Tests Individuales
- **Formularios de creación/edición**: Tests para diálogos con campos de entrada
- **Exportación de datos**: Tests para funcionalidades de exportación
- **Gestión de archivos**: Tests para apertura y eliminación de adjuntos
- **Auditoría**: Tests para funcionalidades de logging y auditoría
- **Integración AWS**: Tests para servicios cloud

### Tests Regresivos
- **Flujos completos**: Tests que cubren múltiples pantallas
- **Navegación**: Tests de navegación entre diferentes secciones
- **Procesos complejos**: Tests de procesos que involucran múltiples pasos
- **Validación de integridad**: Tests que verifican la consistencia de datos

## 🚀 Scripts Disponibles

```bash
# Ejecutar la aplicación en modo desarrollo
npm start

# Empaquetar la aplicación para distribución
npm run pack

# Construir la aplicación para distribución
npm run dist

# Construir iconos de la aplicación
npm run build-icons

# Ejecutar linting del código
npm run lint

# Corregir errores de linting automáticamente
npm run lint:fix

# Ejecutar tests básicos
npm test
```

## 🔒 Licencia

Este proyecto está protegido por una licencia propietaria restrictiva. Todos los derechos están reservados para **Paula Romera Garzón**. No se permite el uso, distribución, modificación o comercialización del código sin autorización expresa.

## 👨‍💻 Autor

**Paula Romera Garzón**

---
