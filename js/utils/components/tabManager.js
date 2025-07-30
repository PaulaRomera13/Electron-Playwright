// tabManager.js - Gestión de pestañas
import { ActionTypeValidator } from '../validation/actionTypeValidator.js';

export class TabManager {
  constructor(app) {
    this.app = app;
    this.actionTypeValidator = new ActionTypeValidator();
  }

  /**
   * Crea el contenedor de pestañas
   * @param {HTMLElement} container - Contenedor padre
   * @param {Object} action - Objeto de acción
   * @param {string} uniqueId - ID único
   * @param {HTMLElement} targetContainer - Contenedor objetivo
   * @returns {HTMLElement} Contenedor de pestañas
   */
  createTabContainer(container, action, uniqueId, targetContainer) {
    const tabContainer = document.createElement("div");
    tabContainer.className = "tab-container";

    const tabButtons = document.createElement("div");
    tabButtons.className = "tab-buttons";

    // Pestaña JSON Model
    const jsonTab = this.createTabButton("JSON Model", "active", () => {
      this.app.currentTabSwitcher(`json-model${uniqueId}`, targetContainer);
    });
    tabButtons.appendChild(jsonTab);

    // Pestaña Crear Test (si corresponde)
    if (this.actionTypeValidator.shouldShowTestGenerator(action)) {
      const testTab = this.createTabButton("Crear Test", "", () => {
        this.app.currentTabSwitcher(`test-generator${uniqueId}`, targetContainer);
      });
      tabButtons.appendChild(testTab);
    }

    tabContainer.appendChild(tabButtons);
    container.appendChild(tabContainer);
    return tabContainer;
  }

  /**
   * Crea un botón de pestaña
   * @param {string} text - Texto del botón
   * @param {string} className - Clase CSS
   * @param {Function} onClick - Función de clic
   * @returns {HTMLElement} Botón de pestaña
   */
  createTabButton(text, className, onClick) {
    const tabButton = document.createElement("button");
    tabButton.className = `tab-button ${className}`;
    tabButton.textContent = text;
    tabButton.onclick = onClick;
    return tabButton;
  }

  /**
   * Crea el contenido de las pestañas
   * @param {HTMLElement} tabContainer - Contenedor de pestañas
   * @param {Object} action - Objeto de acción
   * @param {string} uniqueId - ID único
   * @param {HTMLElement} targetContainer - Contenedor objetivo
   */
  createTabContents(tabContainer, action, uniqueId, targetContainer) {
    const tabContents = document.createElement("div");

    // Contenido de la pestaña JSON Model
    this.createJsonTabContent(tabContents, action, uniqueId);

    // Contenido de la pestaña Crear Test (si corresponde)
    if (this.actionTypeValidator.shouldShowTestGenerator(action)) {
      this.createTestTabContent(tabContents, action, uniqueId, targetContainer);
    }

    tabContainer.appendChild(tabContents);
  }

  /**
   * Crea el contenido de la pestaña JSON Model
   * @param {HTMLElement} tabContents - Contenedor de contenido
   * @param {Object} action - Objeto de acción
   * @param {string} uniqueId - ID único
   */
  createJsonTabContent(tabContents, action, uniqueId) {
    const jsonTabContent = document.createElement("div");
    jsonTabContent.className = "tab-content active";
    jsonTabContent.id = `json-model${uniqueId}`;

    const jsonSection = document.createElement("div");
    jsonSection.className = "detail-section";

    const jsonTitle = document.createElement("h3");
    jsonTitle.innerHTML = '<i class="fas fa-code"></i> JSON Model';
    jsonSection.appendChild(jsonTitle);

    const jsonEditor = document.createElement("textarea");
    jsonEditor.className = "json-viewer";
    jsonEditor.style.width = "100%";
    jsonEditor.style.minHeight = "500px";
    jsonEditor.readOnly = true;
    jsonEditor.value = JSON.stringify(action, null, 2);
    jsonSection.appendChild(jsonEditor);
    jsonTabContent.appendChild(jsonSection);
    tabContents.appendChild(jsonTabContent);
  }

