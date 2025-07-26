/*
 * Clase base para todos los generadores de test
 * Contiene la funcionalidad común compartida por todos los generadores
 */

import { isTabsComponent, getTabLabels } from './utils/tabUtils.js'
import { isObjectByTabsComponent, getObjectByTabsLabels } from './utils/objectByTabsUtils.js';

/**
 * Clase base que proporciona funcionalidad común para todos los generadores de test
 */
export class BaseTestGenerator {
    /**
     * Constructor de la clase base
     * @param {Object} app - Referencia a la aplicación principal
     */
    constructor(app) {
      this.app = app // Guardar referencia para acceso a métodos globales
    }
  
    /**
     * Genera los campos HTML comunes que usan todos los generadores
     * @returns {string} HTML de los campos comunes
     */
    generateCommonFields() {
      return `
        <!-- Campo para el proceso del menú -->
        <div class="form-group">
            <label for="processName">Proceso del menú a seleccionar:</label>
            <input type="text" id="processName" placeholder="Ej: Stock control" data-json-path="desktopMode.label" />
        </div>
  
        <!-- Campo para el nombre de la pestaña -->
        <div class="form-group">
            <label for="menuOption">Nombre de la Pestaña (Opción del Menú):</label>
            <input type="text" id="menuOption" placeholder="Ej: Deviations" data-json-path="desktopMode.screenShotName" />
        </div>
  
        <!-- Campo para el nombre del botón (solo lectura, se llena automáticamente) -->
        <div class="form-group">
            <label for="buttonName">Nombre del Botón (ActionName):</label>
            <input type="text" id="buttonName" class="readonly-field" readonly />
        </div>
  
        <!-- Campo para el elemento a seleccionar -->
        <div class="form-group">
            <label for="selectName">Elemento a Seleccionar:</label>
            <input type="text" id="selectName" placeholder="Ej: HPLC" data-json-path="selectName" />
        </div>
  
        <!-- Campo para la posición del botón -->
        <div class="form-group">
            <label for="positionButton">Posición del Botón:</label>
            <input type="text" id="positionButton" value="0" data-json-path="positionButton" />
        </div>
  
        <!-- Campo para la posición del elemento a seleccionar -->
        <div class="form-group">
            <label for="positionSelectElement">Posición del Elemento a Seleccionar:</label>
            <input type="text" id="positionSelectElement" value="0" data-json-path="positionSelectElement" />
        </div>
      `
    }
  
    /**
     * Genera los campos HTML para configuraciones adicionales comunes
     * @returns {string} HTML de las configuraciones adicionales
     */
    generateAdditionalConfigFields() {
      return `
        <!-- Checkbox para ocultar botón de acciones -->
        <div class="form-group">
            <div class="checkbox-group">
                <input type="checkbox" id="hideActionsButton" data-json-path="hideActionsButton" />
                <label for="hideActionsButton">¿Ocultar botón de Acciones escondidas (...)?</label>  
            </div>
        </div>
  
        <!-- Configuración del botón de acciones ocultas (inicialmente oculto) -->
        <div class="form-group" id="hideActionsButtonConfig" style="display: none;">
            <label for="hideActionsButtonLocator">Locator:</label>
            <input type="text" id="hideActionsButtonLocator" value="md-icon:has-text('more_horiz')" class="readonly-field" readonly data-json-path="hideActionsButton.locator" />
            
            <label for="hideActionsButtonPosition" style="margin-top: 10px;">Position:</label>
            <input type="text" id="hideActionsButtonPosition" value="0" data-json-path="hideActionsButton.position" />
        </div>
  
        <!-- Checkbox para añadir configuración de flecha -->
        <div class="form-group">
            <div class="checkbox-group">
                <input type="checkbox" id="addArrowConfig" data-json-path="arrowDirection" />
                <label for="addArrowConfig">¿Añadir configuración de flecha?</label>  
            </div>
        </div>
  
        <!-- Configuración de la flecha (inicialmente oculto) -->
        <div class="form-group" id="arrowConfigContainer" style="display: none;">
            <label for="arrowDirection">Dirección de la flecha:</label>
            <select id="arrowDirection" class="form-control" data-json-path="arrowDirection">
                <option value="down">Abajo</option>
                <option value="up">Arriba</option>
            </select>
            
            <label for="positionArrow" style="margin-top: 10px;">Posición de la flecha:</label>
            <input type="text" id="positionArrow" value="0" data-json-path="positionArrow" />
        </div>
      `
    }
  
    /**
     * Genera los campos HTML para textos de notificación
     * @returns {string} HTML de los campos de notificación
     */
    generateNotificationFields() {
      return `
        <!-- Campos para textos de notificación -->
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
      `
    }
  
