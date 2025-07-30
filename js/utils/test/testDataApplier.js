// testDataApplier.js - Aplicación de datos a plantillas de test
export class TestDataApplier {
  constructor(app) {
    this.app = app;
  }

  /**
   * Aplica los datos comunes a la plantilla de test
   * @param {Object} testData - Objeto de datos de test a modificar
   * @param {Object} formData - Datos del formulario
   */
  applyCommonTestData(testData, formData) {
    // Establecer valores comunes para todos los modos (desktop, mobile, tablet)
    const modes = ["desktopMode", "mobileMode", "tabletRetratoMode"];
    modes.forEach((mode) => {
      testData[mode].label = formData.processName;
      testData[mode].view = formData.processName;
      testData[mode].viewScreenShotLabel = formData.processName;
      testData[mode].screenShotName = formData.menuOption;
    });

    // Establecer etiqueta específica del modo móvil (con punto al inicio)
    testData.mobileMode.label = `.${formData.processName.toLowerCase()}`;

    // Establecer nombre del botón desde la acción seleccionada
    const selectedAction = this.app.getSelectedAction();
    if (selectedAction) {
      testData.buttonName = selectedAction.actionName;
    }

    // Establecer datos básicos del formulario
    testData.selectName = formData.selectName;
    testData.textInNotif1 = formData.textInNotif1;
    testData.textInNotif2 = formData.textInNotif2;
    testData.textInNotif3 = formData.textInNotif3;
    testData.positionButton = formData.positionButton;
    testData.positionSelectElement = formData.positionSelectElement;

    // Agregar configuración de botón de acciones ocultas si está habilitado
    if (formData.hideActionsButton) {
      testData.hideActionsButton = {
        locator: formData.hideActionsButtonLocator,
        position: formData.hideActionsButtonPosition,
      };
    }

    // Agregar configuración de flecha si está habilitado
    if (formData.addArrowConfig) {
      testData.arrowDirection = formData.arrowDirection;
      testData.positionArrow = formData.positionArrow;
    } else {
      // Eliminar configuración de flecha si no está habilitado
      delete testData.arrowDirection;
      delete testData.positionArrow;
      delete testData.screenShotsArrow;
    }
  }

  /**
   * Aplica datos personalizados a la plantilla de test
   * @param {Object} testData - Objeto de datos de test a modificar
   * @param {Object} customData - Datos personalizados
   * @param {Object} config - Configuración de aplicación
   */
  applyCustomTestData(testData, customData, config = {}) {
    if (!customData || !config.fieldMappings) return;

    config.fieldMappings.forEach(mapping => {
      if (customData[mapping.sourceField] !== undefined) {
        this.setNestedValue(testData, mapping.targetPath, customData[mapping.sourceField]);
      }
    });
  }

  /**
   * Establece un valor en una ruta anidada del objeto
   * @param {Object} obj - Objeto a modificar
   * @param {string} path - Ruta anidada (ej: "desktopMode.label")
   * @param {*} value - Valor a establecer
   */
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  /**
   * Aplica datos de validación a la plantilla de test
   * @param {Object} testData - Objeto de datos de test a modificar
   * @param {Object} validationData - Datos de validación
   */
  applyValidationData(testData, validationData) {
    if (validationData.isValid === false) {
      testData.validationErrors = validationData.errors;
    }
  }

  /**
   * Aplica datos transformados a la plantilla de test
   * @param {Object} testData - Objeto de datos de test a modificar
   * @param {Object} transformedData - Datos transformados
   * @param {Object} transformConfig - Configuración de transformación
   */
  applyTransformedData(testData, transformedData, transformConfig) {
    if (!transformedData || !transformConfig.fieldMappings) return;

    transformConfig.fieldMappings.forEach(mapping => {
      if (transformedData[mapping.sourceField] !== undefined) {
        const value = this.applyTransformToValue(transformedData[mapping.sourceField], mapping.transform);
        this.setNestedValue(testData, mapping.targetPath, value);
      }
    });
  }

  /**
   * Aplica una transformación a un valor
   * @param {*} value - Valor a transformar
   * @param {Object} transform - Configuración de transformación
   * @returns {*} Valor transformado
   */
  applyTransformToValue(value, transform) {
    if (!transform) return value;

    let transformedValue = value;

    // Transformación de tipo
    if (transform.type) {
      transformedValue = this.convertType(transformedValue, transform.type);
    }

    // Transformación de formato
    if (transform.format) {
      transformedValue = this.formatValue(transformedValue, transform.format);
    }

    // Transformación de función personalizada
    if (transform.function) {
      transformedValue = this.applyCustomFunction(transformedValue, transform.function);
    }

    return transformedValue;
  }

