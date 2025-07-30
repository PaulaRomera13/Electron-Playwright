// Utilidad para detectar y extraer información de componentes ObjectByTabs

/**
 * Detecta si el objeto es un componente ObjectByTabs
 * @param {Object} json - El objeto JSON a analizar
 * @returns {boolean} true si es ObjectByTabs, false si no
 */
export function isObjectByTabsComponent(json) {
  return json && json.component === 'ObjectByTabs' && Array.isArray(json.tabs);
}

/**
 * Devuelve los nombres de los tabs en el idioma elegido para ObjectByTabs
 * @param {Object} json - El objeto JSON de ObjectByTabs
 * @param {'es'|'en'} lang - Idioma ('es' o 'en')
 * @returns {Array<string>} Array con los nombres de los tabs en el idioma elegido
 */
export function getObjectByTabsLabels(json, lang = 'es') {
  if (!isObjectByTabsComponent(json)) return [];
  return json.tabs.map(tab => {
    if (lang === 'en') return tab.tabLabel_en || '';
    return tab.tabLabel_es || '';
  });
} 