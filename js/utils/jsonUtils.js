// Utilidades para manejo de JSON (buscar, copiar, editar, vista previa)
export class JsonUtils {
  constructor(app) {
    this.app = app
  }

  getTestDataTemplate() {
    return {
      desktopMode: {
        pageElementName: "sp-action-menu#dashboardprocedures",
        screenShotsName: "window open procedure",
        label: "",
        view: "",
        viewScreenShotLabel: "",
        screenShotName: "",
      },
      mobileMode: {
        pageElementName: "md-list-item#dashboardmyprocedures",
        clickMenu: "md-filled-icon-button.menu",
        screenShotsName: "window open procedure",
        label: "",
        viewScreenShotLabel: "",
        screenShotName: "",
      },
      tabletRetratoMode: {
        pageElementName: "sp-action-menu#dashboardprocedures",
        screenShotsName: "window open procedure",
        label: "",
        view: "",
        viewScreenShotLabel: "",
        screenShotName: "",
      },
      phraseError: "Verify no console errors",
      phraseNetworkInterceptionAndLogger: "Attach Logger and NetworkInterceptor to the page",
      phraseVerifyNetwork: "Verify network responses",
      selectName: "",
      phraseSelect: "Select Element",
      buttonName: "",
      screenShotsSelect: "Select Name",
      textInNotif1: "",
      textInNotif2: "",
      textInNotif3: "",
      phrasePauses: "Execution Pauses",
      phraseScreenShots: "Attach ScreenShots",
      screenShotsElement: "Select Element",
      screenShotsButtonName: "Click on Button",
      positionButton: "0",
      positionSelectElement: "0",
      arrowDirection: "down",
      positionArrow: 0,
      screenShotsArrow: "Click on the arrow to order",
    }
  }

  createPreviewContainer() {
    const testPreview = document.createElement("div")
    testPreview.className = "test-preview"
    testPreview.innerHTML = `
            <div class="preview-controls">
                <button class="copy-btn" id="copyJsonBtn">
                    <i class="fas fa-copy"></i> Copiar JSON
                </button>
                <button class="search-btn" id="searchBtn">
                    <i class="fas fa-search"></i> Buscar
                </button>
                <button class="edit-json-btn" id="editJsonBtn">
                    <i class="fas fa-edit"></i> Editar JSON
                </button>
            </div>
            <div class="search-container" id="searchContainer">
                <input type="text" id="searchInput" placeholder="Buscar en JSON...">
                <button id="clearSearchBtn">Limpiar</button>
            </div>
            <h4 style="margin-top: 0;"><i class="fas fa-eye"></i> Vista Previa JSON</h4>
            <pre class="preview-json" id="testPreview"></pre>
        `
    return testPreview
  }

