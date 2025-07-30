// testGeneratorRegressiveRefactored.js - Versión refactorizada siguiendo principios SOLID
import { BaseTestGenerator } from "../baseTestGenerator.js"
import { RegressiveDialogUtils } from "../utils/regressive/regressiveDialogUtils.js";
import { RegressivePanelUtils } from "../utils/regressive/regressivePanelUtils.js";
import { RegressiveNavigationUtils } from "../utils/regressive/regressiveNavigationUtils.js";
import { RegressiveDataUtils } from "../utils/regressive/regressiveDataUtils.js";

export class TestGeneratorRegressive extends BaseTestGenerator {
  constructor(app) {
    super(app);
    
    // Inicializar utilitarios
    this.dialogUtils = new RegressiveDialogUtils();
    this.panelUtils = new RegressivePanelUtils();
    this.navigationUtils = new RegressiveNavigationUtils();
    this.dataUtils = new RegressiveDataUtils();
    
    // Estado del test regresivo
    this.regressiveModelJsons = [];
    this.savedRegressiveActions = [];
    
    // Configurar persistencia del panel
    this.panelUtils.setupPanelPersistence();
    
    // Exponer métodos globalmente para debugging
    this.exposeDebugMethods();
  }

  // Método principal para iniciar el test regresivo
  showRegressiveDialog() {
    this.dialogUtils.showRegressiveDialog((numScreens) => {
      this.showJsonEditors(numScreens);
    });
  }

  // Mostrar editores de JSON
  showJsonEditors(num) {
    this.dialogUtils.showJsonEditors(num, (parsedJsons) => {
      this.regressiveModelJsons = parsedJsons;
      this.showSimpleActionSelector();
    });
  }

  // Mostrar selector de acciones
  showSimpleActionSelector() {
    this.dialogUtils.showSimpleActionSelector(
      this.regressiveModelJsons,
      (regressiveScreens) => this.handleGenerateForms(regressiveScreens),
      () => this.generateRegressiveTest()
    );
  }

  // Manejar la generación de formularios
  async handleGenerateForms(regressiveScreens) {
    await this.dataUtils.clearRegressiveFile();
    
    // Enviar todas las pantallas como array
    const allScreens = regressiveScreens.map(screen => screen.modelJson);
    await this.dataUtils.saveRegressiveScreenToFile(allScreens);

    if (regressiveScreens.length > 1) {
      this.showRegressiveNavigation(regressiveScreens);
    } else {
      this.loadSingleScreen(regressiveScreens[0]);
    }
  }

  // Mostrar navegación entre pantallas
  showRegressiveNavigation(regressiveScreens) {
    this.navigationUtils.showRegressiveNavigation(
      regressiveScreens, 
      this.app, 
      (screen, index) => {
        // Callback cuando cambia de pantalla
        this.panelUtils.restoreSavedActionsPanel();
      }
    );
    
    // Asegurar que el panel de acciones guardadas esté siempre visible
    this.panelUtils.createSavedActionsPanel();
  }

  // Cargar una sola pantalla
  loadSingleScreen(screen) {
    this.app.modelJson = screen.modelJson;
    this.app.sidebarManager.renderMainConfig(screen.modelJson);
    this.app.sidebarManager.renderActionsList(screen.modelJson);
    this.app.sidebarManager.renderRowButtonsList(screen.modelJson);
    
    // Asegurar que el panel de acciones guardadas esté siempre visible
    this.panelUtils.createSavedActionsPanel();
  }

  // Generar test regresivo
  generateRegressiveTest() {
    if (!this.savedRegressiveActions || this.savedRegressiveActions.length === 0) {
      alert('No hay acciones guardadas. Guarda al menos una acción antes de generar el test regresivo.');
      return;
    }

    try {
      const finalJson = this.dataUtils.generateRegressiveTestJson(this.savedRegressiveActions);
      this.dialogUtils.showRegressiveTestResult(finalJson);
    } catch (error) {
      alert(`Error al generar test regresivo: ${error.message}`);
    }
  }

  // Método para agregar acción guardada
  addSavedAction(action) {
    this.savedRegressiveActions.push(action);
    this.panelUtils.updateSavedActionsList();
  }

  // Método para remover acción guardada
  removeSavedAction(action) {
    this.panelUtils.removeSavedAction(action);
  }

  // Método para generar array desde acciones guardadas
  generateArrayFromSavedActions() {
    this.panelUtils.generateArrayFromSavedActions();
  }

  // Método para forzar actualización del panel
  forceUpdatePanel() {
    this.panelUtils.forceUpdatePanel();
  }

