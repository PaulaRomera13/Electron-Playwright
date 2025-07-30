// actionRenderer.js - Renderizado de detalles de acciones
export class ActionRenderer {
  constructor(app) {
    this.app = app;
  }

  /**
   * Renderiza los detalles de una acción
   */
  renderActionDetails(action, targetContainer) {
    const container = targetContainer || document.getElementById("details-container");
    if (!container) return;

    this.preserveRegressiveNavigation(container);
    this.clearContainer(container);
    this.restoreRegressiveNavigation(container, targetContainer);

    const uniqueId = targetContainer ? `_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : '';
    
    this.createActionTitle(container, action);
    const tabContainer = this.createTabContainer(container, action, uniqueId, targetContainer);
    this.createTabContents(tabContainer, action, uniqueId, targetContainer);
    
    this.handleSingleRegressiveMode();
    this.setupTabSwitcher(uniqueId, targetContainer);
  }

  /**
   * Preserva la barra de navegación regresiva
   */
  preserveRegressiveNavigation(container) {
    this.regressiveNavBar = document.getElementById("regressive-navigation-bar");
    this.regressiveNavBarParent = this.regressiveNavBar ? this.regressiveNavBar.parentNode : null;
  }

  /**
   * Limpia el contenedor
   */
  clearContainer(container) {
    container.innerHTML = "";
  }

  /**
   * Restaura la barra de navegación regresiva
   */
  restoreRegressiveNavigation(container, targetContainer) {
    if (this.regressiveNavBar && this.regressiveNavBarParent === container) {
      container.appendChild(this.regressiveNavBar);
    }
    
    // Asegurar que el panel de acciones guardadas permanezca visible
    if (targetContainer && this.app.testGeneratorRegressive) {
      setTimeout(() => {
        this.app.testGeneratorRegressive.restoreSavedActionsPanel();
      }, 0);
    }
  }

  /**
   * Crea el título de la acción
   */
  createActionTitle(container, action) {
    const title = document.createElement("h2");
    title.innerHTML = `<i class="fas fa-cube"></i> ${action.actionName}`;
    title.style.color = "var(--primary-color)";
    title.style.marginBottom = "25px";
    container.appendChild(title);
  }

  /**
   * Crea el contenedor de pestañas
   */
  createTabContainer(container, action, uniqueId, targetContainer) {
    const tabContainer = document.createElement("div");
    tabContainer.className = "tab-container";

    const tabButtons = document.createElement("div");
    tabButtons.className = "tab-buttons";

    // Pestaña JSON Model
    const jsonTab = document.createElement("button");
    jsonTab.className = "tab-button active";
    jsonTab.textContent = "JSON Model";
    jsonTab.onclick = () => this.app.currentTabSwitcher(`json-model${uniqueId}`, targetContainer);
    tabButtons.appendChild(jsonTab);

    // Pestaña Crear Test (si corresponde)
    if (this.shouldShowTestGenerator(action)) {
      const testTab = document.createElement("button");
      testTab.className = "tab-button";
      testTab.textContent = "Crear Test";
      testTab.onclick = () => this.app.currentTabSwitcher(`test-generator${uniqueId}`, targetContainer);
      tabButtons.appendChild(testTab);
    }

    tabContainer.appendChild(tabButtons);
    container.appendChild(tabContainer);
    return tabContainer;
  }

  /**
   * Determina si debe mostrar el generador de test
   */
  shouldShowTestGenerator(action) {
    const hasDialogWithFields = action.requiresDialog && action.dialogInfo?.fields?.length > 0;
    const isAuditAction = (action.actionName.includes("AUDIT") || action.actionName.includes("AUDIT_")) && !(action.dialogInfo?.name === "uploadFileDialog");
    const isAWSAttachmentAction = action.dialogInfo?.name === "uploadFileDialog";
    const isRemoveAttachmentAction = action.actionName.includes("REMOVE_ATTACHMENT") || action.actionName.includes("REMOVE_ATTACHMENTS");
    const isOpenAttachmentAction = !isRemoveAttachmentAction && !isAWSAttachmentAction && (action.actionName.includes("OPEN_ATTACHMENT") || action.actionName.includes("ATTACHMENT"));
    const isDialogWithColumnSelection = action.requiresDialog && action.dialogInfo?.gridContent === true && Array.isArray(action.dialogInfo.columns) && action.dialogInfo.columns.length > 0;
    const isReactivateObjectDialog = action.dialogInfo?.name === "reactivateObjectDialog";

    return !action.requiresDialog ||
           hasDialogWithFields ||
           isAuditAction ||
           isOpenAttachmentAction ||
           isRemoveAttachmentAction ||
           isAWSAttachmentAction ||
           isDialogWithColumnSelection ||
           isReactivateObjectDialog;
  }

  /**
   * Crea el contenido de las pestañas
   */
  createTabContents(tabContainer, action, uniqueId, targetContainer) {
    const tabContents = document.createElement("div");

    // Contenido de la pestaña JSON Model
    this.createJsonTabContent(tabContents, action, uniqueId);

    // Contenido de la pestaña Crear Test (si corresponde)
    if (this.shouldShowTestGenerator(action)) {
      this.createTestTabContent(tabContents, action, uniqueId, targetContainer);
    }

    tabContainer.appendChild(tabContents);
  }

  /**
   * Crea el contenido de la pestaña JSON Model
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
    const { testForm, generatorType } = this.createTestForm(action, idSuffix);

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

    this.setupTestListeners(generatorType, idSuffix, targetContainer, action);
  }

  /**
   * Crea el formulario de test según el tipo de acción
   */
  createTestForm(action, idSuffix) {
    let testForm;
    let generatorType = "unknown";

    if (action.dialogInfo?.name === "reactivateObjectDialog") {
      testForm = this.app.testGeneratorReactiveObjectDialog.createForm(idSuffix);
      generatorType = "reactivateObjectDialog";
    } else if (this.isDialogWithColumnSelection(action)) {
      testForm = this.app.testGeneratorDialogWithColumnSelection.createForm(idSuffix);
      generatorType = "dialogWithColumnSelection";
    } else if (this.hasDialogWithFields(action)) {
      testForm = this.app.testGeneratorDialog.createForm(idSuffix);
      generatorType = "dialog";
    } else if (this.isAuditAction(action)) {
      testForm = this.app.testGeneratorAudit.createForm(idSuffix);
      generatorType = "audit";
    } else if (this.isRemoveAttachmentAction(action)) {
      testForm = this.app.testGeneratorRemoveAttachment.createForm(idSuffix);
      generatorType = "removeAttachment";
    } else if (this.isAWSAttachmentAction(action)) {
      testForm = this.app.testGeneratorAWS.createForm(idSuffix);
      generatorType = "aws";
    } else if (this.isOpenAttachmentAction(action)) {
      testForm = this.app.testGeneratorOpenAttachment.createForm(idSuffix);
      generatorType = "openAttachment";
    } else if (action.actionName === "_EXPORT") {
      testForm = this.app.testGeneratorExport.createForm(idSuffix);
      generatorType = "export";
    } else {
      testForm = this.app.testGeneratorNoDialog.createForm(idSuffix);
      generatorType = "noDialog";
    }

    return { testForm, generatorType };
  }

  /**
   * Verifica si es una acción de diálogo con columnas
   */
  isDialogWithColumnSelection(action) {
    return action.requiresDialog && 
           action.dialogInfo?.gridContent === true && 
           Array.isArray(action.dialogInfo.columns) && 
           action.dialogInfo.columns.length > 0;
  }

  /**
   * Verifica si tiene diálogo con campos
   */
  hasDialogWithFields(action) {
    return action.requiresDialog && action.dialogInfo?.fields?.length > 0;
  }

  /**
   * Verifica si es una acción de auditoría
   */
  isAuditAction(action) {
    return (action.actionName.includes("AUDIT") || action.actionName.includes("AUDIT_")) && 
           !(action.dialogInfo?.name === "uploadFileDialog");
  }

  /**
   * Verifica si es una acción de adjunto AWS
   */
  isAWSAttachmentAction(action) {
    return action.dialogInfo?.name === "uploadFileDialog";
  }

  /**
   * Verifica si es una acción de remover adjunto
   */
  isRemoveAttachmentAction(action) {
    return action.actionName.includes("REMOVE_ATTACHMENT") || 
           action.actionName.includes("REMOVE_ATTACHMENTS");
  }

  /**
   * Verifica si es una acción de abrir adjunto
   */
  isOpenAttachmentAction(action) {
    return !this.isRemoveAttachmentAction(action) && 
           !this.isAWSAttachmentAction(action) && 
           (action.actionName.includes("OPEN_ATTACHMENT") || 
            action.actionName.includes("ATTACHMENT"));
  }

  /**
   * Verifica si está en modo regresivo
   */
  isRegressiveMode(targetContainer) {
    return targetContainer ||
           document.getElementById("regressive-navigation-bar") ||
           document.querySelector('.regressive-mode');
  }

  /**
   * Agrega el contenedor de guardado regresivo
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
   * Configura los listeners del test
   */
  setupTestListeners(generatorType, idSuffix, targetContainer, action) {
    const setupListeners = () => {
      if (generatorType === "dialogWithColumnSelection") {
        this.app.testGeneratorDialogWithColumnSelection.setupListeners(idSuffix, targetContainer ? action : null);
      } else if (generatorType === "reactivateObjectDialog") {
        this.app.testGeneratorReactiveObjectDialog.setupListeners(idSuffix, targetContainer ? action : null);
      } else if (generatorType === "dialog") {
        this.app.testGeneratorDialog.setupListeners(idSuffix, targetContainer ? action : null);
      } else if (generatorType === "audit") {
        this.app.testGeneratorAudit.setupListeners(idSuffix, targetContainer ? action : null);
      } else if (generatorType === "removeAttachment") {
        this.app.testGeneratorRemoveAttachment.setupListeners(idSuffix, targetContainer ? action : null);
      } else if (generatorType === "aws") {
        this.app.testGeneratorAWS.setupListeners(idSuffix, targetContainer ? action : null);
      } else if (generatorType === "openAttachment") {
        this.app.testGeneratorOpenAttachment.setupListeners(idSuffix, targetContainer ? action : null);
      } else if (generatorType === "export") {
        this.app.testGeneratorExport.setupListeners(idSuffix, targetContainer ? action : null);
      } else {
        this.app.testGeneratorNoDialog.setupListeners(idSuffix, targetContainer ? action : null);
      }
      this.app.jsonUtils.setupPreviewControls();
    };

    if (targetContainer) {
      setTimeout(setupListeners, 0);
    } else {
      setTimeout(setupListeners, 100);
    }
  }

  /**
   * Maneja el modo regresivo de una sola pantalla
   */
  handleSingleRegressiveMode() {
    const isSingleRegressiveMode =
      this.app.regressiveScreens &&
      this.app.regressiveScreens.length === 1 &&
      !document.getElementById("regressive-navigation-bar");

    if (isSingleRegressiveMode) {
      this.app.testGeneratorRegressive.addSingleRegressiveGenerateBtn();
      this.app.testGeneratorRegressive.createSavedActionsPanel();
    }
  }

  /**
   * Configura el switcher de pestañas
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