  setupPreviewControls() {
      const copyBtn = document.getElementById("copyJsonBtn")
    const searchBtn = document.getElementById("searchBtn")
    const editBtn = document.getElementById("editJsonBtn")
    const searchContainer = document.getElementById("searchContainer")
    const searchInput = document.getElementById("searchInput")
    const clearSearchBtn = document.getElementById("clearSearchBtn")
    const preview = document.getElementById("testPreview")

    let editorActive = false
    let editableJson = null
    let overlay = null

    // Copiar JSON (funciona en ambos modos)
    copyBtn.addEventListener("click", () => {
      if (editorActive && editableJson) {
        navigator.clipboard.writeText(editableJson.value).then(() => {
          const originalHtml = copyBtn.innerHTML
          copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!'
          setTimeout(() => {
            copyBtn.innerHTML = originalHtml
          }, 2000)
        })
      } else {
        const jsonContent = preview.textContent
        navigator.clipboard.writeText(jsonContent).then(() => {
          const originalHtml = copyBtn.innerHTML
          copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!'
          setTimeout(() => {
            copyBtn.innerHTML = originalHtml
          }, 2000)
        })
      }
    })

    // Buscar JSON (funciona en ambos modos)
    searchBtn.addEventListener("click", () => {
      searchContainer.classList.toggle("active")
      if (searchContainer.classList.contains("active")) {
        searchInput.focus()
      } else {
        if (editorActive && editableJson) {
          this.clearHighlightsEditor(editableJson, overlay)
        } else {
          this.clearHighlights()
        }
      }
    })
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.trim()
      if (searchTerm) {
        if (editorActive && editableJson) {
          this.highlightTextEditor(searchTerm, editableJson, overlay)
        } else {
          this.highlightText(searchTerm)
        }
      } else {
        if (editorActive && editableJson) {
          this.clearHighlightsEditor(editableJson, overlay)
        } else {
          this.clearHighlights()
        }
      }
    })
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = ""
      if (editorActive && editableJson) {
        this.clearHighlightsEditor(editableJson, overlay)
      } else {
        this.clearHighlights()
      }
    })

    // Editar JSON
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        this.showJsonEditor({
          onOpen: (ta, ov) => {
            editorActive = true
            editableJson = ta
            overlay = ov
          },
          onClose: () => {
            editorActive = false
            editableJson = null
            overlay = null
            this.clearHighlights()
          },
          searchValue: searchInput.value
        })
      })
    }
  }

  highlightText(searchTerm) {
    this.clearHighlights()
    const preview = document.getElementById("testPreview")
    const text = preview.textContent
    const regex = new RegExp(searchTerm, "gi")

    preview.innerHTML = text.replace(regex, (match) => `<span class="highlight">${match}</span>`)
  }

  clearHighlights() {
    const preview = document.getElementById("testPreview")
    const text = preview.textContent
    preview.innerHTML = text
  }

  highlightJsonPath(jsonPath) {
    // Limpiar resaltado anterior
    if (this.app.getLastHighlightedField()) {
      const elements = document.querySelectorAll(`.json-highlight-${this.app.getLastHighlightedField()}`)
      elements.forEach((el) => {
        el.classList.remove("json-highlight")
        el.classList.remove(`json-highlight-${this.app.getLastHighlightedField()}`)
      })
    }

    // Almacenar campo actual para limpiar después
    const lastHighlightedField = jsonPath.replace(/\./g, "-")
    this.app.setLastHighlightedField(lastHighlightedField)

    // Encontrar y resaltar todas las rutas coincidentes en el JSON
    const preview = document.getElementById("testPreview")
    if (!preview || !preview.textContent) return

    try {
      const jsonData = JSON.parse(preview.textContent)
      const testData = JSON.parse(jsonData.testDataGame)

      // Función para obtener el valor en la ruta especificada
      function getValueByPath(obj, path) {
        return path.split(".").reduce((o, p) => o && o[p], obj)
      }

      const value = getValueByPath(testData, jsonPath)
      if (value === undefined) return

      // Crear una regex para encontrar el valor en la cadena JSON
      let searchValue
      if (typeof value === "object") {
        searchValue = JSON.stringify(value)
      } else {
        searchValue = `"${jsonPath.split(".").pop()}": ${JSON.stringify(value)}`
      }

      // Resaltar el texto coincidente
      const regex = new RegExp(this.escapeRegExp(searchValue), "g")
      preview.innerHTML = preview.textContent.replace(
        regex,
        (match) => `<span class="json-highlight json-highlight-${lastHighlightedField}">${match}</span>`,
      )
    } catch (e) {
      console.error("Error highlighting JSON path:", e)
    }
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  showJsonEditor({onOpen, onClose, searchValue} = {}) {
    const preview = document.getElementById("testPreview")
    // Crear el contenedor del editor fuera del <pre>
    const parent = preview.parentNode;
    const jsonEditorContainer = document.createElement("div")
    jsonEditorContainer.className = "json-editor-container"
    jsonEditorContainer.style.position = 'relative'
    jsonEditorContainer.style.marginTop = '24px'
    // Obtener el objeto real para mostrarlo bonito
    let jsonObj = this.app.getOriginalTestData();
    if (typeof jsonObj === 'string') {
      try { jsonObj = JSON.parse(jsonObj); } catch(e) {}
    }
    const jsonText = JSON.stringify(jsonObj, null, 2);
    jsonEditorContainer.innerHTML = `
            <h4 class="json-editor-title"><i class="fas fa-edit"></i> Editor JSON</h4>
            <div class="json-editor-area" style="position:relative;">
              <textarea id="editableJson">${jsonText}</textarea>
              <div class="json-actions">
                  <button id="cancelJsonEdit"><i class="fas fa-times"></i> Cancelar</button>
                  <button id="saveJsonChanges" class="primary"><i class="fas fa-save"></i> Guardar Cambios</button>
              </div>
            </div>
        `
    // Insertar el editor después del bloque de vista previa, no dentro
    parent.insertBefore(jsonEditorContainer, preview.nextSibling)
    preview.style.display = "none"
    const editableJson = jsonEditorContainer.querySelector("#editableJson")
    // Overlay para resaltado
    const overlay = document.createElement('div')
    overlay.className = 'json-editor-overlay-highlight'
    jsonEditorContainer.querySelector('.json-editor-area').insertBefore(overlay, editableJson)
    // Mostrar el texto inicial en el overlay
    overlay.innerHTML = this.escapeHtml(editableJson.value)
    overlay.style.display = 'block'
    // Sincronizar tamaño y scroll
    function syncOverlay() {
      overlay.style.width = editableJson.offsetWidth + 'px';
      overlay.style.height = editableJson.offsetHeight + 'px';
      overlay.scrollTop = editableJson.scrollTop;
      overlay.scrollLeft = editableJson.scrollLeft;
    }
    editableJson.addEventListener('scroll', syncOverlay)
    editableJson.addEventListener('input', () => {
      const searchInput = document.getElementById('searchInput')
      const searchTerm = searchInput && searchInput.value.trim()
      if (searchTerm) {
        this.highlightTextEditor(searchTerm, editableJson, overlay)
      } else {
        overlay.innerHTML = this.escapeHtml(editableJson.value)
      }
      syncOverlay()
    })
    // Sincronizar overlay al redimensionar el textarea
    editableJson.addEventListener('mouseup', syncOverlay)
    window.addEventListener('resize', syncOverlay)
    setTimeout(syncOverlay, 100)
    // Lógica de cerrar/cancelar
    jsonEditorContainer.querySelector("#cancelJsonEdit").addEventListener("click", () => {
      jsonEditorContainer.remove()
      preview.style.display = "block"
      if (onClose) onClose()
    })
    jsonEditorContainer.querySelector("#saveJsonChanges").addEventListener("click", () => {
      try {
        const editedJson = editableJson.value
        const parsedJson = JSON.parse(editedJson)
        this.app.setOriginalTestData(parsedJson)
        const previewData = parsedJson
        preview.textContent = JSON.stringify(previewData, null, 2)
        jsonEditorContainer.remove()
        preview.style.display = "block"
        if (onClose) onClose()
      } catch (e) {
        alert("Error en el JSON: " + e.message)
      }
    })
    // Si había búsqueda activa, resaltar
    if (searchValue) {
      this.highlightTextEditor(searchValue, editableJson, overlay)
      overlay.style.display = 'block'
    }
    if (onOpen) onOpen(editableJson, overlay)
  }

  highlightTextEditor(searchTerm, textarea, overlay) {
    const value = textarea.value
    const regex = new RegExp(searchTerm, "gi")
    const highlighted = value.replace(regex, (match) => `<span class='highlight'>${match}</span>`)
    overlay.innerHTML = highlighted
    overlay.style.display = 'block'
  }

  clearHighlightsEditor(textarea, overlay) {
    if (overlay) {
      overlay.innerHTML = this.escapeHtml(textarea.value)
      overlay.style.display = 'block'
    }
  }

  escapeHtml(text) {
    return text.replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
}