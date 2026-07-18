import React, { useState, useCallback } from "react";

export interface DialogState {
  isOpen: boolean;
  type: "success" | "error" | "warning" | "info" | "confirm";
  title: string | React.ReactNode;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

/**
 * هوك مشترك للتعامل مع النوافذ المنبثقة التنبيهية (Dialogs)
 */
export function useGameDialog() {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const showAlert = useCallback((title: string | React.ReactNode, message: string | React.ReactNode, type: DialogState["type"] = "info") => {
    setDialog({ isOpen: true, title, message, type });
  }, []);

  const showConfirm = useCallback((
    title: string | React.ReactNode, 
    message: string | React.ReactNode, 
    onConfirm: () => void,
    confirmText: string = "تأكيد",
    cancelText: string = "إلغاء",
    type: DialogState["type"] = "confirm"
  ) => {
    setDialog({ 
      isOpen: true, 
      title, 
      message, 
      type, 
      onConfirm,
      confirmText,
      cancelText
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    dialog,
    showAlert,
    showConfirm,
    closeDialog
  };
}
