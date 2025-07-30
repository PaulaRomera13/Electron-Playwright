// regressivePanelUtils.js - Manejo del panel de acciones guardadas
export class RegressivePanelUtils {
  constructor() {
    this.savedRegressiveActions = [];
  }

  // ✅ NUEVO: Event listener para mantener el panel visible
  setupPanelPersistence() {
    // Asegurar que el panel permanezca visible cuando se hace clic en cualquier parte
    document.addEventListener('click', () => {
      if (this.savedRegressiveActions && this.savedRegressiveActions.length > 0) {
        this.ensureSavedActionsPanelVisible();
      }
    });
    
    // Asegurar que el panel permanezca visible cuando se cambia de pestaña
    document.addEventListener('DOMContentLoaded', () => {
      if (this.savedRegressiveActions && this.savedRegressiveActions.length > 0) {
        this.ensureSavedActionsPanelVisible();
      }
    });
  }

  // ✅ NUEVO: Método para forzar la actualización del panel
  forceUpdatePanel() {
    const sidebar = document.getElementById("sidebar-container");
    if (!sidebar) return;
    
    const panel = document.getElementById("regressive-saved-actions-panel");
    if (panel) {
      sidebar.removeChild(panel);
    }
    
    this.createSavedActionsPanel();
  }

  // ✅ NUEVO: Método para forzar la recreación del panel con todos los botones
  forceRecreatePanel() {
    console.log("🔄 Forzando recreación del panel de acciones guardadas...");
    this.forceUpdatePanel();
    
    // Verificar que se creó correctamente
    setTimeout(() => {
      const panel = document.getElementById("regressive-saved-actions-panel");
      const toggleButton = document.getElementById("toggle-saved-actions");
      const generateButton = document.getElementById("generate-array-button");
      
      console.log("Panel creado:", !!panel);
      console.log("Botón toggle:", !!toggleButton);
      console.log("Botón generar:", !!generateButton);
      
      if (!toggleButton || !generateButton) {
        console.log("⚠️ Los botones no se crearon correctamente, reintentando...");
        this.forceUpdatePanel();
      }
    }, 100);
  }

  /* ---------- 5. Panel de acciones guardadas ---------- */
  createSavedActionsPanel() {
    const sidebar = document.getElementById("sidebar-container");
    if (!sidebar) return;
    
    // Verificar si ya existe el panel para evitar duplicados
    let panel = document.getElementById("regressive-saved-actions-panel");
    if (panel) {
      // Si ya existe, solo actualizar la lista
      this.updateSavedActionsList();
      return;
    }

    // Crear el panel solo si no existe
    panel = document.createElement("div");
    panel.id = "regressive-saved-actions-panel";
    panel.style.cssText = `
      background: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 15px;
      margin-bottom: 20px;
      position: sticky;
      top: 10px;
      z-index: 100;
    `;

    // ✅ NUEVO: Header con título y botón de desplegar/ocultar
    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e9ecef;
    `;

    // ✅ NUEVO: Contenedor para título y contador
    const titleContainer = document.createElement("div");
    titleContainer.style.cssText = `
      display: flex;
      align-items: center;
      flex: 1;
    `;

    const title = document.createElement("h3");
    title.textContent = "Acciones Guardadas";
    title.style.margin = "0";
    title.style.color = "#007bff";
    titleContainer.appendChild(title);

    // ✅ NUEVO: Contador de acciones guardadas
    const counter = document.createElement("span");
    counter.id = "saved-actions-counter";
    counter.style.cssText = `
      font-size: 12px;
      color: #666;
      margin-left: 10px;
      font-weight: normal;
    `;
    titleContainer.appendChild(counter);
    
    header.appendChild(titleContainer);

    // ✅ NUEVO: Botón para generar el array JSON
    const generateButton = document.createElement("button");
    generateButton.id = "generate-array-button";
    generateButton.innerHTML = '<i class="fas fa-code"></i>';
    generateButton.style.cssText = `
      background: #28a745;
      border: 1px solid #28a745;
      color: white;
      cursor: pointer;
      font-size: 12px;
      padding: 6px 8px;
      border-radius: 4px;
      transition: all 0.3s ease;
      min-width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
    `;
    generateButton.title = "Generar Array JSON con acciones guardadas";
    generateButton.onclick = () => this.generateArrayFromSavedActions();
    header.appendChild(generateButton);
    
    // ✅ NUEVO: Configurar el estado inicial del botón
    this.updateGenerateButtonState();

    // Botón de desplegar/ocultar
    const toggleButton = document.createElement("button");
    toggleButton.id = "toggle-saved-actions";
    toggleButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
    toggleButton.style.cssText = `
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      color: #007bff;
      cursor: pointer;
      font-size: 12px;
      padding: 6px 8px;
      border-radius: 4px;
      transition: all 0.3s ease;
      min-width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    toggleButton.title = "Mostrar/Ocultar acciones guardadas";
    header.appendChild(toggleButton);

    panel.appendChild(header);

    // Contenedor de la lista (inicialmente visible)
    const listContainer = document.createElement("div");
    listContainer.id = "regressive-saved-actions-list";
    listContainer.style.cssText = `
      transition: all 0.3s ease;
      overflow: hidden;
    `;
    panel.appendChild(listContainer);
    
    // Insertar al principio del sidebar para que siempre esté visible
    sidebar.insertBefore(panel, sidebar.firstChild);
    
    // ✅ NUEVO: Configurar el comportamiento del botón toggle
    this.setupToggleButton();
    
    this.updateSavedActionsList();
    
    // ✅ NUEVO: Ocultar el panel inicialmente si no hay acciones guardadas
    if (!this.savedRegressiveActions || this.savedRegressiveActions.length === 0) {
      panel.style.display = "none";
    }
  }

