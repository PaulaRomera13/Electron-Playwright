// Generador de tests para exportación
import { BaseTestGenerator } from "../baseTestGenerator.js"

export class TestGeneratorExport extends BaseTestGenerator {
  constructor(app) {
    super(app)
  }

  showExportTestGenerator() {
    const container = document.getElementById("details-container")
    container.innerHTML = ""

    // Título de la acción
    const title = document.createElement("h2")
    title.innerHTML = `<i class="fas fa-download"></i> Export Test Configuration`
    title.style.color = "var(--primary-color)"
    title.style.marginBottom = "25px"
    container.appendChild(title)

    const testGenerator = document.createElement("div")
    testGenerator.className = "test-generator"

    const testForm = this.createExportForm()

    // Usar el mismo contenedor de vista previa que los otros generadores
    const testPreview = this.app.jsonUtils.createPreviewContainer()

    testGenerator.appendChild(testForm)
    testGenerator.appendChild(testPreview)
    container.appendChild(testGenerator)

    // Configurar listeners
    this.setupExportTestGeneratorListeners()
  }

  createExportForm() {
    const testForm = document.createElement("div")
    testForm.className = "test-form"

    // Verificar si allowUserSelectColumns está habilitado
    const tableConfig = this.modelJson.view_definition[1]
    const allowUserSelectColumns = tableConfig.downloadable && tableConfig.downloadable.allowUserSelectColumns

    // --- Selector de idioma para Tabs ---
    let tabLangSelector = ''
    if (this.modelJson && this.modelJson.component === 'Tabs' && Array.isArray(this.modelJson.tabs)) {
      const tab = this.modelJson.tabs[0];
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
    let formHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> Configuración de Test para exportación
            </div>
            ${this.renderTabLangSelector(this.modelJson)}
            ${this.renderObjectByTabsExtras(this.modelJson)}

            <div class="form-group">
                <label for="exportProcessName">Proceso del menú a seleccionar:</label>
                <input type="text" id="exportProcessName" placeholder="Ej: Stock control" data-json-path="desktopMode.label" />
            </div>

            <div class="form-group">
                <label for="exportMenuOption">Nombre de la Pestaña (Opción del Menú):</label>
                <input type="text" id="exportMenuOption" placeholder="Ej: Deviations" data-json-path="desktopMode.screenShotName" />
            </div>

            <div class="form-group">
                <label for="exportDownloadPath">Ruta de descarga:</label>
                <input type="text" id="exportDownloadPath" value="./export" data-json-path="downloadPath" />
            </div>

            <div class="form-group">
                <label for="exportSelectName">Elemento a Seleccionar:</label>
                <input type="text" id="exportSelectName" placeholder="Ej: HPLC" data-json-path="selectName" />
            </div>

            <div class="form-group">
                <label for="exportPositionButton">Posición del Botón:</label>
                <input type="text" id="exportPositionButton" value="0" data-json-path="positionButton" />
            </div>

            <div class="form-group">
                <label for="exportPositionSelectElement">Posición del Elemento a Seleccionar:</label>
                <input type="text" id="exportPositionSelectElement" value="0" data-json-path="positionSelectElement" />
            </div>
        `

    // Agregar campos de selección de columnas si allowUserSelectColumns es true
    if (allowUserSelectColumns) {
      formHTML += `
                <div class="form-section">
                    <h4><i class="fas fa-columns"></i> Configuración de Columnas</h4>
                    
                    <div class="bulk-field-controls">
                        <button type="button" class="bulk-btn enable-btn" id="enableAllExportColumns">
                            <i class="fas fa-check-circle"></i> Activar Todos
                        </button>
                        <button type="button" class="bulk-btn disable-btn" id="disableAllExportColumns">
                            <i class="fas fa-times-circle"></i> Desactivar Todos
                        </button>
                    </div>

                    <div class="field-group" id="field-columnsToPrint">
                        <div class="field-header">
                            <span class="field-label">Columnas a Exportar (separadas por coma)</span>
                            <div class="field-toggle">
                                <input type="checkbox" id="enable-columnsToPrint" checked data-json-path="columnsToPrint" />
                                <label for="enable-columnsToPrint" class="toggle-label">Incluir en test</label>
                            </div>
                        </div>
                        
                        <div class="field-controls" id="controls-columnsToPrint">
                            <input type="text" class="field-value" id="value-columnsToPrint" placeholder="Ej: order_number,map_icon_top,map_icon_w" data-json-path="columnsToPrint" />
                        </div>
                    </div>

                    <div class="field-group" id="field-buttonOk">
                        <div class="field-header">
                            <span class="field-label">Texto del Botón OK</span>
                            <div class="field-toggle">
                                <input type="checkbox" id="enable-buttonOk" checked data-json-path="buttonOk" />
                                <label for="enable-buttonOk" class="toggle-label">Incluir en test</label>
                            </div>
                        </div>
                        
                        <div class="field-controls" id="controls-buttonOk">
                            <input type="text" class="field-value" id="value-buttonOk" value="OK" data-json-path="buttonOk" />
                        </div>
                    </div>
                </div>
            `
    }

    formHTML += `
            <div class="form-group">
                <div class="checkbox-group">
                    <input type="checkbox" id="exportHideActionsButton" data-json-path="hideActionsButton" />
                    <label for="exportHideActionsButton">¿Ocultar botón de Acciones escondidas (...)?</label>  
                </div>
            </div>

            <div class="form-group" id="exportHideActionsButtonConfig" style="display: none;">
                <label for="exportHideActionsButtonLocator">Locator:</label>
                <input type="text" id="exportHideActionsButtonLocator" value="md-icon:has-text('more_horiz')" class="readonly-field" readonly data-json-path="hideActionsButton.locator" />
                
                <label for="exportHideActionsButtonPosition" style="margin-top: 10px;">Position:</label>
                <input type="text" id="exportHideActionsButtonPosition" value="0" data-json-path="hideActionsButton.position" />
            </div>

            <div class="form-group">
                <div class="checkbox-group">
                    <input type="checkbox" id="exportAddArrowConfig" data-json-path="arrowDirection" />
                    <label for="exportAddArrowConfig">¿Añadir configuración de flecha?</label>  
                </div>
            </div>

            <div class="form-group" id="exportArrowConfigContainer" style="display: none;">
                <label for="exportArrowDirection">Dirección de la flecha:</label>
                <select id="exportArrowDirection" class="form-control" data-json-path="arrowDirection">
                    <option value="down">Abajo</option>
                    <option value="up">Arriba</option>
                </select>
                
                <label for="exportPositionArrow" style="margin-top: 10px;">Posición de la flecha:</label>
                <input type="text" id="exportPositionArrow" value="0" data-json-path="positionArrow" />
            </div>
        `

    testForm.innerHTML = formHTML
    return testForm
  }

  setupExportTestGeneratorListeners() {
    const inputs = document.querySelectorAll(
      "#exportProcessName, #exportMenuOption, #exportDownloadPath, #exportSelectName, #exportPositionButton, #exportPositionSelectElement",
    )
    const checkbox = document.getElementById("exportHideActionsButton")
    const hideConfig = document.getElementById("exportHideActionsButtonConfig")
    const arrowCheckbox = document.getElementById("exportAddArrowConfig")
    const arrowConfigContainer = document.getElementById("exportArrowConfigContainer")

    // Manejar cambio de checkbox
    if (checkbox) {
      checkbox.addEventListener("change", () => {
        hideConfig.style.display = checkbox.checked ? "block" : "none"
        this.updateExportPreview()
        this.app.jsonUtils.highlightJsonPath(checkbox.getAttribute("data-json-path"))
      })
    }

    // Manejar cambio de checkbox de flecha
    if (arrowCheckbox) {
      arrowCheckbox.addEventListener("change", () => {
        arrowConfigContainer.style.display = arrowCheckbox.checked ? "block" : "none"
        this.updateExportPreview()
        this.app.jsonUtils.highlightJsonPath(arrowCheckbox.getAttribute("data-json-path"))
      })
    }

    // Manejar todos los cambios de input básicos
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.updateExportPreview()
        if (input.hasAttribute("data-json-path")) {
          this.app.jsonUtils.highlightJsonPath(input.getAttribute("data-json-path"))
        }
      })
      input.addEventListener("change", () => {
        this.updateExportPreview()
        if (input.hasAttribute("data-json-path")) {
          this.app.jsonUtils.highlightJsonPath(input.getAttribute("data-json-path"))
        }
      })
    })

    // Manejar cambio de dirección de flecha
    const arrowDirection = document.getElementById("exportArrowDirection")
    if (arrowDirection) {
      arrowDirection.addEventListener("change", () => {
        this.updateExportPreview()
        this.app.jsonUtils.highlightJsonPath(arrowDirection.getAttribute("data-json-path"))
      })
    }

    const positionArrow = document.getElementById("exportPositionArrow")
    if (positionArrow) {
      positionArrow.addEventListener("input", () => {
        this.updateExportPreview()
        this.app.jsonUtils.highlightJsonPath(positionArrow.getAttribute("data-json-path"))
      })
    }

    // Manejar controles de columnas si allowUserSelectColumns es true
    const tableConfig = this.modelJson.view_definition[1]
    const allowUserSelectColumns = tableConfig.downloadable && tableConfig.downloadable.allowUserSelectColumns

    if (allowUserSelectColumns) {
      // Usar las utilidades de campos para controles masivos
      this.app.fieldUtils.setupBulkControls(
        "enableAllExportColumns",
        "disableAllExportColumns",
        '#field-columnsToPrint [id^="enable-"], #field-buttonOk [id^="enable-"]',
        () => this.updateExportPreview(),
      )

      // Usar las utilidades de campos para toggles individuales
      this.app.fieldUtils.setupFieldToggleListeners(
        '#field-columnsToPrint [id^="enable-"], #field-buttonOk [id^="enable-"]',
        () => this.updateExportPreview(),
      )

      // Usar las utilidades de campos para valores de campos
      this.app.fieldUtils.setupFieldValueListeners("#value-columnsToPrint, #value-buttonOk", () =>
        this.updateExportPreview(),
      )

      // Inicializar estados de campos
      this.app.fieldUtils.initializeFieldStates(
        '#field-columnsToPrint [id^="enable-"], #field-buttonOk [id^="enable-"]',
      )
    }

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
      if (typeof _this !== 'undefined') _this.updateExportPreview();
    }
    const _this = this;
    radios.forEach(radio => radio.addEventListener('change', updateSearchType));
    setTimeout(updateSearchType, 0);

    // Configurar las utilidades JSON comunes
    setTimeout(() => {
      this.app.jsonUtils.setupPreviewControls()
    }, 100)

    // Actualización inicial de vista previa
    this.updateExportPreview()
  }

  updateExportPreview() {
    const checkbox = document.getElementById("exportHideActionsButton")
    const arrowCheckbox = document.getElementById("exportAddArrowConfig")

    const formData = {
      processName: document.getElementById("exportProcessName") ? document.getElementById("exportProcessName").value : "",
      menuOption: document.getElementById("exportMenuOption") ? document.getElementById("exportMenuOption").value : "",
      downloadPath: document.getElementById("exportDownloadPath") ? document.getElementById("exportDownloadPath").value : "./export",
      selectName: document.getElementById("exportSelectName") ? document.getElementById("exportSelectName").value : "",
      positionButton: document.getElementById("exportPositionButton") ? document.getElementById("exportPositionButton").value : "0",
      positionSelectElement: document.getElementById("exportPositionSelectElement") ? document.getElementById("exportPositionSelectElement").value : "0",
      hideActionsButton: checkbox ? checkbox.checked : false,
      hideActionsButtonLocator: document.getElementById("exportHideActionsButtonLocator") ? document.getElementById("exportHideActionsButtonLocator").value : "",
      hideActionsButtonPosition: document.getElementById("exportHideActionsButtonPosition") ? document.getElementById("exportHideActionsButtonPosition").value : "0",
      addArrowConfig: arrowCheckbox ? arrowCheckbox.checked : false,
      arrowDirection: document.getElementById("exportArrowDirection") ? document.getElementById("exportArrowDirection").value : "down",
      positionArrow: document.getElementById("exportPositionArrow") ? document.getElementById("exportPositionArrow").value : "0",
    }

    const testData = this.generateExportTestData(formData, this.modelJson)
    this.applyTabProperties(testData, this.modelJson);
    this.applyObjectByTabsExtras(testData, this.modelJson);
    this.updatePreviewDisplay(testData)
  }

  generateExportTestData(formData, modelJson) {
    const testDataTemplate = this.app.jsonUtils.getTestDataTemplate()
    const testData = JSON.parse(JSON.stringify(testDataTemplate))

    // Establecer valores comunes para todos los modos
    const modes = ["desktopMode", "mobileMode", "tabletRetratoMode"]
    modes.forEach((mode) => {
      testData[mode].label = formData.processName
      testData[mode].view = formData.processName
      testData[mode].viewScreenShotLabel = formData.processName
      testData[mode].screenShotName = formData.menuOption
    })

    // Establecer etiqueta específica del modo móvil
    testData.mobileMode.label = `.${formData.processName.toLowerCase()}`

    const selectedAction = this.app.getSelectedAction()
    testData.buttonName = selectedAction ? selectedAction.actionName : ""

    // Establecer valores fijos de exportación
    testData.downloadPath = formData.downloadPath
    testData.consoleError = "Error: el archivo no se ha descargado correctamente."
    testData.screenShotsDownload = "Export"

    // Establecer nombre de selección
    testData.selectName = formData.selectName

    // Establecer posiciones
    testData.positionButton = formData.positionButton
    testData.positionSelectElement = formData.positionSelectElement

    // Agregar datos de selección de columnas si allowUserSelectColumns es true
    const tableConfig = (modelJson.view_definition && modelJson.view_definition[1]) ? modelJson.view_definition[1] : {}
    const allowUserSelectColumns = tableConfig.downloadable && tableConfig.downloadable.allowUserSelectColumns

    if (allowUserSelectColumns) {
      // Verificar cada campo de manera independiente usando las utilidades
      const columnsEnabled = this.app.fieldUtils.getFieldState("columnsToPrint")
      const buttonOkEnabled = this.app.fieldUtils.getFieldState("buttonOk")

      if (columnsEnabled) {
        const columnsValue = this.app.fieldUtils.getFieldValue("columnsToPrint", "value-columnsToPrint")
        testData.columnsToPrint = columnsValue ? columnsValue.split(",").map((col) => col.trim()) : []
        testData.screenBeforeSelection = "Before Selecting Columns"
        testData.phraseSelectingColumns = "Selecting columns"
        testData.screenShotsSelectedColumnsExport = "Selected Columns Export"
      }

      if (buttonOkEnabled) {
        const buttonOkValue = this.app.fieldUtils.getFieldValue("buttonOk", "value-buttonOk")
        testData.buttonOk = buttonOkValue || "OK"
      }
    }

    // Agregar hideActionsButton si el checkbox está marcado
    if (formData.hideActionsButton) {
      testData.hideActionsButton = {
        locator: formData.hideActionsButtonLocator,
        position: formData.hideActionsButtonPosition,
      }
    }

    // Agregar configuración de flecha si el checkbox está marcado
    if (formData.addArrowConfig) {
      testData.arrowDirection = formData.arrowDirection
      testData.positionArrow = formData.positionArrow
    } else {
      // Eliminar configuración de flecha si el checkbox no está marcado
      delete testData.arrowDirection
      delete testData.positionArrow
      delete testData.screenShotsArrow
    }

    this.applyTabProperties(testData, modelJson);
    this.applyObjectByTabsExtras(testData, modelJson);

    return testData
  }
}
