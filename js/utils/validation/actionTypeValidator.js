// actionTypeValidator.js - Validación de tipos de acciones
export class ActionTypeValidator {
  constructor() {}

  /**
   * Determina si debe mostrar el generador de test para una acción
   * @param {Object} action - Objeto de acción a validar
   * @returns {boolean} True si debe mostrar el generador de test
   */
  shouldShowTestGenerator(action) {
    const hasDialogWithFields = this.hasDialogWithFields(action);
    const isAuditAction = this.isAuditAction(action);
    const isAWSAttachmentAction = this.isAWSAttachmentAction(action);
    const isRemoveAttachmentAction = this.isRemoveAttachmentAction(action);
    const isOpenAttachmentAction = this.isOpenAttachmentAction(action);
    const isDialogWithColumnSelection = this.isDialogWithColumnSelection(action);
    const isReactivateObjectDialog = this.isReactivateObjectDialog(action);

    return !action.requiresDialog ||
           hasDialogWithFields ||
           isAuditAction ||
           isOpenAttachmentAction ||
           isRemoveAttachmentAction ||
           isAWSAttachmentAction ||
           isDialogWithColumnSelection ||
           isReactivateObjectDialog;
  }

  /**
   * Verifica si es una acción de diálogo con columnas
   * @param {Object} action - Objeto de acción
   * @returns {boolean} True si es diálogo con columnas
   */
  isDialogWithColumnSelection(action) {
    return action.requiresDialog && 
           action.dialogInfo?.gridContent === true && 
           Array.isArray(action.dialogInfo.columns) && 
           action.dialogInfo.columns.length > 0;
  }

  /**
   * Verifica si tiene diálogo con campos
   * @param {Object} action - Objeto de acción
   * @returns {boolean} True si tiene diálogo con campos
   */
  hasDialogWithFields(action) {
    return action.requiresDialog && action.dialogInfo?.fields?.length > 0;
  }

  /**
   * Verifica si es una acción de auditoría
   * @param {Object} action - Objeto de acción
   * @returns {boolean} True si es acción de auditoría
   */
  isAuditAction(action) {
    return (action.actionName.includes("AUDIT") || action.actionName.includes("AUDIT_")) && 
           !(action.dialogInfo?.name === "uploadFileDialog");
  }

  /**
   * Verifica si es una acción de adjunto AWS
   * @param {Object} action - Objeto de acción
   * @returns {boolean} True si es acción de adjunto AWS
   */
  isAWSAttachmentAction(action) {
    return action.dialogInfo?.name === "uploadFileDialog";
  }

  /**
   * Verifica si es una acción de remover adjunto
   * @param {Object} action - Objeto de acción
   * @returns {boolean} True si es acción de remover adjunto
   */
  isRemoveAttachmentAction(action) {
    return action.actionName.includes("REMOVE_ATTACHMENT") || 
           action.actionName.includes("REMOVE_ATTACHMENTS");
  }

  /**
   * Verifica si es una acción de abrir adjunto
   * @param {Object} action - Objeto de acción
   * @returns {boolean} True si es acción de abrir adjunto
   */
  isOpenAttachmentAction(action) {
    return !this.isRemoveAttachmentAction(action) && 
           !this.isAWSAttachmentAction(action) && 
           (action.actionName.includes("OPEN_ATTACHMENT") || 
            action.actionName.includes("ATTACHMENT"));
  }

  /**
   * Verifica si es una acción de reactivar objeto diálogo
   * @param {Object} action - Objeto de acción
   * @returns {boolean} True si es acción de reactivar objeto diálogo
   */
  isReactivateObjectDialog(action) {
    return action.dialogInfo?.name === "reactivateObjectDialog";
  }

  /**
   * Verifica si es una acción de exportación
   * @param {Object} action - Objeto de acción
   * @returns {boolean} True si es acción de exportación
   */
  isExportAction(action) {
    return action.actionName === "_EXPORT";
  }

  /**
   * Obtiene el tipo de generador para una acción
   * @param {Object} action - Objeto de acción
   * @returns {string} Tipo de generador
   */
  getGeneratorType(action) {
    if (this.isReactivateObjectDialog(action)) {
      return "reactivateObjectDialog";
    } else if (this.isDialogWithColumnSelection(action)) {
      return "dialogWithColumnSelection";
    } else if (this.hasDialogWithFields(action)) {
      return "dialog";
    } else if (this.isAuditAction(action)) {
      return "audit";
    } else if (this.isRemoveAttachmentAction(action)) {
      return "removeAttachment";
    } else if (this.isAWSAttachmentAction(action)) {
      return "aws";
    } else if (this.isOpenAttachmentAction(action)) {
      return "openAttachment";
    } else if (this.isExportAction(action)) {
      return "export";
    } else {
      return "noDialog";
    }
  }
} 