  /**
   * Convierte un valor a un tipo específico
   * @param {*} value - Valor a convertir
   * @param {string} type - Tipo de destino
   * @returns {*} Valor convertido
   */
  convertType(value, type) {
    switch (type) {
      case 'string':
        return String(value);
      case 'number':
        return parseFloat(value) || 0;
      case 'boolean':
        return Boolean(value);
      case 'integer':
        return parseInt(value) || 0;
      case 'array':
        return Array.isArray(value) ? value : [value];
      case 'object':
        return typeof value === 'object' ? value : { value };
      default:
        return value;
    }
  }

  /**
   * Formatea un valor según el formato especificado
   * @param {*} value - Valor a formatear
   * @param {string} format - Formato a aplicar
   * @returns {string} Valor formateado
   */
  formatValue(value, format) {
    switch (format) {
      case 'uppercase':
        return String(value).toUpperCase();
      case 'lowercase':
        return String(value).toLowerCase();
      case 'capitalize':
        return String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase();
      case 'currency':
        return parseFloat(value).toFixed(2);
      case 'percentage':
        return `${parseFloat(value).toFixed(2)}%`;
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'time':
        return new Date(value).toLocaleTimeString();
      case 'datetime':
        return new Date(value).toLocaleString();
      default:
        return String(value);
    }
  }

  /**
   * Aplica una función personalizada a un valor
   * @param {*} value - Valor a procesar
   * @param {string} functionName - Nombre de la función
   * @returns {*} Valor procesado
   */
  applyCustomFunction(value, functionName) {
    switch (functionName) {
      case 'trim':
        return String(value).trim();
      case 'reverse':
        return String(value).split('').reverse().join('');
      case 'slugify':
        return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      case 'camelCase':
        return String(value).replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
      case 'snakeCase':
        return String(value).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      default:
        return value;
    }
  }

  /**
   * Aplica todos los datos a la plantilla de test
   * @param {Object} testData - Objeto de datos de test a modificar
   * @param {Object} formData - Datos del formulario
   * @param {Object} config - Configuración completa
   */
  applyAllTestData(testData, formData, config = {}) {
    // Aplicar datos comunes
    this.applyCommonTestData(testData, formData);

    // Aplicar datos personalizados si existen
    if (config.customData) {
      this.applyCustomTestData(testData, config.customData, config);
    }

    // Aplicar datos de validación si existen
    if (config.validationData) {
      this.applyValidationData(testData, config.validationData);
    }

    // Aplicar datos transformados si existen
    if (config.transformedData) {
      this.applyTransformedData(testData, config.transformedData, config);
    }

    // Aplicar datos específicos del tipo de test
    if (config.testType && config.testTypeHandlers && config.testTypeHandlers[config.testType]) {
      config.testTypeHandlers[config.testType](testData, formData, this.app);
    }
  }

  /**
   * Valida que los datos aplicados sean correctos
   * @param {Object} testData - Datos de test a validar
   * @returns {Object} Resultado de la validación
   */
  validateAppliedData(testData) {
    const validation = {
      isValid: true,
      errors: []
    };

    // Validar campos requeridos
    const requiredFields = [
      'buttonName',
      'desktopMode.label',
      'desktopMode.screenShotName'
    ];

    requiredFields.forEach(field => {
      const value = this.getNestedValue(testData, field);
      if (!value || value.trim() === '') {
        validation.isValid = false;
        validation.errors.push(`Campo requerido faltante: ${field}`);
      }
    });

    // Validar tipos de datos
    if (testData.positionButton && isNaN(parseInt(testData.positionButton))) {
      validation.isValid = false;
      validation.errors.push('positionButton debe ser un número');
    }

    if (testData.positionSelectElement && isNaN(parseInt(testData.positionSelectElement))) {
      validation.isValid = false;
      validation.errors.push('positionSelectElement debe ser un número');
    }

    return validation;
  }

  /**
   * Obtiene un valor de una ruta anidada del objeto
   * @param {Object} obj - Objeto a consultar
   * @param {string} path - Ruta anidada
   * @returns {*} Valor encontrado
   */
  getNestedValue(obj, path) {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    
    return current;
  }
} 