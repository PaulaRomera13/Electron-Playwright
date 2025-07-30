// dialogFormRenderer.js - Renderización del formulario de diálogo
export class DialogFormRenderer {
  constructor(app) {
    this.app = app;
  }

  /**
   * Crea el formulario completo para el generador de diálogo
   * @returns {HTMLElement} Elemento DOM del formulario
   */
  createForm() {
    const form = document.createElement("div");
    form.className = "test-form";

    const formHTML = this.generateFormHTML();
    form.innerHTML = formHTML;
    return form;
  }

  /**
   * Genera el HTML completo del formulario
   * @returns {string} HTML del formulario
   */
  generateFormHTML() {
    return `
      <div class="alert alert-info">
        <i class="fas fa-info-circle"></i> Configuración de Test para acción con diálogo
      </div>
      ${this.renderTabLangSelector(this.app.modelJson)}
      ${this.renderObjectByTabsExtras(this.app.modelJson)}
      ${this.generateCommonFields()}
      ${this.generateAdditionalConfigFields()}
      ${this.generateNotificationFields()}
      ${this.generateDialogFields()}
    `;
  }

  /**
   * Genera los campos comunes del formulario
   * @returns {string} HTML de los campos comunes
   */
  generateCommonFields() {
    return `
      <div class="form-group">
        <label for="processName">Proceso del menú a seleccionar:</label>
        <input type="text" id="processName" placeholder="Ej: Stock control" data-json-path="desktopMode.label" />
      </div>

      <div class="form-group">
        <label for="menuOption">Nombre de la Pestaña (Opción del Menú):</label>
        <input type="text" id="menuOption" placeholder="Ej: Deviations" data-json-path="desktopMode.screenShotName" />
      </div>

      <div class="form-group">
        <label for="buttonName">Nombre del Botón (ActionName):</label>
        <input type="text" id="buttonName" class="readonly-field" readonly />
      </div>

      <div class="form-group">
        <label for="selectName">Elemento a Seleccionar:</label>
        <input type="text" id="selectName" placeholder="Ej: HPLC" data-json-path="selectName" />
      </div>

      <div class="form-group">
        <label for="positionButton">Posición del Botón:</label>
        <input type="text" id="positionButton" value="0" data-json-path="positionButton" />
      </div>

      <div class="form-group">
        <label for="positionSelectElement">Posición del Elemento a Seleccionar:</label>
        <input type="text" id="positionSelectElement" value="0" data-json-path="positionSelectElement" />
      </div>
    `;
  }

  /**
   * Genera los campos de configuración adicional
   * @returns {string} HTML de los campos de configuración
   */
  generateAdditionalConfigFields() {
    return `
      <div class="form-group">
        <div class="checkbox-group">
          <input type="checkbox" id="hideActionsButton" data-json-path="hideActionsButton" />
          <label for="hideActionsButton">¿Ocultar botón de Acciones escondidas (...)?</label>  
        </div>
      </div>

      <div class="form-group" id="hideActionsButtonConfig" style="display: none;">
        <label for="hideActionsButtonLocator">Locator:</label>
        <input type="text" id="hideActionsButtonLocator" value="md-icon:has-text('more_horiz')" class="readonly-field" readonly data-json-path="hideActionsButton.locator" />
        
        <label for="hideActionsButtonPosition" style="margin-top: 10px;">Position:</label>
        <input type="text" id="hideActionsButtonPosition" value="0" data-json-path="hideActionsButton.position" />
      </div>

      <div class="form-group">
        <div class="checkbox-group">
          <input type="checkbox" id="addArrowConfig" data-json-path="arrowDirection" />
          <label for="addArrowConfig">¿Añadir configuración de flecha?</label>  
        </div>
      </div>

      <div class="form-group" id="arrowConfigContainer" style="display: none;">
        <label for="arrowDirection">Dirección de la flecha:</label>
        <select id="arrowDirection" class="form-control" data-json-path="arrowDirection">
          <option value="down">Abajo</option>
          <option value="up">Arriba</option>
        </select>
        
        <label for="positionArrow" style="margin-top: 10px;">Posición de la flecha:</label>
        <input type="text" id="positionArrow" value="0" data-json-path="positionArrow" />
      </div>
    `;
  }

  /**
   * Genera los campos de notificación
   * @returns {string} HTML de los campos de notificación
   */
  generateNotificationFields() {
    return `
      <div class="form-group">
        <label for="textInNotif1">Text In Notif 1:</label>
        <input type="text" id="textInNotif1" placeholder="Ej: Created" data-json-path="textInNotif1" />
      </div>

      <div class="form-group">
        <label for="textInNotif2">Text In Notif 2:</label>
        <input type="text" id="textInNotif2" placeholder="Ej: with" data-json-path="textInNotif2" />
      </div>

      <div class="form-group">
        <label for="textInNotif3">Text In Notif 3:</label>
        <input type="text" id="textInNotif3" placeholder="Ej: success" data-json-path="textInNotif3" />
      </div>
    `;
  }

