'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export interface ConfirmationDialog {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmationDialogProps {
  dialog: ConfirmationDialog;
  onClose: (id: string) => void;
}

const icons = {
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
};

const colors = {
  warning: 'text-warning',
  danger: 'text-destructive',
  info: 'text-info',
};

export function ConfirmationDialogComponent({ dialog, onClose }: ConfirmationDialogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = icons[dialog.type];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleConfirm = () => {
    dialog.onConfirm();
    handleClose();
  };

  const handleCancel = () => {
    if (dialog.onCancel) {
      dialog.onCancel();
    }
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(dialog.id), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleCancel}
      />
      
      {/* Dialog */}
      <div 
        className={`relative bg-background border rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 ${colors[dialog.type]}`}>
            <Icon className="w-6 h-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-forum-primary mb-2">
              {dialog.title}
            </h3>
            <p className="text-forum-secondary mb-6">
              {dialog.description}
            </p>
            
            <div className="flex space-x-3 justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="btn-forum"
              >
                {dialog.cancelText || 'Cancel'}
              </Button>
              <Button
                onClick={handleConfirm}
                className={
                  dialog.type === 'danger' 
                    ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                    : 'btn-primary hover-glow'
                }
              >
                {dialog.confirmText || 'Confirm'}
              </Button>
            </div>
          </div>
          
          <button
            onClick={handleCancel}
            className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Confirmation dialog context and hook
let dialogId = 0;
const dialogs: ConfirmationDialog[] = [];
const listeners: ((dialogs: ConfirmationDialog[]) => void)[] = [];

export function showConfirmationDialog(dialog: Omit<ConfirmationDialog, 'id'>) {
  const newDialog: ConfirmationDialog = {
    id: `dialog-${++dialogId}`,
    ...dialog,
  };
  
  dialogs.push(newDialog);
  listeners.forEach(listener => listener([...dialogs]));
}

export function closeConfirmationDialog(id: string) {
  const index = dialogs.findIndex(dialog => dialog.id === id);
  if (index > -1) {
    dialogs.splice(index, 1);
    listeners.forEach(listener => listener([...dialogs]));
  }
}

export function useConfirmationDialog() {
  const [dialogList, setDialogList] = useState<ConfirmationDialog[]>([]);

  useEffect(() => {
    const listener = (newDialogs: ConfirmationDialog[]) => setDialogList(newDialogs);
    listeners.push(listener);
    setDialogList([...dialogs]);

    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    dialogs: dialogList,
    showConfirmationDialog,
    closeConfirmationDialog,
  };
}

// Confirmation dialog container component
export function ConfirmationDialogContainer() {
  const { dialogs, closeConfirmationDialog } = useConfirmationDialog();

  return (
    <>
      {dialogs.map(dialog => (
        <ConfirmationDialogComponent
          key={dialog.id}
          dialog={dialog}
          onClose={closeConfirmationDialog}
        />
      ))}
    </>
  );
}
