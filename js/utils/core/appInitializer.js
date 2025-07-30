// appInitializer.js - Manejo de la inicialización de la aplicación
export class AppInitializer {
  constructor(app) {
    this.app = app;
  }

  /**
   * Inicializa la aplicación cargando el modelo JSON
   */
  async init() {
    try {
      const endpoint = 'http://localhost:3001/model-json';
      const res = await fetch(endpoint, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data?.component) throw new Error('JSON sin la propiedad "component"');
      
      this.app.modelJson = data;
      this.app.sidebarManager.renderMainConfig(this.app.modelJson);
      this.app.sidebarManager.renderActionsList(this.app.modelJson);
      this.app.sidebarManager.renderRowButtonsList(this.app.modelJson);
    } catch (e) {
      console.error('❌ Error al cargar el modelJson:', e.message);
      alert(`Error al cargar el modelo: ${e.message}`);
    }
  }

  /**
   * Inicializa el estado inicial de la aplicación
   */
  initializeState() {
    this.app.selectedAction = null;
    this.app.currentTabSwitcher = null;
    this.app.originalTestData = null;
    this.app.lastHighlightedField = null;
    this.app.modelJson = null;
    this.app.activeTabIdx = 0;
    this.app.regressiveScreens = null;
    this.app.currentRegressiveScreenIndex = 0;
  }

  /**
   * Inicializa completamente la aplicación
   */
  async initializeApp() {
    this.initializeState();
    await this.init();
  }
} 