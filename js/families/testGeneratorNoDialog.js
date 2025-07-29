// Generador de tests para acciones sin diálogo
import { BaseTestGenerator } from "../baseTestGenerator.js"
import { isTabsComponent, getTabLabels } from "../utils/tabUtils.js"

export class TestGeneratorNoDialog extends BaseTestGenerator {
  /**
   * Constructor del generador de tests sin diálogo
   * @param {Object} app - Referencia a la aplicación principal
   */
  constructor(app) {
    super(app) // Llamar al constructor de la clase base
    this.app = app // Guardar referencia para acceso a métodos globales
  }

  /**
   * Crea el formulario para configurar tests sin diálogo
   * Genera campos básicos para acciones directas
   * @returns {HTMLElement} Elemento DOM del formulario
   */
  createForm(idSuffix = "") {
    // Crear el contenedor principal del formulario
    const form = document.createElement("div")
    form.className = "test-form"

    // --- Selector de idioma para Tabs ---
    let tabLangSelector = ''
    let activeTabIdx = 0
    if (this.app.modelJson && isTabsComponent(this.app.modelJson)) {
      // Por defecto, tab activa = 0 (primera)
      const tab = this.app.modelJson.tabs[0];
      const labelES = tab.tabLabel?.label_es || '';
      const labelEN = tab.tabLabel?.label_en || '';
      tabLangSelector = `
        <div class="form-group">
          <label>Label de la Tab:</label>
          <div class="tab-language-toggle">
            <label><input type="radio" name="tabLang" value="es"> <b>ES:</b> ${labelES}</label>
            <label><input type="radio" name="tabLang" value="en" checked> <b>EN:</b> ${labelEN}</label>
          </div>
        </div>
      `
    }

    // Usar los métodos de la clase base para generar el HTML
    const formHTML = `
      <!-- Alerta informativa sobre el tipo de test -->
      <div class="alert alert-warning">
          <i class="fas fa-info-circle"></i> Configuración de Test para acción sin diálogo
      </div>
      ${this.renderTabLangSelector(this.app.modelJson)}
      ${this.renderObjectByTabsExtras(this.app.modelJson)}
      <!-- Campo para el proceso del menú -->
      <div class="form-group">
          <label for="processName${idSuffix}">Proceso del menú a seleccionar:</label>
          <input type="text" id="processName${idSuffix}" placeholder="Ej: Stock control" data-json-path="desktopMode.label" />
      </div>
      <!-- Campo para el nombre de la pestaña -->
      <div class="form-group">
          <label for="menuOption${idSuffix}">Nombre de la Pestaña (Opción del Menú):</label>
          <input type="text" id="menuOption${idSuffix}" placeholder="Ej: Deviations" data-json-path="desktopMode.screenShotName" />
      </div>
      <!-- Campo para el nombre del botón (solo lectura, se llena automáticamente) -->
      <div class="form-group">
          <label for="buttonName${idSuffix}">Nombre del Botón (ActionName):</label>
          <input type="text" id="buttonName${idSuffix}" class="readonly-field" readonly />
      </div>
      <!-- Campo para el elemento a seleccionar -->
      <div class="form-group">
          <label for="selectName${idSuffix}">Elemento a Seleccionar:</label>
          <input type="text" id="selectName${idSuffix}" placeholder="Ej: HPLC" data-json-path="selectName" />
      </div>
      <!-- Campo para la posición del botón -->
      <div class="form-group">
          <label for="positionButton${idSuffix}">Posición del Botón:</label>
          <input type="text" id="positionButton${idSuffix}" value="0" data-json-path="positionButton" />
      </div>
      <!-- Campo para la posición del elemento a seleccionar -->
      <div class="form-group">
          <label for="positionSelectElement${idSuffix}">Posición del Elemento a Seleccionar:</label>
          <input type="text" id="positionSelectElement${idSuffix}" value="0" data-json-path="positionSelectElement" />
      </div>
      <!-- Checkbox para ocultar botón de acciones -->
      <div class="form-group">
          <div class="checkbox-group">
              <input type="checkbox" id="hideActionsButton${idSuffix}" data-json-path="hideActionsButton" />
              <label for="hideActionsButton${idSuffix}">¿Ocultar botón de Acciones escondidas (...)?</label>  
          </div>
      </div>
      <!-- Configuración del botón de acciones ocultas (inicialmente oculto) -->
      <div class="form-group" id="hideActionsButtonConfig${idSuffix}" style="display: none;">
          <label for="hideActionsButtonLocator${idSuffix}">Locator:</label>
          <input type="text" id="hideActionsButtonLocator${idSuffix}" value="md-icon:has-text('more_horiz')" class="readonly-field" readonly data-json-path="hideActionsButton.locator" />
          <label for="hideActionsButtonPosition${idSuffix}" style="margin-top: 10px;">Position:</label>
          <input type="text" id="hideActionsButtonPosition${idSuffix}" value="0" data-json-path="hideActionsButton.position" />
      </div>
      <!-- Checkbox para añadir configuración de flecha -->
      <div class="form-group">
          <div class="checkbox-group">
              <input type="checkbox" id="addArrowConfig${idSuffix}" data-json-path="arrowDirection" />
              <label for="addArrowConfig${idSuffix}">¿Añadir configuración de flecha?</label>  
          </div>
      </div>
      <!-- Configuración de la flecha (inicialmente oculto) -->
      <div class="form-group" id="arrowConfigContainer${idSuffix}" style="display: none;">
          <label for="arrowDirection${idSuffix}">Dirección de la flecha:</label>
          <select id="arrowDirection${idSuffix}" class="form-control" data-json-path="arrowDirection">
              <option value="down">Abajo</option>
              <option value="up">Arriba</option>
          </select>
          <label for="positionArrow${idSuffix}" style="margin-top: 10px;">Posición de la flecha:</label>
          <input type="text" id="positionArrow${idSuffix}" value="0" data-json-path="positionArrow" />
      </div>
      <!-- Campos para textos de notificación -->
      <div class="form-group">
          <label for="textInNotif1${idSuffix}">Text In Notif 1:</label>
          <input type="text" id="textInNotif1${idSuffix}" placeholder="Ej: Created" data-json-path="textInNotif1" />
      </div>
      <div class="form-group">
          <label for="textInNotif2${idSuffix}">Text In Notif 2:</label>
          <input type="text" id="textInNotif2${idSuffix}" placeholder="Ej: with" data-json-path="textInNotif2" />
      </div>
      <div class="form-group">
          <label for="textInNotif3${idSuffix}">Text In Notif 3:</label>
          <input type="text" id="textInNotif3${idSuffix}" placeholder="Ej: success" data-json-path="textInNotif3" />
      </div>
    `

    // Establecer el HTML en el formulario y retornarlo
    form.innerHTML = formHTML
    setTimeout(() => this.updatePreview(idSuffix), 0)
    return form
  }

