import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = Date.now() + Math.random().toString(36).substr(2, 5);
      const newToast = { id, message, type };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toastSuccess = useCallback((msg, duration) => showToast(msg, 'success', duration), [showToast]);
  const toastError = useCallback((msg, duration) => showToast(msg, 'error', duration), [showToast]);
  const toastWarning = useCallback((msg, duration) => showToast(msg, 'warning', duration), [showToast]);
  const toastInfo = useCallback((msg, duration) => showToast(msg, 'info', duration), [showToast]);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        toastSuccess,
        toastError,
        toastWarning,
        toastInfo,
        removeToast,
      }}
    >
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`} role="alert">
            <div className="toast-icon">
              {toast.type === 'success' && <CheckCircle2 size={20} color="#10b981" />}
              {toast.type === 'error' && <AlertCircle size={20} color="#ef4444" />}
              {toast.type === 'warning' && <AlertTriangle size={20} color="#f59e0b" />}
              {toast.type === 'info' && <Info size={20} color="#0ea5e9" />}
            </div>
            <div className="toast-message" style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="btn-ghost btn-icon"
              style={{ padding: '2px', cursor: 'pointer' }}
              aria-label="Cerrar notificación"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser utilizado dentro de un ToastProvider');
  }
  return context;
};
