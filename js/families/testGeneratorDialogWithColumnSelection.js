import { BaseTestGenerator } from "../baseTestGenerator.js"

export class TestGeneratorDialogWithColumnSelection extends BaseTestGenerator {
  constructor(app) {
    super(app)
  }

  createForm() {
    const form = document.createElement("div")
    form.className = "test-form"
    // Campos comunes + campo específico
    form.innerHTML = `
      <div class="alert alert-info">
        <i class="fas fa-info-circle"></i> Configuración de Test para acción con selección de columna en diálogo
      </div>
      ${this.generateCommonFields()}
      ${this.generateAdditionalConfigFields()}
      ${this.generateNotificationFields()}
      <div class="form-section">
        <h4><i class="fas fa-table-columns"></i> Configuración Diálogo con Selección de Columna</h4>
        <div class="form-group">
          <label for="itemToSelect">Ítem a seleccionar (itemToSelect):</label>
          <input type="text" id="itemToSelect" placeholder="Ej: HPLC" />
        </div>
        <div class="form-group">
          <label for="buttonDo">Botón de acceptar:</label>
          <input type="text" id="buttonDo" value="Do" />
        </div>
      </div>
    `
    return form
  }

  setupListeners() {
    // Listeners para todos los campos del formulario
    const inputs = document.querySelectorAll(".test-form input, .test-form select, .test-form textarea")
    const checkbox = document.getElementById("hideActionsButton")
    const hideConfig = document.getElementById("hideActionsButtonConfig")
    const arrowCheckbox = document.getElementById("addArrowConfig")
    const arrowConfigContainer = document.getElementById("arrowConfigContainer")
    const selectedAction = this.app.getSelectedAction()
    if (selectedAction) {
      document.getElementById("buttonName").value = selectedAction.actionName
    }
    if (checkbox) {
      checkbox.addEventListener("change", () => {
        hideConfig.style.display = checkbox.checked ? "block" : "none"
        this.updatePreview()
      })
    }
    if (arrowCheckbox) {
      arrowCheckbox.addEventListener("change", () => {
        arrowConfigContainer.style.display = arrowCheckbox.checked ? "block" : "none"
        this.updatePreview()
      })
    }
    inputs.forEach((input) => {
      input.addEventListener("input", () => this.updatePreview())
      input.addEventListener("change", () => this.updatePreview())
    })
    this.updatePreview()
  }

  updatePreview() {
    // Obtener datos comunes y específicos
    const formData = this.getCommonFormData()
    formData.itemToSelect = document.getElementById("itemToSelect")?.value || ""
    formData.buttonDo = document.getElementById("buttonDo")?.value || "Do"
    formData.screenShotsDo = formData.buttonDo
    formData.screenShotsFilledForm = "Filled Form"
    // Generar testData
    const testData = this.generateDialogWithColumnSelectionTestData(formData)
    this.updatePreviewDisplay(testData)
  }

  generateDialogWithColumnSelectionTestData(formData) {
    // Plantilla base
    const testDataTemplate = this.app.jsonUtils.getTestDataTemplate()
    const testData = JSON.parse(JSON.stringify(testDataTemplate))
    // Aplicar datos comunes
    this.applyCommonTestData(testData, formData)
    // Añadir campos específicos
    testData.itemToSelect = formData.itemToSelect
    testData.buttonDo = formData.buttonDo
    testData.screenShotsDo = formData.screenShotsDo
    testData.screenShotsFilledForm = formData.screenShotsFilledForm
    return testData
  }
} 