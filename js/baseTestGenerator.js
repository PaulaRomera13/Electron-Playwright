/*
 * Clase base refactorizada para todos los generadores de test
 * Sigue los principios SOLID con responsabilidades separadas
 */

// Importación de clases utilitarias refactorizadas
import { HtmlFieldGenerator } from './utils/form/htmlFieldGenerator.js';
import { FormListenerManager } from './utils/form/formListenerManager.js';
import { FormDataCollector } from './utils/form/formDataCollector.js';
import { TestDataApplier } from './utils/test/testDataApplier.js';
import { TabsComponentManager } from './utils/components/tabsComponentManager.js';

/**
 * Clase base refactorizada que proporciona funcionalidad común para todos los generadores de test
 * Sigue el principio de responsabilidad única - solo coordina los componentes
 */
export class BaseTestGenerator {
  /**
   * Constructor de la clase base refactorizada
   * @param {Object} app - Referencia a la aplicación principal
   */
  constructor(app) {
    this.app = app; // Guardar referencia para acceso a métodos globales
    
    // Inicializar managers de responsabilidades específicas
    this.htmlFieldGenerator = new HtmlFieldGenerator();
    this.formListenerManager = new FormListenerManager(app);
    this.formDataCollector = new FormDataCollector();
    this.testDataApplier = new TestDataApplier(app);
    this.tabsComponentManager = new TabsComponentManager(app);
  }

  /**
   * Genera los campos HTML comunes que usan todos los generadores
   * @returns {string} HTML de los campos comunes
   */
  generateCommonFields() {
    return this.htmlFieldGenerator.generateCommonFields();
  }

  /**
   * Genera los campos HTML para configuraciones adicionales comunes
   * @returns {string} HTML de las configuraciones adicionales
   */
  generateAdditionalConfigFields() {
    return this.htmlFieldGenerator.generateAdditionalConfigFields();
  }

  /**
   * Genera los campos HTML para textos de notificación
   * @returns {string} HTML de los campos de notificación
   */
  generateNotificationFields() {
    return this.htmlFieldGenerator.generateNotificationFields();
  }

  /**
   * Genera campos HTML personalizados
   * @param {Object} config - Configuración de los campos
   * @returns {string} HTML de los campos personalizados
   */
  generateCustomFields(config) {
    return this.htmlFieldGenerator.generateCustomFields(config);
  }

  /**
   * Configura los listeners comunes para todos los formularios
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupCommonListeners(updatePreviewCallback) {
    this.formListenerManager.setupCommonListeners(updatePreviewCallback);
  }

  /**
   * Configura listeners personalizados para elementos específicos
   * @param {Object} config - Configuración de listeners
   * @param {Function} updatePreviewCallback - Función callback para actualizar la vista previa
   */
  setupCustomListeners(config, updatePreviewCallback) {
    this.formListenerManager.setupCustomListeners(config, updatePreviewCallback);
  }

  /**
   * Configura listeners para validación en tiempo real
   * @param {Object} validationConfig - Configuración de validación
   */
  setupValidationListeners(validationConfig) {
    this.formListenerManager.setupValidationListeners(validationConfig);
  }

  /**
   * Recopila los datos comunes del formulario
   * @returns {Object} Objeto con los datos comunes del formulario
   */
  getCommonFormData() {
    return this.formDataCollector.getCommonFormData();
  }

  /**
   * Recopila datos de campos personalizados
   * @param {Array} fieldIds - Array de IDs de campos a recopilar
   * @returns {Object} Objeto con los datos de los campos personalizados
   */
  getCustomFormData(fieldIds) {
    return this.formDataCollector.getCustomFormData(fieldIds);
  }

  /**
   * Recopila datos de campos con validación
   * @param {Object} validationConfig - Configuración de validación
   * @returns {Object} Objeto con los datos y estado de validación
   */
  getValidatedFormData(validationConfig) {
    return this.formDataCollector.getValidatedFormData(validationConfig);
  }

  /**
   * Recopila todos los datos del formulario de una vez
   * @param {Object} config - Configuración completa del formulario
   * @returns {Object} Objeto con todos los datos del formulario
   */
  getAllFormData(config = {}) {
    return this.formDataCollector.getAllFormData(config);
  }

  /**
   * Aplica los datos comunes a la plantilla de test
   * @param {Object} testData - Objeto de datos de test a modificar
   * @param {Object} formData - Datos del formulario
   */
  applyCommonTestData(testData, formData) {
    this.testDataApplier.applyCommonTestData(testData, formData);
  }

  /**
   * Aplica todos los datos a la plantilla de test
   * @param {Object} testData - Objeto de datos de test a modificar
   * @param {Object} formData - Datos del formulario
   * @param {Object} config - Configuración completa
   */
  applyAllTestData(testData, formData, config = {}) {
    this.testDataApplier.applyAllTestData(testData, formData, config);
  }

