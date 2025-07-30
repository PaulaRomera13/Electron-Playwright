// rowButtonsRenderer.js - Renderizado de row buttons
import { ActionDescriptionProvider } from '../providers/actionDescriptionProvider.js';
import { isTabsComponent, getTabLabels } from '../components/tabUtils.js';
import { isObjectByTabsComponent, getObjectByTabsLabels } from '../components/objectByTabsUtils.js';

export class RowButtonsRenderer {
  constructor(app) {
    this.app = app;
    this.actionDescriptionProvider = new ActionDescriptionProvider();
  }

  /**
   * Renderiza la lista de row_buttons disponibles en el sidebar
   * @param {Object} modelJson - Modelo JSON
   */
  renderRowButtonsList(modelJson) {
    const container = document.getElementById("row-buttons-container");
    if (!container) return;
    container.innerHTML = "";

    // Soporte para ObjectByTabs
    if (isObjectByTabsComponent(modelJson)) {
      this.renderObjectByTabsRowButtons(modelJson, container);
      return;
    }

    // Soporte para Tabs
    if (isTabsComponent(modelJson)) {
      this.renderTabsRowButtons(modelJson, container);
      return;
    }

    // Si no es Tabs ni ObjectByTabs, lógica original
    this.renderSimpleRowButtons(modelJson, container);
  }

  /**
   * Renderiza row buttons para componentes ObjectByTabs
   * @param {Object} modelJson - Modelo JSON
   * @param {HTMLElement} container - Contenedor
   */
  renderObjectByTabsRowButtons(modelJson, container) {
    const tabLabels = getObjectByTabsLabels(modelJson, 'es');
    const tabsBar = this.createTabsBar(tabLabels, (tabIdx, tabButton) => {
      this.app.setActiveTabIdx(tabIdx);
      this.renderTabRowButtons(tabIdx, modelJson);
    });
    
    const rowButtonsList = document.createElement("div");
    rowButtonsList.className = "tab-actions-list";
    container.appendChild(tabsBar);
    container.appendChild(rowButtonsList);
    
    // Guardar referencia a la lista de row buttons
    this.rowButtonsList = rowButtonsList;
    
    // Renderizar row buttons de la primera tab por defecto
    this.renderTabRowButtons(0, modelJson);
  }

  /**
   * Renderiza row buttons para componentes Tabs
   * @param {Object} modelJson - Modelo JSON
   * @param {HTMLElement} container - Contenedor
   */
  renderTabsRowButtons(modelJson, container) {
    const tabLabels = getTabLabels(modelJson, 'es');
    const tabsBar = this.createTabsBar(tabLabels, (tabIdx, tabButton) => {
      this.app.setActiveTabIdx(tabIdx);
      this.renderTabRowButtons(tabIdx, modelJson);
    });
    
    const rowButtonsList = document.createElement("div");
    rowButtonsList.className = "tab-actions-list";
    container.appendChild(tabsBar);
    container.appendChild(rowButtonsList);
    
    // Guardar referencia a la lista de row buttons
    this.rowButtonsList = rowButtonsList;
    
    // Renderizar row buttons de la primera tab por defecto
    this.renderTabRowButtons(0, modelJson);
  }

  /**
   * Renderiza row buttons simples (sin pestañas)
   * @param {Object} modelJson - Modelo JSON
   * @param {HTMLElement} container - Contenedor
   */
  renderSimpleRowButtons(modelJson, container) {
    const rowButtons = modelJson.view_definition[1]?.row_buttons || [];
    if (!rowButtons.length) {
      const noRowButtons = document.createElement("div");
      noRowButtons.className = "no-actions";
      noRowButtons.textContent = "No hay row_buttons en este componente.";
      container.appendChild(noRowButtons);
      return;
    }
    
    rowButtons.forEach((action, index) => {
      const actionItem = this.createRowButtonItem(action, index, 'row_buttons');
      container.appendChild(actionItem);
    });
  }

