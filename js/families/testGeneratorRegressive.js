// testGeneratorRegressive.js (versión final con guardado de acciones)
import { BaseTestGenerator } from "../baseTestGenerator.js";

export class TestGeneratorRegressive extends BaseTestGenerator {
  constructor(app) {
    super(app);
    this.regressiveModelJsons = [];
    this.savedRegressiveActions = [];
  }

  /* ---------- 1. Diálogo inicial ---------- */
  showRegressiveDialog() {
    const html = `
      <div class="modal-overlay">
        <div class="regressive-dialog">
          <div class="regressive-dialog-header">
            <h3>Configurar Test Regresivo</h3>
            <button class="regressive-dialog-close" id="closeRegressiveDialog" title="Cerrar">&times;</button>
          </div>
          <div class="regressive-dialog-content">
            <label for="numScreens">Número de pantallas:</label>
            <input type="number" id="numScreens" min="1" max="10" value="1" />
            <div class="regressive-dialog-buttons">
              <button id="cancelRegressive" class="regressive-cancel-btn">Cancelar</button>
              <button id="continueRegressive" class="regressive-continue-btn">Continuar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    const dialog = document.createElement("div");
    dialog.innerHTML = html;
    document.body.appendChild(dialog);
    document.getElementById("closeRegressiveDialog").onclick = () => document.body.removeChild(dialog);
    document.getElementById("cancelRegressive").onclick = () => document.body.removeChild(dialog);
    document.getElementById("continueRegressive").onclick = () => {
      const num = parseInt(document.getElementById("numScreens").value);
      document.body.removeChild(dialog);
      this.showJsonEditors(num);
    };
  }

  /* ---------- 2. Pegar JSONs ---------- */
  showJsonEditors(num) {
    const container = document.createElement("div");
    container.className = "modal-overlay";
    let html = `
      <div class="regressive-editors">
        <div class="regressive-dialog-header">
          <h3><i class="fas fa-code"></i> Pegar JSONs</h3>
          <button class="regressive-dialog-close" id="closeJsonEditors" title="Cerrar">&times;</button>
        </div>
        <div class="regressive-dialog-content">
          <p style="margin-bottom: 15px; color: #666;">Pega el JSON de cada pantalla en los campos correspondientes:</p>
    `;
    for (let i = 0; i < num; i++) {
      html += `
        <div class="json-editor-group">
          <label for="json-editor-${i}">JSON Pantalla ${i + 1}:</label>
          <textarea id="json-editor-${i}" class="json-editor" placeholder='Aquí pegar el JSON de la pantalla'></textarea>
        </div>
      `;
    }
    html += `
          <div class="regressive-dialog-buttons">
            <button id="cancelJsonEditors" class="regressive-cancel-btn">Cancelar</button>
            <button id="loadJsons" class="regressive-continue-btn">
              <i class="fas fa-upload"></i> Cargar JSONs
            </button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML = html;
    document.body.appendChild(container);
    document.getElementById("closeJsonEditors").onclick = () => document.body.removeChild(container);
    document.getElementById("cancelJsonEditors").onclick = () => document.body.removeChild(container);
    document.getElementById("loadJsons").onclick = () => {
      const areas = container.querySelectorAll(".json-editor");
      const parsed = [];
      let error = false;
      areas.forEach((area, idx) => {
        if (!area.value.trim()) {
          alert(`El campo JSON pantalla ${idx + 1} está vacío`);
          error = true;
          return;
        }
        try {
          const obj = JSON.parse(area.value);
          if (!obj.component) throw new Error("Falta la propiedad 'component'");
          parsed.push(obj);
        } catch (e) {
          alert(`Error en pantalla ${idx + 1}: ${e.message}`);
          error = true;
        }
      });
      if (!error) {
        this.regressiveModelJsons = parsed;
        document.body.removeChild(container);
        this.showSimpleActionSelector();
      }
    };
  }

  /* ---------- 3. Selector de acciones con botón guardar ---------- */
  showSimpleActionSelector() {
    const wrapper = document.createElement("div");
    wrapper.className = "modal-overlay";
    let html = `<div class="regressive-selector"><h3>Seleccionar y Guardar Acciones</h3>`;

    this.regressiveModelJsons.forEach((modelJson, idx) => {
      let actions = [];
      let row_buttons = [];

      if (modelJson.component === 'Tabs' || modelJson.component === 'ObjectByTabs') {
        modelJson.tabs.forEach((tab, tabIdx) => {
          if (tab.view_definition) {
            const tabActions = this.findAllActionsSeparately(tab.view_definition);
            actions = actions.concat(tabActions.actions.map(a => ({ ...a, tabIdx })));
            row_buttons = row_buttons.concat(tabActions.row_buttons.map(a => ({ ...a, tabIdx })));
          }
        });
      } else {
        const result = this.findAllActionsSeparately(modelJson.view_definition);
        actions = result.actions;
        row_buttons = result.row_buttons;
      }

      html += `<div><b>Pantalla ${idx + 1} (${modelJson.component})</b><br/>`;

      if (actions.length) {
        html += `<p><u>Actions:</u><br/>`;
        actions.forEach((action, aIdx) => {
          html += `<label>
            <input type="checkbox" data-model="${idx}" data-origin="actions" data-action="${aIdx}">
            ${action.actionName}
          </label>
          <button class="save-action-btn" data-model="${idx}" data-origin="actions" data-action="${aIdx}">Guardar</button><br/>`;
        });
        html += `</p>`;
      }

      if (row_buttons.length) {
        html += `<p><u>Row Buttons:</u><br/>`;
        row_buttons.forEach((action, aIdx) => {
          html += `<label>
            <input type="checkbox" data-model="${idx}" data-origin="row_buttons" data-action="${aIdx}">
            ${action.actionName}
          </label>
          <button class="save-action-btn" data-model="${idx}" data-origin="row_buttons" data-action="${aIdx}">Guardar</button><br/>`;
        });
        html += `</p>`;
      }

      html += `</div><hr/>`;
    });

    html += `
      <button id="generateForms">Generar Formularios</button>
      <button id="generateRegressiveTestBtn" style="margin-left:10px;background:#dc3545;color:white;">Generar Test Regresivo</button>
    </div>`;
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);

