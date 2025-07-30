// dialogTestDataGenerator.js - Generación de datos de test para diálogo
export class DialogTestDataGenerator {
  constructor(app) {
    this.app = app;
  }

  /**
   * Genera los datos de test para el diálogo
   * @param {Object} formData - Datos del formulario
   * @returns {Object} Datos de test generados
   */
  generateDialogTestData(formData) {
    const testDataTemplate = this.app.jsonUtils.getTestDataTemplate();
    const testData = JSON.parse(JSON.stringify(testDataTemplate));

    this.applyCommonTestData(testData, formData);
    this.applyDialogFieldsTestData(testData, formData);
    this.applyLinkedListsTestData(testData, formData);
    this.applyConfigTestData(testData, formData);

    return testData;
  }

  /**
   * Aplica los datos comunes del test
   * @param {Object} testData - Datos de test a modificar
   * @param {Object} formData - Datos del formulario
   */
  applyCommonTestData(testData, formData) {
    const modes = ["desktopMode", "mobileMode", "tabletRetratoMode"];
    modes.forEach((mode) => {
      testData[mode].label = formData.processName;
      testData[mode].view = formData.processName;
      testData[mode].viewScreenShotLabel = formData.processName;
      testData[mode].screenShotName = formData.menuOption;
    });

    testData.mobileMode.label = `.${formData.processName.toLowerCase()}`;

    const selectedAction = this.app.getSelectedAction();
    testData.buttonName = selectedAction ? selectedAction.actionName : "";

    testData.selectName = formData.selectName;
    testData.textInNotif1 = formData.textInNotif1;
    testData.textInNotif2 = formData.textInNotif2;
    testData.textInNotif3 = formData.textInNotif3;
    testData.positionButton = formData.positionButton;
    testData.positionSelectElement = formData.positionSelectElement;

    testData.screenShotsEmptyForm = "Empty Form";
    testData.screenShotsFilledForm = "Filled Form";

    this.applyTabsTestData(testData);
  }

  /**
   * Aplica los datos de test para tabs
   * @param {Object} testData - Datos de test a modificar
   */
  applyTabsTestData(testData) {
    if (this.app.modelJson && this.app.modelJson.component === 'Tabs' && Array.isArray(this.app.modelJson.tabs)) {
      let activeTabIdx = 0;
      let tabLang = 'en';
      const langInput = document.querySelector('input[name="tabLang"]:checked');
      if (langInput) tabLang = langInput.value;
      const tab = this.app.modelJson.tabs[activeTabIdx];
      const label = tabLang === 'en' ? tab.tabLabel?.label_en : tab.tabLabel?.label_es;
      testData.phraseTab = 'Click on Tab';
      testData.tab = label;
      testData.screenShotTab = label;
    }
  }

  /**
   * Aplica los datos de test para los campos del diálogo
   * @param {Object} testData - Datos de test a modificar
   * @param {Object} formData - Datos del formulario
   */
  applyDialogFieldsTestData(testData, formData) {
    const selectedAction = this.app.getSelectedAction();
    if (!selectedAction?.dialogInfo?.fields || !formData.fieldStates) return;

    selectedAction.dialogInfo.fields.forEach((fieldObj) => {
      const fieldKey = Object.keys(fieldObj)[0];
      const fieldConfig = fieldObj[fieldKey];

      if (formData.fieldStates[fieldKey]) {
        const fieldData = formData.fieldValues[fieldKey];
        this.applyFieldTestData(testData, fieldKey, fieldConfig, fieldData);
      }
    });
  }

