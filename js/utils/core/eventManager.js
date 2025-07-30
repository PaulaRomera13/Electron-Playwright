// eventManager.js - Manejo de eventos del DOM
export class EventManager {
  constructor(app) {
    this.app = app;
  }

  /**
   * Configura todos los eventos de la aplicación
   */
  setupAllEvents() {
    this.setupModalEvents();
    this.setupRegressiveButtonEvents();
    this.setupJsonEditorEvents();
  }

  /**
   * Configura eventos del modal de JSON
   */
  setupModalEvents() {
    // Eventos del modal de JSON
    const toggleBtn = document.getElementById('toggleModelJsonForm');
    const closeBtn = document.getElementById('closeModelJsonModal');
    const uploadForm = document.getElementById('uploadForm');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.getElementById('modeljsonUploadContainer').style.display = 'flex';
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('modeljsonUploadContainer').style.display = 'none';
      });
    }

    if (uploadForm) {
      uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleModelUpload();
      });
    }
  }

  /**
   * Maneja la subida del modelo JSON
   */
  async handleModelUpload() {
    const editor = document.getElementById('modelJsonEditor');
    const statusElement = document.getElementById('uploadStatus');
    
    let json;
    try {
      json = JSON.parse(editor.value);
    } catch (err) {
      statusElement.textContent = 'JSON inválido';
      statusElement.style.color = 'red';
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/upload-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Error desconocido');
      
      statusElement.textContent = '¡Modelo actualizado y guardado!';
      statusElement.style.color = 'green';
      document.getElementById('modeljsonUploadContainer').style.display = 'none';
      await this.app.init();
    } catch (err) {
      statusElement.textContent = 'Error al guardar: ' + err.message;
      statusElement.style.color = 'red';
    }
  }

  /**
   * Configura eventos del botón de test regresivo
   */
  setupRegressiveButtonEvents() {
    const regressiveBtn = document.getElementById('regressiveTestButton');
    if (regressiveBtn) {
      regressiveBtn.addEventListener('click', () => {
        this.app.testGeneratorRegressive.showRegressiveDialog();
      });
    }
  }

  /**
   * Configura eventos del editor JSON
   */
  setupJsonEditorEvents() {
    const editor = document.getElementById('modelJsonEditor');
    const formatBtn = document.getElementById('formatJsonBtn');
    const minifyBtn = document.getElementById('minifyJsonBtn');
    const searchBtn = document.getElementById('searchJsonBtn');
    const searchBox = document.getElementById('jsonSearchBox');
    const searchInput = document.getElementById('jsonSearchInput');
    const searchCount = document.getElementById('jsonSearchCount');
    const searchPrev = document.getElementById('jsonSearchPrev');
    const searchNext = document.getElementById('jsonSearchNext');
    const searchClose = document.getElementById('jsonSearchClose');

    if (formatBtn) {
      formatBtn.addEventListener('click', () => {
        this.formatJson(editor);
      });
    }

    if (minifyBtn) {
      minifyBtn.addEventListener('click', () => {
        this.minifyJson(editor);
      });
    }

    // Configurar búsqueda en JSON
    let searchMatches = [];
    let currentMatch = 0;

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        searchBox.style.display = 'flex';
        searchInput.focus();
        this.highlightMatches(editor, searchInput, searchCount, searchMatches, currentMatch);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        currentMatch = 0;
        this.highlightMatches(editor, searchInput, searchCount, searchMatches, currentMatch);
      });
    }

    if (searchPrev) {
      searchPrev.addEventListener('click', () => {
        if (searchMatches.length === 0) return;
        currentMatch = (currentMatch - 1 + searchMatches.length) % searchMatches.length;
        this.highlightMatches(editor, searchInput, searchCount, searchMatches, currentMatch);
      });
    }

    if (searchNext) {
      searchNext.addEventListener('click', () => {
        if (searchMatches.length === 0) return;
        currentMatch = (currentMatch + 1) % searchMatches.length;
        this.highlightMatches(editor, searchInput, searchCount, searchMatches, currentMatch);
      });
    }

    if (searchClose) {
      searchClose.addEventListener('click', () => {
        searchBox.style.display = 'none';
        searchInput.value = '';
        searchCount.textContent = '';
        editor.setSelectionRange(0, 0);
        editor.focus();
      });
    }
  }

  /**
   * Formatea el JSON en el editor
   */
  formatJson(editor) {
    try {
      const obj = JSON.parse(editor.value);
      editor.value = JSON.stringify(obj, null, 2);
    } catch {
      alert('JSON inválido, no se puede formatear');
    }
  }

  /**
   * Comprime el JSON en el editor
   */
  minifyJson(editor) {
    try {
      const obj = JSON.parse(editor.value);
      editor.value = JSON.stringify(obj);
    } catch {
      alert('JSON inválido, no se puede comprimir');
    }
  }

  /**
   * Resalta las coincidencias en la búsqueda
   */
  highlightMatches(editor, searchInput, searchCount, searchMatches, currentMatch) {
    const value = editor.value;
    const term = searchInput.value;
    if (!term) {
      searchCount.textContent = '';
      return;
    }
    
    searchMatches.length = 0; // Limpiar array
    let idx = value.indexOf(term);
    while (idx !== -1) {
      searchMatches.push(idx);
      idx = value.indexOf(term, idx + term.length);
    }
    
    if (searchMatches.length > 0) {
      searchCount.textContent = `${currentMatch + 1} de ${searchMatches.length}`;
      const start = searchMatches[currentMatch];
      editor.focus();
      editor.setSelectionRange(start, start + term.length);
    } else {
      searchCount.textContent = '0';
    }
  }

  /**
   * Configura eventos de selección de acciones
   */
  setupActionSelectionEvents() {
    // Los eventos de selección de acciones se configuran dinámicamente
    // en el renderizado de la lista de acciones
  }

  /**
   * Configura eventos de navegación de pestañas
   */
  setupTabNavigationEvents() {
    // Los eventos de navegación de pestañas se configuran dinámicamente
    // en el renderizado de las pestañas
  }

  /**
   * Limpia todos los eventos registrados
   */
  cleanupEvents() {
    // En una implementación más avanzada, aquí se limpiarían
    // todos los event listeners registrados
  }
} 