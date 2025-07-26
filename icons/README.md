# Iconos de la Aplicación

Esta carpeta contiene todos los iconos utilizados por la aplicación Electron para generar tests de Playwright.

## Iconos disponibles

### Iconos principales
- **`icon.png`** - Icono principal de la aplicación (formato PNG)
- **`icon.ico`** - Icono para Windows (formato ICO)
- **`icon.icns`** - Icono para macOS (formato ICNS)

### Iconos en diferentes tamaños
La aplicación incluye iconos optimizados para diferentes resoluciones:

- **`16x16.png`** - Icono pequeño (16x16 píxeles)
- **`24x24.png`** - Icono pequeño-mediano (24x24 píxeles)
- **`32x32.png`** - Icono mediano (32x32 píxeles)
- **`48x48.png`** - Icono mediano-grande (48x48 píxeles)
- **`64x64.png`** - Icono grande (64x64 píxeles)
- **`128x128.png`** - Icono extra grande (128x128 píxeles)
- **`512x512.png`** - Icono muy grande (512x512 píxeles)
- **`1024x1024.png`** - Icono máximo (1024x1024 píxeles)

## Uso en la aplicación

### Configuración en package.json
Los iconos se configuran en el archivo `package.json` para diferentes plataformas:

```json
"build": {
  "win": {
    "icon": "icons/icon.ico"
  },
  "mac": {
    "icon": "icons/icon.icns"
  },
  "linux": {
    "icon": "icons/icon.png"
  }
}
```

### Generación automática
Los iconos se pueden generar automáticamente usando el script:

```bash
npm run build-icons
```

Este comando utiliza `electron-icon-builder` para generar todos los tamaños necesarios a partir del icono principal.

## Formatos soportados

- **PNG**: Formato estándar para la mayoría de plataformas
- **ICO**: Formato específico para Windows
- **ICNS**: Formato específico para macOS

## Optimización

Los iconos están optimizados para:
- **Tamaño de archivo**: Compresión eficiente sin pérdida de calidad
- **Escalabilidad**: Mantienen la calidad en diferentes tamaños
- **Compatibilidad**: Funcionan correctamente en todas las plataformas soportadas

## Personalización

Para cambiar los iconos de la aplicación:

1. Reemplazar el archivo `icon.png` principal
2. Ejecutar `npm run build-icons` para regenerar todos los tamaños
3. Los nuevos iconos se usarán automáticamente en la siguiente compilación

## Notas técnicas

- Los iconos se empaquetan con la aplicación usando `electron-builder`
- Se incluyen como recursos extra en el build final
- El formato ICO es requerido para Windows
- El formato ICNS es requerido para macOS
- PNG se usa como fallback para Linux y otras plataformas 