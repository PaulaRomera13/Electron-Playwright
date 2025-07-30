/*
 * Archivo principal refactorizado de la aplicación Playwright Test Generator
 * Sigue los principios SOLID con responsabilidades separadas
 */

// Importación de módulos principales
import { SidebarManager } from "./sidebar.js";
import { TestGeneratorDialog } from "./families/testGeneratorDialog.js";
import { TestGeneratorNoDialog } from "./families/testGeneratorNoDialog.js";
import { TestGeneratorAudit } from "./families/testGeneratorAudit.js";
import { TestGeneratorExport } from "./families/testGeneratorExport.js";
import { JsonUtils } from "./utils/data/jsonUtils.js";
import { FieldUtils } from "./utils/data/fieldUtils.js";
import { TestGeneratorOpenAttachment } from "./families/testGeneratorOpenAttachment.js";
import { TestGeneratorRemoveAttachment } from "./families/testGeneratorRemoveAttachment.js";
import { TestGeneratorAWS } from "./families/testGeneratorAWS.js";
import { TestGeneratorDialogWithColumnSelection } from "./families/testGeneratorDialogWithColumnSelection.js";
import { TestGeneratorReactiveObjectDialog } from "./families/testGeneratorReactiveObjectDialog.js";
import { TestGeneratorRegressive } from "./families/testGeneratorRegressive.js";

// Importación de clases utilitarias refactorizadas
import { AppInitializer } from "./utils/core/appInitializer.js";
import { EventManager } from "./utils/core/eventManager.js";
import { ActionRenderer } from "./utils/render/actionRenderer.js";
import { StateManager } from "./utils/core/stateManager.js";
import { RegressiveActionManager } from "./utils/regressive/regressiveActionManager.js";
import { FormFactory } from "./utils/factory/formFactory.js";

/**
 * Clase principal refactorizada que coordina toda la aplicación
 * Sigue el principio de responsabilidad única - solo coordina los componentes
 */
class PlaywrightTestGenerator {
  constructor() {
    // Inicializar managers de responsabilidades específicas
    this.appInitializer = new AppInitializer(this);
    this.eventManager = new EventManager(this);
    this.actionRenderer = new ActionRenderer(this);
    this.stateManager = new StateManager(this);
    this.regressiveActionManager = new RegressiveActionManager(this);

    // Inicializar componentes principales
    this.initializeComponents();
    
    // Configurar eventos
    this.eventManager.setupAllEvents();
    
    // Inicializar la aplicación
    this.appInitializer.initializeApp();
  }

  /**
   * Inicializa todos los componentes principales
   */
  initializeComponents() {
    // Sidebar manager
    this.sidebarManager = new SidebarManager(this);
    
    // Test generators
    this.testGeneratorDialog = new TestGeneratorDialog(this);
    this.testGeneratorNoDialog = new TestGeneratorNoDialog(this);
    this.testGeneratorAudit = new TestGeneratorAudit(this);
    this.testGeneratorExport = new TestGeneratorExport(this);
    this.testGeneratorOpenAttachment = new TestGeneratorOpenAttachment(this);
    this.testGeneratorRemoveAttachment = new TestGeneratorRemoveAttachment(this);
    this.testGeneratorAWS = new TestGeneratorAWS(this);
    this.testGeneratorDialogWithColumnSelection = new TestGeneratorDialogWithColumnSelection(this);
    this.testGeneratorReactiveObjectDialog = new TestGeneratorReactiveObjectDialog(this);
    this.testGeneratorRegressive = new TestGeneratorRegressive(this);
    
    // Utils
    this.jsonUtils = new JsonUtils(this);
    this.fieldUtils = new FieldUtils(this);
    
    // Factory para formularios
    this.formFactory = new FormFactory(this);
  }

  /**
   * Inicializa la aplicación (delegado al AppInitializer)
   */
  async init() {
    await this.appInitializer.init();
  }

  /**
   * Selecciona una acción (delegado al StateManager)
   */
  selectAction(action, index, source = 'actions') {
    this.stateManager.selectAction(action, index, source);
  }

  /**
   * Renderiza los detalles de una acción (delegado al ActionRenderer)
   */
  renderActionDetails(action, targetContainer) {
    this.actionRenderer.renderActionDetails(action, targetContainer);
  }

  /**
   * Guarda una acción regresiva (delegado al RegressiveActionManager)
   */
  saveRegressiveAction(action, idSuffix, targetContainer) {
    this.regressiveActionManager.saveRegressiveAction(action, idSuffix, targetContainer);
  }

  /**
   * Actualiza el panel dinámico de acciones guardadas (delegado al RegressiveActionManager)
   */
  updateDynamicSavedActions(targetContainer) {
    this.regressiveActionManager.updateDynamicSavedActions(targetContainer);
  }

  // Métodos de acceso al estado (delegados al StateManager)
  getSelectedAction() {
    return this.stateManager.getSelectedAction();
  }

  getOriginalTestData() {
    return this.stateManager.getOriginalTestData();
  }

  setOriginalTestData(data) {
    this.stateManager.setOriginalTestData(data);
  }

  getLastHighlightedField() {
    return this.stateManager.getLastHighlightedField();
  }

  setLastHighlightedField(field) {
    this.stateManager.setLastHighlightedField(field);
  }

  setActiveTabIdx(idx) {
    this.stateManager.setActiveTabIdx(idx);
  }

  getActiveTabIdx() {
    return this.stateManager.getActiveTabIdx();
  }

  // Métodos adicionales para funcionalidad avanzada
  getStateStats() {
    return this.stateManager.getStateStats();
  }

  getRegressiveActionStats() {
    return this.regressiveActionManager.getRegressiveActionStats();
  }

  exportRegressiveActions() {
    return this.regressiveActionManager.exportRegressiveActions();
  }

  importRegressiveActions(jsonData) {
    return this.regressiveActionManager.importRegressiveActions(jsonData);
  }

  clearSavedRegressiveActions() {
    this.regressiveActionManager.clearSavedRegressiveActions();
  }

  resetApplicationState() {
    this.stateManager.resetState();
  }

  /**
   * Método de debug para desarrollo
   */
  debug() {
    console.log('=== Estado de la Aplicación ===');
    console.log('Estado:', this.stateManager.getState());
    console.log('Estadísticas del estado:', this.stateManager.getStateStats());
    console.log('Estadísticas regresivas:', this.regressiveActionManager.getRegressiveActionStats());
    console.log('¿Estado válido?', this.stateManager.isStateValid());
    console.log('Estadísticas del renderer:', this.actionRenderer.getRendererStats());
    console.log('Estadísticas del sidebar:', this.sidebarManager.getSidebarStats());
  }
}

// Inicializar la aplicación refactorizada
window.playwrightApp = new PlaywrightTestGenerator();

// Exponer métodos de debug globalmente para desarrollo
window.debugApp = () => window.playwrightApp.debug();
window.getAppStats = () => window.playwrightApp.getStateStats();
window.getRegressiveStats = () => window.playwrightApp.getRegressiveActionStats(); 