  /**
   * Aplica los datos de test para un campo específico
   * @param {Object} testData - Datos de test a modificar
   * @param {string} fieldKey - Clave del campo
   * @param {Object} fieldConfig - Configuración del campo
   * @param {Object} fieldData - Datos del campo
   */
  applyFieldTestData(testData, fieldKey, fieldConfig, fieldData) {
    if (fieldKey.startsWith("text") || fieldKey.startsWith("number")) {
      testData[fieldKey] = {
        label: fieldData.label,
        value: fieldData.value || "",
      };
    } else if (fieldKey.startsWith("list") || fieldKey.startsWith("select")) {
      let visibleValue = fieldData.option || "";
      if (fieldConfig.items && fieldConfig.items.length > 0) {
        const langRadio = document.querySelector(`input[name='lang-${fieldKey}']:checked`);
        const lang = langRadio ? langRadio.value : "en";
        const selectedItem = fieldConfig.items.find(item => item.keyName === fieldData.option);
        if (selectedItem) {
          visibleValue = lang === "es" ? (selectedItem.keyValue_es || selectedItem.keyValue_en) : selectedItem.keyValue_en;
        }
      }
      testData[fieldKey] = {
        label: fieldData.label,
        option: visibleValue,
      };
    } else if (fieldKey.startsWith("date")) {
      testData[fieldKey] = {
        label: fieldData.label,
        date: fieldData.date || "2024-01-01",
      };
    } else if (fieldKey.startsWith("datetime")) {
      testData[fieldKey] = {
        label: fieldData.label,
        datetime: fieldData.datetime || "2024-01-01T12:00",
      };
    } else if (fieldKey.startsWith("checkbox")) {
      testData[fieldKey] = {
        label: fieldData.label,
        boolean: fieldData.boolean || false,
      };
    } else if (fieldKey.startsWith("multilist")) {
      testData[fieldKey] = {
        label: fieldData.label,
        id: fieldKey,
        options: fieldData.options || [],
      };
    } else if (fieldKey.startsWith("tree")) {
      testData[fieldKey] = {
        label: fieldData.label,
        option: fieldData.option || "",
        position: fieldData.position || "0",
      };
    } else if (fieldKey.startsWith("input")) {
      testData[fieldKey] = {
        placeholder: fieldData.placeholder || "",
        value: fieldData.value || "",
      };
    }
    // Los campos twoListsLinked se procesan por separado
  }

  /**
   * Aplica los datos de test para las listas vinculadas
   * @param {Object} testData - Datos de test a modificar
   * @param {Object} formData - Datos del formulario
   */
  applyLinkedListsTestData(testData, formData) {
    const selectedAction = this.app.getSelectedAction();
    if (!selectedAction?.dialogInfo?.fields || !formData.fieldStates) return;

    selectedAction.dialogInfo.fields.forEach((fieldObj) => {
      const fieldKey = Object.keys(fieldObj)[0];
      const fieldConfig = fieldObj[fieldKey];
      
      if (fieldKey.startsWith("twoListsLinked") && formData.fieldStates) {
        const linkedLists = this.getLinkedListsFromConfig(fieldConfig);
        linkedLists.forEach((listInfo, index) => {
          const listKey = listInfo.key;
          if (formData.fieldStates[listKey] && formData.fieldValues[listKey]) {
            const fieldData = formData.fieldValues[listKey];
            let visibleValue = fieldData.option || "";
            
            if (listInfo.config.items && listInfo.config.items.length > 0) {
              const langRadio = document.querySelector(`input[name='lang-${listKey}']:checked`);
              const lang = langRadio ? langRadio.value : "en";
              const selectedItem = listInfo.config.items.find(item => item.keyName === fieldData.option);
              if (selectedItem) {
                visibleValue = lang === "es" ? (selectedItem.keyValue_es || selectedItem.keyValue_en) : selectedItem.keyValue_en;
              }
            }
            
            testData[listKey] = {
              label: fieldData.label,
              option: visibleValue,
            };
          }
        });
      }
    });
  }

  /**
   * Aplica los datos de test para las configuraciones
   * @param {Object} testData - Datos de test a modificar
   * @param {Object} formData - Datos del formulario
   */
  applyConfigTestData(testData, formData) {
    if (formData.hideActionsButton) {
      testData.hideActionsButton = {
        locator: formData.hideActionsButtonLocator,
        position: formData.hideActionsButtonPosition,
      };
    }

    if (formData.addArrowConfig) {
      testData.arrowDirection = formData.arrowDirection;
      testData.positionArrow = formData.positionArrow;
    } else {
      delete testData.arrowDirection;
      delete testData.positionArrow;
      delete testData.screenShotsArrow;
    }
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
} 