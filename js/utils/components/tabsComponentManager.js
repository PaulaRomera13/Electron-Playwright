// tabsComponentManager.js - Manejo de componentes Tabs y ObjectByTabs
import { isTabsComponent, getTabLabels } from './tabUtils.js';
import { isObjectByTabsComponent, getObjectByTabsLabels } from './objectByTabsUtils.js';

export class TabsComponentManager {
  constructor(app) {
    this.app = app;
  }

  /**
   * Si el componente es Tabs, añade los objetos de tab requeridos
   * @param {Object} json - El JSON de configuración
   * @param {'es'|'en'} lang - Idioma ('es' o 'en')
   * @returns {Array<Object>} Array de objetos con phraseTab, tab y screenShotTab
   */
  addTabsTestSteps(json, lang = 'es') {
    if (!isTabsComponent(json)) return [];
    const tabLabels = getTabLabels(json, lang);
    return tabLabels.map(tabLabel => ({
      phraseTab: 'Click on Tab',
      tab: tabLabel,
      screenShotTab: tabLabel
    }));
  }

  /**
   * Renderiza el selector de idioma de la tab si el modelo es Tabs
   * @param {Object} modelJson - Modelo JSON
   * @returns {string} HTML del selector o vacío
   */
  renderTabLangSelector(modelJson) {
    // Soporte para Tabs y ObjectByTabs
    if ((isTabsComponent(modelJson) || isObjectByTabsComponent(modelJson)) && Array.isArray(modelJson.tabs)) {
      let activeTabIdx = 0;
      if (this.app && typeof this.app.getActiveTabIdx === 'function') {
        activeTabIdx = this.app.getActiveTabIdx();
      }
      let labelES = '', labelEN = '';
      if (isTabsComponent(modelJson)) {
        const tab = modelJson.tabs[activeTabIdx];
        labelES = tab.tabLabel?.label_es || '';
        labelEN = tab.tabLabel?.label_en || '';
      } else if (isObjectByTabsComponent(modelJson)) {
        const tab = modelJson.tabs[activeTabIdx];
        labelES = tab.tabLabel_es || '';
        labelEN = tab.tabLabel_en || '';
      }
      return `
        <div class="form-group">
          <label>Label de la Tab:</label>
          <div class="tab-language-toggle">
            <label><input type="radio" name="tabLang" value="es"> <b>ES:</b> ${labelES}</label>
            <label><input type="radio" name="tabLang" value="en" checked> <b>EN:</b> ${labelEN}</label>
          </div>
        </div>
      `;
    }
    return '';
  }

  /**
   * Añade phraseTab, tab y screenShotTab al testData si el modelo es Tabs
   * @param {Object} testData - Datos de test
   * @param {Object} modelJson - Modelo JSON
   */
  applyTabProperties(testData, modelJson) {
    if ((isTabsComponent(modelJson) || isObjectByTabsComponent(modelJson)) && Array.isArray(modelJson.tabs)) {
      let activeTabIdx = 0;
      if (this.app && typeof this.app.getActiveTabIdx === 'function') {
        activeTabIdx = this.app.getActiveTabIdx();
      }
      let tabLang = 'en';
      const langInput = document.querySelector('input[name="tabLang"]:checked');
      if (langInput) tabLang = langInput.value;
      let label = '';
      if (isTabsComponent(modelJson)) {
        const tab = modelJson.tabs[activeTabIdx];
        label = tabLang === 'en' ? tab.tabLabel?.label_en : tab.tabLabel?.label_es;
      } else if (isObjectByTabsComponent(modelJson)) {
        const tab = modelJson.tabs[activeTabIdx];
        label = tabLang === 'en' ? tab.tabLabel_en : tab.tabLabel_es;
      }
      testData.phraseTab = 'Click on Tab';
      testData.tab = label;
      testData.screenShotTab = label;
    }
  }

