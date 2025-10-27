import React, { useEffect } from 'react';
// FIX: Added missing ToastMessage and ToastType to the import from ../types to resolve module not found errors.
import { ToastMessage, ToastType } from '../types.ts';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

const Toast = React.memo(({ message, type, onClose }: ToastProps) => {
  useEffect(() => { const timer = setTimeout(() => { onClose(); }, 5000); return () => clearTimeout(timer); }, [onClose]);
  return <div className={`toast toast-${type}`} onClick={onClose}><p>{message}</p></div>;
});

export const ToastContainer = ({ toasts, removeToast }: { toasts: ToastMessage[], removeToast: (id: string) => void }) => (
    <div className="toast-container"> {toasts.map(toast => ( <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} /> ))} </div>
);