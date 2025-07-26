# CI/CD Pipeline para Electron-Playwright

Este repositorio incluye un pipeline de Integración y Despliegue Continuo (CI/CD) basado en GitHub Actions, diseñado para automatizar la calidad, construcción, pruebas y publicación de la aplicación Electron-Playwright en múltiples plataformas.

## ¿Qué hace este workflow?

- **Lint y verificación de sintaxis:** Asegura que el código JavaScript y los archivos JSON cumplen con los estándares de calidad y formato.
- **Build multiplataforma:** Compila y empaqueta la aplicación para Linux, Windows y macOS.
- **Ejecución de tests:** Verifica la sintaxis de los archivos principales y ejecuta pruebas básicas.
- **Empaquetado y subida de artefactos:** Genera archivos ZIP con los builds de cada plataforma y los sube como artefactos.
- **Release automático:** Crea un release en GitHub con los builds y el changelog extraído de `CHANGELOG.md`.

## ¿Cuándo se ejecuta?

- En cada push o pull request a la rama `master`.
- El job de release solo se ejecuta en pushes directos a `master`.

## Estructura de los jobs

1. **lint**  
   - Instala dependencias.
   - Convierte saltos de línea a LF.
   - Ejecuta ESLint (con y sin fix).
   - Verifica sintaxis de archivos JS y formato de archivos JSON.
   - Comprueba la estructura básica del proyecto.

2. **build-linux, build-windows, build-macos**  
   - Instalan dependencias y construyen la aplicación para cada sistema operativo.
   - Ejecutan la app brevemente para verificar que inicia.
   - Empaquetan el resultado en un archivo ZIP nombrado con la versión.
   - Suben el artefacto generado.

3. **test**  
   - Verifica la sintaxis de los archivos principales y de todos los scripts JS.

4. **release**  
   - Solo en pushes a `master`.
   - Lee la versión desde `package.json`.
   - Crea un tag de versión.
   - Empaqueta el código fuente (excluyendo node_modules, dist, .git, etc).
   - Descarga los builds de cada plataforma.
   - Lee el changelog desde `CHANGELOG.md`.
   - Publica un release en GitHub con los artefactos y el changelog.

## Requisitos

- Tener configurado el secreto `GH_TOKEN` en el repositorio para permitir la subida de releases y artefactos.
- El archivo `CHANGELOG.md` debe estar actualizado para que el release incluya las notas correctas.

## Archivos y artefactos generados

- `electron-app-linux-v<versión>.zip`
- `electron-app-windows-v<versión>.zip`
- `electron-app-macos-v<versión>.zip`
- `project-source-v<versión>.zip` (código fuente del proyecto)

## Personalización

Puedes modificar el archivo `.github/workflows/ci-cd.yml` para:
- Agregar nuevos pasos de validación o pruebas.
- Cambiar la lógica de empaquetado o publicación.
- Adaptar el pipeline a nuevas plataformas o requerimientos. 