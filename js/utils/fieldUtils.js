/*
 * Utilidades para manejo de campos (incluir/no incluir en test)
 * Proporciona funcionalidades reutilizables para gestionar campos de formulario
 * que pueden ser habilitados o deshabilitados en los generadores de test
 */

/**
 * Clase que proporciona utilidades para el manejo de campos de formulario
 */
export class FieldUtils {
    /**
     * Constructor de las utilidades de campos
     * @param {Object} app - Referencia a la aplicación principal
     */
    constructor(app) {
      this.app = app // Guardar referencia a la aplicación principal
    }
  
    /**
     * Configura controles masivos (Activar Todos / Desactivar Todos)
     * @param {string} enableAllId - ID del botón "Activar Todos"
     * @param {string} disableAllId - ID del botón "Desactivar Todos"
     * @param {string} fieldSelector - Selector CSS para los campos afectados
     * @param {Function} updateCallback - Función a llamar después de actualizar
     */
    setupBulkControls(enableAllId, disableAllId, fieldSelector, updateCallback) {
      // Obtener referencias a los botones de control masivo
      const enableAllBtn = document.getElementById(enableAllId)
      const disableAllBtn = document.getElementById(disableAllId)
  
      // Configurar botón "Activar Todos"
      if (enableAllBtn) {
        enableAllBtn.addEventListener("click", () => {
          // Seleccionar todos los checkboxes y marcarlos como activos
          document.querySelectorAll(fieldSelector).forEach((checkbox) => {
            checkbox.checked = true
            this.toggleFieldState(checkbox) // Actualizar estado visual
          })
          updateCallback() // Llamar función de actualización
        })
      }
  
      // Configurar botón "Desactivar Todos"
      if (disableAllBtn) {
        disableAllBtn.addEventListener("click", () => {
          // Seleccionar todos los checkboxes y desmarcarlos
          document.querySelectorAll(fieldSelector).forEach((checkbox) => {
            checkbox.checked = false
            this.toggleFieldState(checkbox) // Actualizar estado visual
          })
          updateCallback() // Llamar función de actualización
        })
      }
    }
  
    /**
     * Configura listeners para campos individuales (toggles de habilitar/deshabilitar)
     * @param {string} fieldSelector - Selector CSS para los campos
     * @param {Function} updateCallback - Función a llamar después de actualizar
     */
    setupFieldToggleListeners(fieldSelector, updateCallback) {
      // Configurar listener para cada checkbox de campo
      document.querySelectorAll(fieldSelector).forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          this.toggleFieldState(checkbox) // Actualizar estado visual del campo
          updateCallback() // Llamar función de actualización
          // Resaltar la ruta JSON correspondiente si existe
          if (checkbox.hasAttribute("data-json-path")) {
            this.app.jsonUtils.highlightJsonPath(checkbox.getAttribute("data-json-path"))
          }
        })
      })
    }
  
    /**
     * Alterna el estado visual del campo (habilitado/deshabilitado)
     * @param {HTMLElement} checkbox - El checkbox que controla el campo
     */
    toggleFieldState(checkbox) {
      // Obtener la clave del campo removiendo el prefijo "enable-"
      const fieldKey = checkbox.id.replace("enable-", "")
      // Obtener referencias a los elementos del campo
      const fieldGroup = document.getElementById(`field-${fieldKey}`)
      const controls = document.getElementById(`controls-${fieldKey}`)
  
      // Verificar que los elementos existan antes de modificarlos
      if (fieldGroup && controls) {
        if (checkbox.checked) {
          // Campo habilitado: remover clase de deshabilitado y restaurar interactividad
          fieldGroup.classList.remove("field-disabled")
          controls.style.opacity = "1"
          controls.style.pointerEvents = "auto"
        } else {
          // Campo deshabilitado: agregar clase de deshabilitado y reducir interactividad
          fieldGroup.classList.add("field-disabled")
          controls.style.opacity = "0.5"
          controls.style.pointerEvents = "none"
        }
      }
    }
  
    /**
     * Configura listeners para valores de campos (inputs, selects, etc.)
     * @param {string} fieldSelector - Selector CSS para los campos de valor
     * @param {Function} updateCallback - Función a llamar después de actualizar
     */
    setupFieldValueListeners(fieldSelector, updateCallback) {
      // Configurar listeners para cada campo de valor
      document.querySelectorAll(fieldSelector).forEach((input) => {
        // Listener para evento 'input' (cambios en tiempo real)
        input.addEventListener("input", () => {
          updateCallback() // Actualizar vista previa
          // Resaltar la ruta JSON correspondiente si existe
          if (input.hasAttribute("data-json-path")) {
            this.app.jsonUtils.highlightJsonPath(input.getAttribute("data-json-path"))
          }
        })
        // Listener para evento 'change' (cambios confirmados)
        input.addEventListener("change", () => {
          updateCallback() // Actualizar vista previa
          // Resaltar la ruta JSON correspondiente si existe
          if (input.hasAttribute("data-json-path")) {
            this.app.jsonUtils.highlightJsonPath(input.getAttribute("data-json-path"))
          }
        })
      })
    }
  
    /**
     * Obtiene el estado de un campo específico (habilitado/deshabilitado)
     * @param {string} fieldKey - Clave del campo a verificar
     * @returns {boolean} true si el campo está habilitado, false en caso contrario
     */
    getFieldState(fieldKey) {
      const checkbox = document.getElementById(`enable-${fieldKey}`)
      return checkbox ? checkbox.checked : false
    }
  
    /**
     * Obtiene el valor de un campo específico
     * @param {string} fieldKey - Clave del campo (no utilizada actualmente)
     * @param {string} inputId - ID del input del cual obtener el valor
     * @returns {string} El valor del campo o cadena vacía si no existe
     */
    getFieldValue(fieldKey, inputId) {
      const input = document.getElementById(inputId)
      return input ? input.value : ""
    }
  
    /**
     * Configura el estado inicial de todos los campos especificados
     * @param {string} fieldSelector - Selector CSS para los campos a inicializar
     */
    initializeFieldStates(fieldSelector) {
      // Aplicar el estado inicial a cada checkbox encontrado
      document.querySelectorAll(fieldSelector).forEach((checkbox) => {
        this.toggleFieldState(checkbox)
      })
    }
  }
  