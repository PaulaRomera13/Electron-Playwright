/*
 * Archivo principal de la aplicación Playwright Test Generator
 * Maneja la inicialización de la aplicación, la navegación entre pestañas,
 * la selección de acciones y la coordinación entre todos los módulos
 */

// Importación de todos los módulos necesarios para la aplicación
import { SidebarManager } from "./sidebar.js" // Gestor del sidebar y configuración
import { TestGeneratorDialog } from "./families/testGeneratorDialog.js" // Generador para acciones con diálogo
import { TestGeneratorNoDialog } from "./families/testGeneratorNoDialog.js" // Generador para acciones sin diálogo
import { TestGeneratorAudit } from "./families/testGeneratorAudit.js" // Generador para acciones de auditoría
import { TestGeneratorExport } from "./families/testGeneratorExport.js" // Generador para exportación
import { JsonUtils } from "./utils/jsonUtils.js" // Utilidades para manejo de JSON
import { FieldUtils } from "./utils/fieldUtils.js" // Utilidades para manejo de campos
import { TestGeneratorOpenAttachment } from "./families/testGeneratorOpenAttachment.js" // Generador para acciones de abrir adjuntos
import { TestGeneratorRemoveAttachment } from "./families/testGeneratorRemoveAttachment.js" // Generador para remover adjuntos
import { TestGeneratorAWS } from "./families/testGeneratorAWS.js" // Generador para subida AWS
import { TestGeneratorDialogWithColumnSelection } from "./families/testGeneratorDialogWithColumnSelection.js" // Generador para dialogWithColumnSelection
import { TestGeneratorReactiveObjectDialog } from "./families/testGeneratorReactiveObjectDialog.js" // Generador para reactivateObjectDialog
import "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/ace.js";

/**
 * Clase principal que coordina toda la aplicación
 * Maneja el estado global y la comunicación entre módulos
 */