  /**
   * Genera los campos específicos del diálogo
   * @returns {string} HTML de los campos del diálogo
   */
  generateDialogFields() {
    const selectedAction = this.app.getSelectedAction();
    if (!selectedAction?.dialogInfo?.fields) return '';

    let dialogHTML = `
      <div class="form-section">
        <h4><i class="fas fa-wpforms"></i> Campos del Diálogo</h4>
        
        <div class="bulk-field-controls">
          <button type="button" class="bulk-btn enable-btn" id="enableAllFields">
            <i class="fas fa-check-circle"></i> Activar Todos
          </button>
          <button type="button" class="bulk-btn disable-btn" id="disableAllFields">
            <i class="fas fa-times-circle"></i> Desactivar Todos
          </button>
        </div>
    `;

    selectedAction.dialogInfo.fields.forEach((fieldObj) => {
      const fieldKey = Object.keys(fieldObj)[0];
      const fieldConfig = fieldObj[fieldKey];
      dialogHTML += this.generateFieldHTML(fieldKey, fieldConfig);
    });

    dialogHTML += '</div>';
    return dialogHTML;
  }

  /**
   * Genera el HTML para un campo específico
   * @param {string} fieldKey - Clave del campo
   * @param {Object} fieldConfig - Configuración del campo
   * @returns {string} HTML del campo
   */
  generateFieldHTML(fieldKey, fieldConfig) {
    let fieldHTML = `
      <div class="field-group" id="field-${fieldKey}">
        <div class="field-header">
          <span class="field-label">${fieldKey}</span>
          <div class="field-toggle">
            <input type="checkbox" id="enable-${fieldKey}" checked data-json-path="${fieldKey}" />
            <label for="enable-${fieldKey}" class="toggle-label">Incluir en test</label>
          </div>
        </div>
        
        <div class="field-controls" id="controls-${fieldKey}">
    `;

    // Solo mostrar toggle de idioma para campos que NO sean twoListsLinked
    if (!fieldKey.startsWith("twoListsLinked")) {
      fieldHTML += this.generateLanguageToggle(fieldKey, fieldConfig);
    }

    fieldHTML += this.generateFieldInput(fieldKey, fieldConfig);
    fieldHTML += `
        </div>
      </div>
    `;

    return fieldHTML;
  }

  /**
   * Genera el toggle de idioma para un campo
   * @param {string} fieldKey - Clave del campo
   * @param {Object} fieldConfig - Configuración del campo
   * @returns {string} HTML del toggle de idioma
   */
  generateLanguageToggle(fieldKey, fieldConfig) {
    return `
      <div class="language-toggle">
        <input type="radio" id="lang-en-${fieldKey}" name="lang-${fieldKey}" value="en" checked />
        <label for="lang-en-${fieldKey}">EN: ${fieldConfig.label_en || "N/A"}</label>
        
        <input type="radio" id="lang-es-${fieldKey}" name="lang-${fieldKey}" value="es" />
        <label for="lang-es-${fieldKey}">ES: ${fieldConfig.label_es || "N/A"}</label>
      </div>
    `;
  }

  /**
   * Genera el input específico para un tipo de campo
   * @param {string} fieldKey - Clave del campo
   * @param {Object} fieldConfig - Configuración del campo
   * @returns {string} HTML del input
   */
  generateFieldInput(fieldKey, fieldConfig) {
    if (fieldKey.startsWith("text") || fieldKey.startsWith("number")) {
      return `<input type="text" class="field-value" id="value-${fieldKey}" placeholder="Valor del campo" data-json-path="${fieldKey}.value" />`;
    } else if (fieldKey.startsWith("list") || fieldKey.startsWith("select")) {
      return this.generateSelectInput(fieldKey, fieldConfig);
    } else if (fieldKey.startsWith("date")) {
      return `<input type="date" class="field-value" id="date-${fieldKey}" value="2024-01-01" data-json-path="${fieldKey}.date" />`;
    } else if (fieldKey.startsWith("datetime")) {
      return `<input type="datetime-local" class="field-value" id="datetime-${fieldKey}" value="2024-01-01T12:00" data-json-path="${fieldKey}.datetime" />`;
    } else if (fieldKey.startsWith("checkbox")) {
      return `
        <label style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" class="field-value" id="boolean-${fieldKey}" data-json-path="${fieldKey}.boolean" />
          Valor booleano
        </label>
      `;
    } else if (fieldKey.startsWith("multilist")) {
      return `<input type="text" class="field-value" id="options-${fieldKey}" placeholder="Opciones separadas por coma" data-json-path="${fieldKey}.options" />`;
    } else if (fieldKey.startsWith("tree")) {
      return `
        <input type="text" class="field-value" id="option-${fieldKey}" placeholder="Opción seleccionada" style="margin-bottom: 8px;" data-json-path="${fieldKey}.option" />
        <input type="text" class="field-value" id="position-${fieldKey}" placeholder="Posición" value="0" data-json-path="${fieldKey}.position" />
      `;
    } else if (fieldKey.startsWith("input")) {
      return `
        <input type="text" class="field-value" id="placeholder-${fieldKey}" placeholder="Placeholder" style="margin-bottom: 8px;" data-json-path="${fieldKey}.placeholder" />
        <input type="text" class="field-value" id="value-${fieldKey}" placeholder="Valor" data-json-path="${fieldKey}.value" />
      `;
    } else if (fieldKey.startsWith("twoListsLinked")) {
      return this.generateLinkedListsInput(fieldKey, fieldConfig);
    }

    return '';
  }

