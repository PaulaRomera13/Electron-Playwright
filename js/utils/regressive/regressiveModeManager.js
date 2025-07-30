// regressiveModeManager.js - Gestión del modo regresivo
export class RegressiveModeManager {
  constructor(app) {
    this.app = app;
  }

  /**
   * Preserva la barra de navegación regresiva
   * @param {HTMLElement} container - Contenedor
   */
  preserveRegressiveNavigation(container) {
    this.regressiveNavBar = document.getElementById("regressive-navigation-bar");
    this.regressiveNavBarParent = this.regressiveNavBar ? this.regressiveNavBar.parentNode : null;
  }

  /**
   * Restaura la barra de navegación regresiva
   * @param {HTMLElement} container - Contenedor
   * @param {HTMLElement} targetContainer - Contenedor objetivo
   */
  restoreRegressiveNavigation(container, targetContainer) {
    if (this.regressiveNavBar && this.regressiveNavBarParent === container) {
      container.appendChild(this.regressiveNavBar);
    }
    
    // Asegurar que el panel de acciones guardadas permanezca visible
    if (targetContainer && this.app.testGeneratorRegressive) {
      setTimeout(() => {
        this.app.testGeneratorRegressive.restoreSavedActionsPanel();
      }, 0);
    }
  }

  /**
   * Verifica si está en modo regresivo
   * @param {HTMLElement} targetContainer - Contenedor objetivo
   * @returns {boolean} True si está en modo regresivo
   */
  isRegressiveMode(targetContainer) {
    return targetContainer ||
           document.getElementById("regressive-navigation-bar") ||
           document.querySelector('.regressive-mode');
  }

  /**
   * Maneja el modo regresivo de una sola pantalla
   */
  handleSingleRegressiveMode() {
    const isSingleRegressiveMode =
      this.app.regressiveScreens &&
      this.app.regressiveScreens.length === 1 &&
      !document.getElementById("regressive-navigation-bar");

    if (isSingleRegressiveMode) {
      this.app.testGeneratorRegressive.addSingleRegressiveGenerateBtn();
      this.app.testGeneratorRegressive.createSavedActionsPanel();
    }
  }

  /**
   * Agrega el contenedor de guardado regresivo
   * @param {HTMLElement} testGenerator - Generador de test
   * @param {Object} action - Objeto de acción
   * @param {string} idSuffix - Sufijo de ID
   * @param {HTMLElement} targetContainer - Contenedor objetivo
   */
  addRegressiveSaveContainer(testGenerator, action, idSuffix, targetContainer) {
    const regressiveSaveContainer = document.createElement("div");
    regressiveSaveContainer.className = "regressive-save-container";
    regressiveSaveContainer.style.cssText = `
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    `;

    const saveButton = document.createElement("button");
    saveButton.className = "regressive-save-btn";
    saveButton.innerHTML = '<i class="fas fa-save"></i> Guardar Acción Regresiva';
    saveButton.style.cssText = `
      padding: 10px 20px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    `;
    saveButton.onclick = () => {
      const container = targetContainer || document.getElementById("details-container");
      this.app.saveRegressiveAction(action, idSuffix, container);
    };

    const savedCount = document.createElement("div");
    savedCount.className = "regressive-saved-count";
    savedCount.style.cssText = `margin-top: 10px; font-size: 12px; color: #666;`;
    savedCount.textContent = `Acciones guardadas: ${this.app.testGeneratorRegressive.savedRegressiveActions.length}`;

    regressiveSaveContainer.appendChild(saveButton);
    regressiveSaveContainer.appendChild(savedCount);
    testGenerator.appendChild(regressiveSaveContainer);
  }
} 