import { useState, useCallback } from 'react';
// FIX: Corrected import path for types to resolve module error.
import { ToastMessage, ToastType } from '../types';

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