    // Botón guardar acción
    wrapper.querySelectorAll(".save-action-btn").forEach(btn => {
      btn.onclick = () => {
        const modelIdx = parseInt(btn.dataset.model);
        const actionIdx = parseInt(btn.dataset.action);
        const origin = btn.dataset.origin;
        const modelJson = this.regressiveModelJsons[modelIdx];

        let actionsObj;
        if (modelJson.component === 'Tabs' || modelJson.component === 'ObjectByTabs') {
          let allActions = { actions: [], row_buttons: [] };
          modelJson.tabs.forEach((tab, tabIdx) => {
            if (tab.view_definition) {
              const tabActions = this.findAllActionsSeparately(tab.view_definition);
              allActions.actions = allActions.actions.concat(tabActions.actions.map(a => ({ ...a, tabIdx })));
              allActions.row_buttons = allActions.row_buttons.concat(tabActions.row_buttons.map(a => ({ ...a, tabIdx })));
            }
          });
          actionsObj = allActions;
        } else {
          actionsObj = this.findAllActionsSeparately(modelJson.view_definition);
        }

        const action = actionsObj[origin][actionIdx];
        if (!action) return;

        const jsonData = {
          screenName: `Pantalla ${modelIdx + 1}`,
          actionName: action.actionName,
          actionType: origin,
          actionData: action
        };

        this.savedRegressiveActions.push({
          screenName: `Pantalla ${modelIdx + 1}`,
          screenIndex: modelIdx,
          actionName: action.actionName,
          jsonData
        });

        this.updateSavedActionsList();
      };
    });

    // Botón generar formularios
    wrapper.querySelector("#generateForms").onclick = () => {
      const selected = [];
      wrapper.querySelectorAll("input[type='checkbox']:checked").forEach(cb => {
        const modelIdx = parseInt(cb.dataset.model);
        const actionIdx = parseInt(cb.dataset.action);
        const origin = cb.dataset.origin;
        const modelJson = this.regressiveModelJsons[modelIdx];

        let actionsObj;
        if (modelJson.component === 'Tabs' || modelJson.component === 'ObjectByTabs') {
          let allActions = { actions: [], row_buttons: [] };
          modelJson.tabs.forEach((tab, tabIdx) => {
            if (tab.view_definition) {
              const tabActions = this.findAllActionsSeparately(tab.view_definition);
              allActions.actions = allActions.actions.concat(tabActions.actions.map(a => ({ ...a, tabIdx })));
              allActions.row_buttons = allActions.row_buttons.concat(tabActions.row_buttons.map(a => ({ ...a, tabIdx })));
            }
          });
          actionsObj = allActions;
        } else {
          actionsObj = this.findAllActionsSeparately(modelJson.view_definition);
        }

        const action = actionsObj[origin][actionIdx];
        if (action) selected.push({ modelIdx, action });
      });

      const groupedByScreen = {};
      selected.forEach(({ modelIdx, action }) => {
        if (!groupedByScreen[modelIdx]) groupedByScreen[modelIdx] = [];
        groupedByScreen[modelIdx].push(action);
      });

      const regressiveScreens = [];
      for (const modelIdx in groupedByScreen) {
        const selectedActions = groupedByScreen[modelIdx];
        const originalModelJson = this.regressiveModelJsons[modelIdx];
        const modelJson = {
          component: originalModelJson.component,
          view_definition: [
            {},
            {
              actions: selectedActions.filter(a => a.origin === "actions"),
              row_buttons: selectedActions.filter(a => a.origin === "row_buttons")
            }
          ]
        };
        regressiveScreens.push({
          modelJson,
          screenName: `Pantalla ${parseInt(modelIdx) + 1}`,
          screenIndex: parseInt(modelIdx)
        });
      }

      (async () => {
        await this.clearRegressiveFile();
        for (const screen of regressiveScreens) {
          await this.saveRegressiveScreenToFile(screen.modelJson);
        }

        if (regressiveScreens.length > 1) {
          this.showRegressiveNavigation(regressiveScreens);
        } else {
          const screen = regressiveScreens[0];
          this.app.modelJson = screen.modelJson;
          this.app.sidebarManager.renderMainConfig(screen.modelJson);
          this.app.sidebarManager.renderActionsList(screen.modelJson);
          this.app.sidebarManager.renderRowButtonsList(screen.modelJson);
          this.createSavedActionsPanel();
        }
      })();

      document.body.removeChild(wrapper);
    };

