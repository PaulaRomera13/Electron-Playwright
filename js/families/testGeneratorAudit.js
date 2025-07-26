import { BaseTestGenerator } from "../baseTestGenerator.js"
// Generador de tests para acciones de auditoría
export class TestGeneratorAudit extends BaseTestGenerator {
  constructor(app) {
    super(app)
  }

  createForm() {
    const form = document.createElement("div")
    form.className = "test-form"
    // Puedes usar los campos comunes y añadir los específicos
    // --- Selector de idioma para Tabs ---
    let tabLangSelector = ''
    if (this.app.modelJson && this.app.modelJson.component === 'Tabs' && Array.isArray(this.app.modelJson.tabs)) {
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
    const formHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> Configuración de Test para acción de Auditoría
            </div>
            ${this.renderTabLangSelector(this.app.modelJson)}
            ${this.renderObjectByTabsExtras(this.app.modelJson)}
            ${this.generateCommonFields()}
            <div class="form-group">
                <label for="positionButton2">Posición del Botón para Firmar:</label>
                <input type="text" id="positionButton2" value="1" data-json-path="positionButton2" />
            </div>
            <div class="form-group">
                <div class="checkbox-group">
                    <input type="checkbox" id="activeFilter" data-json-path="activeFilter" />
                    <label for="activeFilter">¿Añadir Filtros en el diálogo del Audit?</label>  
                </div>
            </div>
            <div class="form-section" id="filterConfigContainer" style="display: none;">
                <h4><i class="fas fa-filter"></i> Configuración de Filtros</h4>
                <div class="bulk-field-controls">
                    <button type="button" class="bulk-btn enable-btn" id="enableAllFilters">
                        <i class="fas fa-check-circle"></i> Activar Todos
                    </button>
                    <button type="button" class="bulk-btn disable-btn" id="disableAllFilters">
                        <i class="fas fa-times-circle"></i> Desactivar Todos
                    </button>
                </div>
                <div class="field-group" id="field-optionFilterSelect">
                    <div class="field-header">
                        <span class="field-label">Opción de Filtro</span>
                        <div class="field-toggle">
                            <input type="checkbox" id="enable-optionFilterSelect" checked data-json-path="optionFilterSelect" />
                            <label for="enable-optionFilterSelect" class="toggle-label">Incluir en test</label>
                        </div>
                    </div>
                    <div class="field-controls" id="controls-optionFilterSelect">
                        <input type="text" class="field-value" id="value-optionFilterSelect" placeholder="Ej: Attachment added" data-json-path="optionFilterSelect" />
                    </div>
                </div>
                <div class="field-group" id="field-fillDateFilter">
                    <div class="field-header">
                        <span class="field-label">Fecha Inicial</span>
                        <div class="field-toggle">
                            <input type="checkbox" id="enable-fillDateFilter" checked data-json-path="fillDateFilter" />
                            <label for="enable-fillDateFilter" class="toggle-label">Incluir en test</label>
                        </div>
                    </div>
                    <div class="field-controls" id="controls-fillDateFilter">
                        <input type="date" class="field-value" id="value-fillDateFilter" placeholder="Ej: 2025-04-01" data-json-path="fillDateFilter" />
                    </div>
                </div>
                <div class="field-group" id="field-fillSecondDateFilter">
                    <div class="field-header">
                        <span class="field-label">Fecha Final</span>
                        <div class="field-toggle">
                            <input type="checkbox" id="enable-fillSecondDateFilter" checked data-json-path="fillSecondDateFilter" />
                            <label for="enable-fillSecondDateFilter" class="toggle-label">Incluir en test</label>
                        </div>
                    </div>
                    <div class="field-controls" id="controls-fillSecondDateFilter">
                        <input type="date" class="field-value" id="value-fillSecondDateFilter" placeholder="Ej: 2025-07-02" data-json-path="fillSecondDateFilter" />
                    </div>
                </div>
            </div>
            ${this.generateAdditionalConfigFields()}
            ${this.generateNotificationFields()}
        `
    form.innerHTML = formHTML
    return form
  }

  setupListeners() {
    // Listeners comunes para los campos base
    super.setupCommonListeners(() => this.updatePreview())
    // Listeners específicos para los campos de filtros de auditoría
    const activeFilterCheckbox = document.getElementById("activeFilter")
    const filterConfigContainer = document.getElementById("filterConfigContainer")
    if (activeFilterCheckbox && filterConfigContainer) {
      activeFilterCheckbox.addEventListener("change", () => {
        filterConfigContainer.style.display = activeFilterCheckbox.checked ? "block" : "none"
        this.updatePreview()
      })
    }
    // Listeners para los checkboxes y campos de filtros
    const enableAllBtn = document.getElementById("enableAllFilters")
    const disableAllBtn = document.getElementById("disableAllFilters")
    if (enableAllBtn) {
      enableAllBtn.addEventListener("click", () => {
        document.querySelectorAll('[id^="enable-"]').forEach((checkbox) => {
          checkbox.checked = true
          this.toggleFieldState(checkbox)
        })
        this.updatePreview()
      })
    }
    if (disableAllBtn) {
      disableAllBtn.addEventListener("click", () => {
        document.querySelectorAll('[id^="enable-"]').forEach((checkbox) => {
          checkbox.checked = false
          this.toggleFieldState(checkbox)
        })
        this.updatePreview()
      })
    }
    document.querySelectorAll('[id^="enable-"]').forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        this.toggleFieldState(checkbox)
        this.updatePreview()
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
      if (typeof _this !== 'undefined') _this.updatePreview();
    }
    const _this = this;
    radios.forEach(radio => radio.addEventListener('change', updateSearchType));
    setTimeout(updateSearchType, 0);
    // Actualización inicial de la vista previa
    this.updatePreview()
  }

  toggleFieldState(checkbox) {
    // Lógica para mostrar/ocultar campos de filtro según el checkbox
    const fieldKey = checkbox.id.replace("enable-", "")
    const fieldGroup = document.getElementById(`field-${fieldKey}`)
    if (fieldGroup) {
      fieldGroup.classList.toggle("disabled", !checkbox.checked)
      fieldGroup.querySelectorAll("input, select").forEach((el) => {
        el.disabled = !checkbox.checked
      })
    }
  }

  updatePreview() {
    // Obtener los datos comunes usando el método de la base
    const formData = this.getCommonFormData()
    // Añadir los campos específicos de auditoría
    formData.positionButton2 = document.getElementById("positionButton2")?.value || "1"
    formData.activeFilter = document.getElementById("activeFilter")?.checked || false
    formData.filterStates = {}
    formData.filterValues = {}
    if (formData.activeFilter) {
      // Filtro de opción
      const optionFilterCheckbox = document.getElementById("enable-optionFilterSelect")
      if (optionFilterCheckbox) {
        formData.filterStates.optionFilterSelect = optionFilterCheckbox.checked
        if (optionFilterCheckbox.checked) {
          const optionFilterInput = document.getElementById("value-optionFilterSelect")
          formData.filterValues.optionFilterSelect = optionFilterInput ? optionFilterInput.value : ""
        }
      }
      // Filtros de fecha
      const dateFilterCheckbox = document.getElementById("enable-fillDateFilter")
      if (dateFilterCheckbox) {
        formData.filterStates.fillDateFilter = dateFilterCheckbox.checked
        if (dateFilterCheckbox.checked) {
          const dateFilterInput = document.getElementById("value-fillDateFilter")
          formData.filterValues.fillDateFilter = dateFilterInput ? dateFilterInput.value : ""
        }
      }
      const secondDateFilterCheckbox = document.getElementById("enable-fillSecondDateFilter")
      if (secondDateFilterCheckbox) {
        formData.filterStates.fillSecondDateFilter = secondDateFilterCheckbox.checked
        if (secondDateFilterCheckbox.checked) {
          const secondDateFilterInput = document.getElementById("value-fillSecondDateFilter")
          formData.filterValues.fillSecondDateFilter = secondDateFilterInput ? secondDateFilterInput.value : ""
        }
      }
    }
    // Generar los datos de test y actualizar la vista previa
    const testData = this.generateAuditTestData(formData)
    this.applyTabProperties(testData, this.app.modelJson);
    this.applyObjectByTabsExtras(testData, this.app.modelJson);
    this.updatePreviewDisplay(testData)
  }

  generateAuditTestData(formData) {
    // Lógica específica de auditoría, igual que antes
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
    // Establecer nombre del botón desde la acción
    const selectedAction = this.app.getSelectedAction()
    testData.buttonName = selectedAction ? selectedAction.actionName : ""
    // Establecer nombre de selección
    testData.selectName = formData.selectName
    // Establecer textos de notificación
    testData.textInNotif1 = formData.textInNotif1
    testData.textInNotif2 = formData.textInNotif2
    testData.textInNotif3 = formData.textInNotif3
    // Establecer posiciones
    testData.positionButton = formData.positionButton
    testData.positionSelectElement = formData.positionSelectElement
    // Agregar campos específicos de auditoría
    testData.activeFilter = formData.activeFilter || false
    testData.positionButton2 = formData.positionButton2 || "1"
    testData.screenShotsClickSign = "Click on Sign"
    if (testData.activeFilter) {
      if (formData.filterStates && formData.filterStates.optionFilterSelect) {
        testData.phraseOpenFilter = "Clicked on the filter button"
        testData.textFilter = "Show Filters"
        testData.screenShotsClickFilter = "Click on Filter"
        testData.phraseShouldClickSearchPlaceholder = "Clicked on search or select action placeholder"
        testData.placeholderShouldFilter = "Search or select action..."
        testData.phraseShouldClickSelectButton = "Clicked on Select button"
        testData.buttonSelectFilter = "Select"
        testData.phraseShouldClickFilter = "Clicked option filter"
        testData.optionFilterSelect = formData.filterValues.optionFilterSelect || ""
        testData.screenShotsClickOptionFilter = "Click on Filter Option"
      }
      if (formData.filterStates && formData.filterStates.fillDateFilter) {
        testData.phraseShouldFillDate = "Filled date in the second textbox"
        testData.phraseRangeDate = "Range date"
        testData.fillDateFilter = formData.filterValues.fillDateFilter || ""
        testData.fillSecondDateFilter = formData.filterValues.fillSecondDateFilter || ""
        testData.screenShotsAfterAddDayRange = "Add the range of days"
        testData.phraseApplyFilter = "Apply Filter"
        testData.clickButtonApplyFilter = "Apply Filter"
        testData.screenShotsFilter = "Filter"
        testData.hideFilters = "Hide Filters"
      }
    }
    this.applyTabProperties(testData, this.app.modelJson);
    this.applyObjectByTabsExtras(testData, this.app.modelJson);
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
    return testData
  }
}