  /**
   * Renderiza los row buttons de una tab específica
   * @param {number} tabIdx - Índice de la pestaña
   * @param {Object} modelJson - Modelo JSON
   */
  renderTabRowButtons(tabIdx, modelJson) {
    if (!this.rowButtonsList) return;
    this.rowButtonsList.innerHTML = "";
    
    let tabRowButtons = [];
    
    if (isObjectByTabsComponent(modelJson)) {
      const tab = modelJson.tabs[tabIdx];
      tabRowButtons = this.findAllRowButtons(tab.view_definition);
    } else if (isTabsComponent(modelJson)) {
      const tab = modelJson.tabs[tabIdx];
      tabRowButtons = (tab.view_definition && tab.view_definition[1] && tab.view_definition[1].row_buttons) || [];
    }
    
    if (tabRowButtons.length === 0) {
      const noRowButtons = document.createElement("div");
      noRowButtons.className = "no-actions";
      noRowButtons.textContent = "No hay row_buttons en esta pestaña.";
      this.rowButtonsList.appendChild(noRowButtons);
    } else {
      tabRowButtons.forEach((action, index) => {
        const actionItem = this.createRowButtonItem(action, index, 'row_buttons');
        this.rowButtonsList.appendChild(actionItem);
      });
    }
  }

  /**
   * Crea un elemento de row button
   * @param {Object} action - Objeto de acción
   * @param {number} index - Índice de la acción
   * @param {string} source - Fuente de la acción
   * @returns {HTMLElement} Elemento de row button
   */
  createRowButtonItem(action, index, source = 'row_buttons') {
    const actionItem = document.createElement("div");
    actionItem.className = "action-item";
    actionItem.onclick = () => this.app.selectAction(action, index, source);
    
    const actionName = document.createElement("div");
    actionName.className = "action-name";
    actionName.textContent = action.actionName;
    
    const actionSummary = document.createElement("div");
    actionSummary.className = "action-summary";
    const buttonTitle = action.button?.title?.label_es || action.button?.title?.label_en || "No title";
    const actionDescription = this.actionDescriptionProvider.getActionDescription(action);
    actionSummary.textContent = `${buttonTitle} • ${actionDescription}`;
    
    actionItem.appendChild(actionName);
    actionItem.appendChild(actionSummary);
    
    return actionItem;
  }

  /**
   * Función recursiva para buscar row_buttons en todos los niveles
   * @param {Object} obj - Objeto a buscar
   * @returns {Array} Array de row buttons encontrados
   */
  findAllRowButtons(obj) {
    let buttons = [];
    if (Array.isArray(obj)) {
      obj.forEach(item => { buttons = buttons.concat(this.findAllRowButtons(item)); });
    } else if (obj && typeof obj === 'object') {
      if (Array.isArray(obj.row_buttons)) buttons = buttons.concat(obj.row_buttons);
      Object.values(obj).forEach(val => { buttons = buttons.concat(this.findAllRowButtons(val)); });
    }
    return buttons;
  }

  /**
   * Crea una barra de pestañas
   * @param {Array} tabLabels - Etiquetas de las pestañas
   * @param {Function} onTabClick - Función de clic en pestaña
   * @returns {HTMLElement} Contenedor de pestañas
   */
  createTabsBar(tabLabels, onTabClick) {
    const tabsContainer = document.createElement("div");
    tabsContainer.className = "tabs-bar-container";

    const tabsBar = document.createElement("div");
    tabsBar.className = "tabs-scroll-container";

    tabLabels.forEach((label, tabIdx) => {
      const tabButton = document.createElement("button");
      tabButton.className = "tab-action-btn";
      tabButton.textContent = label || `Tab ${tabIdx+1}`;
      if (tabIdx === 0) tabButton.classList.add("active");
      tabButton.onclick = () => {
        tabsBar.querySelectorAll(".tab-action-btn").forEach(btn => btn.classList.remove("active"));
        tabButton.classList.add("active");
        onTabClick(tabIdx, tabButton);
      };
      tabsBar.appendChild(tabButton);
    });

    tabsContainer.appendChild(tabsBar);
    return tabsContainer;
  }


} 