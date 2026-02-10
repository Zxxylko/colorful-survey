import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import type { Toast } from './useToast';
import { ToastContext } from './useToast';

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div 
        style={{ 
          position: 'fixed', 
          bottom: '2rem', 
          right: '2rem', 
          zIndex: 9999, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.5rem' 
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              layout
              className="glass p-4 rounded-md d-flex align-items-center gap-3 shadow-lg"
              style={{ 
                minWidth: '300px', 
                background: toast.type === 'success' ? 'rgba(0, 200, 83, 0.1)' : 
                            toast.type === 'error' ? 'rgba(255, 23, 68, 0.1)' : 
                            'rgba(33, 150, 243, 0.1)',
                border: toast.type === 'success' ? '1px solid rgba(0, 200, 83, 0.2)' : 
                        toast.type === 'error' ? '1px solid rgba(255, 23, 68, 0.2)' : 
                        '1px solid rgba(33, 150, 243, 0.2)',
                backdropFilter: 'blur(12px)',
                cursor: 'pointer'
              }}
              onClick={() => removeToast(toast.id)}
            >
              <div 
                className="p-2 rounded-full d-flex align-items-center justify-content-center"
                style={{
                  background: toast.type === 'success' ? 'var(--success)' : 
                              toast.type === 'error' ? 'var(--danger)' : 
                              'var(--info)',
                  width: '24px', height: '24px'
                }}
              >
                {toast.type === 'success' && <CheckCircle2 size={14} color="white" />}
                {toast.type === 'error' && <AlertCircle size={14} color="white" />}
                {toast.type === 'info' && <Info size={14} color="white" />}
              </div>
              <div className="flex-grow-1 fs-sm fw-semibold" style={{ color: 'white' }}>
                {toast.message}
              </div>
              <button 
                className="btn-icon p-1 rounded-circle" 
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeToast(toast.id);
                }}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
