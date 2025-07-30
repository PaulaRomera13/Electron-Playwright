// formFactory.js - Factory para creación de formularios según tipo de acción
import { ActionTypeValidator } from '../validation/actionTypeValidator.js';

export class FormFactory {
  constructor(app) {
    this.app = app;
    this.actionTypeValidator = new ActionTypeValidator();
  }

  /**
   * Crea el formulario de test según el tipo de acción
   * @param {Object} action - Objeto de acción
   * @param {string} idSuffix - Sufijo para IDs únicos
   * @returns {Object} Objeto con {testForm, generatorType}
   */
  createTestForm(action, idSuffix) {
    const generatorType = this.actionTypeValidator.getGeneratorType(action);
    const testForm = this.createFormByType(generatorType, idSuffix);
    
    return { testForm, generatorType };
  }

  /**
   * Crea el formulario según el tipo de generador
   * @param {string} generatorType - Tipo de generador
   * @param {string} idSuffix - Sufijo para IDs únicos
   * @returns {HTMLElement} Elemento del formulario
   */
  createFormByType(generatorType, idSuffix) {
    const generatorMap = {
      reactivateObjectDialog: () => this.app.testGeneratorReactiveObjectDialog.createForm(idSuffix),
      dialogWithColumnSelection: () => this.app.testGeneratorDialogWithColumnSelection.createForm(idSuffix),
      dialog: () => this.app.testGeneratorDialog.createForm(idSuffix),
      audit: () => this.app.testGeneratorAudit.createForm(idSuffix),
      removeAttachment: () => this.app.testGeneratorRemoveAttachment.createForm(idSuffix),
      aws: () => this.app.testGeneratorAWS.createForm(idSuffix),
      openAttachment: () => this.app.testGeneratorOpenAttachment.createForm(idSuffix),
      export: () => this.app.testGeneratorExport.createForm(idSuffix),
      noDialog: () => this.app.testGeneratorNoDialog.createForm(idSuffix)
    };

    const generator = generatorMap[generatorType];
    if (!generator) {
      console.warn(`Generador no encontrado para tipo: ${generatorType}`);
      return this.app.testGeneratorNoDialog.createForm(idSuffix);
    }

    return generator();
  }

  /**
   * Configura los listeners del test según el tipo de generador
   * @param {string} generatorType - Tipo de generador
   * @param {string} idSuffix - Sufijo para IDs únicos
   * @param {HTMLElement} targetContainer - Contenedor objetivo
   * @param {Object} action - Objeto de acción
   */
  setupTestListeners(generatorType, idSuffix, targetContainer, action) {
    const listenerMap = {
      dialogWithColumnSelection: () => this.app.testGeneratorDialogWithColumnSelection.setupListeners(idSuffix, targetContainer ? action : null),
      reactivateObjectDialog: () => this.app.testGeneratorReactiveObjectDialog.setupListeners(idSuffix, targetContainer ? action : null),
      dialog: () => this.app.testGeneratorDialog.setupListeners(idSuffix, targetContainer ? action : null),
      audit: () => this.app.testGeneratorAudit.setupListeners(idSuffix, targetContainer ? action : null),
      removeAttachment: () => this.app.testGeneratorRemoveAttachment.setupListeners(idSuffix, targetContainer ? action : null),
      aws: () => this.app.testGeneratorAWS.setupListeners(idSuffix, targetContainer ? action : null),
      openAttachment: () => this.app.testGeneratorOpenAttachment.setupListeners(idSuffix, targetContainer ? action : null),
      export: () => this.app.testGeneratorExport.setupListeners(idSuffix, targetContainer ? action : null),
      noDialog: () => this.app.testGeneratorNoDialog.setupListeners(idSuffix, targetContainer ? action : null)
    };

    const setupListeners = () => {
      const listener = listenerMap[generatorType];
      if (listener) {
        listener();
      }
      this.app.jsonUtils.setupPreviewControls();
    };

    if (targetContainer) {
      setTimeout(setupListeners, 0);
    } else {
      setTimeout(setupListeners, 100);
    }
  }
} 