    /**
     * Configura los listeners comunes para todos los formularios
     * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
     */
    setupCommonListeners(updatePreviewCallback) {
      // Obtener referencias a todos los elementos del formulario
      const inputs = document.querySelectorAll(".test-form input, .test-form select, .test-form textarea")
      const checkbox = document.getElementById("hideActionsButton")
      const hideConfig = document.getElementById("hideActionsButtonConfig")
      const arrowCheckbox = document.getElementById("addArrowConfig")
      const arrowConfigContainer = document.getElementById("arrowConfigContainer")
  
      // Establecer nombre del botón desde la acción seleccionada
      const selectedAction = this.app.getSelectedAction()
      if (selectedAction) {
        const buttonNameInput = document.getElementById("buttonName")
        if (buttonNameInput) {
          buttonNameInput.value = selectedAction.actionName
        }
      }
  
      // Configurar checkbox para ocultar botón de acciones
      if (checkbox) {
        checkbox.addEventListener("change", () => {
          // Mostrar/ocultar configuración adicional según el estado del checkbox
          if (hideConfig) {
            hideConfig.style.display = checkbox.checked ? "block" : "none"
          }
          updatePreviewCallback() // Actualizar vista previa
          // Resaltar la ruta JSON correspondiente
          if (checkbox.hasAttribute("data-json-path")) {
            this.app.jsonUtils.highlightJsonPath(checkbox.getAttribute("data-json-path"))
          }
        })
      }
  
      // Configurar checkbox para configuración de flecha
      if (arrowCheckbox) {
        arrowCheckbox.addEventListener("change", () => {
          // Mostrar/ocultar configuración de flecha según el estado del checkbox
          if (arrowConfigContainer) {
            arrowConfigContainer.style.display = arrowCheckbox.checked ? "block" : "none"
          }
          updatePreviewCallback() // Actualizar vista previa
          // Resaltar la ruta JSON correspondiente
          if (arrowCheckbox.hasAttribute("data-json-path")) {
            this.app.jsonUtils.highlightJsonPath(arrowCheckbox.getAttribute("data-json-path"))
          }
        })
      }
  
      // Configurar listeners para todos los inputs del formulario
      inputs.forEach((input) => {
        // Evento 'input' para cambios en tiempo real
        input.addEventListener("input", () => {
          updatePreviewCallback() // Actualizar vista previa
          if (input.hasAttribute("data-json-path")) {
            // Resaltar la ruta JSON correspondiente si existe
            this.app.jsonUtils.highlightJsonPath(input.getAttribute("data-json-path"))
          }
        })
        // Evento 'change' para cambios confirmados
        input.addEventListener("change", () => {
          updatePreviewCallback() // Actualizar vista previa
          if (input.hasAttribute("data-json-path")) {
            // Resaltar la ruta JSON correspondiente si existe
            this.app.jsonUtils.highlightJsonPath(input.getAttribute("data-json-path"))
          }
        })
      })
    }
  
    /**
     * Recopila los datos comunes del formulario
     * @returns {Object} Objeto con los datos comunes del formulario
     */
    getCommonFormData() {
      const checkbox = document.getElementById("hideActionsButton")
      const arrowCheckbox = document.getElementById("addArrowConfig")
  
      return {
        processName: this.getInputValue("processName"),
        menuOption: this.getInputValue("menuOption"),
        selectName: this.getInputValue("selectName"),
        positionButton: this.getInputValue("positionButton", "0"),
        positionSelectElement: this.getInputValue("positionSelectElement", "0"),
        hideActionsButton: checkbox ? checkbox.checked : false,
        hideActionsButtonLocator: this.getInputValue("hideActionsButtonLocator"),
        hideActionsButtonPosition: this.getInputValue("hideActionsButtonPosition", "0"),
        addArrowConfig: arrowCheckbox ? arrowCheckbox.checked : false,
        arrowDirection: this.getInputValue("arrowDirection", "down"),
        positionArrow: this.getInputValue("positionArrow", "0"),
        textInNotif1: this.getInputValue("textInNotif1"),
        textInNotif2: this.getInputValue("textInNotif2"),
        textInNotif3: this.getInputValue("textInNotif3"),
      }
    }
  
    /**
     * Obtiene el valor de un input de forma segura
     * @param {string} inputId - ID del input
     * @param {string} defaultValue - Valor por defecto si no existe el input
     * @returns {string} Valor del input o valor por defecto
     */
    getInputValue(inputId, defaultValue = "") {
      const input = document.getElementById(inputId)
      return input ? input.value : defaultValue
    }
  
