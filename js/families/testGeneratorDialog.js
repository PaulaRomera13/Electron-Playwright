// Generador de tests para acciones con diálogo - Refactorizado siguiendo principios SOLID
import { BaseTestGenerator } from "../baseTestGenerator.js"
import { DialogFormRenderer } from "../utils/form/dialogFormRenderer.js"
import { DialogEventManager } from "../utils/form/dialogEventManager.js"
import { DialogDataCollector } from "../utils/form/dialogDataCollector.js"
import { DialogTestDataGenerator } from "../utils/test/dialogTestDataGenerator.js"

export class TestGeneratorDialog extends BaseTestGenerator {
  constructor(app) {
    super(app)
    
    // Inicializar componentes con responsabilidades específicas
    this.formRenderer = new DialogFormRenderer(app)
    this.eventManager = new DialogEventManager(app)
    this.dataCollector = new DialogDataCollector(app)
    this.testDataGenerator = new DialogTestDataGenerator(app)
  }

  /**
   * Crea el formulario delegando la responsabilidad al renderizador
   * @returns {HTMLElement} Elemento DOM del formulario
   */
  createForm() {
    return this.formRenderer.createForm()
  }

  /**
   * Configura los listeners delegando la responsabilidad al manager de eventos
   */
  setupListeners() {
    this.eventManager.setupListeners(() => this.updatePreview())
  }

  /**
   * Actualiza la vista previa del test
   */
  updatePreview() {
    // Recolectar datos del formulario
    const formData = this.dataCollector.collectFormData()
    
    // Generar datos de test
    const testData = this.testDataGenerator.generateDialogTestData(formData)
    
    // Aplicar propiedades adicionales
    this.applyTabProperties(testData, this.app.modelJson)
    this.applyObjectByTabsExtras(testData, this.app.modelJson)
    
    // Actualizar la vista previa
    this.updatePreviewDisplay(testData)
  }
}