  /**
   * Genera un input de tipo select
   * @param {string} fieldKey - Clave del campo
   * @param {Object} fieldConfig - Configuración del campo
   * @returns {string} HTML del select
   */
  generateSelectInput(fieldKey, fieldConfig) {
    if (fieldConfig.items && fieldConfig.items.length > 0) {
      let selectHTML = `<select class="field-value" id="option-${fieldKey}" data-json-path="${fieldKey}.option">`;
      fieldConfig.items.forEach((item) => {
        selectHTML += `<option value="${item.keyName}">${item.keyValue_en}</option>`;
      });
      selectHTML += `</select>`;
      return selectHTML;
    } else {
      return `<input type="text" class="field-value" id="option-${fieldKey}" placeholder="Opción seleccionada" data-json-path="${fieldKey}.option" />`;
    }
  }

  /**
   * Genera el input para listas vinculadas
   * @param {string} fieldKey - Clave del campo
   * @param {Object} fieldConfig - Configuración del campo
   * @returns {string} HTML de las listas vinculadas
   */
  generateLinkedListsInput(fieldKey, fieldConfig) {
    const linkedLists = this.getLinkedListsFromConfig(fieldConfig);
    let linkedListsHTML = `<div class="multiple-lists-container">`;

    linkedLists.forEach((listInfo, index) => {
      const listNumber = index + 1;
      const listKey = listInfo.key;

      linkedListsHTML += `
        <div class="linked-list-group">
          <label class="linked-list-label">${listKey}: ${listInfo.config?.label_en || listKey}</label>
          
          <div class="language-toggle linked-list-language">
            <input type="radio" id="lang-en-${listKey}" name="lang-${listKey}" value="en" checked />
            <label for="lang-en-${listKey}">EN: ${listInfo.config?.label_en || "N/A"}</label>
            
            <input type="radio" id="lang-es-${listKey}" name="lang-${listKey}" value="es" />
            <label for="lang-es-${listKey}">ES: ${listInfo.config?.label_es || "N/A"}</label>
          </div>
      `;

      if (listInfo.config?.items && listInfo.config.items.length > 0) {
        linkedListsHTML += `
          <select class="field-value linked-list-select" id="list${listNumber}-${fieldKey}" data-list-number="${listNumber}" data-json-path="${fieldKey}.list${listNumber}.option" ${index > 0 ? "disabled" : ""}>
            <option value="">Seleccionar...</option>
          </select>
        `;
      } else {
        linkedListsHTML += `
          <input type="text" class="field-value linked-list-input" id="list${listNumber}-${fieldKey}" data-list-number="${listNumber}" data-json-path="${fieldKey}.list${listNumber}.option" placeholder="Escribir opción..." />
        `;
      }

      linkedListsHTML += `</div>`;
    });

    linkedListsHTML += `</div>`;
    return linkedListsHTML;
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
   * Renderiza el selector de idioma para tabs
   * @param {Object} modelJson - Modelo JSON
   * @returns {string} HTML del selector
   */
  renderTabLangSelector(modelJson) {
    if (!modelJson || modelJson.component !== 'Tabs' || !Array.isArray(modelJson.tabs)) {
      return '';
    }

    const tab = modelJson.tabs[0];
    const labelES = tab.tabLabel?.label_es || '';
    const labelEN = tab.tabLabel?.label_en || '';

    return `
      <div class="form-group">
        <label>Label de la Tab:</label>
        <div class="tab-language-toggle">
          <label><input type="radio" name="tabLang" value="es"> <b>ES:</b> ${labelES}</label>
          <label><input type="radio" name="tabLang" value="en" checked> <b>EN:</b> ${labelEN}</label>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza extras para ObjectByTabs
   * @param {Object} modelJson - Modelo JSON
   * @returns {string} HTML de los extras
   */
  renderObjectByTabsExtras(modelJson) {
    // Implementación delegada al componente correspondiente
    return '';
  }
} 