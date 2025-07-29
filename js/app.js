/*
 * Archivo principal de la aplicación Playwright Test Generator
 * Maneja la inicialización de la aplicación, la navegación entre pestañas,
 * la selección de acciones y la coordinación entre todos los módulos
 */

// Importación de todos los módulos necesarios para la aplicación
import { SidebarManager } from "./sidebar.js";
import { TestGeneratorDialog } from "./families/testGeneratorDialog.js";
import { TestGeneratorNoDialog } from "./families/testGeneratorNoDialog.js";
import { TestGeneratorAudit } from "./families/testGeneratorAudit.js";
import { TestGeneratorExport } from "./families/testGeneratorExport.js";
import { JsonUtils } from "./utils/jsonUtils.js";
import { FieldUtils } from "./utils/fieldUtils.js";
import { TestGeneratorOpenAttachment } from "./families/testGeneratorOpenAttachment.js";
import { TestGeneratorRemoveAttachment } from "./families/testGeneratorRemoveAttachment.js";
import { TestGeneratorAWS } from "./families/testGeneratorAWS.js";
import { TestGeneratorDialogWithColumnSelection } from "./families/testGeneratorDialogWithColumnSelection.js";
import { TestGeneratorReactiveObjectDialog } from "./families/testGeneratorReactiveObjectDialog.js";
import "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/ace.js";
import { TestGeneratorRegressive } from "./families/testGeneratorRegressive.js";

/**
 * Clase principal que coordina toda la aplicación
 * Maneja el estado global y la comunicación entre módulos
 */
class PlaywrightTestGenerator {
  constructor() {
    this.selectedAction = null;
    this.currentTabSwitcher = null;
    this.originalTestData = null;
    this.lastHighlightedField = null;
    this.modelJson = null;
    this.activeTabIdx = 0;
    this.regressiveScreens = null;
    this.currentRegressiveScreenIndex = 0;

    this.sidebarManager = new SidebarManager(this);
    this.testGeneratorDialog = new TestGeneratorDialog(this);
    this.testGeneratorNoDialog = new TestGeneratorNoDialog(this);
    this.testGeneratorAudit = new TestGeneratorAudit(this);
    this.testGeneratorExport = new TestGeneratorExport(this);
    this.jsonUtils = new JsonUtils(this);
    this.fieldUtils = new FieldUtils(this);
    this.testGeneratorOpenAttachment = new TestGeneratorOpenAttachment(this);
    this.testGeneratorRemoveAttachment = new TestGeneratorRemoveAttachment(this);
    this.testGeneratorAWS = new TestGeneratorAWS(this);
    this.testGeneratorDialogWithColumnSelection = new TestGeneratorDialogWithColumnSelection(this);
    this.testGeneratorReactiveObjectDialog = new TestGeneratorReactiveObjectDialog(this);
    this.testGeneratorRegressive = new TestGeneratorRegressive(this);

    this.init();

    // Eventos del modal de JSON
    document.getElementById('toggleModelJsonForm').addEventListener('click', () => {
      document.getElementById('modeljsonUploadContainer').style.display = 'flex';
    });
    document.getElementById('closeModelJsonModal').addEventListener('click', () => {
      document.getElementById('modeljsonUploadContainer').style.display = 'none';
    });

    document.getElementById('uploadForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const editor = document.getElementById('modelJsonEditor');
      let json;
      try {
        json = JSON.parse(editor.value);
      } catch (err) {
        document.getElementById('uploadStatus').textContent = 'JSON inválido';
        document.getElementById('uploadStatus').style.color = 'red';
        return;
      }
      try {
        const res = await fetch('http://localhost:3001/upload-model', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(json)
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || 'Error desconocido');
        document.getElementById('uploadStatus').textContent = '¡Modelo actualizado y guardado!';
        document.getElementById('uploadStatus').style.color = 'green';
        document.getElementById('modeljsonUploadContainer').style.display = 'none';
        await this.init();
      } catch (err) {
        document.getElementById('uploadStatus').textContent = 'Error al guardar: ' + err.message;
        document.getElementById('uploadStatus').style.color = 'red';
      }
    });

    // Botón de test regresivo
    const regressiveBtn = document.getElementById('regressiveTestButton');
    if (regressiveBtn) {
      regressiveBtn.addEventListener('click', () => {
        this.testGeneratorRegressive.showRegressiveDialog();
      });
    }

    // JSON editor modal helpers
    const editor = document.getElementById('modelJsonEditor');
    const formatBtn = document.getElementById('formatJsonBtn');
    const minifyBtn = document.getElementById('minifyJsonBtn');
    const searchBtn = document.getElementById('searchJsonBtn');
    const searchBox = document.getElementById('jsonSearchBox');
    const searchInput = document.getElementById('jsonSearchInput');
    const searchCount = document.getElementById('jsonSearchCount');
    const searchPrev = document.getElementById('jsonSearchPrev');
    const searchNext = document.getElementById('jsonSearchNext');
    const searchClose = document.getElementById('jsonSearchClose');

