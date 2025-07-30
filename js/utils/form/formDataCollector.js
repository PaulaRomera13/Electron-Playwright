// formDataCollector.js - Recopilación de datos de formularios
export class FormDataCollector {
  constructor() {}

  /**
   * Recopila los datos comunes del formulario
   * @returns {Object} Objeto con los datos comunes del formulario
   */
  getCommonFormData() {
    const checkbox = document.getElementById("hideActionsButton");
    const arrowCheckbox = document.getElementById("addArrowConfig");

    return {
      processName: this.getInputValue("processName"),
      menuOption: this.getInputValue("menuOption"),
      selectName: this.getInputValue("selectName"),
      positionButton: this.getInputValue("positionButton", "0"),
      positionSelectElement: this.getInputValue("positionSelectElement", "0"),
      hideActionsButton: checkbox ? checkbox.checked : false,
      hideActionsButtonLocator: this.getInputValue("hideActionsButtonLocator"),
      hideActionsButtonPosition: this.getInputValue("hideActionsButtonPosition", "0"),
      addArrowConfig: arrowCheckbox ? arrowCheckbox.checked : false,
      arrowDirection: this.getInputValue("arrowDirection", "down"),
      positionArrow: this.getInputValue("positionArrow", "0"),
      textInNotif1: this.getInputValue("textInNotif1"),
      textInNotif2: this.getInputValue("textInNotif2"),
      textInNotif3: this.getInputValue("textInNotif3"),
    };
  }

  /**
   * Obtiene el valor de un input de forma segura
   * @param {string} inputId - ID del input
   * @param {string} defaultValue - Valor por defecto si no existe el input
   * @returns {string} Valor del input o valor por defecto
   */
  getInputValue(inputId, defaultValue = "") {
    const input = document.getElementById(inputId);
    return input ? input.value : defaultValue;
  }

  /**
   * Obtiene el valor de un checkbox
   * @param {string} checkboxId - ID del checkbox
   * @param {boolean} defaultValue - Valor por defecto
   * @returns {boolean} Estado del checkbox
   */
  getCheckboxValue(checkboxId, defaultValue = false) {
    const checkbox = document.getElementById(checkboxId);
    return checkbox ? checkbox.checked : defaultValue;
  }

  /**
   * Obtiene el valor de un select
   * @param {string} selectId - ID del select
   * @param {string} defaultValue - Valor por defecto
   * @returns {string} Valor seleccionado
   */
  getSelectValue(selectId, defaultValue = "") {
    const select = document.getElementById(selectId);
    return select ? select.value : defaultValue;
  }

  /**
   * Obtiene el valor de un radio button
   * @param {string} name - Nombre del grupo de radio buttons
   * @param {string} defaultValue - Valor por defecto
   * @returns {string} Valor seleccionado
   */
  getRadioValue(name, defaultValue = "") {
    const radios = document.getElementsByName(name);
    for (let radio of radios) {
      if (radio.checked) {
        return radio.value;
      }
    }
    return defaultValue;
  }

  /**
   * Recopila datos de campos personalizados
   * @param {Array} fieldIds - Array de IDs de campos a recopilar
   * @returns {Object} Objeto con los datos de los campos personalizados
   */
  getCustomFormData(fieldIds) {
    const data = {};
    
    if (fieldIds && Array.isArray(fieldIds)) {
      fieldIds.forEach(fieldId => {
        data[fieldId] = this.getInputValue(fieldId);
      });
    }
    
    return data;
  }

  /**
   * Recopila datos de campos con validación
   * @param {Object} validationConfig - Configuración de validación
   * @returns {Object} Objeto con los datos y estado de validación
   */
  getValidatedFormData(validationConfig) {
    const data = {};
    const validation = {
      isValid: true,
      errors: {}
    };

    if (validationConfig.fields && Array.isArray(validationConfig.fields)) {
      validationConfig.fields.forEach(field => {
        const value = this.getInputValue(field.id);
        data[field.id] = value;
        
        // Validar campo
        const fieldValidation = this.validateFieldValue(value, field.rules);
        if (!fieldValidation.isValid) {
          validation.isValid = false;
          validation.errors[field.id] = fieldValidation.errorMessage;
        }
      });
    }

    return { data, validation };
  }

