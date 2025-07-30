// Utilidad para detectar y extraer información de componentes Tabs

/**
 * Detecta si el objeto es un componente Tabs
 * @param {Object} json - El objeto JSON a analizar
 * @returns {boolean} true si es Tabs, false si no
 */
export function isTabsComponent(json) {
  return json && json.component === 'Tabs' && Array.isArray(json.tabs);
}

/**
 * Devuelve los nombres de los tabs en el idioma elegido
 * @param {Object} json - El objeto JSON de Tabs
 * @param {'es'|'en'} lang - Idioma ('es' o 'en')
 * @returns {Array<string>} Array con los nombres de los tabs en el idioma elegido
 */
export function getTabLabels(json, lang = 'es') {
  if (!isTabsComponent(json)) return [];
  return json.tabs.map(tab => {
    if (tab.tabLabel) {
      return lang === 'en' ? tab.tabLabel.label_en : tab.tabLabel.label_es;
    }
    return '';
  });
} 