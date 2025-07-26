import { BaseTestGenerator } from "../baseTestGenerator.js"

// Generador de tests para acción _ADDAWSATTACHMENT (subida de archivos a AWS)
export class TestGeneratorAWS extends BaseTestGenerator {
  constructor(app) {
    super(app)
  }

  createForm() {
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
      <div class="alert alert-info">
        <i class="fas fa-info-circle"></i> Configuración de Test para acción de Subida a AWS
      </div>
      ${this.renderTabLangSelector(this.app.modelJson)}
      ${this.renderObjectByTabsExtras(this.app.modelJson)}
      ${this.generateCommonFields()}
      <div class="form-section">
        <h4><i class="fas fa-cloud-upload-alt"></i> Configuración de Subida AWS</h4>
        <div class="form-group">
          <label for="filePath">Ruta del archivo a subir:</label>
          <input type="text" id="filePath" value="./AWS/testingAWS.txt" data-json-path="filePath" />
        </div>
        <div class="form-group">
          <label for="positionInputField">Posición del input de archivo:</label>
          <input type="text" id="positionInputField" value="0" data-json-path="positionInputField" />
        </div>
      </div>
      ${this.generateAdditionalConfigFields()}
      ${this.generateNotificationFields()}
    `
    form.innerHTML = formHTML
    setTimeout(() => this.updatePreview(), 0)
    return form
  }

  setupListeners() {
    super.setupCommonListeners(() => this.updatePreview())
    // Listeners para campos específicos de AWS
    const filePathInput = document.getElementById("filePath")
    const positionInputFieldInput = document.getElementById("positionInputField")
    if (filePathInput) filePathInput.addEventListener("input", () => this.updatePreview())
    if (positionInputFieldInput) positionInputFieldInput.addEventListener("input", () => this.updatePreview())
    // Rellenar automáticamente el nombre del botón
    const selectedAction = this.app.getSelectedAction()
    if (selectedAction) {
      const buttonNameInput = document.getElementById("buttonName")
      if (buttonNameInput) buttonNameInput.value = selectedAction.actionName
    }
    setTimeout(() => this.updatePreview(), 0)
  }

  updatePreview() {
    // Recopilar datos del formulario
    const formData = {
      ...this.getCommonFormData(),
      ...{
        filePath: document.getElementById("filePath") ? document.getElementById("filePath").value : "./AWS/testingAWS.txt",
        positionInputField: document.getElementById("positionInputField") ? document.getElementById("positionInputField").value : "0",
        hideActionsButton: document.getElementById("hideActionsButton")?.checked || false,
        hideActionsButtonLocator: document.getElementById("hideActionsButtonLocator") ? document.getElementById("hideActionsButtonLocator").value : "md-icon:has-text('more_horiz')",
        hideActionsButtonPosition: document.getElementById("hideActionsButtonPosition") ? document.getElementById("hideActionsButtonPosition").value : "0",
        addArrowConfig: document.getElementById("addArrowConfig")?.checked || false,
        arrowDirection: document.getElementById("arrowDirection") ? document.getElementById("arrowDirection").value : "down",
        positionArrow: document.getElementById("positionArrow") ? document.getElementById("positionArrow").value : "0",
        textInNotif1: document.getElementById("textInNotif1")?.value || "",
        textInNotif2: document.getElementById("textInNotif2")?.value || "",
        textInNotif3: document.getElementById("textInNotif3")?.value || ""
      }
    }
    const testData = this.generateAWSTestData(formData)
    this.app.setOriginalTestData(testData)
    // Calcular campos editados y borrados
    const editedFields = {}
    const removedFields = {}
    Object.keys(formData).forEach(key => {
      if (formData[key] !== undefined && formData[key] !== null && formData[key] !== "") {
        editedFields[key] = true
      } else {
        removedFields[key] = true
      }
    })
    this.updatePreviewDisplay(testData, editedFields, removedFields)
  }

  generateAWSTestData(formData) {
    // Obtener plantilla base y crear copia
    const testDataTemplate = this.app.jsonUtils.getTestDataTemplate()
    const testData = JSON.parse(JSON.stringify(testDataTemplate))
    // Establecer valores comunes
    const modes = ["desktopMode", "mobileMode", "tabletRetratoMode"]
    modes.forEach((mode) => {
      testData[mode].label = formData.processName
      testData[mode].view = formData.processName
      testData[mode].viewScreenShotLabel = formData.processName
      testData[mode].screenShotName = formData.menuOption
    })
    testData.mobileMode.label = `.${formData.processName?.toLowerCase?.() || ""}`
    const selectedAction = this.app.getSelectedAction()
    testData.buttonName = selectedAction ? selectedAction.actionName : ""
    testData.selectName = formData.selectName
    testData.textInNotif1 = formData.textInNotif1
    testData.textInNotif2 = formData.textInNotif2
    testData.textInNotif3 = formData.textInNotif3
    testData.positionButton = formData.positionButton
    testData.positionSelectElement = formData.positionSelectElement
    // Campos fijos y configurables para AWS
    testData.phraseFileContent = "📖 Read the content of the file to upload"
    testData.filePath = formData.filePath || "./AWS/testingAWS.txt"
    testData.phraseFileExists = "📂 Check if the file exists"
    testData.phraseReadFileContent = "📖 Read the file content"
    testData.phraseTextFileContent = "📖 Log the content of the file"
    testData.phraseUploadArchivo = "📤 Upload the file"
    testData.phraseLocateFileInput = "🔍 Locate file input field"
    testData.inputField = "input[type='file']"
    testData.positionInputField = formData.positionInputField || "0"
    testData.phraseSetFileForUpload = "📤 Set the file for upload"
    testData.screenShotsFilled = "Filled Form"
    // Configuración adicional
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
    if (selectedAction && selectedAction.dialogInfo && selectedAction.dialogInfo.fields) {
      // ...
    }
    this.applyTabProperties(testData, this.app.modelJson);
    this.applyObjectByTabsExtras(testData, this.app.modelJson);
    return testData
  }
}