  /**
   * Configura todos los event listeners para el formulario sin diálogo
   * Usa la funcionalidad común de la clase base
   */
  setupListeners(idSuffix = "") {
    // Usar el método común de la clase base
    this.setupCommonListeners(() => this.updatePreview(idSuffix), idSuffix)

    // Obtener referencias a todos los elementos del formulario
    const inputs = document.querySelectorAll(`.test-form input[id$='${idSuffix}'], .test-form select[id$='${idSuffix}'], .test-form textarea[id$='${idSuffix}']`)
    const checkbox = document.getElementById(`hideActionsButton${idSuffix}`)
    const hideConfig = document.getElementById(`hideActionsButtonConfig${idSuffix}`)
    const arrowCheckbox = document.getElementById(`addArrowConfig${idSuffix}`)
    const arrowConfigContainer = document.getElementById(`arrowConfigContainer${idSuffix}`)
    const preview = document.getElementById(`testPreview${idSuffix}`)

    // Establecer nombre del botón desde la acción seleccionada
    const selectedAction = this.app.getSelectedAction()
    if (selectedAction) {
      document.getElementById(`buttonName${idSuffix}`).value = selectedAction.actionName
    }

    // Configurar checkbox para ocultar botón de acciones
    if (checkbox) {
      checkbox.addEventListener("change", () => {
        // Mostrar/ocultar configuración adicional según el estado del checkbox
        hideConfig.style.display = checkbox.checked ? "block" : "none"
        this.updatePreview(idSuffix) // Actualizar vista previa
        // Resaltar la ruta JSON correspondiente
        this.app.jsonUtils.highlightJsonPath(checkbox.getAttribute("data-json-path"))
      })
    }

    // Configurar checkbox para configuración de flecha
    if (arrowCheckbox) {
      arrowCheckbox.addEventListener("change", () => {
        // Mostrar/ocultar configuración de flecha según el estado del checkbox
        arrowConfigContainer.style.display = arrowCheckbox.checked ? "block" : "none"
        this.updatePreview(idSuffix) // Actualizar vista previa
        // Resaltar la ruta JSON correspondiente
        this.app.jsonUtils.highlightJsonPath(arrowCheckbox.getAttribute("data-json-path"))
      })
    }

    // Configurar listeners para todos los inputs del formulario
    inputs.forEach((input) => {
      // Evento 'input' para cambios en tiempo real
      input.addEventListener("input", () => {
        this.updatePreview(idSuffix) // Actualizar vista previa
        if (input.hasAttribute("data-json-path")) {
          // Resaltar la ruta JSON correspondiente si existe
          this.app.jsonUtils.highlightJsonPath(input.getAttribute("data-json-path"))
        }
      })
      // Evento 'change' para cambios confirmados
      input.addEventListener("change", () => {
        this.updatePreview(idSuffix) // Actualizar vista previa
        if (input.hasAttribute("data-json-path")) {
          // Resaltar la ruta JSON correspondiente si existe
          this.app.jsonUtils.highlightJsonPath(input.getAttribute("data-json-path"))
        }
      })
    })

    // Control dinámico de visibilidad para ObjectByTabs (Seleccionar/Buscar)
    const radios = document.getElementsByName('objectByTabsSearchType');
    const selectGroup = document.getElementById('objectByTabsSelectGroup');
    const searchGroup = document.getElementById('objectByTabsSearchGroup');
    function updateSearchType() {
      if (!radios.length || !selectGroup || !searchGroup) return;
      const selected = Array.from(radios).find(r => r.checked)?.value || 'select';
      if (selected === 'select') {
        selectGroup.style.display = '';
        searchGroup.style.display = 'none';
      } else {
        selectGroup.style.display = 'none';
        searchGroup.style.display = '';
      }
      // Actualizar la vista previa del JSON al cambiar
      if (typeof _this !== 'undefined') _this.updatePreview(idSuffix);
    }
    const _this = this;
    radios.forEach(radio => radio.addEventListener('change', updateSearchType));
    setTimeout(updateSearchType, 0);

    // Realizar actualización inicial de la vista previa
    this.updatePreview(idSuffix)
  }

