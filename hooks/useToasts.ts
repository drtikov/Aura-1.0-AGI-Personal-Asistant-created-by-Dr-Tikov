import { useState, useCallback } from 'react';
// FIX: Added missing ToastMessage and ToastType to the import from ../types to resolve module not found errors.
import { ToastMessage, ToastType } from '../types.ts';

export const useToasts = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = self.crypto.randomUUID();
    setToasts(prevToasts => [{ id, message, type }, ...prevToasts].slice(0, 5));
  }, []);
  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);
  return { toasts, addToast, removeToast };
};