    // Botón generar test regresivo
    wrapper.querySelector("#generateRegressiveTestBtn").onclick = () => {
      this.generateRegressiveTest();
    };
  }

  /* ---------- 4. Vista previa con JSON real ---------- */
  generateRegressiveTest() {
    if (this.savedRegressiveActions.length === 0) {
      alert('No hay acciones guardadas. Guarda al menos una acción antes de generar el test regresivo.');
      return;
    }

    const testArray = this.savedRegressiveActions.map(a => a.jsonData);
    const finalJson = { testDataGame: testArray };
    this.showRegressiveTestResult(finalJson);
  }

  showRegressiveTestResult(finalJson) {
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
      <h3><i class="fas fa-code"></i> Test Regresivo Generado</h3>
      <button class="regressive-dialog-close" id="closeRegressiveResult" title="Cerrar">&times;</button>
    `;

    const content = document.createElement("div");
    content.className = "regressive-dialog-content";

    const jsonContainer = document.createElement("div");
    jsonContainer.style.cssText = `
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 15px;
    `;

    const jsonLabel = document.createElement("label");
    jsonLabel.textContent = "JSON Final del Test Regresivo:";
    jsonLabel.style.cssText = `display: block; margin-bottom: 10px; font-weight: 600; color: #333;`;

    const jsonTextarea = document.createElement("textarea");
    jsonTextarea.value = JSON.stringify(finalJson, null, 2);
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

    jsonContainer.appendChild(jsonLabel);
    jsonContainer.appendChild(jsonTextarea);
    content.appendChild(jsonContainer);
    content.appendChild(buttonsContainer);

    modalContent.appendChild(header);
    modalContent.appendChild(content);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    document.getElementById("closeRegressiveResult").onclick = () => document.body.removeChild(modal);
  }

  /* ---------- 5. Panel de acciones guardadas ---------- */
  createSavedActionsPanel() {
    const sidebar = document.getElementById("sidebar-container");
    if (!sidebar) return;
    const existingPanel = document.getElementById("regressive-saved-actions-panel");
    if (existingPanel) sidebar.removeChild(existingPanel);

    const panel = document.createElement("div");
    panel.id = "regressive-saved-actions-panel";
    panel.style.cssText = `
      background: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 15px;
      margin-bottom: 20px;
    `;

    const title = document.createElement("h3");
    title.textContent = "Acciones Guardadas";
    title.style.marginTop = "0";
    title.style.color = "#007bff";
    panel.appendChild(title);

    const listContainer = document.createElement("div");
    listContainer.id = "regressive-saved-actions-list";
    panel.appendChild(listContainer);
    sidebar.insertBefore(panel, sidebar.firstChild);
    this.updateSavedActionsList();
  }

  updateSavedActionsList() {
    const listContainer = document.getElementById("regressive-saved-actions-list");
    if (!listContainer) return;
    listContainer.innerHTML = "";
    if (this.savedRegressiveActions.length === 0) {
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
    this.savedRegressiveActions = this.savedRegressiveActions.filter(
      action => !(action.actionName === actionToRemove.actionName && action.screenIndex === actionToRemove.screenIndex)
    );
    this.updateSavedActionsList();
  }

  findAllActionsSeparately(obj) {
    let result = { actions: [], row_buttons: [] };
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        const res = this.findAllActionsSeparately(item);
        result.actions = result.actions.concat(res.actions);
        result.row_buttons = result.row_buttons.concat(res.row_buttons);
      });
    } else if (obj && typeof obj === "object") {
      if (Array.isArray(obj.actions)) {
        result.actions = result.actions.concat(obj.actions.map(a => ({ ...a, origin: 'actions' })));
      }
      if (Array.isArray(obj.row_buttons)) {
        result.row_buttons = result.row_buttons.concat(obj.row_buttons.map(a => ({ ...a, origin: 'row_buttons' })));
      }
      Object.values(obj).forEach(val => {
        const res = this.findAllActionsSeparately(val);
        result.actions = result.actions.concat(res.actions);
        result.row_buttons = result.row_buttons.concat(res.row_buttons);
      });
    }
    return result;
  }

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

  async saveRegressiveScreenToFile(modelJson) {
    try {
      const response = await fetch('http://localhost:3001/upload-regressive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelJson)
      });
      const result = await response.json();
      if (!result.ok) {
        console.error('❌ Error al guardar:', result.error);
      } else {
        console.log('✅ Pantalla guardada');
      }
    } catch (e) {
      console.error('❌ Error en fetch:', e.message);
    }
  }
}