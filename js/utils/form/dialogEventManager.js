// dialogEventManager.js - Manejo de eventos del formulario de diálogo
export class DialogEventManager {
  constructor(app) {
    this.app = app;
  }

  /**
   * Configura todos los listeners del formulario de diálogo
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupListeners(updatePreviewCallback) {
    this.setupCommonListeners(updatePreviewCallback);
    this.setupBulkControlsListeners(updatePreviewCallback);
    this.setupFieldToggleListeners(updatePreviewCallback);
    this.setupConfigListeners(updatePreviewCallback);
    this.setupDynamicLinkedListsListeners(updatePreviewCallback);
    this.setupObjectByTabsListeners(updatePreviewCallback);
    
    // Actualizar vista previa inicial
    updatePreviewCallback();
  }

  /**
   * Configura los listeners comunes para todos los inputs
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupCommonListeners(updatePreviewCallback) {
    const inputs = document.querySelectorAll(".test-form input, .test-form select, .test-form textarea");
    
    // Establecer nombre del botón desde la acción seleccionada
    this.setButtonNameFromSelectedAction();

    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        updatePreviewCallback();
        this.highlightJsonPathIfExists(input);
      });
      
      input.addEventListener("change", () => {
        updatePreviewCallback();
        this.highlightJsonPathIfExists(input);
      });
    });
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
   * Resalta la ruta JSON si existe
   * @param {HTMLElement} input - Elemento input
   */
  highlightJsonPathIfExists(input) {
    if (input.hasAttribute("data-json-path")) {
      this.app.jsonUtils.highlightJsonPath(input.getAttribute("data-json-path"));
    }
  }

  /**
   * Configura los listeners para los controles de activar/desactivar todos
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupBulkControlsListeners(updatePreviewCallback) {
    const enableAllBtn = document.getElementById("enableAllFields");
    const disableAllBtn = document.getElementById("disableAllFields");

    if (enableAllBtn) {
      enableAllBtn.addEventListener("click", () => {
        document.querySelectorAll('[id^="enable-"]').forEach((checkbox) => {
          checkbox.checked = true;
          this.toggleFieldState(checkbox);
        });
        updatePreviewCallback();
      });
    }

    if (disableAllBtn) {
      disableAllBtn.addEventListener("click", () => {
        document.querySelectorAll('[id^="enable-"]').forEach((checkbox) => {
          checkbox.checked = false;
          this.toggleFieldState(checkbox);
        });
        updatePreviewCallback();
      });
    }
  }

  /**
   * Configura los listeners para los toggles de campos individuales
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupFieldToggleListeners(updatePreviewCallback) {
    document.querySelectorAll('[id^="enable-"]').forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        this.toggleFieldState(checkbox);
        updatePreviewCallback();
        this.highlightJsonPathIfExists(checkbox);
      });
    });
  }

  /**
   * Configura los listeners para las configuraciones adicionales
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupConfigListeners(updatePreviewCallback) {
    const checkbox = document.getElementById("hideActionsButton");
    const hideConfig = document.getElementById("hideActionsButtonConfig");
    const arrowCheckbox = document.getElementById("addArrowConfig");
    const arrowConfigContainer = document.getElementById("arrowConfigContainer");

    if (checkbox) {
      checkbox.addEventListener("change", () => {
        hideConfig.style.display = checkbox.checked ? "block" : "none";
        updatePreviewCallback();
        this.highlightJsonPathIfExists(checkbox);
      });
    }

    if (arrowCheckbox) {
      arrowCheckbox.addEventListener("change", () => {
        arrowConfigContainer.style.display = arrowCheckbox.checked ? "block" : "none";
        updatePreviewCallback();
        this.highlightJsonPathIfExists(arrowCheckbox);
      });
    }
  }

  /**
   * Configura listeners para listas vinculadas de forma dinámica
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupDynamicLinkedListsListeners(updatePreviewCallback) {
    const selectedAction = this.app.getSelectedAction();
    if (!selectedAction?.dialogInfo?.fields) return;

    selectedAction.dialogInfo.fields.forEach((fieldObj) => {
      const fieldKey = Object.keys(fieldObj)[0];
      const fieldConfig = fieldObj[fieldKey];

      if (fieldKey.startsWith("twoListsLinked")) {
        this.setupLinkedListListeners(fieldKey, fieldConfig, updatePreviewCallback);
      }
    });
  }

  /**
   * Configura listeners para una lista vinculada específica
   * @param {string} fieldKey - Clave del campo
   * @param {Object} fieldConfig - Configuración del campo
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupLinkedListListeners(fieldKey, fieldConfig, updatePreviewCallback) {
    const linkedLists = this.getLinkedListsFromConfig(fieldConfig);

    // Poblar la primera lista si tiene items
    if (linkedLists.length > 0) {
      const firstListElement = document.getElementById(`list1-${fieldKey}`);
      if (firstListElement && firstListElement.tagName === "SELECT") {
        this.populateLinkedList(firstListElement, linkedLists[0].config);
      }
    }

    // Configurar listeners para cada lista
    linkedLists.forEach((listInfo, index) => {
      const listNumber = index + 1;
      const currentElement = document.getElementById(`list${listNumber}-${fieldKey}`);

      if (currentElement) {
        this.setupLinkedListElementListener(currentElement, listInfo, index, linkedLists, fieldKey, updatePreviewCallback);
      }
    });
  }

  /**
   * Configura el listener para un elemento específico de lista vinculada
   * @param {HTMLElement} currentElement - Elemento actual
   * @param {Object} listInfo - Información de la lista
   * @param {number} index - Índice de la lista
   * @param {Array} linkedLists - Array de todas las listas
   * @param {string} fieldKey - Clave del campo
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupLinkedListElementListener(currentElement, listInfo, index, linkedLists, fieldKey, updatePreviewCallback) {
    const eventType = currentElement.tagName === "SELECT" ? "change" : "input";

    currentElement.addEventListener(eventType, () => {
      const selectedValue = currentElement.value;

      // Solo manejar dependencias si es un SELECT
      if (currentElement.tagName === "SELECT") {
        this.handleLinkedListDependencies(index, linkedLists, fieldKey, selectedValue);
      }

      updatePreviewCallback();
    });

    // Para inputs de texto, también agregar listener de change
    if (currentElement.tagName === "INPUT") {
      currentElement.addEventListener("change", () => {
        updatePreviewCallback();
      });
    }
  }

  /**
   * Maneja las dependencias entre listas vinculadas
   * @param {number} index - Índice de la lista actual
   * @param {Array} linkedLists - Array de todas las listas
   * @param {string} fieldKey - Clave del campo
   * @param {string} selectedValue - Valor seleccionado
   */
  handleLinkedListDependencies(index, linkedLists, fieldKey, selectedValue) {
    // Limpiar y deshabilitar todas las listas siguientes (solo selects)
    for (let i = index + 1; i < linkedLists.length; i++) {
      const nextListNumber = i + 1;
      const nextElement = document.getElementById(`list${nextListNumber}-${fieldKey}`);
      if (nextElement && nextElement.tagName === "SELECT") {
        nextElement.innerHTML = '<option value="">Seleccionar...</option>';
        nextElement.disabled = true;
      }
    }

    // Si hay una selección y existe una lista siguiente que sea SELECT, poblarla
    if (selectedValue && index + 1 < linkedLists.length) {
      const nextListNumber = index + 2;
      const nextElement = document.getElementById(`list${nextListNumber}-${fieldKey}`);
      if (nextElement && nextElement.tagName === "SELECT") {
        this.populateLinkedList(nextElement, linkedLists[index + 1].config, selectedValue);
        nextElement.disabled = false;
      }
    }
  }

