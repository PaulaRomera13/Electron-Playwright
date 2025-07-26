// Generador de tests para acciones con diálogo
import { BaseTestGenerator } from "../baseTestGenerator.js"

export class TestGeneratorDialog extends BaseTestGenerator {
  constructor(app) {
    super(app)
  }

  createForm() {
    const form = document.createElement("div")
    form.className = "test-form"

    // --- Selector de idioma para Tabs ---
    let tabLangSelector = ''
    if (this.app.modelJson && this.app.modelJson.component === 'Tabs' && Array.isArray(this.app.modelJson.tabs)) {
      const tab = this.app.modelJson.tabs[0];
      const labelES = tab.tabLabel?.label_es || '';
      const labelEN = tab.tabLabel?.label_en || '';
      tabLangSelector = `
        <div class="form-group">
          <label>Label de la Tab:</label>
          <div class="tab-language-toggle">
            <label><input type="radio" name="tabLang" value="es"> <b>ES:</b> ${labelES}</label>
            <label><input type="radio" name="tabLang" value="en" checked> <b>EN:</b> ${labelEN}</label>
          </div>
        </div>
      `
    }

    let formHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> Configuración de Test para acción con diálogo
            </div>
            ${this.renderTabLangSelector(this.app.modelJson)}
            ${this.renderObjectByTabsExtras(this.app.modelJson)}

            <div class="form-group">
                <label for="processName">Proceso del menú a seleccionar:</label>
                <input type="text" id="processName" placeholder="Ej: Stock control" data-json-path="desktopMode.label" />
            </div>

            <div class="form-group">
                <label for="menuOption">Nombre de la Pestaña (Opción del Menú):</label>
                <input type="text" id="menuOption" placeholder="Ej: Deviations" data-json-path="desktopMode.screenShotName" />
            </div>

            <div class="form-group">
                <label for="buttonName">Nombre del Botón (ActionName):</label>
                <input type="text" id="buttonName" class="readonly-field" readonly />
            </div>

            <div class="form-group">
                <label for="selectName">Elemento a Seleccionar:</label>
                <input type="text" id="selectName" placeholder="Ej: HPLC" data-json-path="selectName" />
            </div>

            <div class="form-group">
                <label for="positionButton">Posición del Botón:</label>
                <input type="text" id="positionButton" value="0" data-json-path="positionButton" />
            </div>

            <div class="form-group">
                <label for="positionSelectElement">Posición del Elemento a Seleccionar:</label>
                <input type="text" id="positionSelectElement" value="0" data-json-path="positionSelectElement" />
            </div>

            <div class="form-group">
                <div class="checkbox-group">
                    <input type="checkbox" id="hideActionsButton" data-json-path="hideActionsButton" />
                    <label for="hideActionsButton">¿Ocultar botón de Acciones escondidas (...)?</label>  
                </div>
            </div>

            <div class="form-group" id="hideActionsButtonConfig" style="display: none;">
                <label for="hideActionsButtonLocator">Locator:</label>
                <input type="text" id="hideActionsButtonLocator" value="md-icon:has-text('more_horiz')" class="readonly-field" readonly data-json-path="hideActionsButton.locator" />
                
                <label for="hideActionsButtonPosition" style="margin-top: 10px;">Position:</label>
                <input type="text" id="hideActionsButtonPosition" value="0" data-json-path="hideActionsButton.position" />
            </div>

            <div class="form-group">
                <div class="checkbox-group">
                    <input type="checkbox" id="addArrowConfig" data-json-path="arrowDirection" />
                    <label for="addArrowConfig">¿Añadir configuración de flecha?</label>  
                </div>
            </div>

            <div class="form-group" id="arrowConfigContainer" style="display: none;">
                <label for="arrowDirection">Dirección de la flecha:</label>
                <select id="arrowDirection" class="form-control" data-json-path="arrowDirection">
                    <option value="down">Abajo</option>
                    <option value="up">Arriba</option>
                </select>
                
                <label for="positionArrow" style="margin-top: 10px;">Posición de la flecha:</label>
                <input type="text" id="positionArrow" value="0" data-json-path="positionArrow" />
            </div>

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

    const selectedAction = this.app.getSelectedAction()
    if (selectedAction && selectedAction.dialogInfo && selectedAction.dialogInfo.fields) {
      formHTML += `
                <div class="form-section">
                    <h4><i class="fas fa-wpforms"></i> Campos del Diálogo</h4>
                    
                    <div class="bulk-field-controls">
                        <button type="button" class="bulk-btn enable-btn" id="enableAllFields">
                            <i class="fas fa-check-circle"></i> Activar Todos
                        </button>
                        <button type="button" class="bulk-btn disable-btn" id="disableAllFields">
                            <i class="fas fa-times-circle"></i> Desactivar Todos
                        </button>
                    </div>
            `

      selectedAction.dialogInfo.fields.forEach((fieldObj) => {
        const fieldKey = Object.keys(fieldObj)[0]
        const fieldConfig = fieldObj[fieldKey]

        formHTML += `
                    <div class="field-group" id="field-${fieldKey}">
                        <div class="field-header">
                            <span class="field-label">${fieldKey}</span>
                            <div class="field-toggle">
                                <input type="checkbox" id="enable-${fieldKey}" checked data-json-path="${fieldKey}" />
                                <label for="enable-${fieldKey}" class="toggle-label">Incluir en test</label>
                            </div>
                        </div>
                        
                        <div class="field-controls" id="controls-${fieldKey}">
                `

        // Solo mostrar toggle de idioma para campos que NO sean twoListsLinked
        if (!fieldKey.startsWith("twoListsLinked")) {
          formHTML += `
                            <div class="language-toggle">
                                <input type="radio" id="lang-en-${fieldKey}" name="lang-${fieldKey}" value="en" checked />
                                <label for="lang-en-${fieldKey}">EN: ${fieldConfig.label_en || "N/A"}</label>
                                
                                <input type="radio" id="lang-es-${fieldKey}" name="lang-${fieldKey}" value="es" />
                                <label for="lang-es-${fieldKey}">ES: ${fieldConfig.label_es || "N/A"}</label>
                            </div>
                    `
        }

        if (fieldKey.startsWith("text") || fieldKey.startsWith("number")) {
          formHTML += `<input type="text" class="field-value" id="value-${fieldKey}" placeholder="Valor del campo" data-json-path="${fieldKey}.value" />`
        } else if (fieldKey.startsWith("list") || fieldKey.startsWith("select")) {
          if (fieldConfig.items && fieldConfig.items.length > 0) {
            formHTML += `<select class="field-value" id="option-${fieldKey}" data-json-path="${fieldKey}.option">`
            fieldConfig.items.forEach((item) => {
              formHTML += `<option value="${item.keyName}">${item.keyValue_en}</option>`
            })
            formHTML += `</select>`
          } else {
            formHTML += `<input type="text" class="field-value" id="option-${fieldKey}" placeholder="Opción seleccionada" data-json-path="${fieldKey}.option" />`
          }
        } else if (fieldKey.startsWith("date")) {
          formHTML += `<input type="date" class="field-value" id="date-${fieldKey}" value="2024-01-01" data-json-path="${fieldKey}.date" />`
        } else if (fieldKey.startsWith("datetime")) {
          formHTML += `<input type="datetime-local" class="field-value" id="datetime-${fieldKey}" value="2024-01-01T12:00" data-json-path="${fieldKey}.datetime" />`
        } else if (fieldKey.startsWith("checkbox")) {
          formHTML += `
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" class="field-value" id="boolean-${fieldKey}" data-json-path="${fieldKey}.boolean" />
                            Valor booleano
                        </label>
                    `
        } else if (fieldKey.startsWith("multilist")) {
          formHTML += `<input type="text" class="field-value" id="options-${fieldKey}" placeholder="Opciones separadas por coma" data-json-path="${fieldKey}.options" />`
        } else if (fieldKey.startsWith("tree")) {
          formHTML += `
                        <input type="text" class="field-value" id="option-${fieldKey}" placeholder="Opción seleccionada" style="margin-bottom: 8px;" data-json-path="${fieldKey}.option" />
                        <input type="text" class="field-value" id="position-${fieldKey}" placeholder="Posición" value="0" data-json-path="${fieldKey}.position" />
                    `
        } else if (fieldKey.startsWith("input")) {
          formHTML += `
                        <input type="text" class="field-value" id="placeholder-${fieldKey}" placeholder="Placeholder" style="margin-bottom: 8px;" data-json-path="${fieldKey}.placeholder" />
                        <input type="text" class="field-value" id="value-${fieldKey}" placeholder="Valor" data-json-path="${fieldKey}.value" />
                    `
        } else if (fieldKey.startsWith("twoListsLinked")) {
          // Detectar dinámicamente todas las listas vinculadas
          const linkedLists = this.getLinkedListsFromConfig(fieldConfig)

          formHTML += `<div class="multiple-lists-container">`

          // Crear controles para cada lista vinculada
          linkedLists.forEach((listInfo, index) => {
            const listNumber = index + 1
            const listKey = listInfo.key // listLinked1, listLinked2, etc.

            formHTML += `
              <div class="linked-list-group">
                <label class="linked-list-label">${listKey}: ${listInfo.config?.label_en || listKey}</label>
                
                <!-- Toggle de idioma individual para cada lista vinculada -->
                <div class="language-toggle linked-list-language">
                  <input type="radio" id="lang-en-${listKey}" name="lang-${listKey}" value="en" checked />
                  <label for="lang-en-${listKey}">EN: ${listInfo.config?.label_en || "N/A"}</label>
                  
                  <input type="radio" id="lang-es-${listKey}" name="lang-${listKey}" value="es" />
                  <label for="lang-es-${listKey}">ES: ${listInfo.config?.label_es || "N/A"}</label>
                </div>
                
                <!-- Select o Input según si hay items definidos -->
            `

            // Verificar si esta lista tiene items definidos
            if (listInfo.config?.items && listInfo.config.items.length > 0) {
              // Crear select con opciones - solo el primero habilitado para dependencias
              formHTML += `
                <select class="field-value linked-list-select" id="list${listNumber}-${fieldKey}" data-list-number="${listNumber}" data-json-path="${fieldKey}.list${listNumber}.option" ${index > 0 ? "disabled" : ""}>
                  <option value="">Seleccionar...</option>
                </select>
              `
            } else {
              // Crear input de texto - siempre habilitado (sin dependencias)
              formHTML += `
                <input type="text" class="field-value linked-list-input" id="list${listNumber}-${fieldKey}" data-list-number="${listNumber}" data-json-path="${fieldKey}.list${listNumber}.option" placeholder="Escribir opción..." />
              `
            }

            formHTML += `
              </div>
            `
          })

          formHTML += `</div>`
        }

        formHTML += `
                        </div>
                    </div>
                `
      })

      formHTML += `</div>`
    }

    form.innerHTML = formHTML
    return form
  }

