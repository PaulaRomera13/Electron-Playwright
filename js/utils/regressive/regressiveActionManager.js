// regressiveActionManager.js - Gestión de acciones regresivas
export class RegressiveActionManager {
  constructor(app) {
    this.app = app;
  }

  /**
   * Actualiza el panel dinámico de acciones guardadas
   */
  updateDynamicSavedActions(targetContainer) {
    let dynamicPanel = targetContainer.querySelector('.dynamic-saved-actions');

    if (!dynamicPanel) {
      dynamicPanel = document.createElement("div");
      dynamicPanel.className = "dynamic-saved-actions";
      dynamicPanel.style.cssText = `
        margin-top: 15px;
        padding: 10px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 6px;
        max-height: 200px;
        overflow-y: auto;
      `;
      const saveContainer = targetContainer.querySelector('.regressive-save-container');
      if (saveContainer) {
        saveContainer.appendChild(dynamicPanel);
      }
    }

    dynamicPanel.innerHTML = "";

    const allActions = this.app.testGeneratorRegressive.savedRegressiveActions || [];

    if (allActions.length === 0) {
      dynamicPanel.innerHTML = '<div style="color: #666; font-style: italic;">Sin acciones guardadas</div>';
      return;
    }

    const panelTitle = document.createElement("div");
    panelTitle.textContent = `Acciones guardadas (${allActions.length}):`;
    panelTitle.style.cssText = "font-weight: bold; margin-bottom: 8px; color: #007bff;";
    dynamicPanel.appendChild(panelTitle);

    allActions.forEach(action => {
      const actionItem = this.createActionItem(action);
      dynamicPanel.appendChild(actionItem);
    });
  }

