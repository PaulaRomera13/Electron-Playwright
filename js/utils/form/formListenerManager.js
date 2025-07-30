// formListenerManager.js - Manejo de listeners de formularios
export class FormListenerManager {
  constructor(app) {
    this.app = app;
  }

  /**
   * Configura los listeners comunes para todos los formularios
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupCommonListeners(updatePreviewCallback) {
    // Obtener referencias a todos los elementos del formulario
    const inputs = document.querySelectorAll(".test-form input, .test-form select, .test-form textarea");
    const checkbox = document.getElementById("hideActionsButton");
    const hideConfig = document.getElementById("hideActionsButtonConfig");
    const arrowCheckbox = document.getElementById("addArrowConfig");
    const arrowConfigContainer = document.getElementById("arrowConfigContainer");

    // Establecer nombre del botón desde la acción seleccionada
    this.setButtonNameFromSelectedAction();

    // Configurar checkbox para ocultar botón de acciones
    this.setupHideActionsButtonListener(checkbox, hideConfig, updatePreviewCallback);

    // Configurar checkbox para configuración de flecha
    this.setupArrowConfigListener(arrowCheckbox, arrowConfigContainer, updatePreviewCallback);

    // Configurar listeners para todos los inputs del formulario
    this.setupInputListeners(inputs, updatePreviewCallback);
  }

  /**
   * Establece el nombre del botón desde la acción seleccionada
   */
  setButtonNameFromSelectedAction() {
    const selectedAction = this.app.getSelectedAction();
    if (selectedAction) {
      const buttonNameInput = document.getElementById("buttonName");
      if (buttonNameInput) {
        buttonNameInput.value = selectedAction.actionName;
      }
    }
  }

  /**
   * Configura el listener para el checkbox de ocultar botón de acciones
   */
  setupHideActionsButtonListener(checkbox, hideConfig, updatePreviewCallback) {
    if (checkbox) {
      checkbox.addEventListener("change", () => {
        // Mostrar/ocultar configuración adicional según el estado del checkbox
        if (hideConfig) {
          hideConfig.style.display = checkbox.checked ? "block" : "none";
        }
        updatePreviewCallback(); // Actualizar vista previa
        // Resaltar la ruta JSON correspondiente
        if (checkbox.hasAttribute("data-json-path")) {
          this.app.jsonUtils.highlightJsonPath(checkbox.getAttribute("data-json-path"));
        }
      });
    }
  }

  /**
   * Configura el listener para el checkbox de configuración de flecha
   */
  setupArrowConfigListener(arrowCheckbox, arrowConfigContainer, updatePreviewCallback) {
    if (arrowCheckbox) {
      arrowCheckbox.addEventListener("change", () => {
        // Mostrar/ocultar configuración de flecha según el estado del checkbox
        if (arrowConfigContainer) {
          arrowConfigContainer.style.display = arrowCheckbox.checked ? "block" : "none";
        }
        updatePreviewCallback(); // Actualizar vista previa
        // Resaltar la ruta JSON correspondiente
        if (arrowCheckbox.hasAttribute("data-json-path")) {
          this.app.jsonUtils.highlightJsonPath(arrowCheckbox.getAttribute("data-json-path"));
        }
      });
    }
  }

  /**
   * Configura listeners para todos los inputs del formulario
   */
  setupInputListeners(inputs, updatePreviewCallback) {
    inputs.forEach((input) => {
      // Evento 'input' para cambios en tiempo real
      input.addEventListener("input", () => {
        updatePreviewCallback(); // Actualizar vista previa
        this.highlightJsonPathIfExists(input);
      });
      
      // Evento 'change' para cambios confirmados
      input.addEventListener("change", () => {
        updatePreviewCallback(); // Actualizar vista previa
        this.highlightJsonPathIfExists(input);
      });
    });
  }

  /**
   * Resalta la ruta JSON si el elemento tiene el atributo data-json-path
   */
  highlightJsonPathIfExists(input) {
    if (input.hasAttribute("data-json-path")) {
      this.app.jsonUtils.highlightJsonPath(input.getAttribute("data-json-path"));
    }
  }

