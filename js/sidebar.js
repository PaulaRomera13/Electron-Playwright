// sidebar.js - Gestor del sidebar (Refactorizado)
import { ConfigRenderer } from './utils/render/configRenderer.js';
import { ActionDescriptionProvider } from './utils/providers/actionDescriptionProvider.js';
import { ActionListRenderer } from './utils/render/actionListRenderer.js';
import { RowButtonsRenderer } from './utils/render/rowButtonsRenderer.js';
import { FunctionalityChecker } from './utils/checkers/functionalityChecker.js';

/**
 * Clase que coordina toda la funcionalidad del sidebar
 * Sigue el principio de responsabilidad única - solo coordina los componentes
 */
export class SidebarManager {
  /**
   * Constructor del gestor del sidebar
   * @param {Object} app - Referencia a la aplicación principal
   */
  constructor(app) {
    this.app = app;
    
    // Inicializar managers de responsabilidades específicas
    this.configRenderer = new ConfigRenderer();
    this.actionDescriptionProvider = new ActionDescriptionProvider();
    this.actionListRenderer = new ActionListRenderer(app);
    this.rowButtonsRenderer = new RowButtonsRenderer(app);
    this.functionalityChecker = new FunctionalityChecker(app);
  }

  /**
   * Renderiza la configuración principal en el sidebar
   * @param {Object} modelJson - Modelo JSON
   */
  renderMainConfig(modelJson) {
    this.configRenderer.renderMainConfig(modelJson);
  }

  /**
   * Renderiza la lista de acciones disponibles en el sidebar
   * @param {Object} modelJson - Modelo JSON
   */
  renderActionsList(modelJson) {
    this.actionListRenderer.renderActionsList(modelJson);
  }

  /**
   * Renderiza la lista de row_buttons disponibles en el sidebar
   * @param {Object} modelJson - Modelo JSON
   */
  renderRowButtonsList(modelJson) {
    this.rowButtonsRenderer.renderRowButtonsList(modelJson);
  }

  /**
   * Verifica si la funcionalidad de descarga está habilitada
   * @param {Object} modelJson - Modelo JSON
   */
  checkDownloadable(modelJson) {
    this.functionalityChecker.checkDownloadable(modelJson);
  }

  /**
   * Obtiene una descripción específica para el tipo de acción
   * @param {Object} action - Objeto de acción
   * @returns {string} Descripción específica de la acción
   */
  getActionDescription(action) {
    return this.actionDescriptionProvider.getActionDescription(action);
  }

  /**
   * Obtiene estadísticas del sidebar
   * @returns {Object} Estadísticas del sidebar
   */
  getSidebarStats() {
    return {
      configRenderer: 'ConfigRenderer',
      actionDescriptionProvider: 'ActionDescriptionProvider',
      actionListRenderer: 'ActionListRenderer',
      rowButtonsRenderer: 'RowButtonsRenderer',
      functionalityChecker: 'FunctionalityChecker'
    };
  }

  /**
   * Método de debug para desarrollo
   */
  debug() {
    console.log('=== SidebarManager Debug ===');
    console.log('Config Renderer:', this.configRenderer);
    console.log('Action Description Provider:', this.actionDescriptionProvider);
    console.log('Action List Renderer:', this.actionListRenderer);
    console.log('Row Buttons Renderer:', this.rowButtonsRenderer);
    console.log('Functionality Checker:', this.functionalityChecker);
  }
}