  /**
   * Puebla una lista vinculada con opciones filtradas
   * @param {HTMLElement} selectElement - Elemento select a poblar
   * @param {Object} listConfig - Configuración de la lista
   * @param {string} parentValue - Valor padre para filtrar (opcional)
   */
  populateLinkedList(selectElement, listConfig, parentValue = null) {
    if (!listConfig?.items) return;

    listConfig.items.forEach((item) => {
      // Si es la primera lista o no hay filtro, mostrar todos
      // Si hay filtro, mostrar solo los que coincidan con parentValue
      if (parentValue === null || item.parentValue === parentValue) {
        const option = document.createElement("option");
        option.value = item.keyName;
        option.textContent = item.keyValue_en;
        selectElement.appendChild(option);
      }
    });
  }

  /**
   * Extrae y ordena todas las listas vinculadas de la configuración del campo
   * @param {Object} fieldConfig - Configuración del campo twoListsLinked
   * @returns {Array} Array de objetos con información de cada lista
   */
  getLinkedListsFromConfig(fieldConfig) {
    const linkedLists = [];

    Object.keys(fieldConfig).forEach((key) => {
      if (key.startsWith("listLinked")) {
        const match = key.match(/listLinked(\d+)/);
        if (match) {
          const listNumber = Number.parseInt(match[1]);
          linkedLists.push({
            key: key,
            number: listNumber,
            config: fieldConfig[key],
          });
        }
      }
    });

    linkedLists.sort((a, b) => a.number - b.number);
    return linkedLists;
  }

  /**
   * Configura los listeners para ObjectByTabs
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupObjectByTabsListeners(updatePreviewCallback) {
    const radios = document.getElementsByName('objectByTabsSearchType');
    const selectGroup = document.getElementById('objectByTabsSelectGroup');
    const searchGroup = document.getElementById('objectByTabsSearchGroup');
    
    if (!radios.length || !selectGroup || !searchGroup) return;

    const updateSearchType = () => {
      const selected = Array.from(radios).find(r => r.checked)?.value || 'select';
      if (selected === 'select') {
        selectGroup.style.display = '';
        searchGroup.style.display = 'none';
      } else {
        selectGroup.style.display = 'none';
        searchGroup.style.display = '';
      }
      updatePreviewCallback();
    };

    radios.forEach(radio => radio.addEventListener('change', updateSearchType));
    setTimeout(updateSearchType, 0);
  }

  /**
   * Cambia el estado visual de un campo
   * @param {HTMLElement} checkbox - Checkbox del campo
   */
  toggleFieldState(checkbox) {
    const fieldKey = checkbox.id.replace("enable-", "");
    const fieldGroup = document.getElementById(`field-${fieldKey}`);
    const controls = document.getElementById(`controls-${fieldKey}`);

    if (checkbox.checked) {
      fieldGroup.classList.remove("field-disabled");
      controls.style.opacity = "1";
      controls.style.pointerEvents = "auto";
    } else {
      fieldGroup.classList.add("field-disabled");
      controls.style.opacity = "0.5";
      controls.style.pointerEvents = "none";
    }
  }
} 