  // Nuevo método para restaurar el panel si se pierde
  restoreSavedActionsPanel() {
    this.ensureSavedActionsPanelVisible();
  }

  // Nuevo método para asegurar que el panel permanezca visible
  ensureSavedActionsPanelVisible() {
    const sidebar = document.getElementById("sidebar-container");
    if (!sidebar) return;
    
    let panel = document.getElementById("regressive-saved-actions-panel");
    
    // ✅ NUEVO: Verificar si el panel tiene el botón toggle
    const hasToggleButton = panel && panel.querySelector("#toggle-saved-actions");
    
    if (!panel || !hasToggleButton) {
      // Si no existe el panel o no tiene el botón toggle, recrearlo
      if (panel) {
        sidebar.removeChild(panel);
      }
      this.createSavedActionsPanel();
      panel = document.getElementById("regressive-saved-actions-panel");
    } else {
      // Asegurar que el panel esté en la posición correcta (al principio del sidebar)
      if (panel.parentNode === sidebar && panel !== sidebar.firstChild) {
        sidebar.insertBefore(panel, sidebar.firstChild);
      }
      // Actualizar la lista de acciones
      this.updateSavedActionsList();
      // ✅ NUEVO: Reconfigurar el botón toggle
      this.setupToggleButton();
    }
    
    // ✅ NUEVO: Mostrar el panel solo si hay acciones guardadas
    if (panel) {
      if (this.savedRegressiveActions && this.savedRegressiveActions.length > 0) {
        panel.style.display = "block";
      } else {
        panel.style.display = "none";
      }
    }
  }

