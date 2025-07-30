// dialogDataCollector.js - Recolección de datos del formulario de diálogo
export class DialogDataCollector {
  constructor(app) {
    this.app = app;
  }

  /**
   * Recolecta todos los datos del formulario de diálogo
   * @returns {Object} Objeto con todos los datos del formulario
   */
  collectFormData() {
    const formData = {
      ...this.collectCommonFormData(),
      ...this.collectConfigFormData(),
      ...this.collectNotificationFormData(),
      ...this.collectDialogFieldsData(),
    };

    return formData;
  }

  /**
   * Recolecta los datos comunes del formulario
   * @returns {Object} Datos comunes del formulario
   */
  collectCommonFormData() {
    return {
      processName: this.getElementValue("processName") || "",
      menuOption: this.getElementValue("menuOption") || "",
      selectName: this.getElementValue("selectName") || "",
      positionButton: this.getElementValue("positionButton") || "0",
      positionSelectElement: this.getElementValue("positionSelectElement") || "0",
    };
  }

  /**
   * Recolecta los datos de configuración del formulario
   * @returns {Object} Datos de configuración
   */
  collectConfigFormData() {
    const checkbox = document.getElementById("hideActionsButton");
    const arrowCheckbox = document.getElementById("addArrowConfig");

    return {
      hideActionsButton: checkbox ? checkbox.checked : false,
      hideActionsButtonLocator: this.getElementValue("hideActionsButtonLocator") || "",
      hideActionsButtonPosition: this.getElementValue("hideActionsButtonPosition") || "0",
      addArrowConfig: arrowCheckbox ? arrowCheckbox.checked : false,
      arrowDirection: this.getElementValue("arrowDirection") || "down",
      positionArrow: this.getElementValue("positionArrow") || "0",
    };
  }

  /**
   * Recolecta los datos de notificación del formulario
   * @returns {Object} Datos de notificación
   */
  collectNotificationFormData() {
    return {
      textInNotif1: this.getElementValue("textInNotif1") || "",
      textInNotif2: this.getElementValue("textInNotif2") || "",
      textInNotif3: this.getElementValue("textInNotif3") || "",
    };
  }

  /**
   * Recolecta los datos de los campos del diálogo
   * @returns {Object} Datos de los campos del diálogo
   */
  collectDialogFieldsData() {
    const selectedAction = this.app.getSelectedAction();
    if (!selectedAction?.dialogInfo?.fields) {
      return { fieldStates: {}, fieldValues: {} };
    }

    const fieldStates = {};
    const fieldValues = {};

    selectedAction.dialogInfo.fields.forEach((fieldObj) => {
      const fieldKey = Object.keys(fieldObj)[0];
      const fieldConfig = fieldObj[fieldKey];
      const enableCheckbox = document.getElementById(`enable-${fieldKey}`);

      if (enableCheckbox) {
        fieldStates[fieldKey] = enableCheckbox.checked;

        if (enableCheckbox.checked) {
          fieldValues[fieldKey] = this.collectFieldData(fieldKey, fieldConfig);
        }
      }
    });

    // Manejar campos de listas vinculadas como campos independientes
    this.collectLinkedListsData(fieldStates, fieldValues);

    return { fieldStates, fieldValues };
  }

