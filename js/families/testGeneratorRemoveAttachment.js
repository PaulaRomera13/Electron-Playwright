/*
 * Generador de tests para acciones de remover adjuntos (Remove Attachment)
 * Maneja configuraciones específicas para selección y eliminación de adjuntos
 */

import { BaseTestGenerator } from "../baseTestGenerator.js"

/**
 * Clase que genera tests para acciones de remover adjuntos
 * Incluye campos específicos para seleccionar y eliminar adjuntos
 */
export class TestGeneratorRemoveAttachment extends BaseTestGenerator {
    /**
     * Constructor del generador de tests de remover adjuntos
     * @param {Object} app - Referencia a la aplicación principal
     */
    constructor(app) {
      super(app)
    }
  
    /**
     * Crea el formulario para configurar tests de remover adjuntos
     * Incluye campos específicos para seleccionar y eliminar adjuntos
     * @returns {HTMLElement} Elemento DOM del formulario
     */
    createForm() {
      // Crear el contenedor principal del formulario
      const form = document.createElement("div")
      form.className = "test-form"
  
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
            <!-- Alerta informativa sobre el tipo de test -->
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> Configuración de Test para acción de Remover Adjunto
            </div>
            ${this.renderTabLangSelector(this.app.modelJson)}
            ${this.renderObjectByTabsExtras(this.app.modelJson)}
  
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
  
            <!-- Sección específica para configuración de remover adjuntos (solo campos editables) -->
            <div class="form-section">
                <h4><i class="fas fa-trash"></i> Configuración de Remover Adjunto</h4>
                
                <!-- Campo editable para el adjunto a eliminar -->
                <div class="form-group">
                    <label for="attachmentToDelete">Adjunto a Eliminar:</label>
                    <input type="text" id="attachmentToDelete" value="https://www.trazit.net/" data-json-path="attachmentToDelete" />
                </div>
  
                <!-- Campo editable para la posición del adjunto a eliminar -->
                <div class="form-group">
                    <label for="positionAttachmentToDelete">Posición del Adjunto a Eliminar:</label>
                    <input type="text" id="positionAttachmentToDelete" value="0" data-json-path="positionAttachmentToDelete" />
                </div>
            </div>
  
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
  
      // Establecer el HTML en el formulario y retornarlo
      form.innerHTML = formHTML
      return form
    }
  