  /**
   * Configura listeners personalizados para elementos específicos
   * @param {Object} config - Configuración de listeners
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupCustomListeners(config, updatePreviewCallback) {
    if (config.listeners && Array.isArray(config.listeners)) {
      config.listeners.forEach(listenerConfig => {
        const element = document.getElementById(listenerConfig.elementId);
        if (element) {
          element.addEventListener(listenerConfig.event, (event) => {
            if (listenerConfig.handler) {
              listenerConfig.handler(event, this.app);
            }
            updatePreviewCallback();
          });
        }
      });
    }
  }

  /**
   * Configura listeners para campos de tipo radio
   * @param {string} name - Nombre del grupo de radio buttons
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupRadioListeners(name, updatePreviewCallback) {
    const radios = document.getElementsByName(name);
    radios.forEach(radio => {
      radio.addEventListener("change", () => {
        updatePreviewCallback();
      });
    });
  }

  /**
   * Configura listeners para campos de tipo checkbox
   * @param {string} checkboxId - ID del checkbox
   * @param {string} targetId - ID del elemento a mostrar/ocultar
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupCheckboxToggleListener(checkboxId, targetId, updatePreviewCallback) {
    const checkbox = document.getElementById(checkboxId);
    const target = document.getElementById(targetId);
    
    if (checkbox && target) {
      checkbox.addEventListener("change", () => {
        target.style.display = checkbox.checked ? "block" : "none";
        updatePreviewCallback();
      });
    }
  }

  /**
   * Limpia todos los listeners registrados
   * @param {Array} elements - Array de elementos a limpiar
   */
  cleanupListeners(elements) {
    if (elements && Array.isArray(elements)) {
      elements.forEach(element => {
        if (element && element.removeEventListener) {
          // En una implementación más avanzada, aquí se limpiarían
          // todos los event listeners registrados
        }
      });
    }
  }

  /**
   * Configura listeners para validación en tiempo real
   * @param {Object} validationConfig - Configuración de validación
   */
  setupValidationListeners(validationConfig) {
    if (validationConfig.fields && Array.isArray(validationConfig.fields)) {
      validationConfig.fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
          element.addEventListener("input", () => {
            this.validateField(element, field.rules);
          });
          
          element.addEventListener("blur", () => {
            this.validateField(element, field.rules);
          });
        }
      });
    }
  }

  /**
   * Valida un campo específico
   * @param {HTMLElement} element - Elemento a validar
   * @param {Object} rules - Reglas de validación
   */
  validateField(element, rules) {
    if (!rules) return;

    const value = element.value;
    let isValid = true;
    let errorMessage = '';

    // Validación de requerido
    if (rules.required && !value.trim()) {
      isValid = false;
      errorMessage = 'Este campo es requerido';
    }

    // Validación de longitud mínima
    if (rules.minLength && value.length < rules.minLength) {
      isValid = false;
      errorMessage = `Mínimo ${rules.minLength} caracteres`;
    }

    // Validación de longitud máxima
    if (rules.maxLength && value.length > rules.maxLength) {
      isValid = false;
      errorMessage = `Máximo ${rules.maxLength} caracteres`;
    }

    // Validación de patrón
    if (rules.pattern && !rules.pattern.test(value)) {
      isValid = false;
      errorMessage = rules.patternMessage || 'Formato inválido';
    }

    // Aplicar resultado de validación
    this.applyValidationResult(element, isValid, errorMessage);
  }

  /**
   * Aplica el resultado de la validación al elemento
   * @param {HTMLElement} element - Elemento a modificar
   * @param {boolean} isValid - Si la validación es exitosa
   * @param {string} errorMessage - Mensaje de error
   */
  applyValidationResult(element, isValid, errorMessage) {
    // Remover clases de validación previas
    element.classList.remove('valid', 'invalid');
    
    // Aplicar clase correspondiente
    element.classList.add(isValid ? 'valid' : 'invalid');
    
    // Mostrar/ocultar mensaje de error
    let errorElement = element.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      element.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = isValid ? '' : errorMessage;
    errorElement.style.display = isValid ? 'none' : 'block';
  }
} 