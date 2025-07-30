// stateManager.js - Gestión del estado global de la aplicación
export class StateManager {
  constructor(app) {
    this.app = app;
  }

  /**
   * Inicializa el estado inicial de la aplicación
   */
  initializeState() {
    this.app.selectedAction = null;
    this.app.currentTabSwitcher = null;
    this.app.originalTestData = null;
    this.app.lastHighlightedField = null;
    this.app.modelJson = null;
    this.app.activeTabIdx = 0;
    this.app.regressiveScreens = null;
    this.app.currentRegressiveScreenIndex = 0;
  }

  /**
   * Selecciona una acción
   */
  selectAction(action, index, source = 'actions') {
    this.app.selectedAction = action;
    this.updateActionSelectionUI(index, source);
    
    const isRegressiveMode = this.isRegressiveMode();
    let targetContainer = null;
    
    if (isRegressiveMode) {
      targetContainer = document.getElementById("details-container");
      this.ensureRegressivePanelVisible();
    }

    this.app.actionRenderer.renderActionDetails(action, targetContainer);
  }

  /**
   * Actualiza la UI de selección de acciones
   */
  updateActionSelectionUI(index, source) {
    let containerId = source === 'row_buttons' ? 'row-buttons-container' : 'actions-container';
    const container = document.getElementById(containerId);
    if (container) {
      const items = container.querySelectorAll('.action-item');
      items.forEach((item, i) => {
        item.classList.toggle('selected', i === index);
      });
    }
  }

  /**
   * Verifica si está en modo regresivo
   */
  isRegressiveMode() {
    return document.getElementById("regressive-navigation-bar") !== null ||
           document.querySelector('.regressive-mode') !== null ||
           (this.app.regressiveScreens && this.app.regressiveScreens.length > 0) ||
           (this.app.testGeneratorRegressive && this.app.testGeneratorRegressive.savedRegressiveActions.length > 0);
  }

  /**
   * Asegura que el panel regresivo esté visible
   */
  ensureRegressivePanelVisible() {
    if (this.app.testGeneratorRegressive) {
      this.app.testGeneratorRegressive.restoreSavedActionsPanel();
    }
  }

  /**
   * Obtiene la acción seleccionada
   */
  getSelectedAction() {
    return this.app.selectedAction;
  }

  /**
   * Obtiene los datos originales del test
   */
  getOriginalTestData() {
    return this.app.originalTestData;
  }

  /**
   * Establece los datos originales del test
   */
  setOriginalTestData(data) {
    this.app.originalTestData = data;
  }

  /**
   * Obtiene el último campo resaltado
   */
  getLastHighlightedField() {
    return this.app.lastHighlightedField;
  }

  /**
   * Establece el último campo resaltado
   */
  setLastHighlightedField(field) {
    this.app.lastHighlightedField = field;
  }

  /**
   * Establece el índice de la pestaña activa
   */
  setActiveTabIdx(idx) {
    this.app.activeTabIdx = idx;
  }

  /**
   * Obtiene el índice de la pestaña activa
   */
  getActiveTabIdx() {
    return this.app.activeTabIdx;
  }

  /**
   * Establece las pantallas regresivas
   */
  setRegressiveScreens(screens) {
    this.app.regressiveScreens = screens;
  }

  /**
   * Obtiene las pantallas regresivas
   */
  getRegressiveScreens() {
    return this.app.regressiveScreens;
  }

  /**
   * Establece el índice de la pantalla regresiva actual
   */
  setCurrentRegressiveScreenIndex(index) {
    this.app.currentRegressiveScreenIndex = index;
  }

  /**
   * Obtiene el índice de la pantalla regresiva actual
   */
  getCurrentRegressiveScreenIndex() {
    return this.app.currentRegressiveScreenIndex;
  }

  /**
   * Establece el modelo JSON
   */
  setModelJson(modelJson) {
    this.app.modelJson = modelJson;
  }

  /**
   * Obtiene el modelo JSON
   */
  getModelJson() {
    return this.app.modelJson;
  }

  /**
   * Establece el switcher de pestañas actual
   */
  setCurrentTabSwitcher(switcher) {
    this.app.currentTabSwitcher = switcher;
  }

  /**
   * Obtiene el switcher de pestañas actual
   */
  getCurrentTabSwitcher() {
    return this.app.currentTabSwitcher;
  }

  /**
   * Resetea el estado de la aplicación
   */
  resetState() {
    this.initializeState();
  }

  /**
   * Obtiene el estado completo de la aplicación
   */
  getState() {
    return {
      selectedAction: this.app.selectedAction,
      currentTabSwitcher: this.app.currentTabSwitcher,
      originalTestData: this.app.originalTestData,
      lastHighlightedField: this.app.lastHighlightedField,
      modelJson: this.app.modelJson,
      activeTabIdx: this.app.activeTabIdx,
      regressiveScreens: this.app.regressiveScreens,
      currentRegressiveScreenIndex: this.app.currentRegressiveScreenIndex
    };
  }

  /**
   * Restaura el estado de la aplicación
   */
  restoreState(state) {
    if (state.selectedAction) this.app.selectedAction = state.selectedAction;
    if (state.currentTabSwitcher) this.app.currentTabSwitcher = state.currentTabSwitcher;
    if (state.originalTestData) this.app.originalTestData = state.originalTestData;
    if (state.lastHighlightedField) this.app.lastHighlightedField = state.lastHighlightedField;
    if (state.modelJson) this.app.modelJson = state.modelJson;
    if (state.activeTabIdx !== undefined) this.app.activeTabIdx = state.activeTabIdx;
    if (state.regressiveScreens) this.app.regressiveScreens = state.regressiveScreens;
    if (state.currentRegressiveScreenIndex !== undefined) this.app.currentRegressiveScreenIndex = state.currentRegressiveScreenIndex;
  }

  /**
   * Verifica si el estado es válido
   */
  isStateValid() {
    return this.app.modelJson !== null && 
           this.app.modelJson.component !== undefined;
  }

  /**
   * Obtiene estadísticas del estado actual
   */
  getStateStats() {
    return {
      hasSelectedAction: this.app.selectedAction !== null,
      hasModelJson: this.app.modelJson !== null,
      hasRegressiveScreens: this.app.regressiveScreens !== null && this.app.regressiveScreens.length > 0,
      regressiveScreensCount: this.app.regressiveScreens ? this.app.regressiveScreens.length : 0,
      currentRegressiveScreenIndex: this.app.currentRegressiveScreenIndex,
      activeTabIdx: this.app.activeTabIdx
    };
  }
} 