  /**
   * Valida un valor de campo según las reglas especificadas
   * @param {string} value - Valor a validar
   * @param {Object} rules - Reglas de validación
   * @returns {Object} Resultado de la validación
   */
  validateFieldValue(value, rules) {
    const result = {
      isValid: true,
      errorMessage: ''
    };

    if (!rules) return result;

    // Validación de requerido
    if (rules.required && !value.trim()) {
      result.isValid = false;
      result.errorMessage = 'Este campo es requerido';
      return result;
    }

    // Validación de longitud mínima
    if (rules.minLength && value.length < rules.minLength) {
      result.isValid = false;
      result.errorMessage = `Mínimo ${rules.minLength} caracteres`;
      return result;
    }

    // Validación de longitud máxima
    if (rules.maxLength && value.length > rules.maxLength) {
      result.isValid = false;
      result.errorMessage = `Máximo ${rules.maxLength} caracteres`;
      return result;
    }

    // Validación de patrón
    if (rules.pattern && !rules.pattern.test(value)) {
      result.isValid = false;
      result.errorMessage = rules.patternMessage || 'Formato inválido';
      return result;
    }

    // Validación de rango numérico
    if (rules.min !== undefined && parseFloat(value) < rules.min) {
      result.isValid = false;
      result.errorMessage = `Valor mínimo: ${rules.min}`;
      return result;
    }

    if (rules.max !== undefined && parseFloat(value) > rules.max) {
      result.isValid = false;
      result.errorMessage = `Valor máximo: ${rules.max}`;
      return result;
    }

    return result;
  }

  /**
   * Recopila datos de campos con transformación
   * @param {Object} transformConfig - Configuración de transformación
   * @returns {Object} Objeto con los datos transformados
   */
  getTransformedFormData(transformConfig) {
    const data = {};
    
    if (transformConfig.fields && Array.isArray(transformConfig.fields)) {
      transformConfig.fields.forEach(field => {
        let value = this.getInputValue(field.id);
        
        // Aplicar transformaciones
        if (field.transform) {
          value = this.applyTransform(value, field.transform);
        }
        
        data[field.id] = value;
      });
    }
    
    return data;
  }

  /**
   * Aplica una transformación a un valor
   * @param {string} value - Valor a transformar
   * @param {Object} transform - Configuración de transformación
   * @returns {string} Valor transformado
   */
  applyTransform(value, transform) {
    let transformedValue = value;

    // Transformación a mayúsculas
    if (transform.toUpperCase) {
      transformedValue = transformedValue.toUpperCase();
    }

    // Transformación a minúsculas
    if (transform.toLowerCase) {
      transformedValue = transformedValue.toLowerCase();
    }

    // Transformación de trim
    if (transform.trim) {
      transformedValue = transformedValue.trim();
    }

    // Transformación de reemplazo
    if (transform.replace) {
      transformedValue = transformedValue.replace(transform.replace.pattern, transform.replace.replacement);
    }

    // Transformación de formato
    if (transform.format) {
      transformedValue = this.formatValue(transformedValue, transform.format);
    }

    return transformedValue;
  }

  /**
   * Formatea un valor según el formato especificado
   * @param {string} value - Valor a formatear
   * @param {string} format - Formato a aplicar
   * @returns {string} Valor formateado
   */
  formatValue(value, format) {
    switch (format) {
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
        return value;
    }
  }

  /**
   * Recopila todos los datos del formulario de una vez
   * @param {Object} config - Configuración completa del formulario
   * @returns {Object} Objeto con todos los datos del formulario
   */
  getAllFormData(config = {}) {
    const commonData = this.getCommonFormData();
    const customData = this.getCustomFormData(config.customFields);
    const transformedData = this.getTransformedFormData(config.transformConfig);
    
    return {
      ...commonData,
      ...customData,
      ...transformedData
    };
  }
} 