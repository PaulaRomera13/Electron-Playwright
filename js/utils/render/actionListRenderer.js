// actionListRenderer.js - Renderizado de listas de acciones
import { ActionDescriptionProvider } from '../providers/actionDescriptionProvider.js';
import { isTabsComponent, getTabLabels } from '../components/tabUtils.js';
import { isObjectByTabsComponent, getObjectByTabsLabels } from '../components/objectByTabsUtils.js';

export class ActionListRenderer {
  constructor(app) {
    this.app = app;
    this.actionDescriptionProvider = new ActionDescriptionProvider();
  }

  /**
   * Renderiza la lista de acciones disponibles en el sidebar
   * @param {Object} modelJson - Modelo JSON
   */
  renderActionsList(modelJson) {
    const container = document.getElementById("actions-container");
    container.innerHTML = "";

    // Si es ObjectByTabs, mostrar botones dinámicos por tab
    if (isObjectByTabsComponent(modelJson)) {
      this.renderObjectByTabsActions(modelJson, container);
      return;
    }

    // Si es Tabs, mostrar botones dinámicos por tab
    if (isTabsComponent(modelJson)) {
      this.renderTabsActions(modelJson, container);
      return;
    }

    // Si no es Tabs, lógica original
    this.renderSimpleActions(modelJson, container);
  }

  /**
   * Renderiza acciones para componentes ObjectByTabs
   * @param {Object} modelJson - Modelo JSON
   * @param {HTMLElement} container - Contenedor
   */
  renderObjectByTabsActions(modelJson, container) {
    const tabLabels = getObjectByTabsLabels(modelJson, 'es');
    const tabsBar = this.createTabsBar(tabLabels, (tabIdx, tabButton) => {
      this.app.setActiveTabIdx(tabIdx);
      this.renderTabActions(tabIdx, modelJson);
    });
    
    const actionsList = document.createElement("div");
    actionsList.className = "tab-actions-list";
    container.appendChild(tabsBar);
    container.appendChild(actionsList);
    
    // Guardar referencia a la lista de acciones
    this.actionsList = actionsList;
    
    // Renderizar acciones de la primera tab por defecto
    this.renderTabActions(0, modelJson);
  }

  /**
   * Renderiza acciones para componentes Tabs
   * @param {Object} modelJson - Modelo JSON
   * @param {HTMLElement} container - Contenedor
   */
  renderTabsActions(modelJson, container) {
    const tabLabels = getTabLabels(modelJson, 'es');
    const tabsBar = this.createTabsBar(tabLabels, (tabIdx, tabButton) => {
      this.app.setActiveTabIdx(tabIdx);
      this.renderTabActions(tabIdx, modelJson);
    });
    
    const actionsList = document.createElement("div");
    actionsList.className = "tab-actions-list";
    container.appendChild(tabsBar);
    container.appendChild(actionsList);
    
    // Guardar referencia a la lista de acciones
    this.actionsList = actionsList;
    
    // Renderizar acciones de la primera tab por defecto
    this.renderTabActions(0, modelJson);
  }

  /**
   * Renderiza acciones simples (sin pestañas)
   * @param {Object} modelJson - Modelo JSON
   * @param {HTMLElement} container - Contenedor
   */
  renderSimpleActions(modelJson, container) {
    const actions = modelJson.view_definition[1].actions;
    actions.forEach((action, index) => {
      const actionItem = this.createActionItem(action, index, 'actions');
      container.appendChild(actionItem);
    });
  }

  /**
   * Renderiza las acciones de una tab específica
   * @param {number} tabIdx - Índice de la pestaña
   * @param {Object} modelJson - Modelo JSON
   */
  renderTabActions(tabIdx, modelJson) {
    if (!this.actionsList) return;
    this.actionsList.innerHTML = "";
    
    let tabActions = [];
    
    if (isObjectByTabsComponent(modelJson)) {
      const tab = modelJson.tabs[tabIdx];
      tabActions = this.findAllActions(tab.view_definition);
    } else if (isTabsComponent(modelJson)) {
      const tab = modelJson.tabs[tabIdx];
      tabActions = (tab.view_definition && tab.view_definition[1] && tab.view_definition[1].actions) || [];
    }
    
    if (tabActions.length === 0) {
      const noActions = document.createElement("div");
      noActions.className = "no-actions";
      noActions.textContent = "No hay acciones en esta pestaña.";
      this.actionsList.appendChild(noActions);
    } else {
      tabActions.forEach((action, index) => {
        const actionItem = this.createActionItem(action, index);
        this.actionsList.appendChild(actionItem);
      });
    }
  }

  /**
   * Crea un elemento de acción
   * @param {Object} action - Objeto de acción
   * @param {number} index - Índice de la acción
   * @param {string} source - Fuente de la acción
   * @returns {HTMLElement} Elemento de acción
   */
  createActionItem(action, index, source = 'actions') {
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
   * Función recursiva para buscar acciones en todos los niveles
   * @param {Object} obj - Objeto a buscar
   * @returns {Array} Array de acciones encontradas
   */
  findAllActions(obj) {
    let actions = [];
    if (Array.isArray(obj)) {
      obj.forEach(item => { actions = actions.concat(this.findAllActions(item)); });
    } else if (obj && typeof obj === 'object') {
      if (Array.isArray(obj.actions)) actions = actions.concat(obj.actions);
      Object.values(obj).forEach(val => { actions = actions.concat(this.findAllActions(val)); });
    }
    return actions;
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