  // Método para forzar recreación del panel
  forceRecreatePanel() {
    this.panelUtils.forceRecreatePanel();
  }

  // Método para restaurar panel de acciones guardadas
  restoreSavedActionsPanel() {
    this.panelUtils.restoreSavedActionsPanel();
  }

  // Método para asegurar que el panel esté visible
  ensureSavedActionsPanelVisible() {
    this.panelUtils.ensureSavedActionsPanelVisible();
  }

  // Método para actualizar lista de acciones guardadas
  updateSavedActionsList() {
    this.panelUtils.updateSavedActionsList();
  }

  // Método para limpiar archivo regresivo
  async clearRegressiveFile() {
    return await this.dataUtils.clearRegressiveFile();
  }

  // Método para guardar pantalla regresiva
  async saveRegressiveScreenToFile(data) {
    return await this.dataUtils.saveRegressiveScreenToFile(data);
  }

  // Método para cargar datos regresivos
  async loadRegressiveData() {
    return await this.dataUtils.loadRegressiveData();
  }

  // Método para validar JSON de pantalla
  validateScreenJson(jsonData) {
    return this.dataUtils.validateScreenJson(jsonData);
  }

  // Método para procesar JSONs de pantallas
  processScreenJsons(jsonArray) {
    return this.dataUtils.processScreenJsons(jsonArray);
  }

  // Método para exportar datos
  exportRegressiveData(data, format) {
    return this.dataUtils.exportRegressiveData(data, format);
  }

  // Método para copiar al portapapeles
  async copyToClipboard(data) {
    return await this.dataUtils.copyToClipboard(data);
  }

  // Método para descargar archivo
  downloadFile(data, filename, format) {
    return this.dataUtils.downloadFile(data, filename, format);
  }

  // Método para navegar a siguiente pantalla
  navigateToNextScreen(regressiveScreens, onScreenChange) {
    this.navigationUtils.navigateToNextScreen(regressiveScreens, this.app, onScreenChange);
  }

  // Método para navegar a pantalla anterior
  navigateToPreviousScreen(regressiveScreens, onScreenChange) {
    this.navigationUtils.navigateToPreviousScreen(regressiveScreens, this.app, onScreenChange);
  }

  // Método para obtener pantalla actual
  getCurrentScreen(regressiveScreens) {
    return this.navigationUtils.getCurrentScreen(regressiveScreens, this.app);
  }

  // Método para limpiar navegación
  clearNavigation() {
    this.navigationUtils.clearNavigation();
  }

  // Método para debug
  debugForceUpdate() {
    this.panelUtils.debugForceUpdate();
  }

  // Exponer métodos de debug globalmente
  exposeDebugMethods() {
    window.forceUpdateRegressivePanel = () => this.forceRecreatePanel();
    window.generateRegressiveArray = () => this.generateArrayFromSavedActions();
    window.debugRegressivePanel = () => this.debugForceUpdate();
  }

  // Método para obtener estadísticas del test regresivo
  getRegressiveStats() {
    return {
      totalScreens: this.regressiveModelJsons.length,
      savedActions: this.savedRegressiveActions.length,
      hasNavigation: this.app.currentRegressiveScreenIndex !== undefined,
      currentScreen: this.app.currentRegressiveScreenIndex || 0
    };
  }

  // Método para resetear el estado del test regresivo
  resetRegressiveState() {
    this.regressiveModelJsons = [];
    this.savedRegressiveActions = [];
    this.app.currentRegressiveScreenIndex = undefined;
    this.clearNavigation();
    
    // Limpiar panel de acciones guardadas
    const panel = document.getElementById("regressive-saved-actions-panel");
    if (panel) {
      panel.remove();
    }
  }

  // Método para exportar configuración completa
  exportConfiguration() {
    return {
      regressiveModelJsons: this.regressiveModelJsons,
      savedRegressiveActions: this.savedRegressiveActions,
      currentScreenIndex: this.app.currentRegressiveScreenIndex,
      stats: this.getRegressiveStats()
    };
  }

  // Método para importar configuración
  importConfiguration(config) {
    if (config.regressiveModelJsons) {
      this.regressiveModelJsons = config.regressiveModelJsons;
    }
    if (config.savedRegressiveActions) {
      this.savedRegressiveActions = config.savedRegressiveActions;
    }
    if (config.currentScreenIndex !== undefined) {
      this.app.currentRegressiveScreenIndex = config.currentScreenIndex;
    }
    
    // Recrear panel si hay acciones guardadas
    if (this.savedRegressiveActions.length > 0) {
      this.panelUtils.createSavedActionsPanel();
    }
  }
} 