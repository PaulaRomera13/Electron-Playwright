// regressiveDataUtils.js - Manejo de persistencia de datos para tests regresivos
export class RegressiveDataUtils {
  constructor() {}

  async clearRegressiveFile() {
    try {
      const response = await fetch('http://localhost:3001/clear-regressive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || 'Error al limpiar');
      console.log('✅ Archivo limpiado');
    } catch (e) {
      console.error('❌ Error al limpiar:', e.message);
      throw e;
    }
  }

  async saveRegressiveScreenToFile(data) {
    try {
      // ✅ CORREGIDO: Siempre enviar como array
      const payload = Array.isArray(data) ? data : [data];
      
      const response = await fetch('http://localhost:3001/upload-regressive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      if (!result.ok) {
        console.error('❌ Error al guardar:', result.error);
      } else {
        console.log(`✅ ${Array.isArray(data) ? data.length : 1} pantalla(s) guardada(s)`);
      }
    } catch (e) {
      console.error('❌ Error en fetch:', e.message);
    }
  }

  // Método para cargar datos regresivos desde el servidor
  async loadRegressiveData() {
    try {
      const response = await fetch('http://localhost:3001/load-regressive', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || 'Error al cargar');
      
      return result.data;
    } catch (e) {
      console.error('❌ Error al cargar datos regresivos:', e.message);
      return null;
    }
  }

  // Método para validar JSON de pantalla
  validateScreenJson(jsonData) {
    try {
      if (!jsonData.component) {
        throw new Error("Falta la propiedad 'component'");
      }
      
      if (!jsonData.view_definition && !jsonData.tabs) {
        throw new Error("Falta 'view_definition' o 'tabs'");
      }
      
      return true;
    } catch (e) {
      throw new Error(`Error de validación: ${e.message}`);
    }
  }

  // Método para procesar múltiples JSONs de pantallas
  processScreenJsons(jsonArray) {
    const processed = [];
    const errors = [];
    
    jsonArray.forEach((jsonData, index) => {
      try {
        this.validateScreenJson(jsonData);
        processed.push({
          ...jsonData,
          screenIndex: index,
          screenName: `Pantalla ${index + 1}`
        });
      } catch (e) {
        errors.push({
          index: index + 1,
          error: e.message
        });
      }
    });
    
    return {
      processed,
      errors,
      hasErrors: errors.length > 0
    };
  }

  // Método para generar el JSON final del test regresivo
  generateRegressiveTestJson(savedActions) {
    if (!savedActions || savedActions.length === 0) {
      throw new Error('No hay acciones guardadas para generar el test regresivo');
    }

    const testArray = savedActions.map(action => action.jsonData);
    return { testDataGame: testArray };
  }

  // Método para exportar datos a diferentes formatos
  exportRegressiveData(data, format = 'json') {
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return this.convertToCSV(data);
      case 'xml':
        return this.convertToXML(data);
      default:
        throw new Error(`Formato no soportado: ${format}`);
    }
  }

  // Método auxiliar para convertir a CSV
  convertToCSV(data) {
    if (!data.testDataGame || !Array.isArray(data.testDataGame)) {
      return '';
    }
    
    const headers = ['Index', 'Action', 'Screen', 'Data'];
    const rows = data.testDataGame.map((action, index) => [
      index + 1,
      action.actionName || 'N/A',
      action.screenName || 'N/A',
      JSON.stringify(action.jsonData || {})
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  // Método auxiliar para convertir a XML
  convertToXML(data) {
    if (!data.testDataGame || !Array.isArray(data.testDataGame)) {
      return '<?xml version="1.0" encoding="UTF-8"?><regressiveTest></regressiveTest>';
    }
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<regressiveTest>\n';
    
    data.testDataGame.forEach((action, index) => {
      xml += `  <action index="${index + 1}">\n`;
      xml += `    <name>${action.actionName || 'N/A'}</name>\n`;
      xml += `    <screen>${action.screenName || 'N/A'}</screen>\n`;
      xml += `    <data>${JSON.stringify(action.jsonData || {})}</data>\n`;
      xml += `  </action>\n`;
    });
    
    xml += '</regressiveTest>';
    return xml;
  }

  // Método para copiar datos al portapapeles
  async copyToClipboard(data) {
    try {
      await navigator.clipboard.writeText(data);
      return true;
    } catch (e) {
      console.error('Error al copiar al portapapeles:', e);
      return false;
    }
  }

  // Método para descargar archivo
  downloadFile(data, filename, format = 'json') {
    const content = this.exportRegressiveData(data, format);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
} 