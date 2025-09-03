import Toast from '@components/toast';
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

type ToastMessage = { id: number; message: string };

interface ToastContextProps {
  showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="-translate-x-1/2 fixed bottom-[11rem] left-1/2 z-[var(--z-toast)]">
          {toasts.map((t) => (
            <Toast key={t.id} message={t.message} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
