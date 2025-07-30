// Gestor del sidebar y configuración principal

import { isTabsComponent, getTabLabels } from './utils/components/tabUtils.js'
import { isObjectByTabsComponent, getObjectByTabsLabels } from './utils/components/objectByTabsUtils.js';

// Utilidad para crear barra de tabs
function createTabsBar(tabLabels, onTabClick) {
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

/**
 * Clase que gestiona toda la funcionalidad del sidebar
 */
export class SidebarManager {
  /**
   * Constructor del gestor del sidebar
   * @param {Object} app - Referencia a la aplicación principal
   */
  constructor(app) {
    this.app = app // Guardar referencia a la aplicación principal
  }

  /**
   * Renderiza la configuración principal en el sidebar
   * Muestra información del componente y detalles de view query
   */
  renderMainConfig(modelJson) {
    document.getElementById("config-component").textContent = modelJson.component
    document.getElementById("config-hideLeftPane").textContent = modelJson.hideLeftPane ? "Yes" : "No"
    document.getElementById("config-hasOwnComponent").textContent = modelJson.hasOwnComponent ? "Yes" : "No"

    const viewQueryGrid = document.getElementById("view-query-grid")
    viewQueryGrid.innerHTML = "";

    if (isTabsComponent(modelJson)) {
      const tabLabels = getTabLabels(modelJson, 'es')
      modelJson.tabs.forEach((tab, idx) => {
        const tabTitle = document.createElement("div")
        tabTitle.className = "tab-viewquery-title"
        tabTitle.textContent = `Tab: ${tabLabels[idx] || 'Tab ' + (idx+1)}`
        viewQueryGrid.appendChild(tabTitle)
        if (tab.viewQuery) {
          for (const [key, value] of Object.entries(tab.viewQuery)) {
            const nameDiv = document.createElement("div")
            nameDiv.className = "property-name"
            nameDiv.textContent = key
            const valueDiv = document.createElement("div")
            valueDiv.className = "property-value"
            valueDiv.textContent = typeof value === "object" ? JSON.stringify(value) : value
            viewQueryGrid.appendChild(nameDiv)
            viewQueryGrid.appendChild(valueDiv)
          }
        } else {
          const noViewQuery = document.createElement("div")
          noViewQuery.textContent = "No hay viewQuery en esta tab."
          viewQueryGrid.appendChild(noViewQuery)
        }
      })
    } else {
      let viewQuery = modelJson.viewQuery;
      if (viewQuery) {
        for (const [key, value] of Object.entries(viewQuery)) {
          const nameDiv = document.createElement("div")
          nameDiv.className = "property-name"
          nameDiv.textContent = key
          const valueDiv = document.createElement("div")
          valueDiv.className = "property-value"
          valueDiv.textContent = typeof value === "object" ? JSON.stringify(value) : value
          viewQueryGrid.appendChild(nameDiv)
          viewQueryGrid.appendChild(valueDiv)
        }
      } else {
        viewQueryGrid.textContent = "No hay viewQuery en este componente."
      }
    }
  }

  /**
   * Obtiene una descripción específica para el tipo de acción
   * @param {Object} action - Objeto de acción
   * @returns {string} Descripción específica de la acción
   */
  getActionDescription(action) {
    const actionName = action.actionName

    // Detectar patrones específicos primero
    if (actionName.includes("AUDIT_FOR_GIVEN_")) {
      return "Audit"
    }

    // Detectar acciones de remover adjuntos
    if (actionName.includes("REMOVE_ATTACHMENT") || actionName.includes("REMOVE_ATTACHMENTS")) {
      return "Remove Attachment"
    }

    // Si la acción contiene ADDAWSATTACHMENT, mostrar AWS
    if (actionName.includes("ADDAWSATTACHMENT")) {
      return "AWS"
    }

    // Mapeo de descripciones específicas por tipo de acción
    const actionDescriptions = {
      OPEN_ATTACHMENTS: "Open Attachment",
      OPEN_ATTACHMENT: "Open Attachment",
    }

    // Si existe una descripción específica, usarla
    if (actionDescriptions[actionName]) {
      return actionDescriptions[actionName]
    }

    // NUEVO: Si es reactivateObjectDialog
    if (action.requiresDialog && action.dialogInfo && action.dialogInfo.name === 'reactivateObjectDialog') {
      return 'Reactivar diálogo de objetos';
    }

    if (action.requiresDialog) {
      if (action.dialogInfo && action.dialogInfo.gridContent === true && Array.isArray(action.dialogInfo.columns) && action.dialogInfo.columns.length > 0) {
        return "Diálogo con selección"
      }
      return "Con diálogo"
    }
    return "Sin diálogo"
  }

  /**
   * Renderiza la lista de acciones disponibles en el sidebar
   * Si es Tabs, muestra un botón por tab (label_es) y al hacer clic muestra las acciones de esa tab
   * Si no, muestra las acciones como antes
   */
  renderActionsList(modelJson) {
    const container = document.getElementById("actions-container")
    container.innerHTML = ""

    // Si es ObjectByTabs, mostrar botones dinámicos por tab
    if (isObjectByTabsComponent(modelJson)) {
      const tabLabels = getObjectByTabsLabels(modelJson, 'es')
      const tabsBar = createTabsBar(tabLabels, (tabIdx, tabButton) => {
        this.app.setActiveTabIdx(tabIdx)
        this.renderTabActions(tabIdx, modelJson)
      });
      
      const actionsList = document.createElement("div")
      actionsList.className = "tab-actions-list"
      container.appendChild(tabsBar)
      container.appendChild(actionsList)
      
      // Guardar referencia a la lista de acciones
      this.actionsList = actionsList
      
      // Renderizar acciones de la primera tab por defecto
      this.renderTabActions(0, modelJson)
      return
    }

    // Si es Tabs, mostrar botones dinámicos por tab
    if (isTabsComponent(modelJson)) {
      const tabLabels = getTabLabels(modelJson, 'es')
      const tabsBar = createTabsBar(tabLabels, (tabIdx, tabButton) => {
        this.app.setActiveTabIdx(tabIdx)
        this.renderTabActions(tabIdx, modelJson)
      });
      
      const actionsList = document.createElement("div")
      actionsList.className = "tab-actions-list"
      container.appendChild(tabsBar)
      container.appendChild(actionsList)
      
      // Guardar referencia a la lista de acciones
      this.actionsList = actionsList
      
      // Renderizar acciones de la primera tab por defecto
      this.renderTabActions(0, modelJson)
      return
    }

    // Si no es Tabs, lógica original
    const actions = modelJson.view_definition[1].actions
    actions.forEach((action, index) => {
      const actionItem = document.createElement("div")
      actionItem.className = "action-item"
      actionItem.onclick = () => this.app.selectAction(action, index, 'actions')
      const actionName = document.createElement("div")
      actionName.className = "action-name"
      actionName.textContent = action.actionName
      const actionSummary = document.createElement("div")
      actionSummary.className = "action-summary"
      const buttonTitle = action.button?.title?.label_es || action.button?.title?.label_en || "No title"
      const actionDescription = this.getActionDescription(action)
      actionSummary.textContent = `${buttonTitle} • ${actionDescription}`
      actionItem.appendChild(actionName)
      actionItem.appendChild(actionSummary)
      container.appendChild(actionItem)
    })
  }

  /**
   * Renderiza las acciones de una tab específica
   */
  renderTabActions(tabIdx, modelJson) {
    if (!this.actionsList) return;
    this.actionsList.innerHTML = ""
    
    let tabActions = [];
    
    if (isObjectByTabsComponent(modelJson)) {
      const tab = modelJson.tabs[tabIdx]
      tabActions = this.findAllActions(tab.view_definition)
    } 
    else if (isTabsComponent(modelJson)) {
      const tab = modelJson.tabs[tabIdx]
      tabActions = (tab.view_definition && tab.view_definition[1] && tab.view_definition[1].actions) || []
    }
    
    if (tabActions.length === 0) {
      const noActions = document.createElement("div")
      noActions.className = "no-actions"
      noActions.textContent = "No hay acciones en esta pestaña."
      this.actionsList.appendChild(noActions)
    } else {
      tabActions.forEach((action, index) => {
        const actionItem = document.createElement("div")
        actionItem.className = "action-item"
        actionItem.onclick = () => this.app.selectAction(action, index)
        const actionName = document.createElement("div")
        actionName.className = "action-name"
        actionName.textContent = action.actionName
        const actionSummary = document.createElement("div")
        actionSummary.className = "action-summary"
        const buttonTitle = action.button?.title?.label_es || action.button?.title?.label_en || "No title"
        const actionDescription = this.getActionDescription(action)
        actionSummary.textContent = `${buttonTitle} • ${actionDescription}`
        actionItem.appendChild(actionName)
        actionItem.appendChild(actionSummary)
        this.actionsList.appendChild(actionItem)
      })
    }
  }

  /**
   * Función recursiva para buscar acciones en todos los niveles
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
   * Renderiza la lista de row_buttons disponibles en el sidebar
   */
  renderRowButtonsList(modelJson) {
    const container = document.getElementById("row-buttons-container")
    if (!container) return;
    container.innerHTML = ""

    // Soporte para ObjectByTabs
    if (isObjectByTabsComponent(modelJson)) {
      const tabLabels = getObjectByTabsLabels(modelJson, 'es')
      const tabsBar = createTabsBar(tabLabels, (tabIdx, tabButton) => {
        this.app.setActiveTabIdx(tabIdx)
        this.renderTabRowButtons(tabIdx, modelJson)
      });
      
      const rowButtonsList = document.createElement("div")
      rowButtonsList.className = "tab-actions-list"
      container.appendChild(tabsBar)
      container.appendChild(rowButtonsList)
      
      // Guardar referencia a la lista de row buttons
      this.rowButtonsList = rowButtonsList
      
      // Renderizar row buttons de la primera tab por defecto
      this.renderTabRowButtons(0, modelJson)
      return
    }

    // Soporte para Tabs
    if (isTabsComponent(modelJson)) {
      const tabLabels = getTabLabels(modelJson, 'es')
      const tabsBar = createTabsBar(tabLabels, (tabIdx, tabButton) => {
        this.app.setActiveTabIdx(tabIdx)
        this.renderTabRowButtons(tabIdx, modelJson)
      });
      
      const rowButtonsList = document.createElement("div")
      rowButtonsList.className = "tab-actions-list"
      container.appendChild(tabsBar)
      container.appendChild(rowButtonsList)
      
      // Guardar referencia a la lista de row buttons
      this.rowButtonsList = rowButtonsList
      
      // Renderizar row buttons de la primera tab por defecto
      this.renderTabRowButtons(0, modelJson)
      return
    }

    // Si no es Tabs ni ObjectByTabs, lógica original
    const rowButtons = modelJson.view_definition[1]?.row_buttons || [];
    if (!rowButtons.length) {
      const noRowButtons = document.createElement("div")
      noRowButtons.className = "no-actions"
      noRowButtons.textContent = "No hay row_buttons en este componente."
      container.appendChild(noRowButtons)
      return;
    }
    
    rowButtons.forEach((action, index) => {
      const actionItem = document.createElement("div")
      actionItem.className = "action-item"
      actionItem.onclick = () => this.app.selectAction(action, index, 'row_buttons')
      const actionName = document.createElement("div")
      actionName.className = "action-name"
      actionName.textContent = action.actionName
      const actionSummary = document.createElement("div")
      actionSummary.className = "action-summary"
      const buttonTitle = action.button?.title?.label_es || action.button?.title?.label_en || "No title"
      const actionDescription = this.getActionDescription(action)
      actionSummary.textContent = `${buttonTitle} • ${actionDescription}`
      actionItem.appendChild(actionName)
      actionItem.appendChild(actionSummary)
      container.appendChild(actionItem)
    })
  }

  /**
   * Renderiza los row buttons de una tab específica
   */
  renderTabRowButtons(tabIdx, modelJson) {
    if (!this.rowButtonsList) return;
    this.rowButtonsList.innerHTML = ""
    
    let tabRowButtons = [];
    
    if (isObjectByTabsComponent(modelJson)) {
      const tab = modelJson.tabs[tabIdx]
      tabRowButtons = this.findAllRowButtons(tab.view_definition)
    } 
    else if (isTabsComponent(modelJson)) {
      const tab = modelJson.tabs[tabIdx]
      tabRowButtons = (tab.view_definition && tab.view_definition[1] && tab.view_definition[1].row_buttons) || []
    }
    
    if (tabRowButtons.length === 0) {
      const noRowButtons = document.createElement("div")
      noRowButtons.className = "no-actions"
      noRowButtons.textContent = "No hay row_buttons en esta pestaña."
      this.rowButtonsList.appendChild(noRowButtons)
    } else {
      tabRowButtons.forEach((action, index) => {
        const actionItem = document.createElement("div")
        actionItem.className = "action-item"
        actionItem.onclick = () => this.app.selectAction(action, index, 'row_buttons')
        const actionName = document.createElement("div")
        actionName.className = "action-name"
        actionName.textContent = action.actionName
        const actionSummary = document.createElement("div")
        actionSummary.className = "action-summary"
        const buttonTitle = action.button?.title?.label_es || action.button?.title?.label_en || "No title"
        const actionDescription = this.getActionDescription(action)
        actionSummary.textContent = `${buttonTitle} • ${actionDescription}`
        actionItem.appendChild(actionName)
        actionItem.appendChild(actionSummary)
        this.rowButtonsList.appendChild(actionItem)
      })
    }
  }

  /**
   * Función recursiva para buscar row_buttons en todos los niveles
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
   * Verifica si la funcionalidad de descarga está habilitada
   */
  checkDownloadable(modelJson) {
    const exportButton = document.getElementById("exportButton");

    const tableConfig = Array.isArray(modelJson.view_definition) && modelJson.view_definition.length > 1
      ? modelJson.view_definition[1]
      : null;

    if (tableConfig && tableConfig.downloadable && tableConfig.downloadable.enable) {
      exportButton.style.display = "block";
      const newButton = exportButton.cloneNode(true);
      exportButton.parentNode.replaceChild(newButton, exportButton);
      newButton.addEventListener("click", () => {
        this.app.testGeneratorExport.showExportTestGenerator();
      });
    } else {
      exportButton.style.display = "none";
    }
  }
}