  /**
   * Recolecta los datos de un campo específico
   * @param {string} fieldKey - Clave del campo
   * @param {Object} fieldConfig - Configuración del campo
   * @returns {Object} Datos del campo
   */
  collectFieldData(fieldKey, fieldConfig) {
    const langRadio = document.querySelector(`input[name="lang-${fieldKey}"]:checked`);
    const selectedLang = langRadio ? langRadio.value : "en";
    const label = selectedLang === "en" ? fieldConfig.label_en : fieldConfig.label_es;

    const fieldData = { label: label || fieldKey };

    if (fieldKey.startsWith("text") || fieldKey.startsWith("number")) {
      fieldData.value = this.getElementValue(`value-${fieldKey}`) || "";
    } else if (fieldKey.startsWith("list") || fieldKey.startsWith("select")) {
      fieldData.option = this.getElementValue(`option-${fieldKey}`) || "";
    } else if (fieldKey.startsWith("date")) {
      fieldData.date = this.getElementValue(`date-${fieldKey}`) || "2024-01-01";
    } else if (fieldKey.startsWith("datetime")) {
      fieldData.datetime = this.getElementValue(`datetime-${fieldKey}`) || "2024-01-01T12:00";
    } else if (fieldKey.startsWith("checkbox")) {
      const booleanInput = document.getElementById(`boolean-${fieldKey}`);
      fieldData.boolean = booleanInput ? booleanInput.checked : false;
    } else if (fieldKey.startsWith("multilist")) {
      const optionsValue = this.getElementValue(`options-${fieldKey}`) || "";
      fieldData.options = optionsValue ? optionsValue.split(",").map((s) => s.trim()) : [];
    } else if (fieldKey.startsWith("tree")) {
      fieldData.option = this.getElementValue(`option-${fieldKey}`) || "";
      fieldData.position = this.getElementValue(`position-${fieldKey}`) || "0";
    } else if (fieldKey.startsWith("input")) {
      fieldData.placeholder = this.getElementValue(`placeholder-${fieldKey}`) || "";
      fieldData.value = this.getElementValue(`value-${fieldKey}`) || "";
    }
    // Los campos twoListsLinked se manejan por separado

    return fieldData;
  }

  /**
   * Recolecta los datos de las listas vinculadas
   * @param {Object} fieldStates - Estados de los campos
   * @param {Object} fieldValues - Valores de los campos
   */
  collectLinkedListsData(fieldStates, fieldValues) {
    const selectedAction = this.app.getSelectedAction();
    if (!selectedAction?.dialogInfo?.fields) return;

    selectedAction.dialogInfo.fields.forEach((fieldObj) => {
      const fieldKey = Object.keys(fieldObj)[0];
      const fieldConfig = fieldObj[fieldKey];
      const enableCheckbox = document.getElementById(`enable-${fieldKey}`);

      if (fieldKey.startsWith("twoListsLinked") && enableCheckbox && enableCheckbox.checked) {
        const linkedLists = this.getLinkedListsFromConfig(fieldConfig);

        // Generar un campo independiente para cada lista vinculada
        linkedLists.forEach((listInfo, index) => {
          const listNumber = index + 1;
          const listKey = listInfo.key;
          const listInput = document.getElementById(`list${listNumber}-${fieldKey}`);

          // Obtener el idioma seleccionado para esta lista específica
          const langRadio = document.querySelector(`input[name="lang-${listKey}"]:checked`);
          const selectedLang = langRadio ? langRadio.value : "en";
          const label =
            selectedLang === "en"
              ? listInfo.config?.label_en
              : listInfo.config?.label_es || listInfo.config?.label_en || listKey;

          // Crear campo independiente para cada lista (solo label y option)
          fieldStates[listKey] = true;
          fieldValues[listKey] = {
            label: label,
            option: listInput ? listInput.value : "",
          };
        });
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
   * Obtiene el valor de un elemento del DOM
   * @param {string} elementId - ID del elemento
   * @returns {string} Valor del elemento
   */
  getElementValue(elementId) {
    const element = document.getElementById(elementId);
    return element ? element.value : "";
  }

  /**
   * Obtiene el valor de un elemento checkbox
   * @param {string} elementId - ID del elemento
   * @returns {boolean} Estado del checkbox
   */
  getElementChecked(elementId) {
    const element = document.getElementById(elementId);
    return element ? element.checked : false;
  }

  /**
   * Obtiene el valor seleccionado de un grupo de radio buttons
   * @param {string} name - Nombre del grupo de radio buttons
   * @returns {string} Valor seleccionado
   */
  getRadioValue(name) {
    const radio = document.querySelector(`input[name="${name}"]:checked`);
    return radio ? radio.value : "";
  }
} 