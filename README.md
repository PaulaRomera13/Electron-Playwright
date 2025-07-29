# Generador de Tests Playwright

## Descripción

Esta aplicación Electron permite generar tests de Playwright de manera rápida y eficiente. La aplicación analiza un JSON que representa la estructura de una pantalla y genera automáticamente los tests correspondientes para todas las acciones y botones de fila (row_buttons) disponibles.

## Características principales

### Crear Test Individuales:
- **Análisis de JSON**: Copia y pega el JSON de cualquier pantalla para analizar su estructura
- **Generación automática de tests**: Crea tests de Playwright basados en las acciones disponibles
- **Soporte para múltiples tipos de acciones**: 
  - Diálogos simples y complejos
  - Exportación de datos
  - Apertura de archivos adjuntos
  - Eliminación de archivos adjuntos
  - Auditoría
  - Objetos reactivos
  - Y más...
- **Interfaz intuitiva**: Aplicación de escritorio con interfaz gráfica fácil de usar
- **Configuración flexible**: Permite personalizar la configuración de cada componente


### Crear Test Regresivos:
- **Configuración de múltiples pantallas**: Define el número de pantallas para tu test regresivo
- **Editor de JSONs múltiples**: Pega los JSONs de cada pantalla en editores separados
- **Selector de acciones avanzado**: Selecciona acciones específicas de cada pantalla
- **Navegación entre pantallas**: Sistema de navegación con botones anterior/siguiente
- **Panel de acciones guardadas**: Visualiza y gestiona todas las acciones guardadas
- **Generación de tests completos**: Crea tests que cubren flujos completos de múltiples pantallas.

## Instalación

```bash
npm install
```

## Uso

```bash
npm start
```


## Tecnologías utilizadas

- **Electron**: Framework para aplicaciones de escritorio
- **Express**: Servidor web (para funcionalidades adicionales)
- **Font Awesome**: Iconos de la interfaz.


## Documentación de la API

Para información detallada sobre los endpoints del servidor y su uso, consulta el archivo [`API-ENDPOINTS-README.md`](./API-ENDPOINTS-README.md).


## Autor

Paula Romera Garzón

## Licencia

Este proyecto está protegido por una licencia propietaria restrictiva. Todos los derechos están reservados para Paula Romera Garzón. No se permite el uso, distribución, modificación o comercialización del código sin autorización expresa.


## Documentación del CI/CD

Para más detalles sobre el pipeline de integración y despliegue continuo (CI/CD), consulta el archivo [`CI-CD-README.md`](./CI-CD-README.md) en la raíz del repositorio.