  /**
   * Extrae y ordena todas las listas vinculadas de la configuración del campo
   * @param {Object} fieldConfig - Configuración del campo twoListsLinked
   * @returns {Array} Array de objetos con información de cada lista
   */
  getLinkedListsFromConfig(fieldConfig) {
    const linkedLists = []

    // Buscar todas las propiedades que empiecen con "listLinked"
    Object.keys(fieldConfig).forEach((key) => {
      if (key.startsWith("listLinked")) {
        // Extraer el número de la lista (listLinked1 -> 1, listLinked2 -> 2, etc.)
        const match = key.match(/listLinked(\d+)/)
        if (match) {
          const listNumber = Number.parseInt(match[1])
          linkedLists.push({
            key: key,
            number: listNumber,
            config: fieldConfig[key],
          })
        }
      }
    })

    // Ordenar por número de lista
    linkedLists.sort((a, b) => a.number - b.number)

    return linkedLists
  }

  setupListeners() {
    const inputs = document.querySelectorAll(".test-form input, .test-form select, .test-form textarea")
    const checkbox = document.getElementById("hideActionsButton")
    const hideConfig = document.getElementById("hideActionsButtonConfig")
    const arrowCheckbox = document.getElementById("addArrowConfig")
    const arrowConfigContainer = document.getElementById("arrowConfigContainer")
    const preview = document.getElementById("testPreview")

    const selectedAction = this.app.getSelectedAction()
    if (selectedAction) {
      document.getElementById("buttonName").value = selectedAction.actionName
    }

    const enableAllBtn = document.getElementById("enableAllFields")
    const disableAllBtn = document.getElementById("disableAllFields")

    if (enableAllBtn) {
      enableAllBtn.addEventListener("click", () => {
        document.querySelectorAll('[id^="enable-"]').forEach((checkbox) => {
          checkbox.checked = true
          this.toggleFieldState(checkbox)
        })
        this.updatePreview()
      })
    }

    if (disableAllBtn) {
      disableAllBtn.addEventListener("click", () => {
        document.querySelectorAll('[id^="enable-"]').forEach((checkbox) => {
          checkbox.checked = false
          this.toggleFieldState(checkbox)
        })
        this.updatePreview()
      })
    }

    document.querySelectorAll('[id^="enable-"]').forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        this.toggleFieldState(checkbox)
        this.updatePreview()
        this.app.jsonUtils.highlightJsonPath(checkbox.getAttribute("data-json-path"))
      })
    })

    if (checkbox) {
      checkbox.addEventListener("change", () => {
        hideConfig.style.display = checkbox.checked ? "block" : "none"
        this.updatePreview()
        this.app.jsonUtils.highlightJsonPath(checkbox.getAttribute("data-json-path"))
      })
    }

    if (arrowCheckbox) {
      arrowCheckbox.addEventListener("change", () => {
        arrowConfigContainer.style.display = arrowCheckbox.checked ? "block" : "none"
        this.updatePreview()
        this.app.jsonUtils.highlightJsonPath(arrowCheckbox.getAttribute("data-json-path"))
      })
    }

    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.updatePreview()
        if (input.hasAttribute("data-json-path")) {
          this.app.jsonUtils.highlightJsonPath(input.getAttribute("data-json-path"))
        }
      })
      input.addEventListener("change", () => {
        this.updatePreview()
        if (input.hasAttribute("data-json-path")) {
          this.app.jsonUtils.highlightJsonPath(input.getAttribute("data-json-path"))
        }
      })
    })

    // Configurar listas vinculadas dinámicamente
    this.setupDynamicLinkedListsListeners()

    // Control dinámico de visibilidad para ObjectByTabs (Seleccionar/Buscar)
    const radios = document.getElementsByName('objectByTabsSearchType');
    const selectGroup = document.getElementById('objectByTabsSelectGroup');
    const searchGroup = document.getElementById('objectByTabsSearchGroup');
    function updateSearchType() {
      if (!radios.length || !selectGroup || !searchGroup) return;
      const selected = Array.from(radios).find(r => r.checked)?.value || 'select';
      if (selected === 'select') {
        selectGroup.style.display = '';
        searchGroup.style.display = 'none';
      } else {
        selectGroup.style.display = 'none';
        searchGroup.style.display = '';
      }
      if (typeof _this !== 'undefined') _this.updatePreview();
    }
    const _this = this;
    radios.forEach(radio => radio.addEventListener('change', updateSearchType));
    setTimeout(updateSearchType, 0);

    this.updatePreview()
  }

  /**
   * Configura listeners para listas vinculadas de forma dinámica
   * Maneja cualquier número de listas (1, 2, 3, 4, 5, etc.) como inputs de texto
   */
  setupDynamicLinkedListsListeners() {
    const selectedAction = this.app.getSelectedAction()
    if (!selectedAction?.dialogInfo?.fields) return

    selectedAction.dialogInfo.fields.forEach((fieldObj) => {
      const fieldKey = Object.keys(fieldObj)[0]
      const fieldConfig = fieldObj[fieldKey]

      if (fieldKey.startsWith("twoListsLinked")) {
        const linkedLists = this.getLinkedListsFromConfig(fieldConfig)

        // Poblar la primera lista si tiene items
        if (linkedLists.length > 0) {
          const firstListElement = document.getElementById(`list1-${fieldKey}`)
          if (firstListElement && firstListElement.tagName === "SELECT") {
            this.populateLinkedList(firstListElement, linkedLists[0].config)
          }
        }

        // Configurar listeners para cada lista
        linkedLists.forEach((listInfo, index) => {
          const listNumber = index + 1
          const currentElement = document.getElementById(`list${listNumber}-${fieldKey}`)

          if (currentElement) {
            // Listener para cambios (tanto select como input)
            const eventType = currentElement.tagName === "SELECT" ? "change" : "input"

            currentElement.addEventListener(eventType, () => {
              const selectedValue = currentElement.value

              // Solo manejar dependencias si es un SELECT
              if (currentElement.tagName === "SELECT") {
                // Limpiar y deshabilitar todas las listas siguientes (solo selects)
                for (let i = index + 1; i < linkedLists.length; i++) {
                  const nextListNumber = i + 1
                  const nextElement = document.getElementById(`list${nextListNumber}-${fieldKey}`)
                  if (nextElement && nextElement.tagName === "SELECT") {
                    nextElement.innerHTML = '<option value="">Seleccionar...</option>'
                    nextElement.disabled = true
                  }
                  // Los inputs de texto no se tocan
                }

                // Si hay una selección y existe una lista siguiente que sea SELECT, poblarla
                if (selectedValue && index + 1 < linkedLists.length) {
                  const nextListNumber = index + 2
                  const nextElement = document.getElementById(`list${nextListNumber}-${fieldKey}`)
                  if (nextElement && nextElement.tagName === "SELECT") {
                    this.populateLinkedList(nextElement, linkedLists[index + 1].config, selectedValue)
                    nextElement.disabled = false
                  }
                }
              }
              // Los inputs de texto siempre actualizan la preview sin dependencias

              this.updatePreview()
            })

            // Para inputs de texto, también agregar listener de change
            if (currentElement.tagName === "INPUT") {
              currentElement.addEventListener("change", () => {
                this.updatePreview()
              })
            }
          }
        })
      }
    })
  }

  /**
   * Puebla una lista vinculada con opciones filtradas
   * @param {HTMLElement} selectElement - Elemento select a poblar
   * @param {Object} listConfig - Configuración de la lista
   * @param {string} parentValue - Valor padre para filtrar (opcional)
   */
  populateLinkedList(selectElement, listConfig, parentValue = null) {
    if (!listConfig?.items) return

    listConfig.items.forEach((item) => {
      // Si es la primera lista o no hay filtro, mostrar todos
      // Si hay filtro, mostrar solo los que coincidan con parentValue
      if (parentValue === null || item.parentValue === parentValue) {
        const option = document.createElement("option")
        option.value = item.keyName
        option.textContent = item.keyValue_en
        selectElement.appendChild(option)
      }
    })
  }

  toggleFieldState(checkbox) {
    const fieldKey = checkbox.id.replace("enable-", "")
    const fieldGroup = document.getElementById(`field-${fieldKey}`)
    const controls = document.getElementById(`controls-${fieldKey}`)

    if (checkbox.checked) {
      fieldGroup.classList.remove("field-disabled")
      controls.style.opacity = "1"
      controls.style.pointerEvents = "auto"
    } else {
      fieldGroup.classList.add("field-disabled")
      controls.style.opacity = "0.5"
      controls.style.pointerEvents = "none"
    }
  }

  updatePreview() {
    const checkbox = document.getElementById("hideActionsButton")
    const arrowCheckbox = document.getElementById("addArrowConfig")
    const preview = document.getElementById("testPreview")

    const formData = {
      processName: document.getElementById("processName") ? document.getElementById("processName").value : "",
      menuOption: document.getElementById("menuOption") ? document.getElementById("menuOption").value : "",
      selectName: document.getElementById("selectName") ? document.getElementById("selectName").value : "",
      positionButton: document.getElementById("positionButton") ? document.getElementById("positionButton").value : "0",
      positionSelectElement: document.getElementById("positionSelectElement") ? document.getElementById("positionSelectElement").value : "0",
      hideActionsButton: checkbox ? checkbox.checked : false,
      hideActionsButtonLocator: document.getElementById("hideActionsButtonLocator") ? document.getElementById("hideActionsButtonLocator").value : "",
      hideActionsButtonPosition: document.getElementById("hideActionsButtonPosition") ? document.getElementById("hideActionsButtonPosition").value : "0",
      addArrowConfig: arrowCheckbox ? arrowCheckbox.checked : false,
      arrowDirection: document.getElementById("arrowDirection") ? document.getElementById("arrowDirection").value : "down",
      positionArrow: document.getElementById("positionArrow") ? document.getElementById("positionArrow").value : "0",
      textInNotif1: document.getElementById("textInNotif1") ? document.getElementById("textInNotif1").value : "",
      textInNotif2: document.getElementById("textInNotif2") ? document.getElementById("textInNotif2").value : "",
      textInNotif3: document.getElementById("textInNotif3") ? document.getElementById("textInNotif3").value : "",
      fieldStates: {},
      fieldValues: {},
    }

    const selectedAction = this.app.getSelectedAction()
    if (selectedAction && selectedAction.dialogInfo && selectedAction.dialogInfo.fields) {
      selectedAction.dialogInfo.fields.forEach((fieldObj) => {
        const fieldKey = Object.keys(fieldObj)[0]
        const fieldConfig = fieldObj[fieldKey]
        const enableCheckbox = document.getElementById(`enable-${fieldKey}`)

        if (enableCheckbox) {
          formData.fieldStates[fieldKey] = enableCheckbox.checked

          if (enableCheckbox.checked) {
            const langRadio = document.querySelector(`input[name="lang-${fieldKey}"]:checked`)
            const selectedLang = langRadio ? langRadio.value : "en"
            const label = selectedLang === "en" ? fieldConfig.label_en : fieldConfig.label_es

            formData.fieldValues[fieldKey] = { label: label || fieldKey }

            if (fieldKey.startsWith("text") || fieldKey.startsWith("number")) {
              const valueInput = document.getElementById(`value-${fieldKey}`)
              formData.fieldValues[fieldKey].value = valueInput ? valueInput.value : ""
            } else if (fieldKey.startsWith("list") || fieldKey.startsWith("select")) {
              const optionInput = document.getElementById(`option-${fieldKey}`)
              formData.fieldValues[fieldKey].option = optionInput ? optionInput.value : ""
            } else if (fieldKey.startsWith("date")) {
              const dateInput = document.getElementById(`date-${fieldKey}`)
              formData.fieldValues[fieldKey].date = dateInput ? dateInput.value : "2024-01-01"
            } else if (fieldKey.startsWith("datetime")) {
              const datetimeInput = document.getElementById(`datetime-${fieldKey}`)
              formData.fieldValues[fieldKey].datetime = datetimeInput ? datetimeInput.value : "2024-01-01T12:00"
            } else if (fieldKey.startsWith("checkbox")) {
              const booleanInput = document.getElementById(`boolean-${fieldKey}`)
              formData.fieldValues[fieldKey].boolean = booleanInput ? booleanInput.checked : false
            } else if (fieldKey.startsWith("multilist")) {
              const optionsInput = document.getElementById(`options-${fieldKey}`)
              const optionsValue = optionsInput ? optionsInput.value : ""
              formData.fieldValues[fieldKey].options = optionsValue ? optionsValue.split(",").map((s) => s.trim()) : []
            } else if (fieldKey.startsWith("tree")) {
              const optionInput = document.getElementById(`option-${fieldKey}`)
              const positionInput = document.getElementById(`position-${fieldKey}`)
              formData.fieldValues[fieldKey].option = optionInput ? optionInput.value : ""
              formData.fieldValues[fieldKey].position = positionInput ? positionInput.value : "0"
            } else if (fieldKey.startsWith("input")) {
              const placeholderInput = document.getElementById(`placeholder-${fieldKey}`)
              const valueInput = document.getElementById(`value-${fieldKey}`)
              formData.fieldValues[fieldKey].placeholder = placeholderInput ? placeholderInput.value : ""
              formData.fieldValues[fieldKey].value = valueInput ? valueInput.value : ""
            } else if (fieldKey.startsWith("twoListsLinked")) {
              // No generar el campo twoListsLinked, sino campos individuales para cada lista
              // Esta lógica se maneja por separado más abajo
            }
          }
        }
      })

      // Manejar campos de listas vinculadas como campos independientes
      selectedAction.dialogInfo.fields.forEach((fieldObj) => {
        const fieldKey = Object.keys(fieldObj)[0]
        const fieldConfig = fieldObj[fieldKey]
        const enableCheckbox = document.getElementById(`enable-${fieldKey}`)

        if (fieldKey.startsWith("twoListsLinked") && enableCheckbox && enableCheckbox.checked) {
          const linkedLists = this.getLinkedListsFromConfig(fieldConfig)

          // Generar un campo independiente para cada lista vinculada
          linkedLists.forEach((listInfo, index) => {
            const listNumber = index + 1
            const listKey = listInfo.key // listLinked1, listLinked2, etc.
            const listInput = document.getElementById(`list${listNumber}-${fieldKey}`)

            // Obtener el idioma seleccionado para esta lista específica
            const langRadio = document.querySelector(`input[name="lang-${listKey}"]:checked`)
            const selectedLang = langRadio ? langRadio.value : "en"
            const label =
              selectedLang === "en"
                ? listInfo.config?.label_en
                : listInfo.config?.label_es || listInfo.config?.label_en || listKey

            // Crear campo independiente para cada lista (solo label y option)
            formData.fieldStates[listKey] = true
            formData.fieldValues[listKey] = {
              label: label,
              option: listInput ? listInput.value : "",
            }
          })
        }
      })
    }

    const testData = this.generateDialogTestData(formData)
    this.applyTabProperties(testData, this.app.modelJson);
    this.applyObjectByTabsExtras(testData, this.app.modelJson);
    this.updatePreviewDisplay(testData)
  }

  generateDialogTestData(formData) {
    const testDataTemplate = this.app.jsonUtils.getTestDataTemplate()
    const testData = JSON.parse(JSON.stringify(testDataTemplate))

    const modes = ["desktopMode", "mobileMode", "tabletRetratoMode"]
    modes.forEach((mode) => {
      testData[mode].label = formData.processName
      testData[mode].view = formData.processName
      testData[mode].viewScreenShotLabel = formData.processName
      testData[mode].screenShotName = formData.menuOption
    })

    testData.mobileMode.label = `.${formData.processName.toLowerCase()}`

    const selectedAction = this.app.getSelectedAction()
    testData.buttonName = selectedAction ? selectedAction.actionName : ""

    testData.selectName = formData.selectName
    testData.textInNotif1 = formData.textInNotif1
    testData.textInNotif2 = formData.textInNotif2
    testData.textInNotif3 = formData.textInNotif3
    testData.positionButton = formData.positionButton
    testData.positionSelectElement = formData.positionSelectElement

    testData.screenShotsEmptyForm = "Empty Form"
    testData.screenShotsFilledForm = "Filled Form"

    if (this.app.modelJson && this.app.modelJson.component === 'Tabs' && Array.isArray(this.app.modelJson.tabs)) {
      let activeTabIdx = 0;
      let tabLang = 'en';
      const langInput = document.querySelector('input[name="tabLang"]:checked');
      if (langInput) tabLang = langInput.value;
      const tab = this.app.modelJson.tabs[activeTabIdx];
      const label = tabLang === 'en' ? tab.tabLabel?.label_en : tab.tabLabel?.label_es;
      testData.phraseTab = 'Click on Tab';
      testData.tab = label;
      testData.screenShotTab = label;
    }

    if (selectedAction && selectedAction.dialogInfo && selectedAction.dialogInfo.fields) {
      selectedAction.dialogInfo.fields.forEach((fieldObj) => {
        const fieldKey = Object.keys(fieldObj)[0]
        const fieldConfig = fieldObj[fieldKey]

        if (formData.fieldStates && formData.fieldStates[fieldKey]) {
          const fieldData = formData.fieldValues[fieldKey]

          if (fieldKey.startsWith("text") || fieldKey.startsWith("number")) {
            testData[fieldKey] = {
              label: fieldData.label,
              value: fieldData.value || "",
            }
          } else if (fieldKey.startsWith("list") || fieldKey.startsWith("select")) {
            // Buscar el item seleccionado y guardar el valor visible según idioma
            let visibleValue = fieldData.option || ""
            if (fieldConfig.items && fieldConfig.items.length > 0) {
              // Detectar idioma
              const langRadio = document.querySelector(`input[name='lang-${fieldKey}']:checked`)
              const lang = langRadio ? langRadio.value : "en"
              const selectedItem = fieldConfig.items.find(item => item.keyName === fieldData.option)
              if (selectedItem) {
                visibleValue = lang === "es" ? (selectedItem.keyValue_es || selectedItem.keyValue_en) : selectedItem.keyValue_en
              }
            }
            testData[fieldKey] = {
              label: fieldData.label,
              option: visibleValue,
            }
          } else if (fieldKey.startsWith("date")) {
            testData[fieldKey] = {
              label: fieldData.label,
              date: fieldData.date || "2024-01-01",
            }
          } else if (fieldKey.startsWith("datetime")) {
            testData[fieldKey] = {
              label: fieldData.label,
              datetime: fieldData.datetime || "2024-01-01T12:00",
            }
          } else if (fieldKey.startsWith("checkbox")) {
            testData[fieldKey] = {
              label: fieldData.label,
              boolean: fieldData.boolean || false,
            }
          } else if (fieldKey.startsWith("multilist")) {
            testData[fieldKey] = {
              label: fieldData.label,
              id: fieldKey,
              options: fieldData.options || [],
            }
          } else if (fieldKey.startsWith("tree")) {
            testData[fieldKey] = {
              label: fieldData.label,
              option: fieldData.option || "",
              position: fieldData.position || "0",
            }
          } else if (fieldKey.startsWith("input")) {
            testData[fieldKey] = {
              placeholder: fieldData.placeholder || "",
              value: fieldData.value || "",
            }
          } else if (fieldKey.startsWith("twoListsLinked")) {
            // Los campos de listas vinculadas se procesan como campos independientes
            // No generar el campo twoListsLinked aquí
          }
        }
      })

      // Generar campos independientes para listas vinculadas (solo label y option)
      selectedAction.dialogInfo.fields.forEach((fieldObj) => {
        const fieldKey = Object.keys(fieldObj)[0]
        const fieldConfig = fieldObj[fieldKey]
        if (fieldKey.startsWith("twoListsLinked") && formData.fieldStates) {
          const linkedLists = this.getLinkedListsFromConfig(fieldConfig)
          linkedLists.forEach((listInfo, index) => {
            const listKey = listInfo.key
            if (formData.fieldStates[listKey] && formData.fieldValues[listKey]) {
              const fieldData = formData.fieldValues[listKey]
              let visibleValue = fieldData.option || ""
              if (listInfo.config.items && listInfo.config.items.length > 0) {
                // Detectar idioma
                const langRadio = document.querySelector(`input[name='lang-${listKey}']:checked`)
                const lang = langRadio ? langRadio.value : "en"
                const selectedItem = listInfo.config.items.find(item => item.keyName === fieldData.option)
                if (selectedItem) {
                  visibleValue = lang === "es" ? (selectedItem.keyValue_es || selectedItem.keyValue_en) : selectedItem.keyValue_en
                }
              }
              testData[listKey] = {
                label: fieldData.label,
                option: visibleValue,
              }
            }
          })
        }
      })
    }

    if (formData.hideActionsButton) {
      testData.hideActionsButton = {
        locator: formData.hideActionsButtonLocator,
        position: formData.hideActionsButtonPosition,
      }
    }

    if (formData.addArrowConfig) {
      testData.arrowDirection = formData.arrowDirection
      testData.positionArrow = formData.positionArrow
    } else {
      delete testData.arrowDirection
      delete testData.positionArrow
      delete testData.screenShotsArrow
    }

    return testData
  }
}