    formatBtn.addEventListener('click', () => {
      try {
        const obj = JSON.parse(editor.value);
        editor.value = JSON.stringify(obj, null, 2);
      } catch {
        alert('JSON inválido, no se puede formatear');
      }
    });

    minifyBtn.addEventListener('click', () => {
      try {
        const obj = JSON.parse(editor.value);
        editor.value = JSON.stringify(obj);
      } catch {
        alert('JSON inválido, no se puede comprimir');
      }
    });

    let searchMatches = [];
    let currentMatch = 0;

    function highlightMatches() {
      const value = editor.value;
      const term = searchInput.value;
      if (!term) {
        searchCount.textContent = '';
        return;
      }
      searchMatches = [];
      let idx = value.indexOf(term);
      while (idx !== -1) {
        searchMatches.push(idx);
        idx = value.indexOf(term, idx + term.length);
      }
      if (searchMatches.length > 0) {
        searchCount.textContent = `${currentMatch + 1} de ${searchMatches.length}`;
        const start = searchMatches[currentMatch];
        editor.focus();
        editor.setSelectionRange(start, start + term.length);
      } else {
        searchCount.textContent = '0';
      }
    }

    searchBtn.addEventListener('click', () => {
      searchBox.style.display = 'flex';
      searchInput.focus();
      highlightMatches();
    });

    searchInput.addEventListener('input', () => {
      currentMatch = 0;
      highlightMatches();
    });

    searchPrev.addEventListener('click', () => {
      if (searchMatches.length === 0) return;
      currentMatch = (currentMatch - 1 + searchMatches.length) % searchMatches.length;
      highlightMatches();
    });

    searchNext.addEventListener('click', () => {
      if (searchMatches.length === 0) return;
      currentMatch = (currentMatch + 1) % searchMatches.length;
      highlightMatches();
    });

