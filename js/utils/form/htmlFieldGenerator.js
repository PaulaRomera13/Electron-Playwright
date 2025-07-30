// htmlFieldGenerator.js - Generación de campos HTML comunes
export class HtmlFieldGenerator {
  constructor() {}

  /**
   * Genera los campos HTML comunes que usan todos los generadores
   * @returns {string} HTML de los campos comunes
   */
  generateCommonFields() {
    return `
      <!-- Campo para el proceso del menú -->
      <div class="form-group">
          <label for="processName">Proceso del menú a seleccionar:</label>
          <input type="text" id="processName" placeholder="Ej: Stock control" data-json-path="desktopMode.label" />
      </div>

      <!-- Campo para el nombre de la pestaña -->
      <div class="form-group">
          <label for="menuOption">Nombre de la Pestaña (Opción del Menú):</label>
          <input type="text" id="menuOption" placeholder="Ej: Deviations" data-json-path="desktopMode.screenShotName" />
      </div>

      <!-- Campo para el nombre del botón (solo lectura, se llena automáticamente) -->
      <div class="form-group">
          <label for="buttonName">Nombre del Botón (ActionName):</label>
          <input type="text" id="buttonName" class="readonly-field" readonly />
      </div>

      <!-- Campo para el elemento a seleccionar -->
      <div class="form-group">
          <label for="selectName">Elemento a Seleccionar:</label>
          <input type="text" id="selectName" placeholder="Ej: HPLC" data-json-path="selectName" />
      </div>

      <!-- Campo para la posición del botón -->
      <div class="form-group">
          <label for="positionButton">Posición del Botón:</label>
          <input type="text" id="positionButton" value="0" data-json-path="positionButton" />
      </div>

      <!-- Campo para la posición del elemento a seleccionar -->
      <div class="form-group">
          <label for="positionSelectElement">Posición del Elemento a Seleccionar:</label>
          <input type="text" id="positionSelectElement" value="0" data-json-path="positionSelectElement" />
      </div>
    `
  }

  /**
   * Genera los campos HTML para configuraciones adicionales comunes
   * @returns {string} HTML de las configuraciones adicionales
   */
  generateAdditionalConfigFields() {
    return `
      <!-- Checkbox para ocultar botón de acciones -->
      <div class="form-group">
          <div class="checkbox-group">
              <input type="checkbox" id="hideActionsButton" data-json-path="hideActionsButton" />
              <label for="hideActionsButton">¿Ocultar botón de Acciones escondidas (...)?</label>  
          </div>
      </div>

      <!-- Configuración del botón de acciones ocultas (inicialmente oculto) -->
      <div class="form-group" id="hideActionsButtonConfig" style="display: none;">
          <label for="hideActionsButtonLocator">Locator:</label>
          <input type="text" id="hideActionsButtonLocator" value="md-icon:has-text('more_horiz')" class="readonly-field" readonly data-json-path="hideActionsButton.locator" />
          
          <label for="hideActionsButtonPosition" style="margin-top: 10px;">Position:</label>
          <input type="text" id="hideActionsButtonPosition" value="0" data-json-path="hideActionsButton.position" />
      </div>

      <!-- Checkbox para añadir configuración de flecha -->
      <div class="form-group">
          <div class="checkbox-group">
              <input type="checkbox" id="addArrowConfig" data-json-path="arrowDirection" />
              <label for="addArrowConfig">¿Añadir configuración de flecha?</label>  
          </div>
      </div>

      <!-- Configuración de la flecha (inicialmente oculto) -->
      <div class="form-group" id="arrowConfigContainer" style="display: none;">
          <label for="arrowDirection">Dirección de la flecha:</label>
          <select id="arrowDirection" class="form-control" data-json-path="arrowDirection">
              <option value="down">Abajo</option>
              <option value="up">Arriba</option>
          </select>
          
          <label for="positionArrow" style="margin-top: 10px;">Posición de la flecha:</label>
          <input type="text" id="positionArrow" value="0" data-json-path="positionArrow" />
      </div>
    `
  }

  /**
   * Genera los campos HTML para textos de notificación
   * @returns {string} HTML de los campos de notificación
   */
  generateNotificationFields() {
    return `
      <!-- Campos para textos de notificación -->
      <div class="form-group">
          <label for="textInNotif1">Text In Notif 1:</label>
          <input type="text" id="textInNotif1" placeholder="Ej: Created" data-json-path="textInNotif1" />
      </div>

      <div class="form-group">
          <label for="textInNotif2">Text In Notif 2:</label>
          <input type="text" id="textInNotif2" placeholder="Ej: with" data-json-path="textInNotif2" />
      </div>

      <div class="form-group">
          <label for="textInNotif3">Text In Notif 3:</label>
          <input type="text" id="textInNotif3" placeholder="Ej: success" data-json-path="textInNotif3" />
      </div>
    `
  }

  /**
   * Genera campos HTML personalizados
   * @param {Object} config - Configuración de los campos
   * @returns {string} HTML de los campos personalizados
   */
  generateCustomFields(config) {
    let html = '';
    
    if (config.fields && Array.isArray(config.fields)) {
      config.fields.forEach(field => {
        html += `
          <div class="form-group">
              <label for="${field.id}">${field.label}:</label>
              ${this.generateFieldInput(field)}
          </div>
        `;
      });
    }
    
    return html;
  }

  /**
   * Genera un input basado en la configuración del campo
   * @param {Object} field - Configuración del campo
   * @returns {string} HTML del input
   */
  generateFieldInput(field) {
    const commonAttrs = `id="${field.id}" ${field.placeholder ? `placeholder="${field.placeholder}"` : ''} ${field.dataJsonPath ? `data-json-path="${field.dataJsonPath}"` : ''}`;
    
    switch (field.type) {
      case 'select':
        return `
          <select ${commonAttrs} class="form-control">
            ${field.options ? field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('') : ''}
          </select>
        `;
      
      case 'textarea':
        return `<textarea ${commonAttrs} class="form-control"></textarea>`;
      
      case 'checkbox':
        return `
          <div class="checkbox-group">
            <input type="checkbox" ${commonAttrs} />
            <label for="${field.id}">${field.label}</label>
          </div>
        `;
      
      case 'number':
        return `<input type="number" ${commonAttrs} class="form-control" ${field.min ? `min="${field.min}"` : ''} ${field.max ? `max="${field.max}"` : ''} />`;
      
      default:
        return `<input type="text" ${commonAttrs} class="form-control" />`;
    }
  }

  /**
   * Genera un contenedor de campos con título
   * @param {string} title - Título del contenedor
   * @param {string} fieldsHtml - HTML de los campos
   * @param {string} containerClass - Clase CSS del contenedor
   * @returns {string} HTML del contenedor
   */
  generateFieldContainer(title, fieldsHtml, containerClass = 'field-section') {
    return `
      <div class="${containerClass}">
        <h4>${title}</h4>
        ${fieldsHtml}
      </div>
    `;
  }
} 