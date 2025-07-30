// actionRenderer.js - Renderizado de detalles de acciones 
import { ActionTypeValidator } from '../validation/actionTypeValidator.js';
import { FormFactory } from '../factory/formFactory.js';
import { TabManager } from '../components/tabManager.js';
import { RegressiveModeManager } from '../regressive/regressiveModeManager.js';

export class ActionRenderer {
  constructor(app) {
    this.app = app;
    
    // Inicializar managers de responsabilidades específicas
    this.actionTypeValidator = new ActionTypeValidator();
    this.formFactory = new FormFactory(app);
    this.tabManager = new TabManager(app);
    this.regressiveModeManager = new RegressiveModeManager(app);
  }

  /**
   * Renderiza los detalles de una acción
   * @param {Object} action - Objeto de acción
   * @param {HTMLElement} targetContainer - Contenedor objetivo
   */
  renderActionDetails(action, targetContainer) {
    const container = targetContainer || document.getElementById("details-container");
    if (!container) return;

    // Preservar y restaurar navegación regresiva
    this.regressiveModeManager.preserveRegressiveNavigation(container);
    this.clearContainer(container);
    this.regressiveModeManager.restoreRegressiveNavigation(container, targetContainer);

    const uniqueId = targetContainer ? `_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : '';
    
    // Crear título de la acción
    this.createActionTitle(container, action);
    
    // Crear contenedor de pestañas
    const tabContainer = this.tabManager.createTabContainer(container, action, uniqueId, targetContainer);
    this.tabManager.createTabContents(tabContainer, action, uniqueId, targetContainer);
    
    // Manejar modo regresivo
    this.regressiveModeManager.handleSingleRegressiveMode();
    this.tabManager.setupTabSwitcher(uniqueId, targetContainer);
  }

  /**
   * Limpia el contenedor
   * @param {HTMLElement} container - Contenedor a limpiar
   */
  clearContainer(container) {
    container.innerHTML = "";
  }

  /**
   * Crea el título de la acción
   * @param {HTMLElement} container - Contenedor padre
   * @param {Object} action - Objeto de acción
   */
  createActionTitle(container, action) {
    const title = document.createElement("h2");
    title.innerHTML = `<i class="fas fa-cube"></i> ${action.actionName}`;
    title.style.color = "var(--primary-color)";
    title.style.marginBottom = "25px";
    container.appendChild(title);
  }

  /**
   * Obtiene estadísticas del renderer
   * @returns {Object} Estadísticas del renderer
   */
  getRendererStats() {
    return {
      actionTypeValidator: 'ActionTypeValidator',
      formFactory: 'FormFactory',
      tabManager: 'TabManager',
      regressiveModeManager: 'RegressiveModeManager'
    };
  }

  /**
   * Método de debug para desarrollo
   */
  debug() {
    console.log('=== ActionRenderer Debug ===');
    console.log('Action Type Validator:', this.actionTypeValidator);
    console.log('Form Factory:', this.formFactory);
    console.log('Tab Manager:', this.tabManager);
    console.log('Regressive Mode Manager:', this.regressiveModeManager);
  }
} 