  /**
   * Crea un elemento de acción para el panel dinámico
   */
  createActionItem(action) {
    const actionItem = document.createElement("div");
    actionItem.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 8px;
      margin: 2px 0;
      background: white;
      border-radius: 4px;
      font-size: 12px;
      border-left: 3px solid #007bff;
    `;

    actionItem.innerHTML = `
      <span style="color: #333; flex: 1; overflow: hidden; text-overflow: ellipsis;">
        ${action.screenName} · ${action.actionName}
      </span>
      <button class="remove-dynamic-action" data-action="${action.actionName}" data-screen="${action.screenIndex}"
              style="background: none; border: none; color: #dc3545; cursor: pointer; font-size: 14px; padding: 0 4px;">
        &times;
      </button>
    `;

    const removeBtn = actionItem.querySelector('.remove-dynamic-action');
    removeBtn.onclick = () => this.removeAction(action);

    return actionItem;
  }

  /**
   * Remueve una acción del panel dinámico
   */
  removeAction(action) {
    this.app.testGeneratorRegressive.savedRegressiveActions = this.app.testGeneratorRegressive.savedRegressiveActions.filter(
      saved => !(saved.actionName === action.actionName && saved.screenIndex === action.screenIndex)
    );
    
    // Actualizar panel dinámico
    const targetContainer = document.querySelector('.regressive-save-container')?.parentElement;
    if (targetContainer) {
      this.updateDynamicSavedActions(targetContainer);
    }
    
    // Actualizar panel principal
    this.app.testGeneratorRegressive.updateSavedActionsList();

    // Actualizar contador
    this.updateSavedCount();
  }

  /**
   * Guarda una acción regresiva
   */
  saveRegressiveAction(action, idSuffix, targetContainer) {
    const previewContainer = targetContainer.querySelector('.preview-json');
    if (!previewContainer) {
      alert('No se encontró la vista previa del JSON');
      return;
    }

    let jsonData = this.parseJsonData(previewContainer);
    if (!jsonData) return;

    const regressiveAction = this.createRegressiveAction(action, jsonData);
    this.addOrUpdateRegressiveAction(regressiveAction);
    
    // Actualizar UI
    this.updateDynamicSavedActions(targetContainer);
    this.app.testGeneratorRegressive.updateSavedActionsList();
    this.updateSavedCount();
    this.showSaveConfirmation(targetContainer);
  }

  /**
   * Parsea los datos JSON del preview
   */
  parseJsonData(previewContainer) {
    let jsonData;
    try {
      jsonData = JSON.parse(previewContainer.textContent);
      if (jsonData && typeof jsonData === 'object' && jsonData.testDataGame) {
        jsonData = jsonData.testDataGame;
      }
    } catch (e) {
      alert('Error al parsear el JSON: ' + e.message);
      return null;
    }
    return jsonData;
  }

  /**
   * Crea una acción regresiva
   */
  createRegressiveAction(action, jsonData) {
    return {
      actionName: action.actionName,
      screenIndex: this.app.currentRegressiveScreenIndex || 0,
      screenName: this.app.regressiveScreens ? 
        this.app.regressiveScreens[this.app.currentRegressiveScreenIndex]?.screenName : 
        `Pantalla ${this.app.currentRegressiveScreenIndex + 1}`,
      jsonData,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Agrega o actualiza una acción regresiva
   */
  addOrUpdateRegressiveAction(regressiveAction) {
    const existingIndex = this.app.testGeneratorRegressive.savedRegressiveActions.findIndex(
      saved => saved.actionName === regressiveAction.actionName && 
               saved.screenIndex === regressiveAction.screenIndex
    );

    if (existingIndex !== -1) {
      this.app.testGeneratorRegressive.savedRegressiveActions[existingIndex] = regressiveAction;
    } else {
      this.app.testGeneratorRegressive.savedRegressiveActions.push(regressiveAction);
    }
  }

  /**
   * Actualiza el contador de acciones guardadas
   */
  updateSavedCount() {
    const savedCount = document.querySelector('.regressive-saved-count');
    if (savedCount) {
      savedCount.textContent = `Acciones guardadas: ${this.app.testGeneratorRegressive.savedRegressiveActions.length}`;
    }
  }

  /**
   * Muestra la confirmación de guardado
   */
  showSaveConfirmation(targetContainer) {
    const saveButton = targetContainer.querySelector('.regressive-save-btn');
    if (saveButton) {
      const originalText = saveButton.innerHTML;
      const originalBackground = saveButton.style.background;
      
      saveButton.innerHTML = '<i class="fas fa-check"></i> ¡Guardado!';
      saveButton.style.background = '#28a745';
      
      setTimeout(() => {
        saveButton.innerHTML = originalText;
        saveButton.style.background = originalBackground;
      }, 2000);
    }
  }

  /**
   * Obtiene todas las acciones regresivas guardadas
   */
  getSavedRegressiveActions() {
    return this.app.testGeneratorRegressive.savedRegressiveActions || [];
  }

  /**
   * Limpia todas las acciones regresivas guardadas
   */
  clearSavedRegressiveActions() {
    this.app.testGeneratorRegressive.savedRegressiveActions = [];
    this.app.testGeneratorRegressive.updateSavedActionsList();
  }

  /**
   * Obtiene estadísticas de las acciones regresivas
   */
  getRegressiveActionStats() {
    const actions = this.getSavedRegressiveActions();
    const stats = {
      totalActions: actions.length,
      actionsByScreen: {},
      actionsByType: {}
    };

    actions.forEach(action => {
      // Agrupar por pantalla
      if (!stats.actionsByScreen[action.screenName]) {
        stats.actionsByScreen[action.screenName] = [];
      }
      stats.actionsByScreen[action.screenName].push(action);

      // Agrupar por tipo de acción
      const actionType = this.getActionType(action.actionName);
      if (!stats.actionsByType[actionType]) {
        stats.actionsByType[actionType] = [];
      }
      stats.actionsByType[actionType].push(action);
    });

    return stats;
  }

  /**
   * Determina el tipo de acción basado en el nombre
   */
  getActionType(actionName) {
    if (actionName.includes("AUDIT")) return "audit";
    if (actionName.includes("ATTACHMENT")) return "attachment";
    if (actionName.includes("EXPORT")) return "export";
    if (actionName.includes("DIALOG")) return "dialog";
    return "standard";
  }

  /**
   * Exporta las acciones regresivas a JSON
   */
  exportRegressiveActions() {
    const actions = this.getSavedRegressiveActions();
    return {
      testDataGame: actions.map(action => action.jsonData),
      metadata: {
        totalActions: actions.length,
        exportDate: new Date().toISOString(),
        screens: [...new Set(actions.map(a => a.screenName))]
      }
    };
  }

  /**
   * Importa acciones regresivas desde JSON
   */
  importRegressiveActions(jsonData) {
    if (!jsonData.testDataGame || !Array.isArray(jsonData.testDataGame)) {
      throw new Error('Formato de datos inválido');
    }

    // Limpiar acciones existentes
    this.clearSavedRegressiveActions();

    // Importar nuevas acciones
    jsonData.testDataGame.forEach((actionData, index) => {
      const regressiveAction = {
        actionName: `Imported_Action_${index + 1}`,
        screenIndex: 0,
        screenName: `Pantalla Importada`,
        jsonData: actionData,
        timestamp: new Date().toISOString()
      };
      
      this.app.testGeneratorRegressive.savedRegressiveActions.push(regressiveAction);
    });

    // Actualizar UI
    this.app.testGeneratorRegressive.updateSavedActionsList();
  }
} 