  /**
   * Valida que los datos aplicados sean correctos
   * @param {Object} testData - Datos de test a validar
   * @returns {Object} Resultado de la validación
   */
  validateAppliedData(testData) {
    return this.testDataApplier.validateAppliedData(testData);
  }

  /**
   * Si el componente es Tabs, añade los objetos de tab requeridos
   * @param {Object} json - El JSON de configuración
   * @param {'es'|'en'} lang - Idioma ('es' o 'en')
   * @returns {Array<Object>} Array de objetos con phraseTab, tab y screenShotTab
   */
  addTabsTestSteps(json, lang = 'es') {
    return this.tabsComponentManager.addTabsTestSteps(json, lang);
  }

  /**
   * Renderiza el selector de idioma de la tab si el modelo es Tabs
   * @param {Object} modelJson - Modelo JSON
   * @returns {string} HTML del selector o vacío
   */
  renderTabLangSelector(modelJson) {
    return this.tabsComponentManager.renderTabLangSelector(modelJson);
  }

  /**
   * Añade phraseTab, tab y screenShotTab al testData si el modelo es Tabs
   * @param {Object} testData - Datos de test
   * @param {Object} modelJson - Modelo JSON
   */
  applyTabProperties(testData, modelJson) {
    this.tabsComponentManager.applyTabProperties(testData, modelJson);
  }

  /**
   * Renderiza los extras de ObjectByTabs (radio y campos de búsqueda/selección) si corresponde
   * @param {Object} modelJson - Modelo JSON
   * @returns {string} HTML del bloque o vacío
   */
  renderObjectByTabsExtras(modelJson) {
    return this.tabsComponentManager.renderObjectByTabsExtras(modelJson);
  }

  /**
   * Añade las propiedades de búsqueda/selección de ObjectByTabs al testData si corresponde
   * @param {Object} testData - Datos de test
   * @param {Object} modelJson - Modelo JSON
   */
  applyObjectByTabsExtras(testData, modelJson) {
    this.tabsComponentManager.applyObjectByTabsExtras(testData, modelJson);
  }

  /**
   * Actualiza la vista previa con los datos generados
   * @param {Object} testData - Datos de test generados
   */
  updatePreviewDisplay(testData) {
    this.app.setOriginalTestData(testData); // Guardar en la aplicación
    const previewData = {
      testDataGame: JSON.stringify(testData),
    };
    const preview = document.getElementById("testPreview");
    if (preview) {
      preview.textContent = JSON.stringify(previewData, null, 2); // Mostrar JSON formateado
    }
  }

  /**
   * Método de debug para desarrollo
   */
  debug() {
    console.log('=== BaseTestGenerator Debug ===');
    console.log('App:', this.app);
    console.log('HTML Field Generator:', this.htmlFieldGenerator);
    console.log('Form Listener Manager:', this.formListenerManager);
    console.log('Form Data Collector:', this.formDataCollector);
    console.log('Test Data Applier:', this.testDataApplier);
    console.log('Tabs Component Manager:', this.tabsComponentManager);
  }

  /**
   * Obtiene estadísticas de los componentes
   * @returns {Object} Estadísticas de los componentes
   */
  getComponentStats() {
    return {
      htmlFieldGenerator: 'HtmlFieldGenerator',
      formListenerManager: 'FormListenerManager',
      formDataCollector: 'FormDataCollector',
      testDataApplier: 'TestDataApplier',
      tabsComponentManager: 'TabsComponentManager'
    };
  }

  /**
   * Valida la configuración de tabs
   * @param {Object} modelJson - Modelo JSON
   * @returns {Object} Resultado de la validación
   */
  validateTabsConfiguration(modelJson) {
    return this.tabsComponentManager.validateTabsConfiguration(modelJson);
  }

  /**
   * Obtiene información detallada de las tabs
   * @param {Object} modelJson - Modelo JSON
   * @returns {Array<Object>} Array con información detallada de las tabs
   */
  getTabsInfo(modelJson) {
    return this.tabsComponentManager.getTabsInfo(modelJson);
  }

  /**
   * Renderiza un selector de tabs
   * @param {Object} modelJson - Modelo JSON
   * @returns {string} HTML del selector de tabs
   */
  renderTabsSelector(modelJson) {
    return this.tabsComponentManager.renderTabsSelector(modelJson);
  }

  /**
   * Aplica la selección de tab al testData
   * @param {Object} testData - Datos de test
   * @param {Object} modelJson - Modelo JSON
   */
  applyTabsSelection(testData, modelJson) {
    this.tabsComponentManager.applyTabsSelection(testData, modelJson);
  }
} 