    /**
     * Aplica los datos comunes a la plantilla de test
     * @param {Object} testData - Objeto de datos de test a modificar
     * @param {Object} formData - Datos del formulario
     */
    applyCommonTestData(testData, formData) {
      // Establecer valores comunes para todos los modos (desktop, mobile, tablet)
      const modes = ["desktopMode", "mobileMode", "tabletRetratoMode"]
      modes.forEach((mode) => {
        testData[mode].label = formData.processName
        testData[mode].view = formData.processName
        testData[mode].viewScreenShotLabel = formData.processName
        testData[mode].screenShotName = formData.menuOption
      })
  
      // Establecer etiqueta específica del modo móvil (con punto al inicio)
      testData.mobileMode.label = `.${formData.processName.toLowerCase()}`
  
      // Establecer nombre del botón desde la acción seleccionada
      const selectedAction = this.app.getSelectedAction()
      if (selectedAction) {
        testData.buttonName = selectedAction.actionName
      }
  
      // Establecer datos básicos del formulario
      testData.selectName = formData.selectName
      testData.textInNotif1 = formData.textInNotif1
      testData.textInNotif2 = formData.textInNotif2
      testData.textInNotif3 = formData.textInNotif3
      testData.positionButton = formData.positionButton
      testData.positionSelectElement = formData.positionSelectElement
  
      // Agregar configuración de botón de acciones ocultas si está habilitado
      if (formData.hideActionsButton) {
        testData.hideActionsButton = {
          locator: formData.hideActionsButtonLocator,
          position: formData.hideActionsButtonPosition,
        }
      }
  
      // Agregar configuración de flecha si está habilitado
      if (formData.addArrowConfig) {
        testData.arrowDirection = formData.arrowDirection
        testData.positionArrow = formData.positionArrow
      } else {
        // Eliminar configuración de flecha si no está habilitado
        delete testData.arrowDirection
        delete testData.positionArrow
        delete testData.screenShotsArrow
      }
    }
  
    /**
     * Actualiza la vista previa con los datos generados
     * @param {Object} testData - Datos de test generados
     */
    updatePreviewDisplay(testData) {
      this.app.setOriginalTestData(testData) // Guardar en la aplicación
      const previewData = {
        testDataGame: JSON.stringify(testData),
      }
      const preview = document.getElementById("testPreview")
      if (preview) {
        preview.textContent = JSON.stringify(previewData, null, 2) // Mostrar JSON formateado
      }
    }

  /**
   * Si el componente es Tabs, añade los objetos de tab requeridos
   * @param {Object} json - El JSON de configuración
   * @param {'es'|'en'} lang - Idioma ('es' o 'en')
   * @returns {Array<Object>} Array de objetos con phraseTab, tab y screenShotTab
   */
  addTabsTestSteps(json, lang = 'es') {
    if (!isTabsComponent(json)) return [];
    const tabLabels = getTabLabels(json, lang);
    return tabLabels.map(tabLabel => ({
      phraseTab: 'Click on Tab',
      tab: tabLabel,
      screenShotTab: tabLabel
    }));
  }

