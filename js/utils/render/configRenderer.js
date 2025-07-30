// configRenderer.js - Renderizado de configuración del sidebar
import { isTabsComponent, getTabLabels } from '../components/tabUtils.js';

export class ConfigRenderer {
  constructor() {}

  /**
   * Renderiza la configuración principal en el sidebar
   * Muestra información del componente y detalles de view query
   * @param {Object} modelJson - Modelo JSON
   */
  renderMainConfig(modelJson) {
    this.renderBasicConfig(modelJson);
    this.renderViewQueryConfig(modelJson);
  }

  /**
   * Renderiza la configuración básica
   * @param {Object} modelJson - Modelo JSON
   */
  renderBasicConfig(modelJson) {
    document.getElementById("config-component").textContent = modelJson.component;
    document.getElementById("config-hideLeftPane").textContent = modelJson.hideLeftPane ? "Yes" : "No";
    document.getElementById("config-hasOwnComponent").textContent = modelJson.hasOwnComponent ? "Yes" : "No";
  }

  /**
   * Renderiza la configuración de view query
   * @param {Object} modelJson - Modelo JSON
   */
  renderViewQueryConfig(modelJson) {
    const viewQueryGrid = document.getElementById("view-query-grid");
    viewQueryGrid.innerHTML = "";

    if (isTabsComponent(modelJson)) {
      this.renderTabsViewQuery(modelJson, viewQueryGrid);
    } else {
      this.renderSimpleViewQuery(modelJson, viewQueryGrid);
    }
  }

  /**
   * Renderiza view query para componentes con pestañas
   * @param {Object} modelJson - Modelo JSON
   * @param {HTMLElement} viewQueryGrid - Contenedor del grid
   */
  renderTabsViewQuery(modelJson, viewQueryGrid) {
    const tabLabels = getTabLabels(modelJson, 'es');
    modelJson.tabs.forEach((tab, idx) => {
      const tabTitle = document.createElement("div");
      tabTitle.className = "tab-viewquery-title";
      tabTitle.textContent = `Tab: ${tabLabels[idx] || 'Tab ' + (idx+1)}`;
      viewQueryGrid.appendChild(tabTitle);
      
      if (tab.viewQuery) {
        this.renderViewQueryProperties(tab.viewQuery, viewQueryGrid);
      } else {
        const noViewQuery = document.createElement("div");
        noViewQuery.textContent = "No hay viewQuery en esta tab.";
        viewQueryGrid.appendChild(noViewQuery);
      }
    });
  }

  /**
   * Renderiza view query para componentes simples
   * @param {Object} modelJson - Modelo JSON
   * @param {HTMLElement} viewQueryGrid - Contenedor del grid
   */
  renderSimpleViewQuery(modelJson, viewQueryGrid) {
    let viewQuery = modelJson.viewQuery;
    if (viewQuery) {
      this.renderViewQueryProperties(viewQuery, viewQueryGrid);
    } else {
      viewQueryGrid.textContent = "No hay viewQuery en este componente.";
    }
  }

  /**
   * Renderiza las propiedades de view query
   * @param {Object} viewQuery - Objeto view query
   * @param {HTMLElement} viewQueryGrid - Contenedor del grid
   */
  renderViewQueryProperties(viewQuery, viewQueryGrid) {
    for (const [key, value] of Object.entries(viewQuery)) {
      const nameDiv = document.createElement("div");
      nameDiv.className = "property-name";
      nameDiv.textContent = key;
      
      const valueDiv = document.createElement("div");
      valueDiv.className = "property-value";
      valueDiv.textContent = typeof value === "object" ? JSON.stringify(value) : value;
      
      viewQueryGrid.appendChild(nameDiv);
      viewQueryGrid.appendChild(valueDiv);
    }
  }
} 