  /**
   * Renderiza los extras de ObjectByTabs (radio y campos de búsqueda/selección) si corresponde
   * @param {Object} modelJson - Modelo JSON
   * @returns {string} HTML del bloque o vacío
   */
  renderObjectByTabsExtras(modelJson) {
    if (
      isObjectByTabsComponent(modelJson) &&
      Array.isArray(modelJson.filter) &&
      modelJson.filter.length > 0 &&
      modelJson.filter.some(f => f && f.filtertext1)
    ) {
      // Buscar el primer filtro válido
      const filterObj = modelJson.filter.find(f => f && f.filtertext1);
      const labelES = filterObj.filtertext1.label_es || 'Buscar';
      return `
        <div class="form-group">
          <label>¿Cómo quieres buscar?</label>
          <div class="tab-language-toggle">
            <label class="fake-checkbox"><input type="radio" name="objectByTabsSearchType" value="select" checked> Seleccionar</label>
            <label class="fake-checkbox"><input type="radio" name="objectByTabsSearchType" value="search"> Buscar</label>
          </div>
        </div>
        <div class="form-group" id="objectByTabsSelectGroup">
          <label>${labelES} (seleccionar):</label>
          <input type="text" id="objectByTabsSelectValue" placeholder="Introduce el valor a seleccionar" />
          <label style="margin-top:6px;">Posición:</label>
          <input type="number" id="objectByTabsSelectPosition" value="0" min="0" style="width:60px;" />
        </div>
        <div class="form-group" id="objectByTabsSearchGroup" style="display:none;">
          <label>${labelES} (buscar):</label>
          <input type="text" id="objectByTabsSearchValue" placeholder="Introduce el valor a buscar" />
        </div>
        <script>
          (function() {
            function updateSearchType() {
              var radios = document.getElementsByName('objectByTabsSearchType');
              var selectGroup = document.getElementById('objectByTabsSelectGroup');
              var searchGroup = document.getElementById('objectByTabsSearchGroup');
              var selected = Array.from(radios).find(r => r.checked)?.value || 'select';
              if (selected === 'select') {
                selectGroup.style.display = '';
                searchGroup.style.display = 'none';
              } else {
                selectGroup.style.display = 'none';
                searchGroup.style.display = '';
              }
            }
            // Ejecutar SIEMPRE tras insertar el HTML
            setTimeout(updateSearchType, 0);
            var radios = document.getElementsByName('objectByTabsSearchType');
            radios.forEach(function(radio) {
              radio.addEventListener('change', updateSearchType);
            });
          })();
        </script>
      `;
    }
    return '';
  }

  /**
   * Añade las propiedades de búsqueda/selección de ObjectByTabs al testData si corresponde
   * @param {Object} testData - Datos de test
   * @param {Object} modelJson - Modelo JSON
   */
  applyObjectByTabsExtras(testData, modelJson) {
    if (
      isObjectByTabsComponent(modelJson) &&
      Array.isArray(modelJson.filter) &&
      modelJson.filter.length > 0 &&
      modelJson.filter.some(f => f && f.filtertext1)
    ) {
      const filterObj = modelJson.filter.find(f => f && f.filtertext1);
      const labelES = filterObj.filtertext1.label_es || 'Buscar';
      testData.phraseClickSearch = 'Click on Search';
      testData.phraseSearch = 'Search';
      testData.phraseFillField = 'Fill Field';
      testData.screenShotSearch = 'Search';
      const radios = document.getElementsByName('objectByTabsSearchType');
      let type = 'select';
      radios.forEach(radio => { if (radio.checked) type = radio.value; });
      if (type === 'select') {
        testData.search = {
          label: labelES,
          selectObjectSearch: document.getElementById('objectByTabsSelectValue')?.value || '',
          positionSelectObjectSearch: document.getElementById('objectByTabsSelectPosition')?.value || '0'
        };
      } else {
        testData.search = {
          label: labelES,
          value: document.getElementById('objectByTabsSearchValue')?.value || '',
          press: 'Search'
        };
      }
    }
  }

  /**
   * Verifica si el modelo es un componente Tabs
   * @param {Object} modelJson - Modelo JSON
   * @returns {boolean} True si es un componente Tabs
   */
  isTabsComponent(modelJson) {
    return isTabsComponent(modelJson);
  }

  /**
   * Verifica si el modelo es un componente ObjectByTabs
   * @param {Object} modelJson - Modelo JSON
   * @returns {boolean} True si es un componente ObjectByTabs
   */
  isObjectByTabsComponent(modelJson) {
    return isObjectByTabsComponent(modelJson);
  }