    searchClose.addEventListener('click', () => {
      searchBox.style.display = 'none';
      searchInput.value = '';
      searchCount.textContent = '';
      editor.setSelectionRange(0, 0);
      editor.focus();
    });
  }

  async init() {
    try {
      const endpoint = 'http://localhost:3001/model-json';
      const res = await fetch(endpoint, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data?.component) throw new Error('JSON sin la propiedad "component"');
      this.modelJson = data;
      this.sidebarManager.renderMainConfig(this.modelJson);
      this.sidebarManager.renderActionsList(this.modelJson);
      this.sidebarManager.renderRowButtonsList(this.modelJson);
    } catch (e) {
      console.error('❌ Error al cargar el modelJson:', e.message);
      alert(`Error al cargar el modelo: ${e.message}`);
    }
  }

  selectAction(action, index, source = 'actions') {
    this.selectedAction = action;
    let containerId = source === 'row_buttons' ? 'row-buttons-container' : 'actions-container';
    const container = document.getElementById(containerId);
    if (container) {
      const items = container.querySelectorAll('.action-item');
      items.forEach((item, i) => {
        item.classList.toggle('selected', i === index);
      });
    }

    const isRegressiveMode =
      document.getElementById("regressive-navigation-bar") !== null ||
      document.querySelector('.regressive-mode') !== null ||
      (this.regressiveScreens && this.regressiveScreens.length > 0) ||
      (this.testGeneratorRegressive && this.testGeneratorRegressive.savedRegressiveActions.length > 0);

    let targetContainer = null;
    if (isRegressiveMode) {
      targetContainer = document.getElementById("details-container");
    }

    this.renderActionDetails(action, targetContainer);
  }

  renderActionDetails(action, targetContainer) {
    const container = targetContainer || document.getElementById("details-container");
    if (!container) return;

    const regressiveNavBar = document.getElementById("regressive-navigation-bar");
    const regressiveNavBarParent = regressiveNavBar ? regressiveNavBar.parentNode : null;

    container.innerHTML = "";

    if (regressiveNavBar && regressiveNavBarParent === container) {
      container.appendChild(regressiveNavBar);
    }

    const uniqueId = targetContainer ? `_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : '';

    const title = document.createElement("h2");
    title.innerHTML = `<i class="fas fa-cube"></i> ${action.actionName}`;
    title.style.color = "var(--primary-color)";
    title.style.marginBottom = "25px";
    container.appendChild(title);

    const tabContainer = document.createElement("div");
    tabContainer.className = "tab-container";

    const tabButtons = document.createElement("div");
    tabButtons.className = "tab-buttons";

    const jsonTab = document.createElement("button");
    jsonTab.className = "tab-button active";
    jsonTab.textContent = "JSON Model";
    jsonTab.onclick = () => this.currentTabSwitcher(`json-model${uniqueId}`, targetContainer);
    tabButtons.appendChild(jsonTab);

    const hasDialogWithFields = action.requiresDialog && action.dialogInfo?.fields?.length > 0;
    const isAuditAction = (action.actionName.includes("AUDIT") || action.actionName.includes("AUDIT_")) && !(action.dialogInfo?.name === "uploadFileDialog");
    const isAWSAttachmentAction = action.dialogInfo?.name === "uploadFileDialog";
    const isRemoveAttachmentAction = action.actionName.includes("REMOVE_ATTACHMENT") || action.actionName.includes("REMOVE_ATTACHMENTS");
    const isOpenAttachmentAction = !isRemoveAttachmentAction && !isAWSAttachmentAction && (action.actionName.includes("OPEN_ATTACHMENT") || action.actionName.includes("ATTACHMENT"));
    const isDialogWithColumnSelection = action.requiresDialog && action.dialogInfo?.gridContent === true && Array.isArray(action.dialogInfo.columns) && action.dialogInfo.columns.length > 0;
    const isReactivateObjectDialog = action.dialogInfo?.name === "reactivateObjectDialog";

    const shouldShowTestGenerator =
      !action.requiresDialog ||
      hasDialogWithFields ||
      isAuditAction ||
      isOpenAttachmentAction ||
      isRemoveAttachmentAction ||
      isAWSAttachmentAction ||
      isDialogWithColumnSelection ||
      isReactivateObjectDialog;

    if (shouldShowTestGenerator) {
      const testTab = document.createElement("button");
      testTab.className = "tab-button";
      testTab.textContent = "Crear Test";
      testTab.onclick = () => this.currentTabSwitcher(`test-generator${uniqueId}`, targetContainer);
      tabButtons.appendChild(testTab);
    }

    tabContainer.appendChild(tabButtons);

    const tabContents = document.createElement("div");

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

    if (shouldShowTestGenerator) {
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
      let testForm;
      let generatorType = "unknown";

      if (action.dialogInfo?.name === "reactivateObjectDialog") {
        testForm = this.testGeneratorReactiveObjectDialog.createForm(idSuffix);
        generatorType = "reactivateObjectDialog";
      } else if (isDialogWithColumnSelection) {
        testForm = this.testGeneratorDialogWithColumnSelection.createForm(idSuffix);
        generatorType = "dialogWithColumnSelection";
      } else if (hasDialogWithFields) {
        testForm = this.testGeneratorDialog.createForm(idSuffix);
        generatorType = "dialog";
      } else if (isAuditAction) {
        testForm = this.testGeneratorAudit.createForm(idSuffix);
        generatorType = "audit";
      } else if (isRemoveAttachmentAction) {
        testForm = this.testGeneratorRemoveAttachment.createForm(idSuffix);
        generatorType = "removeAttachment";
      } else if (isAWSAttachmentAction) {
        testForm = this.testGeneratorAWS.createForm(idSuffix);
        generatorType = "aws";
      } else if (isOpenAttachmentAction) {
        testForm = this.testGeneratorOpenAttachment.createForm(idSuffix);
        generatorType = "openAttachment";
      } else if (action.actionName === "_EXPORT") {
        testForm = this.testGeneratorExport.createForm(idSuffix);
        generatorType = "export";
      } else {
        testForm = this.testGeneratorNoDialog.createForm(idSuffix);
        generatorType = "noDialog";
      }

      const testPreview = this.jsonUtils.createPreviewContainer();
      testGenerator.appendChild(testForm);
      testGenerator.appendChild(testPreview);

      const isRegressiveMode =
        targetContainer ||
        document.getElementById("regressive-navigation-bar") ||
        document.querySelector('.regressive-mode');

      if (isRegressiveMode) {
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
          this.saveRegressiveAction(action, idSuffix, container);
        };

        const savedCount = document.createElement("div");
        savedCount.className = "regressive-saved-count";
        savedCount.style.cssText = `margin-top: 10px; font-size: 12px; color: #666;`;
        savedCount.textContent = `Acciones guardadas: ${this.testGeneratorRegressive.savedRegressiveActions.length}`;

        regressiveSaveContainer.appendChild(saveButton);
        regressiveSaveContainer.appendChild(savedCount);
        testGenerator.appendChild(regressiveSaveContainer);
      }

      testSection.appendChild(testGenerator);
      testTabContent.appendChild(testSection);
      tabContents.appendChild(testTabContent);

      const setupListeners = () => {
        if (generatorType === "dialogWithColumnSelection") {
          this.testGeneratorDialogWithColumnSelection.setupListeners(idSuffix, targetContainer ? action : null);
        } else if (generatorType === "reactivateObjectDialog") {
          this.testGeneratorReactiveObjectDialog.setupListeners(idSuffix, targetContainer ? action : null);
        } else if (generatorType === "dialog") {
          this.testGeneratorDialog.setupListeners(idSuffix, targetContainer ? action : null);
        } else if (generatorType === "audit") {
          this.testGeneratorAudit.setupListeners(idSuffix, targetContainer ? action : null);
        } else if (generatorType === "removeAttachment") {
          this.testGeneratorRemoveAttachment.setupListeners(idSuffix, targetContainer ? action : null);
        } else if (generatorType === "aws") {
          this.testGeneratorAWS.setupListeners(idSuffix, targetContainer ? action : null);
        } else if (generatorType === "openAttachment") {
          this.testGeneratorOpenAttachment.setupListeners(idSuffix, targetContainer ? action : null);
        } else if (generatorType === "export") {
          this.testGeneratorExport.setupListeners(idSuffix, targetContainer ? action : null);
        } else {
          this.testGeneratorNoDialog.setupListeners(idSuffix, targetContainer ? action : null);
        }
        this.jsonUtils.setupPreviewControls();
      };

      if (targetContainer) {
        setTimeout(setupListeners, 0);
      } else {
        setTimeout(setupListeners, 100);
      }
    }

    tabContainer.appendChild(tabContents);
    container.appendChild(tabContainer);

    // 🔁 Re-agregar botón y panel si estamos en modo regresivo de una sola pantalla
    const isSingleRegressiveMode =
      this.regressiveScreens &&
      this.regressiveScreens.length === 1 &&
      !document.getElementById("regressive-navigation-bar");

    if (isSingleRegressiveMode) {
      this.testGeneratorRegressive.addSingleRegressiveGenerateBtn();
      this.testGeneratorRegressive.createSavedActionsPanel();
    }

    this.currentTabSwitcher = (tabId, targetContainer) => {
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

  getSelectedAction() {
    return this.selectedAction;
  }

  getOriginalTestData() {
    return this.originalTestData;
  }

  setOriginalTestData(data) {
    this.originalTestData = data;
  }

  getLastHighlightedField() {
    return this.lastHighlightedField;
  }

  setLastHighlightedField(field) {
    this.lastHighlightedField = field;
  }

  setActiveTabIdx(idx) {
    this.activeTabIdx = idx;
  }

  getActiveTabIdx() {
    return this.activeTabIdx;
  }

  saveRegressiveAction(action, idSuffix, targetContainer) {
    const previewContainer = targetContainer.querySelector('.preview-json');
    if (!previewContainer) {
      alert('No se encontró la vista previa del JSON');
      return;
    }

    let jsonData;
    try {
      jsonData = JSON.parse(previewContainer.textContent);
      if (jsonData && typeof jsonData === 'object' && jsonData.testDataGame) {
        jsonData = jsonData.testDataGame;
      }
    } catch (e) {
      alert('Error al parsear el JSON: ' + e.message);
      return;
    }

    const regressiveAction = {
      actionName: action.actionName,
      screenIndex: this.currentRegressiveScreenIndex || 0,
      screenName: this.regressiveScreens ? this.regressiveScreens[this.currentRegressiveScreenIndex]?.screenName : `Pantalla ${this.currentRegressiveScreenIndex + 1}`,
      jsonData,
      timestamp: new Date().toISOString()
    };

    const existingIndex = this.testGeneratorRegressive.savedRegressiveActions.findIndex(
      saved => saved.actionName === action.actionName && saved.screenIndex === regressiveAction.screenIndex
    );

    if (existingIndex !== -1) {
      this.testGeneratorRegressive.savedRegressiveActions[existingIndex] = regressiveAction;
    } else {
      this.testGeneratorRegressive.savedRegressiveActions.push(regressiveAction);
    }

    const countContainer = targetContainer || document.getElementById("details-container");
    const savedCount = countContainer.querySelector('.regressive-saved-count');
    if (savedCount) {
      savedCount.textContent = `Acciones guardadas: ${this.testGeneratorRegressive.savedRegressiveActions.length}`;
    }

    const saveButton = countContainer.querySelector('.regressive-save-btn');
    if (saveButton) {
      const originalText = saveButton.innerHTML;
      saveButton.innerHTML = '<i class="fas fa-check"></i> ¡Guardado!';
      saveButton.style.background = '#28a745';
      setTimeout(() => {
        saveButton.innerHTML = originalText;
        saveButton.style.background = 'var(--primary-color)';
      }, 2000);
    }

    this.testGeneratorRegressive.updateSavedActionsList();
  }
}

// Inicializar la aplicación
window.playwrightApp = new PlaywrightTestGenerator();