  /**
   * Renderiza el selector de idioma de la tab si el modelo es Tabs
   * @param {Object} modelJson
   * @returns {string} HTML del selector o vacío
   */
  renderTabLangSelector(modelJson) {
    // Soporte para Tabs y ObjectByTabs
    if ((isTabsComponent(modelJson) || isObjectByTabsComponent(modelJson)) && Array.isArray(modelJson.tabs)) {
      let activeTabIdx = 0;
      if (this.app && typeof this.app.getActiveTabIdx === 'function') {
        activeTabIdx = this.app.getActiveTabIdx();
      }
      let labelES = '', labelEN = '';
      if (isTabsComponent(modelJson)) {
        const tab = modelJson.tabs[activeTabIdx];
        labelES = tab.tabLabel?.label_es || '';
        labelEN = tab.tabLabel?.label_en || '';
      } else if (isObjectByTabsComponent(modelJson)) {
        const tab = modelJson.tabs[activeTabIdx];
        labelES = tab.tabLabel_es || '';
        labelEN = tab.tabLabel_en || '';
      }
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
    return '';
  }

  /**
   * Añade phraseTab, tab y screenShotTab al testData si el modelo es Tabs
   * @param {Object} testData
   * @param {Object} modelJson
   */
  applyTabProperties(testData, modelJson) {
    if ((isTabsComponent(modelJson) || isObjectByTabsComponent(modelJson)) && Array.isArray(modelJson.tabs)) {
      let activeTabIdx = 0;
      if (this.app && typeof this.app.getActiveTabIdx === 'function') {
        activeTabIdx = this.app.getActiveTabIdx();
      }
      let tabLang = 'en';
      const langInput = document.querySelector('input[name="tabLang"]:checked');
      if (langInput) tabLang = langInput.value;
      let label = '';
      if (isTabsComponent(modelJson)) {
        const tab = modelJson.tabs[activeTabIdx];
        label = tabLang === 'en' ? tab.tabLabel?.label_en : tab.tabLabel?.label_es;
      } else if (isObjectByTabsComponent(modelJson)) {
        const tab = modelJson.tabs[activeTabIdx];
        label = tabLang === 'en' ? tab.tabLabel_en : tab.tabLabel_es;
      }
      testData.phraseTab = 'Click on Tab';
      testData.tab = label;
      testData.screenShotTab = label;
    }
  }

  /**
   * Renderiza los extras de ObjectByTabs (radio y campos de búsqueda/selección) si corresponde
   * @param {Object} modelJson
   * @returns {string} HTML del bloque o vacío
   */
  renderObjectByTabsExtras(modelJson) {
    if (
      isObjectByTabsComponent(modelJson) &&
      Array.isArray(modelJson.filter) &&
      modelJson.filter.length > 0 &&
      modelJson.filter.some(f => f && f.filtertext1)
    ) {
      // Buscar el primer filtro válido
      const filterObj = modelJson.filter.find(f => f && f.filtertext1);
      const labelES = filterObj.filtertext1.label_es || 'Buscar';
      return `
        <div class="form-group">
          <label>¿Cómo quieres buscar?</label>
          <div class="tab-language-toggle">
            <label class="fake-checkbox"><input type="radio" name="objectByTabsSearchType" value="select" checked> Seleccionar</label>
            <label class="fake-checkbox"><input type="radio" name="objectByTabsSearchType" value="search"> Buscar</label>
          </div>
        </div>
        <div class="form-group" id="objectByTabsSelectGroup">
          <label>${labelES} (seleccionar):</label>
          <input type="text" id="objectByTabsSelectValue" placeholder="Introduce el valor a seleccionar" />
          <label style="margin-top:6px;">Posición:</label>
          <input type="number" id="objectByTabsSelectPosition" value="0" min="0" style="width:60px;" />
        </div>
        <div class="form-group" id="objectByTabsSearchGroup" style="display:none;">
          <label>${labelES} (buscar):</label>
          <input type="text" id="objectByTabsSearchValue" placeholder="Introduce el valor a buscar" />
        </div>
        <script>
          (function() {
            function updateSearchType() {
              var radios = document.getElementsByName('objectByTabsSearchType');
              var selectGroup = document.getElementById('objectByTabsSelectGroup');
              var searchGroup = document.getElementById('objectByTabsSearchGroup');
              var selected = Array.from(radios).find(r => r.checked)?.value || 'select';
              if (selected === 'select') {
                selectGroup.style.display = '';
                searchGroup.style.display = 'none';
              } else {
                selectGroup.style.display = 'none';
                searchGroup.style.display = '';
              }
            }
            // Ejecutar SIEMPRE tras insertar el HTML
            setTimeout(updateSearchType, 0);
            var radios = document.getElementsByName('objectByTabsSearchType');
            radios.forEach(function(radio) {
              radio.addEventListener('change', updateSearchType);
            });
          })();
        </script>
      `;
    }
    return '';
  }

  /**
   * Añade las propiedades de búsqueda/selección de ObjectByTabs al testData si corresponde
   * @param {Object} testData
   * @param {Object} modelJson
   */
  applyObjectByTabsExtras(testData, modelJson) {
    if (
      isObjectByTabsComponent(modelJson) &&
      Array.isArray(modelJson.filter) &&
      modelJson.filter.length > 0 &&
      modelJson.filter.some(f => f && f.filtertext1)
    ) {
      const filterObj = modelJson.filter.find(f => f && f.filtertext1);
      const labelES = filterObj.filtertext1.label_es || 'Buscar';
      testData.phraseClickSearch = 'Click on Search';
      testData.phraseSearch = 'Search';
      testData.phraseFillField = 'Fill Field';
      testData.screenShotSearch = 'Search';
      const radios = document.getElementsByName('objectByTabsSearchType');
      let type = 'select';
      radios.forEach(radio => { if (radio.checked) type = radio.value; });
      if (type === 'select') {
        testData.search = {
          label: labelES,
          selectObjectSearch: document.getElementById('objectByTabsSelectValue')?.value || '',
          positionSelectObjectSearch: document.getElementById('objectByTabsSelectPosition')?.value || '0'
        };
      } else {
        testData.search = {
          label: labelES,
          value: document.getElementById('objectByTabsSearchValue')?.value || '',
          press: 'Search'
        };
      }
    }
  }
  }
  