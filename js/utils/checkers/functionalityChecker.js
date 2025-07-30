// functionalityChecker.js - Verificación de funcionalidades disponibles
export class FunctionalityChecker {
  constructor(app) {
    this.app = app;
  }

  /**
   * Verifica si la funcionalidad de descarga está habilitada
   * @param {Object} modelJson - Modelo JSON
   */
  checkDownloadable(modelJson) {
    const exportButton = document.getElementById("exportButton");
    if (!exportButton) return;

    const tableConfig = this.getTableConfig(modelJson);
    const isDownloadable = this.isDownloadableEnabled(tableConfig);

    if (isDownloadable) {
      this.enableExportButton(exportButton);
    } else {
      this.disableExportButton(exportButton);
    }
  }

  /**
   * Obtiene la configuración de la tabla
   * @param {Object} modelJson - Modelo JSON
   * @returns {Object|null} Configuración de la tabla
   */
  getTableConfig(modelJson) {
    return Array.isArray(modelJson.view_definition) && modelJson.view_definition.length > 1
      ? modelJson.view_definition[1]
      : null;
  }

  /**
   * Verifica si la funcionalidad de descarga está habilitada
   * @param {Object} tableConfig - Configuración de la tabla
   * @returns {boolean} True si está habilitada
   */
  isDownloadableEnabled(tableConfig) {
    return tableConfig && 
           tableConfig.downloadable && 
           tableConfig.downloadable.enable;
  }

  /**
   * Habilita el botón de exportación
   * @param {HTMLElement} exportButton - Botón de exportación
   */
  enableExportButton(exportButton) {
    exportButton.style.display = "block";
    const newButton = exportButton.cloneNode(true);
    exportButton.parentNode.replaceChild(newButton, exportButton);
    newButton.addEventListener("click", () => {
      this.app.testGeneratorExport.showExportTestGenerator();
    });
  }

  /**
   * Deshabilita el botón de exportación
   * @param {HTMLElement} exportButton - Botón de exportación
   */
  disableExportButton(exportButton) {
    exportButton.style.display = "none";
  }

  /**
   * Verifica si una funcionalidad específica está disponible
   * @param {string} functionality - Nombre de la funcionalidad
   * @param {Object} modelJson - Modelo JSON
   * @returns {boolean} True si está disponible
   */
  isFunctionalityAvailable(functionality, modelJson) {
    const checkers = {
      downloadable: () => this.isDownloadableEnabled(this.getTableConfig(modelJson)),
      tabs: () => modelJson.component === 'Tabs',
      objectByTabs: () => modelJson.component === 'ObjectByTabs',
      actions: () => this.hasActions(modelJson),
      rowButtons: () => this.hasRowButtons(modelJson)
    };

    const checker = checkers[functionality];
    return checker ? checker() : false;
  }

  /**
   * Verifica si el modelo tiene acciones
   * @param {Object} modelJson - Modelo JSON
   * @returns {boolean} True si tiene acciones
   */
  hasActions(modelJson) {
    return modelJson.view_definition && 
           modelJson.view_definition[1] && 
           Array.isArray(modelJson.view_definition[1].actions) &&
           modelJson.view_definition[1].actions.length > 0;
  }

  /**
   * Verifica si el modelo tiene row buttons
   * @param {Object} modelJson - Modelo JSON
   * @returns {boolean} True si tiene row buttons
   */
  hasRowButtons(modelJson) {
    return modelJson.view_definition && 
           modelJson.view_definition[1] && 
           Array.isArray(modelJson.view_definition[1].row_buttons) &&
           modelJson.view_definition[1].row_buttons.length > 0;
  }

  /**
   * Obtiene todas las funcionalidades disponibles
   * @param {Object} modelJson - Modelo JSON
   * @returns {Object} Objeto con funcionalidades disponibles
   */
  getAvailableFunctionalities(modelJson) {
    return {
      downloadable: this.isFunctionalityAvailable('downloadable', modelJson),
      tabs: this.isFunctionalityAvailable('tabs', modelJson),
      objectByTabs: this.isFunctionalityAvailable('objectByTabs', modelJson),
      actions: this.isFunctionalityAvailable('actions', modelJson),
      rowButtons: this.isFunctionalityAvailable('rowButtons', modelJson)
    };
  }
} 