class PlaywrightTestGenerator {
  constructor() {
    // Estado de la aplicación
    this.selectedAction = null // Acción actualmente seleccionada
    this.currentTabSwitcher = null // Función para cambiar entre pestañas
    this.originalTestData = null // Datos originales del test generado
    this.lastHighlightedField = null // Último campo resaltado en el JSON
    this.modelJson = null // Aquí se guardará el modelo cargado dinámicamente
    this.activeTabIdx = 0; // Índice de la tab activa

    // Inicialización de todos los gestores y utilidades
    this.sidebarManager = new SidebarManager(this) // Gestor del sidebar
    this.testGeneratorDialog = new TestGeneratorDialog(this) // Generador con diálogo
    this.testGeneratorNoDialog = new TestGeneratorNoDialog(this) // Generador sin diálogo
    this.testGeneratorAudit = new TestGeneratorAudit(this) // Generador de auditoría
    this.testGeneratorExport = new TestGeneratorExport(this) // Generador de exportación
    this.jsonUtils = new JsonUtils(this) // Utilidades JSON
    this.fieldUtils = new FieldUtils(this) // Utilidades de campos
    this.testGeneratorOpenAttachment = new TestGeneratorOpenAttachment(this) // Generador de abrir adjuntos
    this.testGeneratorRemoveAttachment = new TestGeneratorRemoveAttachment(this) // Generador de remover adjuntos
    this.testGeneratorAWS = new TestGeneratorAWS(this) // Generador de subida AWS
    this.testGeneratorDialogWithColumnSelection = new TestGeneratorDialogWithColumnSelection(this) // Generador para dialogWithColumnSelection
    this.testGeneratorReactiveObjectDialog = new TestGeneratorReactiveObjectDialog(this) // Generador para reactivateObjectDialog
    // Inicializar la aplicación
    this.init()

    // listeners para el botón de actualizar y cerrar modal
    document.getElementById('toggleModelJsonForm').addEventListener('click', () => {
      document.getElementById('modeljsonUploadContainer').style.display = 'flex';
    });
    document.getElementById('closeModelJsonModal').addEventListener('click', () => {
      document.getElementById('modeljsonUploadContainer').style.display = 'none';
    });
    // Listener para el submit del formulario
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
      // Guardar en backend
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
        // Recargar modelo desde backend para reflejar cambios
        await this.init();
      } catch (err) {
        document.getElementById('uploadStatus').textContent = 'Error al guardar: ' + err.message;
        document.getElementById('uploadStatus').style.color = 'red';
      }
    });

    // FUNCIONALIDAD PARA FORMATEAR, COMPRIMIR Y BUSCAR EN EL TEXTAREA DEL MODAL
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

    // Formatear JSON
    formatBtn.addEventListener('click', () => {
      try {
        const obj = JSON.parse(editor.value);
        editor.value = JSON.stringify(obj, null, 2);
      } catch (e) {
        alert('JSON inválido, no se puede formatear');
      }
    });
    // Comprimir JSON
    minifyBtn.addEventListener('click', () => {
      try {
        const obj = JSON.parse(editor.value);
        editor.value = JSON.stringify(obj);
      } catch (e) {
        alert('JSON inválido, no se puede comprimir');
      }
    });
    // Buscar en JSON
    let searchMatches = [];
    let currentMatch = 0;
    function highlightMatches() {
      // No se puede resaltar en textarea, pero sí mostrar el número de coincidencias
      const value = editor.value;
      const term = searchInput.value;
      if (!term) {
        searchCount.textContent = '';
        return;
      }
      // Buscar todas las posiciones
      searchMatches = [];
      let idx = value.indexOf(term);
      while (idx !== -1) {
        searchMatches.push(idx);
        idx = value.indexOf(term, idx + term.length);
      }
      if (searchMatches.length > 0) {
        searchCount.textContent = `${currentMatch + 1} de ${searchMatches.length}`;
        // Seleccionar el match actual
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
      console.log('📦 modelJson recibido del servidor:', data);

      if (!data?.component) {
        throw new Error('JSON sin la propiedad "component"');
      }

      this.modelJson = data;

      // Lógica de renderización que ya tienes:
      this.sidebarManager.renderMainConfig(this.modelJson);
      this.sidebarManager.renderActionsList(this.modelJson);
      this.sidebarManager.renderRowButtonsList(this.modelJson);

    } catch (e) {
      console.error('❌ Error al cargar el modelJson:', e.message);
      alert(`Error al cargar el modelo: ${e.message}`);
    }
  }

  /**
   * Maneja la selección de una acción de la lista
   * @param {Object} action - Objeto de acción seleccionada
   * @param {number} index - Índice de la acción en la lista
   * @param {string} source - 'actions' o 'row_buttons'
   */
  selectAction(action, index, source = 'actions') {
    // Guardar la acción seleccionada en el estado
    this.selectedAction = action

    // Actualizar la selección visual solo en el contenedor correspondiente
    let containerId = source === 'row_buttons' ? 'row-buttons-container' : 'actions-container';
    const container = document.getElementById(containerId);
    if (container) {
      const items = container.querySelectorAll('.action-item');
      items.forEach((item, i) => {
        if (i === index) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
      });
    }

    // Renderizar los detalles de la acción seleccionada
    this.renderActionDetails(action)
  }

  /**
   * Renderiza los detalles de la acción seleccionada con pestañas
   * @param {Object} action - Objeto de acción a mostrar
   */
  renderActionDetails(action) {
    // Obtener el contenedor de detalles y limpiarlo
    const container = document.getElementById("details-container")
    container.innerHTML = ""

    // Crear y agregar el título de la acción
    const title = document.createElement("h2")
    title.innerHTML = `<i class="fas fa-cube"></i> ${action.actionName}`
    title.style.color = "var(--primary-color)"
    title.style.marginBottom = "25px"
    container.appendChild(title)

    // Crear el contenedor principal de pestañas
    const tabContainer = document.createElement("div")
    tabContainer.className = "tab-container"

    // Crear la barra de botones de pestañas
    const tabButtons = document.createElement("div")
    tabButtons.className = "tab-buttons"

    // Crear la pestaña JSON Model (siempre presente)
    const jsonTab = document.createElement("button")
    jsonTab.className = "tab-button active"
    jsonTab.textContent = "JSON Model"
    jsonTab.onclick = () => this.currentTabSwitcher("json-model")
    tabButtons.appendChild(jsonTab)

    // Determinar si mostrar la pestaña de generador de test
    const hasDialogWithFields =
      action.requiresDialog && action.dialogInfo && action.dialogInfo.fields && action.dialogInfo.fields.length > 0
    // Solo audit si contiene AUDIT y NO es uploadFileDialog
    const isAuditAction =
      (action.actionName.includes("AUDIT") || action.actionName.includes("AUDIT_")) &&
      !(action.dialogInfo && action.dialogInfo.name === "uploadFileDialog")
    // AWS SOLO si el dialogInfo.name es uploadFileDialog
    const isAWSAttachmentAction = action.dialogInfo && action.dialogInfo.name === "uploadFileDialog"
    // Detectar acciones de remover adjuntos PRIMERO (más específico)
    const isRemoveAttachmentAction =
      action.actionName.includes("REMOVE_ATTACHMENT") || action.actionName.includes("REMOVE_ATTACHMENTS")

    // Detectar acciones de abrir adjuntos DESPUÉS (menos específico)
    const isOpenAttachmentAction =
      !isRemoveAttachmentAction &&
      !isAWSAttachmentAction && // Solo si NO es AWS attachment
      (action.actionName.includes("OPEN_ATTACHMENT") ||
        action.actionName.includes("OPEN_ATTACHMENTS") ||
        action.actionName.includes("ATTACHMENT"))

    // Detectar si es dialogWithColumnSelection
    const isDialogWithColumnSelection =
      action.requiresDialog &&
      action.dialogInfo &&
      action.dialogInfo.gridContent === true &&
      Array.isArray(action.dialogInfo.columns) &&
      action.dialogInfo.columns.length > 0

    // Detectar si es reactivateObjectDialog
    const isReactivateObjectDialog = action.dialogInfo && action.dialogInfo.name === "reactivateObjectDialog";

    // Debug: mostrar información en consola
    console.log("=== DEBUG ACTION DETECTION ===")
    console.log("Action Name:", action.actionName)
    console.log("Requires Dialog:", action.requiresDialog)
    console.log("Has Dialog With Fields:", hasDialogWithFields)
    console.log("Is Audit Action:", isAuditAction)
    console.log("Is Open Attachment Action:", isOpenAttachmentAction)
    console.log("Is Remove Attachment Action:", isRemoveAttachmentAction)
    console.log("Is Dialog With Column Selection:", isDialogWithColumnSelection)
    console.log("Is Reactivate Object Dialog:", isReactivateObjectDialog)

    // Agregar pestaña de Test Generator si corresponde
    const shouldShowTestGenerator =
      !action.requiresDialog ||
      hasDialogWithFields ||
      isAuditAction ||
      isOpenAttachmentAction ||
      isRemoveAttachmentAction ||
      isAWSAttachmentAction ||
      isDialogWithColumnSelection ||
      isReactivateObjectDialog;
    console.log("Should Show Test Generator:", shouldShowTestGenerator)

    if (shouldShowTestGenerator) {
      const testTab = document.createElement("button")
      testTab.className = "tab-button"
      testTab.textContent = "Crear Test"
      testTab.onclick = () => this.currentTabSwitcher("test-generator")
      tabButtons.appendChild(testTab)
    }

    tabContainer.appendChild(tabButtons)

    // Crear el contenedor de contenidos de pestañas
    const tabContents = document.createElement("div")

    // Crear la pestaña JSON Model
    const jsonTabContent = document.createElement("div")
    jsonTabContent.className = "tab-content active"
    jsonTabContent.id = "json-model"

    const jsonSection = document.createElement("div")
    jsonSection.className = "detail-section"

    const jsonTitle = document.createElement("h3")
    jsonTitle.innerHTML = '<i class="fas fa-code"></i> JSON Model'
    jsonSection.appendChild(jsonTitle)

    // Crear el editor de JSON de solo lectura
    const jsonEditor = document.createElement("textarea")
    jsonEditor.className = "json-viewer"
    jsonEditor.style.width = "100%"
    jsonEditor.style.minHeight = "500px"
    jsonEditor.readOnly = true
    jsonEditor.value = JSON.stringify(action, null, 2)

    jsonSection.appendChild(jsonEditor)
    jsonTabContent.appendChild(jsonSection)

    // Crear la pestaña Test Generator si corresponde
    if (shouldShowTestGenerator) {
      const testTabContent = document.createElement("div")
      testTabContent.className = "tab-content"
      testTabContent.id = "test-generator"

      const testSection = document.createElement("div")
      testSection.className = "detail-section"
      testSection.style.padding = "0"
      testSection.style.background = "transparent"
      testSection.style.border = "none"

      const testTitle = document.createElement("h3")
      testTitle.innerHTML = '<i class="fas fa-flask"></i> Crear Test'
      testTitle.style.marginBottom = "20px"
      testTitle.style.padding = "20px"
      testTitle.style.background = "var(--light-bg)"
      testTitle.style.borderRadius = "8px"
      testSection.appendChild(testTitle)

      const testGenerator = document.createElement("div")
      testGenerator.className = "test-generator"

      // Elegir el tipo de formulario según el tipo de acción
      let testForm
      let generatorType = "unknown"

      if (action.dialogInfo && action.dialogInfo.name === "reactivateObjectDialog") {
        testForm = this.testGeneratorReactiveObjectDialog.createForm()
        generatorType = "reactivateObjectDialog"
      } else if (isDialogWithColumnSelection) {
        testForm = this.testGeneratorDialogWithColumnSelection.createForm()
        generatorType = "dialogWithColumnSelection"
      } else if (hasDialogWithFields) {
        testForm = this.testGeneratorDialog.createForm()
        generatorType = "dialog"
      } else if (isAuditAction) {
        testForm = this.testGeneratorAudit.createForm()
        generatorType = "audit"
      } else if (isRemoveAttachmentAction) {
        testForm = this.testGeneratorRemoveAttachment.createForm()
        generatorType = "removeAttachment"
      } else if (isAWSAttachmentAction) {
        testForm = this.testGeneratorAWS.createForm()
        generatorType = "aws"
      } else if (isOpenAttachmentAction) {
        testForm = this.testGeneratorOpenAttachment.createForm()
        generatorType = "openAttachment"
      } else if (action.actionName === "_EXPORT") {
        testForm = this.testGeneratorExport.createForm()
        generatorType = "export"
      } else {
        testForm = this.testGeneratorNoDialog.createForm()
        generatorType = "noDialog"
      }

      console.log("Selected Generator Type:", generatorType)

      // Crear el contenedor de vista previa
      const testPreview = this.jsonUtils.createPreviewContainer()

      testGenerator.appendChild(testForm)
      testGenerator.appendChild(testPreview)

      testSection.appendChild(testGenerator)
      testTabContent.appendChild(testSection)

      // Agregar contenido de pestaña de test al contenedor
      tabContents.appendChild(testTabContent)

      // Configurar listeners después de agregar al DOM
      setTimeout(() => {
        if (generatorType === "dialogWithColumnSelection") {
          this.testGeneratorDialogWithColumnSelection.setupListeners()
        } else if (generatorType === "reactivateObjectDialog") {
          this.testGeneratorReactiveObjectDialog.setupListeners()
        } else if (generatorType === "dialog") {
          this.testGeneratorDialog.setupListeners()
        } else if (generatorType === "audit") {
          this.testGeneratorAudit.setupListeners()
        } else if (generatorType === "removeAttachment") {
          this.testGeneratorRemoveAttachment.setupListeners()
        } else if (generatorType === "aws") {
          this.testGeneratorAWS.setupListeners()
        } else if (generatorType === "openAttachment") {
          this.testGeneratorOpenAttachment.setupListeners()
        } else if (generatorType === "export") {
          this.testGeneratorExport.setupListeners()
        } else {
          this.testGeneratorNoDialog.setupListeners()
        }
        this.jsonUtils.setupPreviewControls()
      }, 100)
    }

    // Agregar todos los contenidos de pestañas
    tabContents.appendChild(jsonTabContent)

    tabContainer.appendChild(tabContents)
    container.appendChild(tabContainer)

    // Función para cambiar entre pestañas
    this.currentTabSwitcher = (tabId) => {
      // Ocultar todos los contenidos de pestañas
      document.querySelectorAll(".tab-content").forEach((tab) => {
        tab.classList.remove("active")
      })

      // Desactivar todos los botones de pestañas
      document.querySelectorAll(".tab-button").forEach((button) => {
        button.classList.remove("active")
      })

      // Activar la pestaña seleccionada
      const tabContent = document.getElementById(tabId)
      if (tabContent) {
        tabContent.classList.add("active")
      }

      // Activar el botón correspondiente
      document.querySelectorAll(".tab-button").forEach((button) => {
        if (button.textContent.toLowerCase().includes(tabId.split("-")[0])) {
          button.classList.add("active")
        } else if (tabId === "test-generator" && button.textContent === "Crear Test") {
          button.classList.add("active")
        }
      })
    }
  }

  // Métodos getter y setter para acceso desde otros módulos

  /**
   * Obtiene la acción actualmente seleccionada
   * @returns {Object|null} La acción seleccionada o null
   */
  getSelectedAction() {
    return this.selectedAction
  }

  /**
   * Obtiene los datos originales del test
   * @returns {Object|null} Los datos del test o null
   */
  getOriginalTestData() {
    return this.originalTestData
  }

  /**
   * Establece los datos originales del test
   * @param {Object} data - Los datos del test a guardar
   */
  setOriginalTestData(data) {
    this.originalTestData = data
  }

  /**
   * Obtiene el último campo resaltado
   * @returns {string|null} El campo resaltado o null
   */
  getLastHighlightedField() {
    return this.lastHighlightedField
  }

  /**
   * Establece el último campo resaltado
   * @param {string} field - El campo a marcar como resaltado
   */
  setLastHighlightedField(field) {
    this.lastHighlightedField = field
  }

  setActiveTabIdx(idx) {
    this.activeTabIdx = idx;
  }
  getActiveTabIdx() {
    return this.activeTabIdx;
  }
}

// Inicializar la aplicación y hacerla disponible globalmente
window.playwrightApp = new PlaywrightTestGenerator()