  /**
   * Actualiza la vista previa del JSON basada en los valores del formulario
   * Usa los métodos comunes de la clase base
   */
  updatePreview(idSuffix = "") {
    const checkbox = document.getElementById(`hideActionsButton${idSuffix}`);
    const arrowCheckbox = document.getElementById(`addArrowConfig${idSuffix}`);
    // Obtener datos comunes usando el método de la clase base
    const formData = {
      processName: document.getElementById(`processName${idSuffix}`) ? document.getElementById(`processName${idSuffix}`).value : "",
      menuOption: document.getElementById(`menuOption${idSuffix}`) ? document.getElementById(`menuOption${idSuffix}`).value : "",
      selectName: document.getElementById(`selectName${idSuffix}`) ? document.getElementById(`selectName${idSuffix}`).value : "",
      positionButton: document.getElementById(`positionButton${idSuffix}`) ? document.getElementById(`positionButton${idSuffix}`).value : "0",
      positionSelectElement: document.getElementById(`positionSelectElement${idSuffix}`) ? document.getElementById(`positionSelectElement${idSuffix}`).value : "0",
      hideActionsButton: checkbox ? checkbox.checked : false,
      hideActionsButtonLocator: document.getElementById(`hideActionsButtonLocator${idSuffix}`) ? document.getElementById(`hideActionsButtonLocator${idSuffix}`).value : "",
      hideActionsButtonPosition: document.getElementById(`hideActionsButtonPosition${idSuffix}`) ? document.getElementById(`hideActionsButtonPosition${idSuffix}`).value : "0",
      addArrowConfig: arrowCheckbox ? arrowCheckbox.checked : false,
      arrowDirection: document.getElementById(`arrowDirection${idSuffix}`) ? document.getElementById(`arrowDirection${idSuffix}`).value : "down",
      positionArrow: document.getElementById(`positionArrow${idSuffix}`) ? document.getElementById(`positionArrow${idSuffix}`).value : "0",
      textInNotif1: document.getElementById(`textInNotif1${idSuffix}`) ? document.getElementById(`textInNotif1${idSuffix}`).value : "",
      textInNotif2: document.getElementById(`textInNotif2${idSuffix}`) ? document.getElementById(`textInNotif2${idSuffix}`).value : "",
      textInNotif3: document.getElementById(`textInNotif3${idSuffix}`) ? document.getElementById(`textInNotif3${idSuffix}`).value : "",
      fieldStates: {},
      fieldValues: {},
    }

    // Generar los datos de test y actualizar la vista previa
    const testData = this.generateTestData(formData)
    this.applyTabProperties(testData, this.app.modelJson);
    this.applyObjectByTabsExtras(testData, this.app.modelJson);
    this.updatePreviewDisplay(testData)
  }

