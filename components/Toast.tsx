

import React, { useEffect } from 'react';
// FIX: Corrected import path for types to resolve module error.
import { ToastMessage, ToastType } from '../types';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

// FIX: Wrapped the component in React.memo to correctly handle the `key` prop when used in a list, resolving type errors.
const Toast = React.memo(({ message, type, onClose }: ToastProps) => {
  useEffect(() => { const timer = setTimeout(() => { onClose(); }, 5000); return () => clearTimeout(timer); }, [onClose]);
  return <div className={`toast toast-${type}`} onClick={onClose}><p>{message}</p></div>;
});

export const ToastContainer = ({ toasts, removeToast }: { toasts: ToastMessage[], removeToast: (id: string) => void }) => (
    <div className="toast-container"> {toasts.map(toast => ( <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} /> ))} </div>
);