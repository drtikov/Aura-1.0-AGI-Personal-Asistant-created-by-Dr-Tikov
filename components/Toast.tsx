import React, { useEffect } from 'react';
import { ToastMessage, ToastType } from '../types';

const Toast = ({ message, type, onClose }: { message: string, type: ToastType, onClose: () => void }) => {
  useEffect(() => { const timer = setTimeout(() => { onClose(); }, 5000); return () => clearTimeout(timer); }, [onClose]);
  return <div className={`toast toast-${type}`} onClick={onClose}><p>{message}</p></div>;
};

export const ToastContainer = ({ toasts, removeToast }: { toasts: ToastMessage[], removeToast: (id: string) => void }) => (
    <div className="toast-container"> {toasts.map(toast => ( <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} /> ))} </div>
);