  /**
   * Obtiene las etiquetas de las tabs
   * @param {Object} modelJson - Modelo JSON
   * @param {'es'|'en'} lang - Idioma
   * @returns {Array<string>} Array de etiquetas
   */
  getTabLabels(modelJson, lang = 'es') {
    if (isTabsComponent(modelJson)) {
      return getTabLabels(modelJson, lang);
    } else if (isObjectByTabsComponent(modelJson)) {
      return getObjectByTabsLabels(modelJson, lang);
    }
    return [];
  }

  /**
   * Obtiene información detallada de las tabs
   * @param {Object} modelJson - Modelo JSON
   * @returns {Array<Object>} Array con información detallada de las tabs
   */
  getTabsInfo(modelJson) {
    if (!Array.isArray(modelJson.tabs)) return [];

    return modelJson.tabs.map((tab, index) => {
      let labelES = '', labelEN = '';
      
      if (isTabsComponent(modelJson)) {
        labelES = tab.tabLabel?.label_es || '';
        labelEN = tab.tabLabel?.label_en || '';
      } else if (isObjectByTabsComponent(modelJson)) {
        labelES = tab.tabLabel_es || '';
        labelEN = tab.tabLabel_en || '';
      }

      return {
        index,
        labelES,
        labelEN,
        isActive: index === (this.app.getActiveTabIdx ? this.app.getActiveTabIdx() : 0)
      };
    });
  }

  /**
   * Renderiza un selector de tabs
   * @param {Object} modelJson - Modelo JSON
   * @returns {string} HTML del selector de tabs
   */
  renderTabsSelector(modelJson) {
    const tabsInfo = this.getTabsInfo(modelJson);
    if (tabsInfo.length === 0) return '';

    let html = `
      <div class="form-group">
        <label>Seleccionar Tab:</label>
        <select id="tabsSelector" class="form-control">
    `;

    tabsInfo.forEach(tab => {
      const selected = tab.isActive ? 'selected' : '';
      html += `<option value="${tab.index}" ${selected}>${tab.labelES} / ${tab.labelEN}</option>`;
    });

    html += `
        </select>
      </div>
    `;

    return html;
  }

  /**
   * Aplica la selección de tab al testData
   * @param {Object} testData - Datos de test
   * @param {Object} modelJson - Modelo JSON
   */
  applyTabsSelection(testData, modelJson) {
    const tabsSelector = document.getElementById('tabsSelector');
    if (tabsSelector && this.isTabsComponent(modelJson) || this.isObjectByTabsComponent(modelJson)) {
      const selectedIndex = parseInt(tabsSelector.value);
      const tabsInfo = this.getTabsInfo(modelJson);
      const selectedTab = tabsInfo[selectedIndex];
      
      if (selectedTab) {
        testData.selectedTabIndex = selectedIndex;
        testData.selectedTabLabelES = selectedTab.labelES;
        testData.selectedTabLabelEN = selectedTab.labelEN;
      }
    }
  }

  /**
   * Valida la configuración de tabs
   * @param {Object} modelJson - Modelo JSON
   * @returns {Object} Resultado de la validación
   */
  validateTabsConfiguration(modelJson) {
    const validation = {
      isValid: true,
      errors: []
    };

    if (!Array.isArray(modelJson.tabs)) {
      validation.isValid = false;
      validation.errors.push('No se encontraron tabs en el modelo');
      return validation;
    }

    if (modelJson.tabs.length === 0) {
      validation.isValid = false;
      validation.errors.push('El modelo no tiene tabs definidas');
      return validation;
    }

    // Validar que cada tab tenga las propiedades requeridas
    modelJson.tabs.forEach((tab, index) => {
      if (isTabsComponent(modelJson)) {
        if (!tab.tabLabel) {
          validation.isValid = false;
          validation.errors.push(`Tab ${index}: Falta tabLabel`);
        }
      } else if (isObjectByTabsComponent(modelJson)) {
        if (!tab.tabLabel_es && !tab.tabLabel_en) {
          validation.isValid = false;
          validation.errors.push(`Tab ${index}: Falta tabLabel_es o tabLabel_en`);
        }
      }
    });

    return validation;
  }
} 