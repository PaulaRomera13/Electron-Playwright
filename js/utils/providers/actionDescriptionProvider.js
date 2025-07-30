// actionDescriptionProvider.js - Proveedor de descripciones de acciones
export class ActionDescriptionProvider {
  constructor() {
    this.actionDescriptions = {
      OPEN_ATTACHMENTS: "Open Attachment",
      OPEN_ATTACHMENT: "Open Attachment",
    };
  }

  /**
   * Obtiene una descripción específica para el tipo de acción
   * @param {Object} action - Objeto de acción
   * @returns {string} Descripción específica de la acción
   */
  getActionDescription(action) {
    const actionName = action.actionName;

    // Detectar patrones específicos primero
    if (this.isAuditForGivenAction(actionName)) {
      return "Audit";
    }

    // Detectar acciones de remover adjuntos
    if (this.isRemoveAttachmentAction(actionName)) {
      return "Remove Attachment";
    }

    // Si la acción contiene ADDAWSATTACHMENT, mostrar AWS
    if (this.isAWSAttachmentAction(actionName)) {
      return "AWS";
    }

    // Si existe una descripción específica, usarla
    if (this.actionDescriptions[actionName]) {
      return this.actionDescriptions[actionName];
    }

    // Si es reactivateObjectDialog
    if (this.isReactivateObjectDialog(action)) {
      return 'Reactivar diálogo de objetos';
    }

    // Lógica de diálogo
    if (action.requiresDialog) {
      if (this.isDialogWithColumnSelection(action)) {
        return "Diálogo con selección";
      }
      return "Con diálogo";
    }
    
    return "Sin diálogo";
  }

  /**
   * Verifica si es una acción de auditoría para un elemento específico
   * @param {string} actionName - Nombre de la acción
   * @returns {boolean} True si es acción de auditoría
   */
  isAuditForGivenAction(actionName) {
    return actionName.includes("AUDIT_FOR_GIVEN_");
  }

  /**
   * Verifica si es una acción de remover adjunto
   * @param {string} actionName - Nombre de la acción
   * @returns {boolean} True si es acción de remover adjunto
   */
  isRemoveAttachmentAction(actionName) {
    return actionName.includes("REMOVE_ATTACHMENT") || actionName.includes("REMOVE_ATTACHMENTS");
  }

  /**
   * Verifica si es una acción de adjunto AWS
   * @param {string} actionName - Nombre de la acción
   * @returns {boolean} True si es acción de adjunto AWS
   */
  isAWSAttachmentAction(actionName) {
    return actionName.includes("ADDAWSATTACHMENT");
  }

  /**
   * Verifica si es una acción de reactivar objeto diálogo
   * @param {Object} action - Objeto de acción
   * @returns {boolean} True si es acción de reactivar objeto diálogo
   */
  isReactivateObjectDialog(action) {
    return action.requiresDialog && action.dialogInfo && action.dialogInfo.name === 'reactivateObjectDialog';
  }

  /**
   * Verifica si es una acción de diálogo con selección de columnas
   * @param {Object} action - Objeto de acción
   * @returns {boolean} True si es diálogo con selección
   */
  isDialogWithColumnSelection(action) {
    return action.dialogInfo && 
           action.dialogInfo.gridContent === true && 
           Array.isArray(action.dialogInfo.columns) && 
           action.dialogInfo.columns.length > 0;
  }

  /**
   * Agrega una nueva descripción de acción
   * @param {string} actionName - Nombre de la acción
   * @param {string} description - Descripción de la acción
   */
  addActionDescription(actionName, description) {
    this.actionDescriptions[actionName] = description;
  }

  /**
   * Obtiene todas las descripciones disponibles
   * @returns {Object} Objeto con todas las descripciones
   */
  getAllDescriptions() {
    return { ...this.actionDescriptions };
  }
} 