    /**
     * Configura todos los event listeners para el formulario de remover adjuntos
     * Maneja la interacción con campos específicos de adjuntos y configuraciones adicionales
     */
    setupListeners() {
      // Obtener referencias a todos los elementos del formulario
      const inputs = document.querySelectorAll(".test-form input, .test-form select, .test-form textarea")
      const checkbox = document.getElementById("hideActionsButton")
      const hideConfig = document.getElementById("hideActionsButtonConfig")
      const arrowCheckbox = document.getElementById("addArrowConfig")
      const arrowConfigContainer = document.getElementById("arrowConfigContainer")
      const preview = document.getElementById("testPreview")
  
      // Establecer nombre del botón desde la acción seleccionada
      const selectedAction = this.app.getSelectedAction()
      if (selectedAction) {
        document.getElementById("buttonName").value = selectedAction.actionName
      }
  
      // Configurar checkbox para ocultar botón de acciones
      if (checkbox) {
        checkbox.addEventListener("change", () => {
          // Mostrar/ocultar configuración adicional según el estado del checkbox
          hideConfig.style.display = checkbox.checked ? "block" : "none"
          this.updatePreview() // Actualizar vista previa
          // Resaltar la ruta JSON correspondiente
          this.app.jsonUtils.highlightJsonPath(checkbox.getAttribute("data-json-path"))
        })
      }
  
      // Configurar checkbox para configuración de flecha
      if (arrowCheckbox) {
        arrowCheckbox.addEventListener("change", () => {
          // Mostrar/ocultar configuración de flecha según el estado del checkbox
          arrowConfigContainer.style.display = arrowCheckbox.checked ? "block" : "none"
          this.updatePreview() // Actualizar vista previa
          // Resaltar la ruta JSON correspondiente
          this.app.jsonUtils.highlightJsonPath(arrowCheckbox.getAttribute("data-json-path"))
        })
      }
  
      // Configurar listeners para todos los inputs del formulario
      inputs.forEach((input) => {
        // Evento 'input' para cambios en tiempo real
        input.addEventListener("input", () => {
          this.updatePreview() // Actualizar vista previa
          if (input.hasAttribute("data-json-path")) {
            // Resaltar la ruta JSON correspondiente si existe
            this.app.jsonUtils.highlightJsonPath(input.getAttribute("data-json-path"))
          }
        })
        // Evento 'change' para cambios confirmados
        input.addEventListener("change", () => {
          this.updatePreview() // Actualizar vista previa
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
        if (typeof _this !== 'undefined') _this.updatePreview();
      }
      const _this = this;
      radios.forEach(radio => radio.addEventListener('change', updateSearchType));
      setTimeout(updateSearchType, 0);
  
      // Realizar actualización inicial de la vista previa
      this.updatePreview()
    }
  
    /**
     * Actualiza la vista previa del JSON basada en los valores del formulario
     * Recopila todos los datos del formulario y genera el JSON de test específico para remover adjuntos
     */
    updatePreview() {
      // Obtener referencias a checkboxes importantes
      const checkbox = document.getElementById("hideActionsButton")
      const arrowCheckbox = document.getElementById("addArrowConfig")
      const preview = document.getElementById("testPreview")
  
      // Recopilar todos los datos del formulario
      const formData = {
        processName: document.getElementById("processName") ? document.getElementById("processName").value : "",
        menuOption: document.getElementById("menuOption") ? document.getElementById("menuOption").value : "",
        selectName: document.getElementById("selectName") ? document.getElementById("selectName").value : "",
        positionButton: document.getElementById("positionButton") ? document.getElementById("positionButton").value : "0",
        positionSelectElement: document.getElementById("positionSelectElement") ? document.getElementById("positionSelectElement").value : "0",
        hideActionsButton: checkbox ? checkbox.checked : false,
        hideActionsButtonLocator: document.getElementById("hideActionsButtonLocator") ? document.getElementById("hideActionsButtonLocator").value : "",
        hideActionsButtonPosition: document.getElementById("hideActionsButtonPosition") ? document.getElementById("hideActionsButtonPosition").value : "0",
        addArrowConfig: arrowCheckbox ? arrowCheckbox.checked : false,
        arrowDirection: document.getElementById("arrowDirection") ? document.getElementById("arrowDirection").value : "down",
        positionArrow: document.getElementById("positionArrow") ? document.getElementById("positionArrow").value : "0",
        textInNotif1: document.getElementById("textInNotif1") ? document.getElementById("textInNotif1").value : "",
        textInNotif2: document.getElementById("textInNotif2") ? document.getElementById("textInNotif2").value : "",
        textInNotif3: document.getElementById("textInNotif3") ? document.getElementById("textInNotif3").value : "",
        // Campos específicos de remover adjuntos
        attachmentToDelete: document.getElementById("attachmentToDelete") ? document.getElementById("attachmentToDelete").value : "https://www.trazit.net/",
        positionAttachmentToDelete: document.getElementById("positionAttachmentToDelete") ? document.getElementById("positionAttachmentToDelete").value : "0",
      }
  
      // Generar los datos de test y actualizar la vista previa
      const testData = this.generateRemoveAttachmentTestData(formData)
      this.applyTabProperties(testData, this.app.modelJson);
      this.applyObjectByTabsExtras(testData, this.app.modelJson);
      this.updatePreviewDisplay(testData)
    }
  
    /**
     * Genera los datos de test para acciones de remover adjuntos
     * @param {Object} formData - Datos recopilados del formulario
     * @returns {Object} Objeto con los datos de test generados
     */
    generateRemoveAttachmentTestData(formData) {
      // Obtener plantilla base y crear copia
      const testDataTemplate = this.app.jsonUtils.getTestDataTemplate()
      const testData = JSON.parse(JSON.stringify(testDataTemplate))
  
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
      testData.buttonName = selectedAction ? selectedAction.actionName : ""
  
      // Establecer datos básicos del formulario
      testData.selectName = formData.selectName
      testData.textInNotif1 = formData.textInNotif1
      testData.textInNotif2 = formData.textInNotif2
      testData.textInNotif3 = formData.textInNotif3
      testData.positionButton = formData.positionButton
      testData.positionSelectElement = formData.positionSelectElement
  
      // Agregar campos específicos de remover adjuntos
      // Campos fijos (siempre los mismos valores)
      testData.phraseSelectRemove = "Select Item to Delete"
      testData.buttonAccept = "Accept"
      testData.screenShotsAccept = "Accept"
  
      // Campos editables (valores del formulario)
      testData.attachmentToDelete = formData.attachmentToDelete
      testData.positionAttachmentToDelete = formData.positionAttachmentToDelete
  
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

      return testData
    }
  }
  