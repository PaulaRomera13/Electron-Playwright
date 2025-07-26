import { BaseTestGenerator } from "../baseTestGenerator.js"

export class TestGeneratorReactiveObjectDialog extends BaseTestGenerator {
  constructor(app) {
    super(app)
    this.lang = 'en'; // idioma por defecto
  }

  createForm() {
    const form = document.createElement("div")
    form.className = "test-form"
    // Obtener label de Number of Days según idioma
    const selectedAction = this.app.getSelectedAction();
    let labelNumDaysEN = 'Number of Days';
    let labelNumDaysES = 'Número de Días';
    if (selectedAction && selectedAction.dialogInfo && selectedAction.dialogInfo.fieldsObject && selectedAction.dialogInfo.fieldsObject.queryNumDays) {
      labelNumDaysEN = selectedAction.dialogInfo.fieldsObject.queryNumDays.label_en || 'Number of Days';
      labelNumDaysES = selectedAction.dialogInfo.fieldsObject.queryNumDays.label_es || 'Número de Días';
    }
    form.innerHTML = `
      <div class="alert alert-info">
        <i class="fas fa-info-circle"></i> Configuración de Test para Reactivar Objeto
      </div>
      ${this.generateCommonFields()}
      ${this.generateAdditionalConfigFields()}
      ${this.generateNotificationFields()}
      <div class="form-section">
        <h4><i class="fas fa-bolt"></i> Configuración Reactivar Diálogo de Objetos</h4>
        <div class="form-group" style="margin-bottom: 24px;">
          <div class="tab-language-toggle">
            <label><input type="radio" name="langNumDays" value="en" ${this.lang === 'en' ? 'checked' : ''}> <b>EN: ${labelNumDaysEN}</b></label>
            <label><input type="radio" name="langNumDays" value="es" ${this.lang === 'es' ? 'checked' : ''}> <b>ES: ${labelNumDaysES}</b></label>
          </div>
        </div>
        <div class="form-group">
          <label for="numbersOfDaysValue" style="font-weight: normal;">${this.lang === 'en' ? labelNumDaysEN : labelNumDaysES}</label>
          <input type="number" id="numbersOfDaysValue" value="10007" />
        </div>
        <div class="form-group">
          <label for="buttonDo">Botón de aceptar:</label>
          <input type="text" id="buttonDo" value="Do" />
        </div>
        <div class="form-group">
          <label for="optionToReactivate">Opción a reactivar:</label>
          <input type="text" id="optionToReactivate" placeholder="Ej: Proposal: O-DEMO" />
        </div>
      </div>
    `
    setTimeout(() => this.setupListeners(), 0)
    return form
  }

  setupListeners() {
    // Actualizar label de Number of Days según idioma
    const radios = document.querySelectorAll('input[name="langNumDays"]')
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.lang = e.target.value
        // Guardar scroll global antes de reemplazar
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const oldForm = document.querySelector('.test-form');
        const parent = oldForm.parentNode;
        parent.replaceChild(this.createForm(), oldForm)
        // Restaurar scroll global después de renderizar
        setTimeout(() => {
          window.scrollTo({ top: scrollTop });
        }, 0);
      })
    })
    // Actualizar preview al cambiar cualquier campo
    const buttonDo = document.getElementById('buttonDo')
    const numbersOfDaysValue = document.getElementById('numbersOfDaysValue')
    const optionToReactivate = document.getElementById('optionToReactivate')
    buttonDo.addEventListener('input', () => this.updatePreview())
    numbersOfDaysValue.addEventListener('input', () => this.updatePreview())
    optionToReactivate.addEventListener('input', () => this.updatePreview())
    // Listeners para campos comunes
    const inputs = document.querySelectorAll(".test-form input, .test-form select, .test-form textarea")
    const checkbox = document.getElementById("hideActionsButton")
    const hideConfig = document.getElementById("hideActionsButtonConfig")
    const arrowCheckbox = document.getElementById("addArrowConfig")
    const arrowConfigContainer = document.getElementById("arrowConfigContainer")
    const selectedAction = this.app.getSelectedAction()
    if (selectedAction) {
      const buttonNameInput = document.getElementById("buttonName")
      if (buttonNameInput) buttonNameInput.value = selectedAction.actionName
    }
    if (checkbox) {
      checkbox.addEventListener("change", () => {
        if (hideConfig) hideConfig.style.display = checkbox.checked ? "block" : "none"
        this.updatePreview()
      })
    }
    if (arrowCheckbox) {
      arrowCheckbox.addEventListener("change", () => {
        if (arrowConfigContainer) arrowConfigContainer.style.display = arrowCheckbox.checked ? "block" : "none"
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
    formData.buttonDo = document.getElementById('buttonDo')?.value || 'Do'
    formData.numbersOfDays = {
      label: 'Number of Days',
      value: document.getElementById('numbersOfDaysValue')?.value || '10007'
    }
    // Actualizar label según idioma
    const selectedAction = this.app.getSelectedAction();
    if (selectedAction && selectedAction.dialogInfo && selectedAction.dialogInfo.fieldsObject && selectedAction.dialogInfo.fieldsObject.queryNumDays) {
      formData.numbersOfDays.label = this.lang === 'es'
        ? (selectedAction.dialogInfo.fieldsObject.queryNumDays.label_es || 'Número de Días')
        : (selectedAction.dialogInfo.fieldsObject.queryNumDays.label_en || 'Number of Days');
    }
    formData.optionToReactivate = {
      toReactivate: 'label',
      option: document.getElementById('optionToReactivate')?.value || ''
    }
    formData.screenShotsFilledForm = 'Filled Form'
    formData.screenShotsDo = formData.buttonDo
    formData.refreshLocator = "md-filled-button[icon='refresh']"
    // Plantilla base
    const testDataTemplate = this.app.jsonUtils.getTestDataTemplate()
    const testData = JSON.parse(JSON.stringify(testDataTemplate))
    // Aplicar datos comunes
    this.applyCommonTestData(testData, formData)
    // Añadir campos específicos
    testData.buttonDo = formData.buttonDo
    testData.numbersOfDays = formData.numbersOfDays
    testData.optionToReactivate = formData.optionToReactivate
    testData.screenShotsFilledForm = formData.screenShotsFilledForm
    testData.screenShotsDo = formData.screenShotsDo
    testData.refreshLocator = formData.refreshLocator
    this.updatePreviewDisplay(testData)
  }
}

export default TestGeneratorReactiveObjectDialog; 