  /**
   * Genera los datos de test para acciones sin diálogo
   * @param {Object} formData - Datos recopilados del formulario
   * @param {Object} [jsonConfig] - JSON de configuración (puede ser el SingleView o Tabs)
   * @param {'es'|'en'} [lang='es'] - Idioma para los tabs
   * @returns {Object} Objeto con los datos de test generados
   */
  generateTestData(formData, jsonConfig = null, lang = 'es') {
    const testDataTemplate = this.app.jsonUtils.getTestDataTemplate()
    const testData = JSON.parse(JSON.stringify(testDataTemplate))
    this.applyCommonTestData(testData, formData)
    const modes = ["desktopMode", "mobileMode", "tabletRetratoMode"]
    modes.forEach((mode) => {
      testData[mode].label = formData.processName
      testData[mode].view = formData.processName
      testData[mode].viewScreenShotLabel = formData.processName
      testData[mode].screenShotName = formData.menuOption
    })
    testData.mobileMode.label = `.${formData.processName.toLowerCase()}`
    const selectedAction = this.app.getSelectedAction()
    testData.buttonName = selectedAction ? selectedAction.actionName : ""
    if (formData.hideActionsButton) {
      testData.hideActionsButton = {
        locator: formData.hideActionsButtonLocator,
        position: formData.hideActionsButtonPosition,
      }
    }
    if (formData.addArrowConfig) {
      testData.arrowDirection = formData.arrowDirection
      testData.positionArrow = formData.positionArrow
    } else {
      delete testData.arrowDirection
      delete testData.positionArrow
      delete testData.screenShotsArrow
    }
    
    // --- Lógica para Tabs: añadir propiedades directamente, no en array ---
    const modelJson = jsonConfig || this.app.modelJson;
    if (modelJson && isTabsComponent(modelJson)) {
      let activeTabIdx = 0;
      let tabLang = 'es';
      const langInput = document.querySelector('input[name="tabLang"]:checked');
      if (langInput) tabLang = langInput.value;
      const tab = modelJson.tabs[activeTabIdx];
      const label = tabLang === 'en' ? tab.tabLabel?.label_en : tab.tabLabel?.label_es;
      testData.phraseTab = 'Click on Tab';
      testData.tab = label;
      testData.screenShotTab = label;
    }
    return testData
  }
}