  /**
   * Crea el contenido de la pestaña Crear Test
   * @param {HTMLElement} tabContents - Contenedor de contenido
   * @param {Object} action - Objeto de acción
   * @param {string} uniqueId - ID único
   * @param {HTMLElement} targetContainer - Contenedor objetivo
   */
  createTestTabContent(tabContents, action, uniqueId, targetContainer) {
    const testTabContent = document.createElement("div");
    testTabContent.className = "tab-content";
    testTabContent.id = `test-generator${uniqueId}`;

    const testSection = document.createElement("div");
    testSection.className = "detail-section";
    testSection.style.padding = "0";
    testSection.style.background = "transparent";
    testSection.style.border = "none";

    const testTitle = document.createElement("h3");
    testTitle.innerHTML = '<i class="fas fa-flask"></i> Crear Test';
    testTitle.style.marginBottom = "20px";
    testTitle.style.padding = "20px";
    testTitle.style.background = "var(--light-bg)";
    testTitle.style.borderRadius = "8px";
    testSection.appendChild(testTitle);

    const testGenerator = document.createElement("div");
    testGenerator.className = "test-generator";

    const idSuffix = targetContainer ? `_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : "";
    const { testForm, generatorType } = this.app.formFactory.createTestForm(action, idSuffix);

    const testPreview = this.app.jsonUtils.createPreviewContainer();
    testGenerator.appendChild(testForm);
    testGenerator.appendChild(testPreview);

    // Agregar contenedor de guardado regresivo si es necesario
    if (this.isRegressiveMode(targetContainer)) {
      this.addRegressiveSaveContainer(testGenerator, action, idSuffix, targetContainer);
    }

    testSection.appendChild(testGenerator);
    testTabContent.appendChild(testSection);
    tabContents.appendChild(testTabContent);

    this.app.formFactory.setupTestListeners(generatorType, idSuffix, targetContainer, action);
  }

  /**
   * Verifica si está en modo regresivo
   * @param {HTMLElement} targetContainer - Contenedor objetivo
   * @returns {boolean} True si está en modo regresivo
   */
  isRegressiveMode(targetContainer) {
    return targetContainer ||
           document.getElementById("regressive-navigation-bar") ||
           document.querySelector('.regressive-mode');
  }

  /**
   * Agrega el contenedor de guardado regresivo
   * @param {HTMLElement} testGenerator - Generador de test
   * @param {Object} action - Objeto de acción
   * @param {string} idSuffix - Sufijo de ID
   * @param {HTMLElement} targetContainer - Contenedor objetivo
   */
  addRegressiveSaveContainer(testGenerator, action, idSuffix, targetContainer) {
    const regressiveSaveContainer = document.createElement("div");
    regressiveSaveContainer.className = "regressive-save-container";
    regressiveSaveContainer.style.cssText = `
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    `;

    const saveButton = document.createElement("button");
    saveButton.className = "regressive-save-btn";
    saveButton.innerHTML = '<i class="fas fa-save"></i> Guardar Acción Regresiva';
    saveButton.style.cssText = `
      padding: 10px 20px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    `;
    saveButton.onclick = () => {
      const container = targetContainer || document.getElementById("details-container");
      this.app.saveRegressiveAction(action, idSuffix, container);
    };

    const savedCount = document.createElement("div");
    savedCount.className = "regressive-saved-count";
    savedCount.style.cssText = `margin-top: 10px; font-size: 12px; color: #666;`;
    savedCount.textContent = `Acciones guardadas: ${this.app.testGeneratorRegressive.savedRegressiveActions.length}`;

    regressiveSaveContainer.appendChild(saveButton);
    regressiveSaveContainer.appendChild(savedCount);
    testGenerator.appendChild(regressiveSaveContainer);
  }

  /**
   * Configura el switcher de pestañas
   * @param {string} uniqueId - ID único
   * @param {HTMLElement} targetContainer - Contenedor objetivo
   */
  setupTabSwitcher(uniqueId, targetContainer) {
    this.app.currentTabSwitcher = (tabId, targetContainer) => {
      const searchScope = targetContainer || document;
      searchScope.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
      searchScope.querySelectorAll(".tab-button").forEach(button => button.classList.remove("active"));
      const tabContent = searchScope.querySelector(`#${tabId}`);
      if (tabContent) tabContent.classList.add("active");
      searchScope.querySelectorAll(".tab-button").forEach(button => {
        const baseTabId = tabId.replace(/_\d+_[a-z0-9]+$/, '');
        if (button.textContent.toLowerCase().includes(baseTabId.split("-")[0]) ||
            (baseTabId === "test-generator" && button.textContent === "Crear Test")) {
          button.classList.add("active");
        }
      });
    };
  }
} 