  updateSavedActionsList() {
    const listContainer = document.getElementById("regressive-saved-actions-list");
    if (!listContainer) return;
    listContainer.innerHTML = "";
    
    // ✅ NUEVO: Controlar la visibilidad del panel completo
    const panel = document.getElementById("regressive-saved-actions-panel");
    if (panel) {
      if (!this.savedRegressiveActions || this.savedRegressiveActions.length === 0) {
        panel.style.display = "none";
        return;
      } else {
        panel.style.display = "block";
      }
    }
    
    // ✅ NUEVO: Verificar si el panel tiene los botones nuevos
    const hasToggleButton = panel && panel.querySelector("#toggle-saved-actions");
    const hasGenerateButton = panel && panel.querySelector("#generate-array-button");
    
    if (!hasToggleButton || !hasGenerateButton) {
      // Si no tiene los botones nuevos, agregar botones temporales
      const updateContainer = document.createElement("div");
      updateContainer.style.cssText = `
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 6px;
        padding: 10px;
        margin-bottom: 15px;
      `;
      
      const updateTitle = document.createElement("div");
      updateTitle.textContent = "🔄 Panel desactualizado";
      updateTitle.style.cssText = `font-weight: bold; color: #856404; margin-bottom: 8px;`;
      updateContainer.appendChild(updateTitle);
      
      const updateButton = document.createElement("button");
      updateButton.textContent = "Actualizar Panel";
      updateButton.style.cssText = `
        background: #007bff;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        margin-right: 8px;
      `;
      updateButton.onclick = () => this.forceRecreatePanel();
      updateContainer.appendChild(updateButton);
      
      const generateTempButton = document.createElement("button");
      generateTempButton.textContent = "Generar Array JSON";
      generateTempButton.style.cssText = `
        background: #28a745;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      `;
      generateTempButton.onclick = () => this.generateArrayFromSavedActions();
      updateContainer.appendChild(generateTempButton);
      
      listContainer.appendChild(updateContainer);
    }
    
    // ✅ NUEVO: Actualizar el contador
    const counter = document.getElementById("saved-actions-counter");
    if (counter) {
      const count = this.savedRegressiveActions ? this.savedRegressiveActions.length : 0;
      counter.textContent = `(${count})`;
    }
    
    // ✅ NUEVO: Actualizar el estado del botón de generar array
    this.updateGenerateButtonState();
    
    if (!this.savedRegressiveActions || this.savedRegressiveActions.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.textContent = "No hay acciones guardadas";
      emptyMsg.style.color = "#666";
      emptyMsg.style.fontStyle = "italic";
      listContainer.appendChild(emptyMsg);
      return;
    }

    const actionsByScreen = {};
    this.savedRegressiveActions.forEach(action => {
      if (!actionsByScreen[action.screenName]) actionsByScreen[action.screenName] = [];
      actionsByScreen[action.screenName].push(action);
    });

    for (const screenName in actionsByScreen) {
      const screenHeader = document.createElement("div");
      screenHeader.textContent = screenName;
      screenHeader.style.fontWeight = "bold";
      screenHeader.style.marginTop = "10px";
      screenHeader.style.color = "#333";
      listContainer.appendChild(screenHeader);

      const actionsList = document.createElement("ul");
      actionsList.style.listStyle = "none";
      actionsList.style.paddingLeft = "15px";
      actionsList.style.marginTop = "5px";

      actionsByScreen[screenName].forEach(action => {
        const item = document.createElement("li");
        item.textContent = action.actionName;
        item.style.marginBottom = "5px";
        item.style.display = "flex";
        item.style.alignItems = "center";

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "&times;";
        deleteBtn.style.cssText = `
          margin-left: 10px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
          padding: 0;
        `;
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          this.removeSavedAction(action);
        };
        item.appendChild(deleteBtn);
        actionsList.appendChild(item);
      });
      listContainer.appendChild(actionsList);
    }
  }

  removeSavedAction(actionToRemove) {
    this.savedRegressiveActions = (this.savedRegressiveActions || []).filter(
      action => !(action.actionName === actionToRemove.actionName && action.screenIndex === actionToRemove.screenIndex)
    );
    this.updateSavedActionsList();
    
    // ✅ NUEVO: Si no quedan acciones guardadas, ocultar el panel
    if (this.savedRegressiveActions.length === 0) {
      const panel = document.getElementById("regressive-saved-actions-panel");
      if (panel) {
        panel.style.display = "none";
      }
    } else {
      // Si quedan acciones, asegurar que el panel esté visible
      this.ensureSavedActionsPanelVisible();
    }
  }

  // ✅ NUEVO: Método para configurar el botón toggle
  setupToggleButton() {
    const toggleButton = document.getElementById("toggle-saved-actions");
    const listContainer = document.getElementById("regressive-saved-actions-list");
    
    if (!toggleButton || !listContainer) return;
    
    // ✅ NUEVO: Usar data attribute para mantener el estado
    let isExpanded = toggleButton.getAttribute('data-expanded') !== 'false';
    
    // Función para actualizar el estado visual
    const updateVisualState = (expanded) => {
      if (expanded) {
        // Desplegar
        listContainer.style.maxHeight = "500px";
        listContainer.style.opacity = "1";
        listContainer.style.padding = "10px 0";
        toggleButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
        toggleButton.title = "Ocultar acciones guardadas";
        toggleButton.style.color = "#007bff";
        toggleButton.style.background = "#e3f2fd";
        toggleButton.style.borderColor = "#007bff";
      } else {
        // Ocultar
        listContainer.style.maxHeight = "0";
        listContainer.style.opacity = "0";
        listContainer.style.padding = "0";
        toggleButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
        toggleButton.title = "Mostrar acciones guardadas";
        toggleButton.style.color = "#6c757d";
        toggleButton.style.background = "#f8f9fa";
        toggleButton.style.borderColor = "#e9ecef";
      }
    };
    
    // Configurar el evento click
    toggleButton.onclick = () => {
      isExpanded = !isExpanded;
      toggleButton.setAttribute('data-expanded', isExpanded);
      updateVisualState(isExpanded);
    };
    
    // Configurar estado inicial
    updateVisualState(isExpanded);
  }

  // ✅ NUEVO: Método para actualizar el estado del botón de generar array
  updateGenerateButtonState() {
    const generateButton = document.getElementById("generate-array-button");
    if (!generateButton) return;
    
    const hasActions = this.savedRegressiveActions && this.savedRegressiveActions.length > 0;
    
    if (hasActions) {
      generateButton.style.background = "#28a745";
      generateButton.style.borderColor = "#28a745";
      generateButton.style.cursor = "pointer";
      generateButton.disabled = false;
      generateButton.title = "Generar Array JSON con acciones guardadas";
    } else {
      generateButton.style.background = "#6c757d";
      generateButton.style.borderColor = "#6c757d";
      generateButton.style.cursor = "not-allowed";
      generateButton.disabled = true;
      generateButton.title = "No hay acciones guardadas para generar";
    }
  }

  // Nuevo método para generar el array JSON a partir de las acciones guardadas
  generateArrayFromSavedActions() {
    if (!this.savedRegressiveActions || this.savedRegressiveActions.length === 0) {
      alert('No hay acciones guardadas. Guarda al menos una acción antes de generar el array JSON.');
      return;
    }

    // ✅ NUEVO: Generar tanto el array simple como el formato completo del test
    const arrayJson = this.savedRegressiveActions.map(action => action.jsonData);
    const testDataGame = { testDataGame: arrayJson };
    
    const jsonTextarea = document.createElement("textarea");
    jsonTextarea.value = JSON.stringify(testDataGame, null, 2);
    jsonTextarea.style.cssText = `
      width: 100%;
      height: 400px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      background: white;
      resize: vertical;
    `;
    jsonTextarea.readOnly = true;

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    const modalContent = document.createElement("div");
    modalContent.className = "regressive-dialog";
    modalContent.style.cssText = `
      background: white;
      padding: 0;
      border-radius: 8px;
      width: 90%;
      max-width: 1000px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    `;

    const header = document.createElement("div");
    header.className = "regressive-dialog-header";
    header.innerHTML = `
      <h3><i class="fas fa-code"></i> Array JSON de Acciones Guardadas (${this.savedRegressiveActions.length})</h3>
      <button class="regressive-dialog-close" id="closeArrayJsonModal" title="Cerrar">&times;</button>
    `;

    const content = document.createElement("div");
    content.className = "regressive-dialog-content";

    // ✅ NUEVO: Información de resumen
    const summaryInfo = document.createElement("div");
    summaryInfo.style.cssText = `
      background: #e3f2fd;
      border: 1px solid #2196f3;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 15px;
    `;
    
    const summaryTitle = document.createElement("h4");
    summaryTitle.textContent = "Resumen de Acciones Guardadas:";
    summaryTitle.style.cssText = `margin: 0 0 10px 0; color: #1976d2;`;
    summaryInfo.appendChild(summaryTitle);
    
    const actionsList = document.createElement("ul");
    actionsList.style.cssText = `margin: 0; padding-left: 20px;`;
    
    this.savedRegressiveActions.forEach((action, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${index + 1}. ${action.screenName} - ${action.actionName}`;
      listItem.style.cssText = `margin-bottom: 5px; color: #333;`;
      actionsList.appendChild(listItem);
    });
    
    summaryInfo.appendChild(actionsList);
    content.appendChild(summaryInfo);

    const jsonContainer = document.createElement("div");
    jsonContainer.style.cssText = `
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 15px;
    `;

    // ✅ NUEVO: Selector de formato
    const formatSelector = document.createElement("div");
    formatSelector.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    `;
    
    const formatLabel = document.createElement("label");
    formatLabel.textContent = "Formato:";
    formatLabel.style.cssText = `font-weight: 600; color: #333;`;
    formatSelector.appendChild(formatLabel);
    
    const formatSelect = document.createElement("select");
    formatSelect.id = "json-format-selector";
    formatSelect.style.cssText = `
      padding: 5px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    `;
    
    const option1 = document.createElement("option");
    option1.value = "complete";
    option1.textContent = "Formato completo (testDataGame)";
    formatSelect.appendChild(option1);
    
    const option2 = document.createElement("option");
    option2.value = "simple";
    option2.textContent = "Array simple";
    formatSelect.appendChild(option2);
    
    formatSelect.onchange = () => {
      const format = formatSelect.value;
      if (format === "complete") {
        jsonTextarea.value = JSON.stringify(testDataGame, null, 2);
      } else {
        jsonTextarea.value = JSON.stringify(arrayJson, null, 2);
      }
    };
    
    formatSelector.appendChild(formatSelect);
    jsonContainer.appendChild(formatSelector);

    const jsonLabel = document.createElement("label");
    jsonLabel.textContent = "JSON de Acciones Guardadas:";
    jsonLabel.style.cssText = `display: block; margin-bottom: 10px; font-weight: 600; color: #333;`;

    jsonContainer.appendChild(jsonLabel);
    jsonContainer.appendChild(jsonTextarea);

    // ✅ NUEVO: Botones de acción
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.cssText = `display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;`;

    const copyButton = document.createElement("button");
    copyButton.textContent = "Copiar JSON";
    copyButton.style.cssText = `padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;`;
    copyButton.onclick = () => {
      navigator.clipboard.writeText(jsonTextarea.value).then(() => {
        copyButton.textContent = "¡Copiado!";
        setTimeout(() => { copyButton.textContent = "Copiar JSON"; }, 2000);
      });
    };

    const closeButton = document.createElement("button");
    closeButton.textContent = "Cerrar";
    closeButton.style.cssText = `padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;`;
    closeButton.onclick = () => document.body.removeChild(modal);

    buttonsContainer.appendChild(copyButton);
    buttonsContainer.appendChild(closeButton);

    jsonContainer.appendChild(buttonsContainer);
    content.appendChild(jsonContainer);

    modalContent.appendChild(header);
    modalContent.appendChild(content);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    document.getElementById("closeArrayJsonModal").onclick = () => document.body.removeChild(modal);
  }

  // ✅ NUEVO: Método para ejecutar desde la consola del navegador
  debugForceUpdate() {
    console.log("🔧 Ejecutando actualización forzada del panel...");
    console.log("Acciones guardadas:", this.savedRegressiveActions);
    console.log("Panel existente:", document.getElementById("regressive-saved-actions-panel"));
    
    this.forceRecreatePanel();
    
    // Exponer el método globalmente para acceso desde consola
    window.forceUpdateRegressivePanel = () => this.forceRecreatePanel();
    window.generateRegressiveArray = () => this.generateArrayFromSavedActions();
    
    console.log("✅ Métodos expuestos globalmente:");
    console.log("- forceUpdateRegressivePanel() - Para actualizar el panel");
    console.log("- generateRegressiveArray() - Para generar el array JSON");
  }
} 